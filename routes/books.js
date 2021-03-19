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

/* GET books page. */
router.get('/', asyncHandler( async (req, res, next) => {
  const books = await Book.findAll();
  res.render('all_books', { title: "Books", books });
}));
 
/* GET create new book form page. */
router.get('/new', asyncHandler( (req, res, next) => {
  res.render('new_book', { title: "New Book" });
}));

/* POST create new book. */
router.post('/', asyncHandler( async (req, res, next) => {
  let book;
  try {
    book = await Book.create(req.body);
    res.redirect('/books');
  } catch (error) {
    throw error;
  }
}));

module.exports = router;
