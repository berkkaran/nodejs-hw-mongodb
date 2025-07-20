import { ContactCollection } from '../db/models/contact.js';

export const getAllcontacts = async () => {
  const contacts = await ContactCollection.find();
  return contacts;
};

export const getContactById = async (contactId) => {
  const contacts = await ContactCollection.findById(contactId);
  return contacts;
};
