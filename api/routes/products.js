const express = require('express');
const router = express.Router();
const multer = require('multer');

const checkAuth = require('../middleware/check-auth');
const productsCtrl = require('../controllers/poducts');

// Settings uploded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + file.originalname);
  }
});
const fileFilter = (req, file, cb) => {
  // Reject a file
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 },
  fileFilter: fileFilter
});

// Headers: Authorization = Bearer + space + token
router.post('/', checkAuth, upload.single('productImage'), productsCtrl.createProduct);

router.get('/', checkAuth, productsCtrl.getAllProduct);

router.get('/:id', checkAuth, productsCtrl.getOneProduct);

router.put('/:id', checkAuth, productsCtrl.editProduct);

router.delete('/:id', checkAuth, productsCtrl.deleteProduct);

module.exports = router;