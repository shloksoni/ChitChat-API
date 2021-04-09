const jwt = require('jsonwebtoken');
const config = require('config')
const knex = require('../db/knex');

module.exports =  checkToken  = (req, res, next)  => {
  //get authcookie from request
  const authcookie = req.cookies.authCookie 

  if (authcookie == null) return res.sendStatus(401)

  jwt.verify(authcookie,config.get('SECRET'),(err,decode)=>{
    if(err){
      res.status(400);
    }
    else if(decode){
      
      knex('users').select().where({username : decode.username})
      .then(data =>{
        if(data.length == 0)  res.status(400);
        else{
          req.user = data[0];
          next();
        }
      })
    }
  })
  
}
