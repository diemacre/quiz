var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Quiz', link: '<a href="https://github.com/diemacre/quiz">Enlace al proyecto</a>' });
});

module.exports = router;
