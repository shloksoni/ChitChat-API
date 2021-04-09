exports.up = function(knex, Promise) {
  return knex.schema.createTable('likes', function(table) {
    table.integer('user_id').references('id').inTable('users');
    table.integer('tweet_id').references('id').inTable('tweets');

  })
}

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('likes');
}