import { ContactCollection } from '../db/models/contact.js';

export const getAllcontacts = async () => {
  const contacts = await ContactCollection.find();
  return contacts;
};

export const getContactById = async (id) => {
  const contact = await ContactCollection.findById(id);
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
  return result;
};

export const deleteContact = async (id) => {
  const result = await ContactCollection.findByIdAndDelete(id);
  return result;
};
