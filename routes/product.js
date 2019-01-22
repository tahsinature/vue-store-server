const router = require('express').Router();
const productController = require('../controller/product');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

router.get('/', productController.getProducts);
router.get('/:id', productController.getSingleProduct);
router.put('/:id', auth, admin, productController.editProduct);
router.post('/', auth, productController.newProduct);
module.exports = router;
