import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import createHttpError from 'http-errors';
import { randomBytes } from 'crypto';

import { User } from '../db/models/user.js';
import { Session } from '../db/models/session.js';

import {
  FIFTEEN_MINUTES,
  THIRTY_DAYS,
  ROLES,
} from '../constants/index.js';

const createSession = () => {
  const accessToken = jwt.sign({ }, process.env.JWT_SECRET, {
    expiresIn: FIFTEEN_MINUTES,
  });
  const refreshToken = jwt.sign({ }, process.env.JWT_SECRET, {
    expiresIn: THIRTY_DAYS,
  });

  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + THIRTY_DAYS),
  };
};

export const registerUser = async (payload) => {
    const user = await User.findOne({ email: payload.email });
    if (user) {
        throw createHttpError(409, 'Email in use');
    }
    const hashedPassword = await bcrypt.hash(payload.password, 10);
    const newUser = await User.create({
        ...payload,
        password: hashedPassword,
    });
    return newUser;
};

export const loginUser = async (payload) => {
    const user = await User.findOne({ email: payload.email });
    if (!user) {
        throw createHttpError(401, 'Unauthorized');
    }
    const isEqual = await bcrypt.compare(payload.password, user.password);
    if (!isEqual) {
        throw createHttpError(401, 'Unauthorized');
    }

    await Session.deleteOne({ userId: user._id });

    const newSession = createSession();

    return await Session.create({
        userId: user._id,
        ...newSession,
    });
};

export const refreshSession = async ({ sessionId, refreshToken }) => {
    const session = await Session.findOne({
        _id: sessionId,
        refreshToken,
    });

    if (!session) {
        throw createHttpError(401, 'Session not found');
    }

    const isRefreshTokenExpired =
        new Date() > new Date(session.refreshTokenValidUntil);

    if (isRefreshTokenExpired) {
        throw createHttpError(401, 'Refresh token expired');
    }

    await Session.deleteOne({ _id: sessionId });

    const newSession = createSession();

    return await Session.create({
        userId: session.userId,
        ...newSession,
    });
};

export const logoutUser = async ({ sessionId, refreshToken }) => {
    await Session.deleteOne({ _id: sessionId, refreshToken });
};
