var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/login', function(req, res, next) {
  res.render('login');
});

router.get('/register', function(req, res, next) {
  res.render('register');
});

// product?id=1
router.get('/product', function(req, res, next) {
  res.render('product');
});

router.get('/basket', function(req, res, next) {
  res.render('basket');
});

router.get('/order', function(req, res, next) {
  res.render('order');
});

router.get('/ordersuccess', function(req, res, next) {
  res.render('order_success');
});

module.exports = router;
