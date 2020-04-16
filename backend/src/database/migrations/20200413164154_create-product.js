exports.up = function(knex) {
    return knex.schema.createTable('produtos', function(table){
        table.increments('id').primary();
        table.string('name').notNullable();
        table.decimal('price').notNullable();
        table.integer('amount').unsigned().notNullable();
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('produtos');
};
