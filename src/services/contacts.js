import { Contact } from '../db/models/contact.js';

export const getAllContacts = async (userId) => {
  const contacts = await Contact.find({ userId });
  return contacts;
};

export const getContactById = async (contactId, userId) => {
  const contact = await Contact.findOne({ _id: contactId, userId });
  return contact;
};

export const createContact = async (payload, userId) => {
  const contact = await Contact.create({ ...payload, userId });
  return contact;
};

export const deleteContact = async (contactId, userId) => {
  const contact = await Contact.findOneAndDelete({ _id: contactId, userId });
  return contact;
};

export const upsertContact = async (contactId, userId, payload, options = {}) => {
    const result = await Contact.findOneAndUpdate(
        { _id: contactId, userId },
        payload,
        {
            new: true,
            runValidators: true,
            ...options,
        }
    );
    return result;
};

export const updateContact = async (contactId, userId, payload) => {
  const contact = await Contact.findOneAndUpdate(
    { _id: contactId, userId },
    payload,
    { new: true }
  );
  return contact;
};
