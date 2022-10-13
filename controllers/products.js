const Product = require("../models/product");

const getAllProducts = async (req, res) => {
    const { featured, company, name, rating, price, sort, fields, limit, page, numericFilter } = req.query;
    let queryObject = {};
    if (featured) queryObject.featured = featured === "true";
    if (company) queryObject.company = company;
    if (name) queryObject.name = { $regex: name, $options: "i" };
    if (numericFilter) {
        const operationsMap = {
            '>': '$gt',
            '>=': '$gte',
            '<': '$lt',
            '<=': '$lte',
            '=': '$eq',
        }
        const regex = /\b(>|<|>=|<=|=)\b/g
        const props = numericFilter.split(',').map(prop => prop.split(regex))
        let numericFilterObject = {}
        const replace = str => operationsMap[str]
        const fields = ['price', 'rating']
        props.forEach(prop => {
            const [name, , value] = prop
            const symbol = replace(prop[1])
            if (fields.includes(name)) {

                numericFilterObject = {
                    ...numericFilterObject,
                    ...{
                        [name]: { [symbol]: Number(value) }
                    }
                }
            }
        })
        queryObject = { ...queryObject, ...numericFilterObject }
    }
    // console.log(queryObject)
    const result = Product.find(queryObject);
    if (sort) {
        const sortList = sort.split(",").join(" ");
        result.sort(sortList);
    } else {
        result.sort("createdAt");
    }
    if (fields) {
        const fieldsList = fields.split(",").join(" ");
        result.select(fieldsList);
    }
    if (numericFilter) {
        const operationsMap = {
            '>': '$gt',
            '>=': '$gte',
            '<': '$lt',
            '<=': '$lte',
            '=': '$eq',
        }
        const regex = /\b(>|<|>=|<=|=)\b/g
        const props = numericFilter.split(',').map(prop => prop.split(regex))
        let numericFilterObject = {}
        const replace = str => operationsMap[str]
        props.forEach(prop => {
            const name = prop[0]
            const symbol = replace(prop[1])
            const value = prop[2]
            numericFilterObject = {
                ...numericFilterObject,
                ...{
                    [name]: { [symbol]: value }
                }
            }
        })
        queryObject = { ...queryObject, numericFilterObject }
    }
    if (page) {
        const limitNumber = Number(limit) || 7
        const pageNumber = Number(page) || 1;
        const skip = (pageNumber - 1) * limitNumber
        result
            .skip(skip)
            .limit(limitNumber)
    }
    const products = await result;
    res.status(200).json({ nbHits: products.length, products });
};

module.exports = {
    getAllProducts,
};
