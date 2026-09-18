const express = require('express');
const cors = require('cors');

require('dotenv').config();
const mongoose = require('mongoose');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const v1Routes = require('./routes/v1/index.js');
const { jwtStrategy } = require('./config/passport.js');

const app = express();

app.use(cors({
  origin: [
    /^http:\/\/localhost:\d+$/,
    'https://linked-in-clone-mu-pearl.vercel.app'
  ],
  methods: 'GET,POST,PUT,DELETE,PATCH',
  credentials: true
}));

app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ limit: '5mb', extended: true }));

app.use(cookieParser());

app.use(passport.initialize());
passport.use('jwt', jwtStrategy);

const mongoUri = process.env.MONGO_URI;
mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 })
  .then(() => console.log('Connected!'))
  .catch(err => {
    console.error('Connection error:', err)
    process.exit(1)
  });

const { errorHandler } = require('./middlewares/error.js');
const ApiError = require('./utils/ApiError.js');
const httpStatus = require('http-status').default;

app.use('/v1', v1Routes);

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

// handle error
app.use(errorHandler);

app.listen(3000, () => {

  console.log(`LinkedInClone server listening on http://localhost:3000`);
});