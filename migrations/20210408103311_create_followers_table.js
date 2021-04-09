
exports.up = function(knex, Promise) {
  return knex.schema.createTable('followers', function(table) {
   table.string('following_username').references('username').inTable('users');
   table.string('follower_username').references('username').inTable('users');

  })
}

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('followers');
}