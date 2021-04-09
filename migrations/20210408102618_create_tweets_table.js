
exports.up = function(knex, Promise) {
  return knex.schema.createTable('tweets', function(table) {
    table.increments();
    table.string('username').notNullable().references('username').inTable('users');
    table.string('tweet_text').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.boolean('is_retweet').notNullable().defaultTo(false);
    table.boolean('is_comment').notNullable().defaultTo(false);
    table.integer('source_id');
    table.integer('likes').defaultTo(0);
    table.integer('comments').defaultTo(0);


  })
}
exports.down = function(knex, Promise) {
  return knex.schema.dropTable('tweets');
}
