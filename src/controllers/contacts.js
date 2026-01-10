import {
  getAllContacts,
  getContactById,
  createContact,
  deleteContact,
  upsertContact,
  updateContact,
} from '../services/contacts.js';
import createHttpError from 'http-errors';

export const getAllContactsController = async (req, res) => {
  const contacts = await getAllContacts(req.user._id);
  res.json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

export const getContactByIdController = async (req, res) => {
  const { contactId } = req.params;
  const contact = await getContactById(contactId, req.user._id);

  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }

  res.json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
};

export const createContactController = async (req, res) => {
  const contact = await createContact(req.body, req.user._id);
  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: contact,
  });
};

export const deleteContactController = async (req, res) => {
    const { contactId } = req.params;
    const contact = await deleteContact(contactId, req.user._id);

    if (!contact) {
        throw createHttpError(404, 'Contact not found');
    }
    res.status(204).send();
};

export const upsertContactController = async (req, res) => {
    const { contactId } = req.params;
    const result = await upsertContact(contactId, req.user._id, req.body, {
        upsert: true,
    });

    const status = result.isNew ? 201 : 200;
    const message = result.isNew
        ? 'Successfully created a contact!'
        : 'Successfully updated a contact!';

    res.status(status).json({
        status,
        message,
        data: result.contact,
    });
};

export const patchContactController = async (req, res) => {
    const { contactId } = req.params;
    const result = await updateContact(contactId, req.user._id, req.body);

    if (!result) {
        throw createHttpError(404, 'Contact not found');
    }

    res.json({
        status: 200,
        message: 'Successfully patched a contact!',
        data: result,
    });
};
