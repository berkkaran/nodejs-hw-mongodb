import { ContactCollection } from '../db/models/contact.js';

export const getAllcontacts = async (page, perPage) => {
  const skip = (page - 1) * perPage;
  const contactsQuery = ContactCollection.find().skip(skip).limit(perPage);
  const totalItems = await ContactCollection.countDocuments();
  const contacts = await contactsQuery;
  return {
    data: contacts,
    totalItems,
  };
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
