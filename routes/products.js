const express = require('express')
const router = express.Router()
const { getAllProducts, getProduct } = require('../controllers/products')


router.route('/all').get(getAllProducts)
router.route('/:id').get(getProduct)

module.exports = router