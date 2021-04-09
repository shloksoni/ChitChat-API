const jwt = require('jsonwebtoken');
const config = require('config')
const bcrypt = require('bcryptjs');

module.exports = hashPassword =(req,res,next)=>{
  if(!req.body.password){
    return res.sendStatus(401);
  }
  var salt = bcrypt.genSaltSync(10);
  var hash = bcrypt.hashSync(req.body.password, salt);
  req.body.password = hash;
  next();
}