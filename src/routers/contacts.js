import { Router } from 'express';
import {
  getContactsController,
  getContactByIdController,
  createContactController,
  updateContactController,
  deleteContactController,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const contactsRouter = Router();

contactsRouter.get('/contacts', ctrlWrapper(getContactsController));

contactsRouter.post('/contacts', ctrlWrapper(createContactController));

contactsRouter.get('/contacts/:id', ctrlWrapper(getContactByIdController));

contactsRouter.patch('/contacts/:id', ctrlWrapper(updateContactController));

contactsRouter.delete('/contacts/:id', ctrlWrapper(deleteContactController));

export default contactsRouter;
