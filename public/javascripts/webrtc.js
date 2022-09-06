(() => {
    const socket = io('/');
    const videoGrid = document.getElementById('video-grid');
    const myPeer = new Peer();
    const myVideo = document.createElement('video');
    myVideo.muted = true;
    const peers = {};

    // 내장함수 navigator
    // @mediaDevices 싱글톤 객체
    navigator.mediaDevices
      // @getUserMedia 화면, 음성 허용
      // 현재 방식은 promise
      .getUserMedia({
        video: true,
        audio: true,
      })
      // promise의 then
      // then는 promise가 반환 했을때 실행
      .then((stream) => {
        addVideoStream(myVideo, stream);
    
        myPeer.on('call', (call) => {
          call.answer(stream);
          const video = document.createElement('video');
          call.on('stream', (userVideoStream) => {
            addVideoStream(video, userVideoStream);
          });
        });
    
        socket.on('user-connected', (userId) => {
          connectToNewUser(userId, stream);
        });
      });
    
    socket.on('user-disconnected', (userId) => {
      if (peers[userId]) peers[userId].close();
    });
    
    myPeer.on('open', (id) => {
      socket.emit('join-room', "temp", id);
    });
    
    function connectToNewUser(userId, stream) {
      const call = myPeer.call(userId, stream);
      const video = document.createElement('video');
      call.on('stream', (userVideoStream) => {
        addVideoStream(video, userVideoStream);
      });
      call.on('close', () => {
        video.remove();
      });
    
      peers[userId] = call;
    }
    
    function addVideoStream(video, stream) {
      video.srcObject = stream;
      video.addEventListener('loadedmetadata', () => {
        video.play();
      });
      videoGrid.append(video);
    }
})()