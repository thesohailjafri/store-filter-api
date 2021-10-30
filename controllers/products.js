const Product = require('../models/product')


const getAllProducts = async (req, res) => {
    let queryObject = {}
    const { featured, name, company, sort, field, limit, page, numericFilters } = req.query

    // filter staff

    if (featured) {
        queryObject.featured = featured === 'true' ? true : false
    }
    if (name) {
        queryObject.name = { $regex: name, $options: 'i' }
    }
    if (company) {
        queryObject.company = company
    }
    if (numericFilters) {
        const operatorMap = {
            '>': '$gt',
            '>=': '$gte',
            '=': '$eq',
            '<': '$lt',
            '<=': '$lte',
        }

        const regEx = /\b(<|>|>=|=|<|<=)\b/
        const filter = numericFilters.replace(regEx, (match) => `-${operatorMap[match]}-`)
        const option = ['price', 'rating']
        filter.split(',').forEach(element => {
            const [field, operator, value] = element.split('-')
            if (option.includes(field)) {
                queryObject[field] = { [operator]: Number(value) }
            }
        })
    }


    let result = Product.find(queryObject)

    //sort staff

    if (sort) {
        const sortList = sort.split(',').join(' ')
        result = result.sort(sortList)
    } else {
        result = result.sort('createAt')
    }

    //field staff

    if (field) {
        const fieldList = field.split(',').join(' ')
        result = result.select(fieldList)
    }

    //paging staff

    const pageNumber = Number(page) || 1
    const pageLimit = Number(limit) || 10
    const skip = (pageNumber - 1) * pageLimit
    result = result.skip(skip).limit(pageLimit)

    const products = await result
    res.status(200).json({ total: products.length, products })
}

const getProduct = async (req, res) => {
    // console.log('here')

    const { id: productID } = req.params
    const product = await Product.findOne({ _id: productID })
    if (!product) {
        return next(createCustomError(`No product with id : ${productID}`, 404))
    }
    res.status(200).json(product)
}


module.exports = {
    getProduct,
    getAllProducts
}