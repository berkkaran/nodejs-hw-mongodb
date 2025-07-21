import { Router } from 'express';
import {
  getAllContactsController,
  getContactByIdController,
  createContactController,
  deleteContactController,
  upsertContactController,
  patchContactController,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import {
  createContactSchema,
  updateContactSchema,
} from '../utils/validationSchemas.js';
import { isValidId } from '../middlewares/isValidId.js';
import { authenticate } from '../middlewares/authenticate.js';

const contactsRouter = Router();

contactsRouter.use('/', authenticate);

contactsRouter.get('/', ctrlWrapper(getAllContactsController));

contactsRouter.get('/:contactId', isValidId, ctrlWrapper(getContactByIdController));

contactsRouter.post('/', validateBody(createContactSchema), ctrlWrapper(createContactController));

contactsRouter.delete('/:contactId', isValidId, ctrlWrapper(deleteContactController));

contactsRouter.put('/:contactId', isValidId, validateBody(updateContactSchema), ctrlWrapper(upsertContactController));

contactsRouter.patch('/:contactId', isValidId, validateBody(updateContactSchema), ctrlWrapper(patchContactController));

export default contactsRouter;
