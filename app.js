const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// Routes which should handle requests
const productRoutes = require('./api/routes/products');
const userRoutes = require('./api/routes/user');

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true }).catch(error => console.log(error.message));

// Middlewares
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/products', productRoutes);
app.use('/user',userRoutes);
app.use('/uploads' ,express.static('uploads'));
// => errors control
app.use((req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
});
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});
// => access control
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, DELETE, GET');
    return res.json(200).json({});
  }
  next();
});

module.exports = app;