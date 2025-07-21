import {
  registerUser,
  loginUser,
  refreshSession,
  logoutUser,
} from '../services/auth.js';

import { THIRTY_DAYS } from '../constants/index.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const setupResponse = (res, session) => {
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + THIRTY_DAYS),
  });
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: new Date(Date.now() + THIRTY_DAYS),
  });
};

const registerUserController = async (req, res) => {
  const user = await registerUser(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: user,
  });
};

export const registerUserCtrl = ctrlWrapper(registerUserController);

const loginUserController = async (req, res) => {
  const session = await loginUser(req.body);

  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });

  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });

  res.json({
    status: 200,
    message: 'Successfully logged in an user!',
    data: {
      accessToken: session.accessToken,
    },
  });
};

export const loginUserCtrl = ctrlWrapper(loginUserController);

const refreshController = async (req, res) => {
  const { refreshToken, sessionId } = req.cookies;

  const session = await refreshSession({
    refreshToken,
    sessionId,
  });

  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });

  res.json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: {
      accessToken: session.accessToken,
    },
  });
};

export const refreshCtrl = ctrlWrapper(refreshController);

const logoutController = async (req, res) => {
  const { sessionId } = req.cookies;
  await logoutUser(sessionId);

  res.clearCookie('sessionId');
  res.clearCookie('refreshToken');

  res.status(204).send();
};

export const logoutCtrl = ctrlWrapper(logoutController);
