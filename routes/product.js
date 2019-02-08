const router = require('express').Router();
const productController = require('../controller/product');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

router.get('/', productController.getProducts);
router.post('/', auth, productController.newProduct);
router.get('/:id', productController.getSingleProduct);
router.put('/:id', auth, admin, productController.editProduct);
router.patch('/:id', auth, admin, productController.markSold);
router.delete('/:id', auth, admin, productController.deleteProduct);

module.exports = router;
