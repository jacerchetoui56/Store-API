require('dotenv').config()

const Products = require('./models/product');
const productsJson = require('./products.json');
const connectDB = require('./db/connect');


const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        await Products.deleteMany();
        await Products.create(productsJson);
        console.log('success');
    } catch (error) {
        console.log(error);
    }
}

start()
