const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const productRoutes = require('./api/routes/products')
const orderRoutes = require('./api/routes/orders')
const userRoutes = require('./api/routes/users')
const StaticsRoutes = require('./api/routes/statics')

mongoose.connect('mongodb://node-shop:' + process.env.MONGO_ATLAS_PW + '@node-rest-shop-shard-00-00-zbiti.mongodb.net:27017,node-rest-shop-shard-00-01-zbiti.mongodb.net:27017,node-rest-shop-shard-00-02-zbiti.mongodb.net:27017/test?ssl=true&replicaSet=node-rest-shop-shard-0&authSource=admin');

app.set('view engine', 'ejs');
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

app.use('/', StaticsRoutes)
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/api/users', userRoutes);

app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
})

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
             message: error.message
        }
    })
})

module.exports = app;