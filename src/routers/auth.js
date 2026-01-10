
import { Router } from 'express';

import {
  registerUserCtrl,
  loginUserCtrl,
  refreshCtrl,
  logoutCtrl,
} from '../controllers/auth.js';

import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';

import {
  registerUserSchema,
  loginUserSchema,
} from '../utils/validationSchemas.js';

const authRouter = Router();

authRouter.post(
  '/register',
  validateBody(registerUserSchema),
  registerUserCtrl,
);

authRouter.post('/login', validateBody(loginUserSchema), loginUserCtrl);

authRouter.post('/refresh', refreshCtrl);

authRouter.post('/logout', logoutCtrl);

export default authRouter;
