var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');
var config = require('config')
const knex = require('../db/knex');
const checkToken = require('../middlewares/checkToken')
const cleanText = require('../middlewares/cleanText')
const { body, validationResult } = require('express-validator');
const { route } = require('./users');

router.get('/', (req,res) =>{
  knex('tweets').select().then((tweets) =>{
    res.send(tweets);
  })
})
router.post('/postTweet', checkToken, cleanText, (req, res)=>{
  const user = req.user
  knex('tweets').insert({tweet_text : req.cleanedText, username : user.username})
  .returning('*')
  .then(tweet =>{
    res.send(tweet[0]);
  })
})

router.post('/postComment', checkToken, cleanText, (req,res)=>{
  const user = req.user
  const source_id = req.body.sourceId;
  console.log(source_id);
  knex('tweets').insert({tweet_text : req.cleanedText, username : user.username, source_id : source_id, is_comment : true})
  .returning('*')
  .then(comm =>{
    knex('tweets').where({id : source_id}).increment({
      comments : 1
    }).then(() =>{
       res.send(comm[0])
    })    
  })
})

router.post('/retweet', checkToken, (req,res)=>{
  const user = req.user
  knex('tweets').insert({ tweet_text : 'dummy', username : user.username, source_id : req.body.sourceID, is_retweet : true})
  .returning('*')
  .then(tweet =>{
    res.send(tweet[0]);
  })
})

router.post('/like', checkToken, (req,res) =>{
  let tweet_id = req.body.tweetId;
  let user_id = req.user.id;
  knex('likes').select()
  .where({user_id : user_id, tweet_id : tweet_id})
  .then(data =>{
    if(data.length === 0){
      //not liked
      knex('likes').insert({user_id, tweet_id})
      .then((d) =>{
       knex('tweets').where({id : tweet_id}).increment({
         likes : 1
       }).then(() =>{
          res.send({liked : true})
       })    
      })
    }
    else{
      knex('likes').where({user_id, tweet_id}).del()
      .then(data => {
        knex('tweets').where({id : tweet_id}).decrement({
          likes : 1
        }).then(() =>{
           res.send({liked : false})
        })
      })
    }
  })
})







module.exports = router;