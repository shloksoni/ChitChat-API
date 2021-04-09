var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');
var config = require('config')
const knex = require('../db/knex');
const checkToken = require('../middlewares/checkToken')
const { body, validationResult } = require('express-validator');
/* GET users listing. */

const getToken = (key) =>{
  return jwt.sign({ username: key }, config.SECRET, {
      expiresIn: 86400 
  });
}

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


// -> Validate req.body 
// -> Hash the password
// -> Check if user already exists
// -> Create User if !exists

router.post('/register', 
  body('email').isEmail(),
  // password must be at least 5 chars long
  body('username').isLength({ min: 1 }),
  body('password').isLength({ min: 1 }),
  body('name').isLength({ min: 3 }),
  function(req, res) {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {username, password, name, email} = req.body;
    knex('users').select().where(function() {
      this.where('email', email).orWhere('username',  username)
    })
    .then(data =>{
      if(data.length > 0){
        return res.status(400).send({auth: false, message: "User Already exists"});
      }
      else{
        knex('users')
        .insert({email,name,password,username})
        .returning('*')
        .then(users =>{
          var token = getToken(username)
          res.cookie('authCookie', token)
          return res.send({auth: true, user: users[0]});
        })

      }
       
    })
  }
);


router.post('/signIn', 
  // password must be at least 5 chars long
  body('username').isLength({ min: 3 }),
  body('password').isLength({ min: 1 }),
  function(req, res) {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {username, password} = req.body;

    knex('users').select().where({username, password})
    .then(users =>{
      if(users.length == 0){
        return res.status(400).send({auth: false, message: "Username or Password Invalid"});
      }
      else{
        var token = getToken(username)
        res.cookie('authCookie', token)
        return res.send({auth: true, user: users[0]});

      }
       
    })
  }
);


router.get('/me', 
  checkToken, function(req, res) {
    console.log("me");
  res.send(req.user);
});


router.post('/follow', checkToken, (req,res)=>{
  const following_username = req.user.username;
  const follower_username = req.body.username;
  knex('followers').select().where({follower_username, following_username}).then(data =>{
    if(data.length === 0){
      knex('followers').insert({follower_username,following_username}).returning('*').then(data =>{
        knex('users').where({username : following_username}).increment({
          following : 1
        })
        .then(()=>{
          knex('users').where({username : follower_username}).increment({
            followers : 1
          })
          .then(()=> res.send({result : true})) 
        })
      })
    }
    else{
      res.send({result : false})
    }
  })
})


router.post('/unfollow', checkToken, (req,res)=>{
  const following_username = req.user.username;
  const follower_username = req.body.username;
  knex('followers').select().where({follower_username, following_username}).then(data =>{
    if(data.length === 0){
      res.send({result : false})
    }
    else{
      knex('followers').del().where({follower_username,following_username}).then(data =>{
        knex('users').where({username : following_username}).decrement({
          following : 1
        })
        .then(()=>{
          knex('users').where({username : follower_username}).decrement({
            followers : 1
          })
          .then(()=> res.send({result : true})) 
        })
      })
    }
  })
})


module.exports = router;
