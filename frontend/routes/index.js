var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/login', function(req, res, next) {
  res.render('login');
});

// product?id=1
router.get('/product', function(req, res, next) {
  res.render('product');
});

module.exports = router;
