import { Hono } from 'https://deno.land/x/hono@v3.10.1/mod.ts';
import { data as persons } from '../assets/persons.ts';
import { Contact } from '../types/interfaces/contact.interface.ts';

const contacts = new Hono();

contacts
  .get('/', (c) => {
    return c.json(persons);
  })
  .get('/:id', (c) => {
    const id = c.req.param('id');
    const foundedContact = persons.find((item) => item.id === Number(id));
    if (!foundedContact) {
      return c.notFound();
    }

    return c.json(foundedContact);
  })
  .post('/', async (c) => {
    const requestBody = await c.req.json<Contact>();

    const isContactExists = persons.some(
      (person) =>
        person.name === requestBody.name || person.number === requestBody.number
    );

    if (isContactExists) {
      return c.json({
        error: 'Contact with the same name or number already exists',
      });
    }

    if (!requestBody.name || !requestBody.number) {
      return c.json({
        error: 'Name and number are required fields',
      });
    }

    const maxId =
      persons.length > 0 ? Math.max(...persons.map((person) => person.id)) : 0;

    const newContact = {
      id: maxId + 1,
      name: requestBody.name,
      number: requestBody.number,
    };

    persons.push(newContact);
    return c.json(newContact);
  })
  .delete('/:id', (c) => {
    const id = c.req.param('id');
    const index = persons.findIndex((person) => person.id === Number(id));

    if (index === -1) {
      return c.notFound();
    }

    const deletedContact = persons.splice(index, 1)[0];
    return c.json({ message: 'Contact deleted successfully', deletedContact });
  });

export { contacts };
