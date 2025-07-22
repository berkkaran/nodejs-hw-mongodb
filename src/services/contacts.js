import { Contact } from '../db/models/contact.js';
import cloudinary from '../utils/cloudinary.js';

export const getAllContacts = async (userId) => {
  const contacts = await Contact.find({ userId });
  return contacts;
};

export const getContactById = async (contactId, userId) => {
  const contact = await Contact.findOne({ _id: contactId, userId });
  return contact;
};

export const createContact = async (payload, userId, photo) => {
  let photoUrl;

  if (photo) {
    const b64 = Buffer.from(photo.buffer).toString('base64');
    let dataURI = 'data:' + photo.mimetype + ';base64,' + b64;
    const photoUpload = await cloudinary.uploader.upload(dataURI, {
      folder: 'contacts-photos',
    });
    photoUrl = photoUpload.secure_url;
  }

  const contact = await Contact.create({ ...payload, userId, photo: photoUrl });
  return contact;
};

export const deleteContact = async (contactId, userId) => {
  const contact = await Contact.findOneAndDelete({ _id: contactId, userId });
  return contact;
};

export const upsertContact = async (
  contactId,
  userId,
  payload,
  photo,
  options = {},
) => {
  let photoUrl;

  if (photo) {
    const b64 = Buffer.from(photo.buffer).toString('base64');
    let dataURI = 'data:' + photo.mimetype + ';base64,' + b64;
    const photoUpload = await cloudinary.uploader.upload(dataURI, {
      folder: 'contacts-photos',
    });
    photoUrl = photoUpload.secure_url;
  }

  const result = await Contact.findOneAndUpdate(
    { _id: contactId, userId },
    { ...payload, photo: photoUrl },
    {
      new: true,
      runValidators: true,
      ...options,
    },
  );

  if (result) {
    return {
      contact: result,
      isNew: false,
    };
  }

  if (options.upsert) {
    const newContact = await Contact.create({
      ...payload,
      photo: photoUrl,
      _id: contactId,
      userId,
    });
    return {
      contact: newContact,
      isNew: true,
    };
  }
};

export const updateContact = async (contactId, userId, payload, photo) => {
  let photoUrl;

  if (photo) {
    const b64 = Buffer.from(photo.buffer).toString('base64');
    let dataURI = 'data:' + photo.mimetype + ';base64,' + b64;
    const photoUpload = await cloudinary.uploader.upload(dataURI, {
      folder: 'contacts-photos',
    });
    photoUrl = photoUpload.secure_url;
  }

  const contact = await Contact.findOneAndUpdate(
    { _id: contactId, userId },
    { ...payload, photo: photoUrl },
    { new: true },
  );
  return contact;
};
