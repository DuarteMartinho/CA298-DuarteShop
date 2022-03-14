var express = require('express');
var router = express.Router();
var ft = require('node-fetch');

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

//prod/:prodid
router.get('/prod/:productId/', function(req, res, next) {
  let request = "http://localhost:1111/api/products/" + req.productId;
  ft.fetch(request) // make a request to this endpoint
    .then(response => response.json()) // with our response, get the json data returned
    .then((data) => {
        if ('detail' in data) { 
          console.log('NOT FOUND');
        } else {
          console.log(data);
          res.render('prod', {data: data});

        }
    }
  );
});

module.exports = router;
