import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import createHttpError from 'http-errors';
import { randomBytes } from 'crypto';

import { UserCollection } from '../db/models/user.js';
import { SessionCollection } from '../db/models/session.js';
import { env } from '../utils/env.js';
import { sendEmail } from '../utils/sendMail.js';

import {
  FIFTEEN_MINUTES,
  THIRTY_DAYS,
  ROLES,
} from '../constants/index.js';

const createSession = (userId) => {
  const accessToken = jwt.sign({ userId }, env('JWT_SECRET'), {
    expiresIn: '15m',
  });
  const refreshToken = jwt.sign({ userId }, env('JWT_SECRET'), {
    expiresIn: '30d',
  });

  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000),
    refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  };
};

export const registerUser = async (payload) => {
  const user = await UserCollection.findOne({ email: payload.email });
  if (user) {
    throw createHttpError(409, 'Email in use');
  }

  const hashedPassword = await bcrypt.hash(payload.password, 10);

  return await UserCollection.create({
    ...payload,
    password: hashedPassword,
  });
};

export const loginUser = async (payload) => {
  const user = await UserCollection.findOne({ email: payload.email });
  if (!user) {
    throw createHttpError(401, 'Unauthorized');
  }

  const isEqual = await bcrypt.compare(payload.password, user.password);
  if (!isEqual) {
    throw createHttpError(401, 'Unauthorized');
  }

  await SessionCollection.deleteOne({ userId: user._id });

  const session = createSession(user._id);

  return await SessionCollection.create({
    userId: user._id,
    ...session,
  });
};

export const sendResetEmail = async (email) => {
  const user = await UserCollection.findOne({ email });
  if (!user) {
    throw createHttpError(404, 'User not found!');
  }

  const resetToken = jwt.sign(
    { sub: user._id, email: user.email },
    env('JWT_SECRET'),
    {
      expiresIn: '5m',
    },
  );

  const resetLink = `${env(
    'APP_DOMAIN',
  )}/reset-password?token=${encodeURIComponent(resetToken)}`;

  try {
    await sendEmail({
      to: email,
      subject: 'Reset your password',
      html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p><p>Alternatively, copy and paste this link into your browser:</p><p>${resetLink}</p>`,
    });
  } catch (error) {
    console.log(error);
    throw createHttpError(
      500,
      'Failed to send the email, please try again later.',
    );
  }
};

export const resetPassword = async ({ token, password }) => {
  let decoded;
  try {
    decoded = jwt.verify(token, env('JWT_SECRET'));
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      throw createHttpError(401, 'Token is expired or invalid.');
    }
    throw err;
  }

  const user = await UserCollection.findOne({
    email: decoded.email,
    _id: decoded.sub,
  });

  if (!user) {
    throw createHttpError(404, 'User not found!');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await UserCollection.updateOne(
    { _id: user._id },
    { password: hashedPassword },
  );

  await SessionCollection.deleteMany({ userId: user._id });
};

export const refreshSession = async ({ sessionId, refreshToken }) => {
  const session = await SessionCollection.findOne({
    _id: sessionId,
    refreshToken,
  });

  if (!session) {
    throw createHttpError(401, 'Session not found');
  }

  const isTokenExpired =
    new Date() > new Date(session.refreshTokenValidUntil);
  if (isTokenExpired) {
    throw createHttpError(401, 'Refresh token expired');
  }

  await SessionCollection.deleteOne({ _id: sessionId });

  const newSession = createSession(session.userId);

  return await SessionCollection.create({
    userId: session.userId,
    ...newSession,
  });
};

export const logoutUser = async (sessionId) => {
  await SessionCollection.deleteOne({ _id: sessionId });
};
