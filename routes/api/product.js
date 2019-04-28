var express = require('express')
var router = express.Router()
const productController = require('../../controllers/api/ProductController')
const verifyToken = require('../../Middlewares/JwtAuthMiddleware')
router.get('/list', productController.list);
router.get('/getAlls', productController.getAlls);
router.get('/getAll', productController.getAll);
router.get('/getAlltags', productController.getAlltags);
router.get('/show/:id', productController.show);
router.post('/store', productController.store);
router.post('/update/:id', productController.update);
router.post('/saveProductAndTag', productController.saveProductAndTag)
router.post('/saveProductAndTagAsync', productController.saveProductAndTagAsync)
router.post('/remove', productController.remove)
module.exports = router;