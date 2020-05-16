import React, { useState, useEffect, Fragment } from 'react';
import { Widget, addResponseMessage } from 'react-chat-widget';
import socketIOClient from 'socket.io-client';

const Create = (props) => {
  const [channel, setChannel] = useState('none');
  const [member, setMember] = useState([]);
  const [room, setRoom] = useState('');
  const [troom, setTRoom] = useState(true);
  const [lname, setLName] = useState('');
  const [fname, setFName] = useState('');
  const [mname, setMName] = useState('');

  const socket = socketIOClient('http://127.0.0.1:2802');
  const chatid = Math.random();

  useEffect(() => {
    socket.on('CHAT_MESSAGE', data => {
      if (data.room === channel && channel !== 'none') {
        if (data.chatid !== chatid && data.name !== lname + ', ' + fname + ' ' + mname) {
          addResponseMessage(data.name + ' : ' + data.message);
        }
      }
    });
    socket.on('JOIN_MESSAGE', data => {
      alert('join' + data.room + '-' + data.name + '-' + data.chatid);
      if (data.room === channel && channel !== 'none') {
        if (data.chatid !== chatid) {
          setMember(prevMember => [...prevMember, data.name]);
        }
      }
    });
  },[channel]);

  const handleMessage = (message) => {
    socket.emit('CHAT_MESSAGE', { room, message, name: lname + ', ' + fname + ' ' + mname, chatid });
  }

  return (
    <Fragment>
      { (channel === 'none') ?
        <div className='container d-flex vh-100 p-3 mx-auto flex-column'>
          <header className='mb-auto'></header>
          <main>
            <div class="card mx-auto" style={{width: '28rem'}}>
              <div class="card-body">
                <h5 class="card-title">Create Room</h5>
                <div class="form-group">
                  <label>Room</label>
                  <input type="text" class="form-control" value={room} onChange={(e)=>{setRoom(e.target.value)}} />
                  <small class="form-text text-muted">Share this code. To let them join the chat.</small>
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
                  <button type="button" class="btn btn-primary" onClick={()=>{setChannel(room);setMember(prevMember => [...prevMember, lname + ', ' + fname + ' ' + mname]);socket.emit('CONVO_CREATED', { room, name: lname + ', ' + fname + ' ' + mname, chatid });}}>Create Room</button>
                : null }
              </div>
            </div>
          </main>
          <footer className='mt-auto'></footer>
        </div> :       
        <div class="container-fluid vh-100">
          <div class="row">
            <nav class="col-md-2 d-none d-md-block bg-light sidebar p-2">
              <div class="sidebar-sticky">
                <ul class="nav flex-column">
                  <li class="nav-item">
                    <a class="nav-link active" href="#">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-home"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                      Room: {channel}
                    </a>
                  </li>
                  {/* <li class="nav-item">
                    <a class="nav-link" href="#">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-layers"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
                      Integrations
                    </a>
                  </li> */}
                </ul>
        
                <h6 class="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">
                  <span>Room Members</span>
                  <a class="d-flex align-items-center text-muted" href="#" onClick={()=>{setTRoom(!troom)}} aria-label="Add a new report">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-plus-circle"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
                  </a>
                </h6>
                {
                  troom ?
                    <ul class="nav flex-column mb-2">
                      { member.map((e,i)=>(
                        <li class="nav-item">
                          <a class="nav-link" href="#" key={'mem'+i}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-users"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                            {e}
                          </a>
                        </li>
                      ))}
                      {/* <li class="nav-item">
                        <a class="nav-link" href="#">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-file-text"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                          Year-end sale
                        </a>
                      </li> */}
                    </ul>
                  : null
                }
                </div>
            </nav>
        
            <main role="main" class="col-md-9 ml-sm-auto col-lg-10 px-4 vh-100">   
            <Widget 
              handleNewUserMessage={ handleMessage }
              style={{ position: 'absolute' }}
              title='Cavite State University'
              subtitle='lab'
              badge={ 1 } />
            </main>
          </div>
        </div>
      }

    </Fragment>
  );
}

export default Create;