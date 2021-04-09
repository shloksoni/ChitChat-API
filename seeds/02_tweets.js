
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('tweets').del()
    .then(function () {
      // Inserts seed entries
      return knex('tweets').insert([
        { 
          username: 'shlok',
          tweet_text: 'hey, Shit , long time no fucks',
        },
        { 
          username: 'dev',
          tweet_text : 'Yeah yeah, no dumbfuck',
        },
        {
          username : 'dev',
          tweet_text: 'This is a hello'
        },
        {
          username : 'shubham',
          tweet_text: 'This is shubham'
        },
        {
          username : 'dev',
          tweet_text: 'This is dev'
        }
      ]);
    });
};
