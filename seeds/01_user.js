
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('tweets').del().then(() =>{
    knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        { 
          username: 'shlok',
          email: 's2hlok@gmail.com',
          password: 'shloksss',
          name: 'shlok'
        },
        { 
          username: 'dev',
          email: 'dev@gmail.com',
          password: 'dev',
          name: 'dev'
        },
        { 
          username: 'shubham',
          email: 'shubham@gmail.com',
          password: 'shubham',
          name: 'shubham'
        }
      ]);
    });
  })
};
