import React, { useState } from 'react';
import toast from 'react-hot-toast';
import './Editor.css';
import Client from './Client';
import CodeEditor from './CodeEditor';
import {
  useLocation,
  useNavigate,
  Navigate,
  useParams,
} from 'react-router-dom';


const Editor = () => {
  const reactNavigator = useNavigate();
  const location = useLocation();
  const { roomId } = useParams();
  const [clients, setClients] = useState([
    {
      socketId: '1',
      username: 'umar'
    },
    {  
      socketId: '2',
      username: 'ahsan'   
    },
     {  
      socketId: '3',
      username: 'ali'   
    },
   
  ]);

  async function copyRoomId() {
    try {
        await navigator.clipboard.writeText(roomId);
        toast.success('Room ID has been copied to your clipboard');
    } catch (err) {
        toast.error('Could not copy the Room ID');
        console.error(err);
    }
  }

  function leaveRoom() {
    reactNavigator('/');
  }

  if (!location.state) {
    return <Navigate to="/" />;
  }

  return (
    <div className="mainWrap">
      <div className="aside">
        <div className="asideInner">
          <div className="logo">
            <img className="logoImage" src="/logo.png" alt="logo" />
            <h1>Quick Code</h1>
          </div>
          <p className="tag">
            Code, Chat, Collaborate.
          </p>
          <hr />
          <h3>Connected</h3>
          <div className="clientsList">
            {clients.map((client) => (
              <Client
                key={client.socketId}
                username={client.username}
              />
            ))}
          </div>
        </div>
        <button className="btn copyBtn" onClick={copyRoomId}>
          Copy Room Id
        </button>
        <button className="btn leaveBtn" onClick={leaveRoom}>
          Leave
        </button>
      </div>
      <div className="editorWrap">
        <CodeEditor/>
      </div>
      
    </div>
  );
};

export default Editor;