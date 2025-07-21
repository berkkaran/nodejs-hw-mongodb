import { ContactCollection } from '../db/models/contact.js';
import createHttpError from 'http-errors';

export const getAllcontacts = async () => {
  const contacts = await ContactCollection.find();
  return contacts;
};

export const getContactById = async (id) => {
  const contact = await ContactCollection.findById(id);
  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }
  return contact;
};

export const createContact = async (payload) => {
  const contact = await ContactCollection.create(payload);
  return contact;
};

export const updateContact = async (id, payload, options = {}) => {
  const result = await ContactCollection.findByIdAndUpdate(id, payload, {
    new: true,
    ...options,
  });
  if (!result) {
    throw createHttpError(404, 'Contact not found');
  }
  return result;
};

export const deleteContact = async (id) => {
  const result = await ContactCollection.findByIdAndDelete(id);
  if (!result) {
    throw createHttpError(404, 'Contact not found');
  }
  return result;
};
