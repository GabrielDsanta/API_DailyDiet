import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('users', (table) => {
        table.uuid('id').primary()
        table.text('name').notNullable()
        table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable
    })

    await knex.schema.createTable('meats', (table) => {
        table.uuid('id').primary()
        table.text('name').notNullable()
        table.text('date').notNullable()
        table.boolean('isInDiet').notNullable()
        table.text('time').notNullable()
        table.text('description')
        table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('users')
    await knex.schema.dropTable('meats')
}

