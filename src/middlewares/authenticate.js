
import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';

import { UserCollection } from '../db/models/user.js';
import { env } from '../utils/env.js';

export const authenticate = async (req, res, next) => {
  const authHeader = req.get('Authorization');

  if (!authHeader) {
    return next(createHttpError(401, 'Please provide Authorization header'));
  }

  const [bearer, token] = authHeader.split(' ');

  if (bearer !== 'Bearer' || !token) {
    return next(createHttpError(401, 'Auth header should be of type Bearer'));
  }

  try {
    const { userId } = jwt.verify(token, env('JWT_SECRET'));

    const user = await UserCollection.findById(userId);

    if (!user) {
      return next(createHttpError(401, 'User not found'));
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return next(createHttpError(401, 'Access token expired'));
    }
    next(createHttpError(401, 'Not authorized'));
  }
};
