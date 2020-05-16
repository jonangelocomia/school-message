import React, { useState, useEffect, Fragment } from 'react';
import { Widget, addResponseMessage } from 'react-chat-widget';
import socketIOClient from 'socket.io-client';

const View = (props) => {
  const [history, setHistory] = useState([]);
  const [troom, setTRoom] = useState(true);
  const [channel, setChannel] = useState('');

  const socket = socketIOClient('http://127.0.0.1:2802');
  const chatid = Math.random();

  useEffect(() => {
    socket.emit('LOAD_DATA', {});
    socket.on('LOAD_DATA', data => {
      console.log({ data });
      setHistory(data.history);
    });
  },[ ]);

  return (
    <Fragment>    
      <div class="container-fluid vh-100">
        <div class="row">
          <nav class="col-md-2 d-none d-md-block bg-light sidebar p-2">
            <div class="sidebar-sticky">
              <ul class="nav flex-column">
                <li class="nav-item">
                  <a class="nav-link active" href="#">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-layers"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
                    HISTORY
                  </a>
                </li>
                {/* <li class="nav-item">
                  <a class="nav-link" href="#">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-layers"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
                    Integrations
                  </a>
                </li> */}
              </ul>
      
              <h6 class="sidebar-heading d-flex justify-content-between align-items-center px-3 py-2 mt-4 mb-1 text-muted">
                <span>Room List</span>
                <a class="d-flex align-items-center text-muted" href="#" onClick={()=>{setTRoom(!troom)}} aria-label="Add a new report">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-plus-circle"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
                </a>
              </h6>
              <div style={{overflowY: 'scroll',maxHeight: '70vh'}}>
              {
                troom ?
                  <ul class="nav flex-column mb-2">
                    { history.map((data,i)=>(
                      <li class="nav-item px-3 py-2">
                        <button key={'button' + i}
                          className={
                            [
                              'btn btn-block', 
                              channel === data.room ? 'btn-success' : 'btn-outline-success'
                            ].join(' ')
                          } 
                          onClick={
                            () => { setChannel(data.room) }
                          }
                          style={{
                            textAlign: 'left',
                            fontSize: '12px'
                          }}>
                            <strong>DATE:</strong><br/> 
                            &nbsp;{(new Date(data.date)).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}<br/>
                            <strong>ROOM:</strong><br/> 
                            &nbsp;{data.room}<br/>
                            <strong>MODERATOR:</strong><br/> 
                            &nbsp;{data.moderator}<br/>
                        </button>
                      </li>
                    ))}
                  </ul>
                : null
              }
              </div>
            </div>
          </nav>
      
          <main role="main" class="col-md-9 ml-sm-auto col-lg-10 px-4 vh-100" style={{overflowY: 'scroll'}}>   
            { channel !== '' ?
              <React.Fragment>
                { history.map((data)=>(
                  <React.Fragment>
                    { channel === data.room ?
                      <table class="table">
                        <thead>
                          <tr>
                            <th scope="col">DATE</th>
                            <th scope="col">NAME</th>
                            <th scope="col">MESSAGE</th>
                          </tr>
                        </thead>
                        <tbody>
                          { data.messages.map((message,m)=>(
                            <tr key={'message'+m}>
                              <th scope="row">{(new Date(message.date)).toString().split(' ').splice(0, 5).join(' ')}</th>
                              <td>{message.name}</td>
                              <td>{message.message}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table> : null
                    }
                  </React.Fragment>
                ))}
              </React.Fragment> : null
            }
          </main>
        </div>
      </div>
    </Fragment>
  );
}

export default View;