var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/:roomKey', function(req, res, next) {
  res.render('index', { roomKey: req.params.roomKey });
});

module.exports = router;
