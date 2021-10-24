const express = require('express')
const router = express.Router()
const { getAllProducts, getProduct } = require('../controllers/products')

router.route('/:id').get(getProduct)
router.route('/all').get(getAllProducts)

module.exports = router