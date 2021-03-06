import React from 'react';
import $ from 'jquery';
import io from 'socket.io-client';

import styles from './RecordingPage.scss';

export default class TeacherStream extends React.Component {

  constructor() {
    super();
    this.joinRoom = this.joinRoom.bind(this);
    this.leaveRoom = this.leaveRoom.bind(this);

    this.socket = io();
    this.socket.on('mobile attached', () => {
      console.log('received mobile');
      this.leaveRoom();
    });
    this.socket.on('mobile detached', () => {
      this.joinRoom();
    });

    this.webrtc = new SimpleWebRTC({
      localVideoEl: 'localVideo',
      autoRequestMedia: true
    });

    this.webrtc.on('readyToCall', () => {
      console.log('joining room');
      $.ajax({
        type: 'POST',
        url: '/nonce',
        success: (data) => {
          this.webrtc.joinRoom(data.nonce);
          this.nonce = data.nonce;
        },
      });
    });
  }

  joinRoom() {
    this.webrtc.startLocalVideo();
  }

  leaveRoom() {
    this.webrtc.stopLocalVideo();
  }

  render() {
    return (<video className={styles.vidObject} height="300" id="localVideo"></video>);
  }
}
