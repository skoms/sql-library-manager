var express = require('express');
var router = express.Router();
const { Book } = require('../models');

/* Async handler Middleware. */
function asyncHandler(callback){
  return async (req, res, next) => {
    try {
      await callback(req, res, next)
    } catch(error){
      next(error);
    }
  }
}

/* GET home page. */
router.get('/', asyncHandler((req, res, next) => {
 res.redirect('/books');
}));

/* GET books page. */
router.get('/books', asyncHandler( async (req, res, next) => {
  const books = await Book.findAll();
  console.log(books);
  res.render('all_books', { books });
 }));
 

module.exports = router;
