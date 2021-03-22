var express = require('express');
var router = express.Router();
const { Book } = require('../models');
const { Op } = require('sequelize');


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
  res.redirect('/books/page-1');
}));

/* GET books by page num. */
router.get('/page-:page', asyncHandler( async (req, res, next) => {
  const page = req.params.page;
  const perPage = 10;
  const books = await Book.findAll({ limit: perPage, offset: perPage * (page - 1), order: [['title', 'ASC']] });

  const totalBooks =  await Book.findAll(); // used to set up pagination buttons
  const pages = Math.round(totalBooks.length / perPage);

  res.render('index', { title: "Books", books, pages, source: 'home', column: '', order: '' });
}));

/* GET books by page num and order. */
router.get('/page-:page/:column-:order', asyncHandler( async (req, res, next) => {
  const page = req.params.page;
  const perPage = 10;
  const column = req.params.column;
  const order = req.params.order; 

  const books = await Book.findAll({ limit: perPage, offset: perPage * (page - 1), order: [[column, order]] });

  const totalBooks =  await Book.findAll(); // used to set up pagination buttons
  const pages = Math.round(totalBooks.length / perPage);

  res.render('index', { title: "Books", books, pages, source: 'ordered', column, order });
}));

// POST simple search results page
router.post('/simple-search', asyncHandler( async (req, res, next) => {
  /* Sets the query to null if it's empty, as '' will result to all when using Op.substring. This prevents false results (Press the 'Home' button to return to home)*/
  let query = req.body.search === '' ? null : req.body.search;
  let books;
  try {
    books = await Book.findAll({
      where: {
        [Op.or]: [
          { title: {  [Op.substring]: query }},
          { author: { [Op.substring]: query }},
          { genre: { [Op.substring]: query }},
          { year: { [Op.eq]: query }}
        ]
      },
      order: [['title', 'ASC']]
    });
    res.render('index', { title: query !== '' ? `Search Results for: '${query}'` : 'Books', books, search: query });
  } catch (error) {
    throw error;
  }
}));

// POST advanced search results page
router.post('/advanced-search', asyncHandler( async (req, res, next) => {
  /* Sets the different values to null if they are empty, as '' will result to all when using Op.substring. This prevents false results */
  const titleQuery = req.body['title-search'] === '' ? null : req.body['title-search'];
  const authorQuery = req.body['author-search'] === '' ? null : req.body['author-search'];
  const genreQuery =req.body['genre-search'] === '' ? null : req.body['genre-search'];
  const yearQuery = req.body['year-search'] === '' ? null : req.body['year-search'];

  let books;
  try {
    books = await Book.findAll({
      where: {
        [Op.or]: [
          { title: {
            [Op.substring]: titleQuery,
          }},
          { author: {
            [Op.substring]: authorQuery,
          }},
          { genre: {
            [Op.substring]: genreQuery,
          }},
          { year: {
            [Op.eq]: yearQuery,
          }},
        ]
      },
      order: [['title', 'ASC']]
    });
    res.render('index', { title: 'Advanced Search Results', books, titleQuery, authorQuery, genreQuery, yearQuery});
  } catch (error) {
    throw error;
  }
}));
 
/* GET create new book form page. */
router.get('/new', asyncHandler( (req, res, next) => {
  res.render('new-book', { title: "New Book", book: {} });
}));

/* POST create new book. */
router.post('/', asyncHandler( async (req, res, next) => {
  let book;
  try {
    book = await Book.create(req.body);
    res.redirect('/books'); 
  } catch (error) {
    if(error.name === "SequelizeValidationError") {
      book = await Book.build(req.body);
      res.render('new-book', { title: "New Book", book, errors: error.errors });
    } else {
      throw error; // error get thrown up to the asyncHandler's catch block
    }
  }
}));

/* GET book update form page. */
router.get('/book-:id', asyncHandler( async (req, res, next) => {
  let book = await Book.findByPk(req.params.id);
  if(book) {
    res.render('update-book', { title: "Update Book", book });
  } else {
    next(); // will pass on the route to the 404 catcher
  }
}));


router.get('/error', asyncHandler( async (req, res, next) => {
  const error = new Error();
  throw error;
}));

/* POST Update book. */
router.post('/book-:id', asyncHandler( async (req, res, next) => {
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
router.post('/book-:id/delete', asyncHandler( async (req, res, next) => {
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
