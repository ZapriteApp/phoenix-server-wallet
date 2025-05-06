import { JSONFilePreset } from 'lowdb/node'
const db = await JSONFilePreset('dbjson/db.json', { contacts: [], password: [], btcPrice :[] })
await db.read();
db.data ||= { contacts: [] };
db.data ||= { password: [] };
db.data ||= { btcPrice: [] };

db.data.password ||= []
db.data.contacts ||= []
db.data.btcPrice ||= []

export default db