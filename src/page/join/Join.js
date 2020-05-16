import React, { useState, useEffect, Fragment } from 'react';
import { Widget, addResponseMessage } from 'react-chat-widget';
import socketIOClient from 'socket.io-client';

const Join = (props) => {
  const [channel, setChannel] = useState('none');
  const [room, setRoom] = useState('');
  const [lname, setLName] = useState('');
  const [fname, setFName] = useState('');
  const [mname, setMName] = useState('');

  const socket = socketIOClient('http://127.0.0.1:2802');
  const chatid = Math.random();

  useEffect(() => {
    socket.on('CHAT_MESSAGE', data => {
      if (data.room === channel && channel !== '') {
        if (data.chatid !== chatid) {
          addResponseMessage(data.name + ' : ' + data.message);
        }
      }
    });
  },[channel]);

  const handleMessage = (message) => {
    socket.emit('CHAT_MESSAGE', { room, message, name: lname + ', ' + fname + ' ' + mname, chatid });
  }

  const joinChannel = (name) => {
    socket.emit('JOIN_MESSAGE', { room, name, chatid });
  }

  return (
    <Fragment>
      { (channel === 'none') ?
        <div className='container d-flex vh-100 p-3 mx-auto flex-column'>
          <header className='mb-auto'></header>
          <main>
            <div class="card mx-auto" style={{width: '28rem'}}>
              <div class="card-body">
                <h5 class="card-title">Join Room</h5>
                <div class="form-group">
                  <label>Room</label>
                  <input type="text" class="form-control" value={room} onChange={(e)=>{setRoom(e.target.value)}} />
                  <small class="form-text text-muted">Paste the code to join the chat.</small>
                </div>
                <div class="form-group">
                  <label>Last Name</label>
                  <input type="text" class="form-control" value={lname} onChange={(e)=>{setLName(e.target.value)}} />
                </div>
                <div class="form-group">
                  <label>First Name</label>
                  <input type="text" class="form-control" value={fname} onChange={(e)=>{setFName(e.target.value)}} />
                </div>
                <div class="form-group">
                  <label>Middle Name</label>
                  <input type="text" class="form-control" value={mname} onChange={(e)=>{setMName(e.target.value)}} />
                </div>
                { (lname !== '' && fname !== '' && mname !== '' && room !== '') ?
                  <button type="button" class="btn btn-primary" onClick={()=>{setChannel(room);joinChannel(lname + ', ' + fname + ' ' + mname)}}>Join Room</button>
                : null }
              </div>
            </div>
          </main>
          <footer className='mt-auto'></footer>
        </div> :       
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
      }

    </Fragment>
  );
}

export default Join;