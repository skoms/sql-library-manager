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
  res.render('index', { title: "Books", books, checked: false });
}));

// POST search results page
router.post('/', asyncHandler( async (req, res, next) => {
  let books;
  try {
    books = await Book.findAll({ where: {}});
    res.render('index', { title: "Books", books, checked: false });
  } catch (error) {
    throw error;
  }
}));
 
/* GET create new book form page. */
router.get('/new', asyncHandler( (req, res, next) => {
  res.render('new-book', { title: "New Book" });
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

/* GET book update form page. */
router.get('/:id', asyncHandler( async (req, res, next) => {
  let book = await Book.findByPk(req.params.id);
  if(book) {
    res.render('update-book', { title: "Update Book", book });
  } else {
    next(); // will pass on the route to the 404 catcher
  }
}));

/* POST Update book. */
router.post('/:id', asyncHandler( async (req, res, next) => {
  let book;
  try {
    book = await Book.findByPk(req.params.id);
    if (book) {
      book.id = req.params.id;
      await book.update(req.body);
      res.redirect("/books");
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    console.log(error.name);
    if(error.name === "SequelizeValidationError") {
      book = await Book.build(req.body);
      book.id = req.params.id;
      res.render('update-book', { title: "Update Book", book, errors: error.errors });
    } else {
      throw error; // error get thrown up to the asyncHandler's catch block
    }
  }
}));

/* POST Delete book. */
router.post('/:id/delete', asyncHandler( async (req, res, next) => {
  const book = await Book.findByPk(req.params.id);
  console.log(book);
  try {
    await Book.destroy({ where: { id: book.id}});
    res.redirect('/books');
  } catch (error) {
    throw error;
  }
}));

module.exports = router;
