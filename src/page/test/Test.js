import React, { useEffect, Fragment } from 'react';
import { Widget, addResponseMessage } from 'react-chat-widget';
import socketIOClient from 'socket.io-client';

const Test = (props) => {
  const socket = socketIOClient('http://127.0.0.1:2802');
  const chatid = Math.random();

  useEffect(() => {
    socket.on('CHAT_MESSAGE', data => {
      if (data.room === 'rizza') {
        if (data.chatid !== chatid) {
          addResponseMessage(data.message);
        }
      }
    });
  },[]);

  const handleMessage = (message) => {
    socket.emit('CHAT_MESSAGE', { room: 'rizza', message, name: 'Jon Angelo Comia', chatid });
  }

  return (
    <Fragment>
      <div style={{
        position: 'relative',
        width: '100vw',
        height: '100vh'
      }}>
        <Widget 
          handleNewUserMessage={ handleMessage }
          style={{ position: 'absolute' }}
          title='Cavite State University'
          subtitle='lab'
          badge={ 1 } />
      </div>
    </Fragment>
  );
}

export default Test;