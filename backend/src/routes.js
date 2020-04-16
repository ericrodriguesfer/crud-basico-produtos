const express = require('express');
const {celebrate, Segments, Joi} = require('celebrate');
const routes = express.Router();
const connection = require('./database/connect');
const productController = require('./controllers/productController');

routes.get('/product', productController.index);

routes.get('/product/:id', celebrate({
    [Segments.PARAMS] : Joi.object().keys({
        id: Joi.number().required(),
    }),
}), productController.indexProduct);

routes.post('/product', celebrate({
    [Segments.BODY] : Joi.object().keys({
        name: Joi.string().required(),
        price: Joi.number().required(),
        amount: Joi.number().required(),
    }),
}), productController.create);

routes.put('/product/:id', celebrate({
    [Segments.PARAMS] : Joi.object().keys({
        id: Joi.number().required(),
    }),
    [Segments.BODY] : Joi.object().keys({
        name: Joi.string().required(),
        amount: Joi.number().required(),
        price: Joi.number().required(),
    }),
}), productController.update);

routes.delete('/product/:id', celebrate({
    [Segments.PARAMS] : Joi.object().keys({
        id: Joi.number().required(),
    })
}), productController.delete);

module.exports = routes;