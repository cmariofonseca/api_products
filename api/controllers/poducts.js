const mongoose = require('mongoose');

const Product = require('../models/product');

const productCtrl = {};

productCtrl.createProduct = async (req, res) => {
  console.log(req.file);
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    productImage: req.file.path
  });
  await product.save();
  res.status(201).json({
    message: 'Created product successfullly'
  });
};

productCtrl.getAllProduct = async (req, res) => {
  const products = await Product.find();
  res.status(200).json(products);
};

productCtrl.getOneProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  res.status(200).json(product);
};

productCtrl.editProduct = async (req, res) => {
  const id = req.params.id;
  const product = {
    name: req.body.name,
    price: req.body.price
  };
  console.log(product);
  console.log('Llega hasta aquí');
  await Product.updateOne({ _id: id }, { $set: product });
  res.status(200).json({
    message: 'Updated product!'
  });
};

productCtrl.deleteProduct = async (req, res) => {
  await Product.findByIdAndRemove(req.params.id);
  res.status(200).json({
    message: 'Deleted product!'
  });
};

module.exports = productCtrl;