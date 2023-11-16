import { handle } from 'https://deno.land/x/hono@v3.10.1/adapter/netlify/mod.ts';
import { Hono } from 'https://deno.land/x/hono@v3.10.1/mod.ts';
import { contacts } from '../../src/routes/contacts.route.ts';

const app = new Hono().basePath('/api');

app.get('/', (c) => c.text('Hello from Hono!'));
app.route('/contacts', contacts);

export default handle(app);
