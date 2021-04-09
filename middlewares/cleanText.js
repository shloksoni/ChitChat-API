const Filter = require('bad-words'), filter = new Filter();

module.exports = cleanText = (req,res,next) =>{
  req.cleanedText = filter.clean(req.body.text);
  next();
}