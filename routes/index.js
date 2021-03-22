var express = require('express');
var router = express.Router();

/* GET home page (Redirect to book list). */
router.get('/', (req, res, next) => {
 res.redirect('/books');
});

// Export router
module.exports = router;
