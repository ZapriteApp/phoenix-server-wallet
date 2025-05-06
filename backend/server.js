import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import router from './api/apiRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
let url = process.env.BACKEND_API_URL
const port = 32400;
// const corsOptions = {
//   origin: url, 
//   methods: 'GET,POST,OPTIONS',
//   allowedHeaders: 'Content-Type,Authorization'
// };

app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, 'views'));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// app.use(cors(corsOptions));
app.use(
  cors({
    origin: ["http://localhost:32400", "http://localhost:3001"],
    credentials: true,
  })
);
app.use('/views', express.static(path.join(__dirname, 'views')));

app.use('/public', express.static(path.join(__dirname, 'public')));

app.use(express.static(path.join(__dirname, '../client/build')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  // res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/home', (req, res) => {
  res.render('dashboard');
});

app.get('/health/interface', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Interface is healthy' });
});


app.get('/login', (req, res) => {
  res.render('login');
});
app.use('/api', router);

app.listen(port, () => {
  console.log(`Phoenixd wallet app ruuning at http://localhost:${port}`);
});



