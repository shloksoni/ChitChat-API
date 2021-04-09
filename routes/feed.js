var express = require('express');
var router = express.Router();
const checkToken = require('../middlewares/checkToken');
const knex = require('../db/knex')
router.get('/', checkToken, (req,res)=>{
  const username = req.user.username;
  knex.from('tweets').innerJoin('followers', 'tweets.username', 'followers.follower_username')
        .where({following_username : username , is_comment : false, is_retweet : false})
        .then((data) => res.send(data.reverse()))
})

module.exports = router;