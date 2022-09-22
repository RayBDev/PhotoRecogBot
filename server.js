require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const knex = require('knex');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const requestMethodFilter = require('./middlewares/requestMethodFilter');
const authenticateToken = require('./middlewares/authenticateToken');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const image = require('./controllers/image');
const refreshToken = require('./controllers/refreshToken');

const db = knex.knex({
  client: 'pg',
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  },
});

const app = express();

app.use(bodyParser.json());
app.use(requestMethodFilter);
app.use(
  cors({
    origin: process.env.ORIGIN_URL,
    credentials: true,
  })
);
// app.use(function (req, res, next) {
//   res.header('Access-Control-Allow-Credentials', 'true');
//   res.header('Access-Control-Allow-Origin', process.env.ORIGIN_URL);
//   res.header(
//     'Access-Control-Allow-Headers',
//     'Origin, X-Requested-With, Content-Type, Accept'
//   );
//   res.header(
//     'Access-Control-Allow-Methods',
//     'GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS'
//   );
//   next();
// });

// JWT Token Generator
const generateAccessToken = (userDetails) => {
  return jwt.sign(userDetails, process.env.JWT_SECRET, { expiresIn: '1800s' });
};

// Serve static assets if in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

app.get('/api/', (req, res) => {
  res.send('it is working');
});
app.post('/api/authToken', authenticateToken, (req, res) => {
  refreshToken.refreshAuthToken(req, res, generateAccessToken);
});
app.post('/api/signin', (req, res) => {
  signin.handleSignin(req, res, db, bcrypt, generateAccessToken);
});
app.post('/api/register', (req, res) => {
  register.handleRegister(req, res, db, bcrypt, generateAccessToken);
});
app.put('/api/image', authenticateToken, (req, res) => {
  image.handleImage(req, res, db);
});
app.post('/api/imageurl', authenticateToken, (req, res) => {
  image.handleApiCall(req, res);
});
app.get('/api/images/:limit/:type', (req, res) => {
  image.returnImages(req, res, db);
});

app.listen(process.env.PORT || 5000, () => {
  console.log(`app is running on port ${process.env.PORT || 5000}`);
});

/*
Directory Structure AKA the endpoints
/ --> res = this is working
/signing --> POST = success/fail
/register --> POST = user
/profile/:userid --> GET = user
/image --> PUT --> user
*/
