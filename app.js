require("dotenv").config()
require('express-async-errors')
const cors = require('cors')
const express = require("express");
const app = express();
app.use(cors())

//*swagger setup
const swagger = require('swagger-ui-express')
const YAML = require('yamljs')
const swaggerDocument = YAML.load('./swagger.yaml')

const port = process.env.PORT || 3000;
const connectDB = require('./db/connect')
const productsRouter = require('./routes/products')
const notFound = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");
app.use(express.json());

app.use('/api-docs', swagger.serve, swagger.setup(swaggerDocument))

app.get('/', (req, res) => {
    res.send('<h1>Store API</h1><a href="/api-docs" >API documentation</a>')
})
app.use('/api/v1/products', productsRouter)
app.use(notFound);
app.use(errorHandlerMiddleware);

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(port, () => {
            console.log(`Server is listening on port ${port}....`)
        })
    } catch (error) {
        console.log(error)
    }
}

start()