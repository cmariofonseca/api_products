const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const userCtrl = {};

userCtrl.createUser = async (req, res) => {
  await User.find({ email: req.body.email }).then(user => {
    if (user.length >= 1) { // If there is more than one user with the same email
      return res.status(409).json({ message: 'Mail exists' });
    } else {
      bcrypt.hash(req.body.password, 10, (error, hash) => {
        if (error) {
          return res.status(500).json({ error: error })
        } else {
          const user = new User({
            _id: new mongoose.Types.ObjectId(),
            email: req.body.email,
            password: hash
          });
          user.save().then(reuslt => {
            res.status(201).json({
              message: 'Created user successfullly'
            });
          }).catch(error => {
            res.status(500).json({
              error: error
            });
          });
        }
      });
    }
  }).catch(error => {
    res.status(500).json({
      error: error
    });
  });
};

userCtrl.deleteUser = async (req, res) => {
  console.log(req.body);
  await User.findOneAndDelete(req.params.id).then(result => {
    res.status(200).json({
      message: 'Deleted user!'
    });
  }).catch(error => {
    res.status(500).json({
      error: error
    });
  });
};

userCtrl.createLogin = async (req, res) => {
  await User.find({ email: req.body.email }).then(user => {
    if (user.length < 1) {
      return res.status(401).json({ message: 'Auth failed' });
    }
    bcrypt.compare(req.body.password, user[0].password, (error, result) => {
      if (error) {
        return res.status(401).json({ message: 'Auth failed' });
      }
      if (result) {
        const token = jwt.sign({
          email: user[0].email,
          userId: user[0]._id
        }, 'secret', { expiresIn: '1h' }); // Secret key
        return res.status(200).json({
          message: 'Auth successful',
          token: token
        });
      }
      res.status(401).json({ message: 'Auth failed' });
    });
  }).catch(error => {
    res.status(500).json({
      error: error
    });
  });
};

module.exports = userCtrl;