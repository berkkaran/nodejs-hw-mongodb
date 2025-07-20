import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import { getAllcontacts, getContactById } from './services/contacts.js';
import { env } from './utils/env.js';

const PORT = Number(env('PORT', '3000'));

export const startServer = () => {
  const app = express();

  app.use(express.json());
  app.use(cors());

  app.use(
    pino(),
  );

  app.get('/', (req, res) => {
    res.json({
      message: 'Welcome to the Contacts APP',
    });
  });
  app.get('/contacts', async (req, res) => {
    try {
      const contacts = await getAllcontacts();
      res.json({
        status: 200,
        message: 'Successfully found contacts!',
        data: contacts,
      });
    } catch (error) {
      res.json({
        status: 500,
        message: 'Error fetching contacts',
        error: error.message,
      });
    }
  });
  app.get('/contacts/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const contact = await getContactById(id);
      if (!contact) {
        res.json({
          status: 404,
          message: 'Contact not found',
        });
        return;
      }
      res.json({
        status: 200,
        message: `Successfully found contact with id: ${id}!`,
        data: contact,
      });
    } catch (error) {
      res.json({
        status: 500,
        message: 'Error fetching contact',
        error: error.message,
      });
    }
  });

  app.use((req, res) => {
    res.json({
      status: 404,
      message: 'Not found',
    });
  });

  app.use((err, req, res) => {
    res.json({
      status: 500,
      message: 'Something went wrong',
      error: err.message,
    });
  });

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
