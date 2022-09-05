var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/:roomKey', function(req, res, next) {
  res.render('index', { roomKey: req.params.roomKey });
  var io = req.app.get('io');
  io.on('connection', (socket) => {
    socket.on('join', (roomKey, userId) => {
      socket.join(roomKey);
      socket.to(roomKey).brodcast.emit('joinRoom', userId); // sender 제외 소켓 전송
  
      socket.on('exit', () => {
        socket.to(roomKey).broadcast.emit('exitRoom', userId);
      })
    })
  })
});




module.exports = router;
