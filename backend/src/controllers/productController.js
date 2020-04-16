const connection = require('../database/connect');

module.exports = {
    async index(request, response){
        const products = await connection('produtos').select('*');

        return response.json(products);
    },
    async indexProduct(request, response) {
        const {id} = request.params;

        const idProductUpdate = await connection('produtos').where('id', id).select('id');

        if (!idProductUpdate) {
            return response.status(401).json({ error: 'Product not found.' });
        }

        const productUpdate = await connection('produtos').where('id', id).select('*');

        return response.json(productUpdate);
    },
    async create(request, response){
        const {name, amount, price} = request.body;

        const [id] = await connection('produtos').insert({name, price, amount});

        return response.json({id});
    },
    async update(request, response){
        const {id} = request.params;
        const {name, amount, price} = request.body;

        const idUpdate = await connection('produtos').where('id', id).select('id');

        if(!idUpdate){
            return response.status(401).json({error: 'Product not found.'});
        }

        await connection('produtos').where('id', id).update('name', name).update('price', price).update('amount', amount);

        return response.status(204).send();
    },
    async delete(request, response) {
        const {id} = request.params;

        const idDelete = await connection('produtos').where('id', id).select('id');

        if (!idDelete) {
            return response.status(401).json({ error: 'Product not found.' });
        }

        await connection('produtos').where('id', id).delete();

        return response.status(204).send();
    }
}