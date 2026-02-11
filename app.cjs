const express = require('express');
const cors = require('cors');

require('dotenv').config();
const mongoose = require('mongoose');
const passport = require('passport');
const v1Routes = require('./routes/v1/index.cjs');
const { jwtStrategy } = require('./config/passport.cjs');

const app = express();

app.use(cors({
  origin: /^http:\/\/localhost:\d+$/,
  methods: 'GET,POST,PUT,DELETE',
  credentials: true
}));

app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ limit: '5mb', extended: true }));

app.use(passport.initialize());
passport.use('jwt', jwtStrategy);

const mongoUri = process.env.MONGO_URI;
mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 1000 })
  .then(() => console.log('Connected!'))
  .catch(err => console.error('Connection error:', err));

app.use('/v1', v1Routes);

app.use((err, req, res, next) => {
  console.log("err:", err)//this line not printing.
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  if (statusCode === 500) {
    console.error(err);
  }

  res.status(statusCode).json({
    code: statusCode,
    message: message,
  });
});

app.listen(3000, () => {
  console.log(`LinkedInClone server listening on http://localhost:3000`);
});