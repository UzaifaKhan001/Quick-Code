import React, { useState, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';
import './Editor.css';
import ACTIONS from '../Actions';
import Client from '../components/Client';
import CodeEditor from '../components/CodeEditor';
import { initSocket } from './socket';
import {
    useLocation,
    useNavigate,
    Navigate,
    useParams,
} from 'react-router-dom';

const Editor = () => {
    const socketRef = useRef(null);
    const codeRef = useRef(null);
    const location = useLocation();
    const { roomId } = useParams();
    const reactNavigator = useNavigate();
    const [clients, setClients] = useState([]);

    useEffect(() => {
        const init = async () => {
            socketRef.current = await initSocket();
            socketRef.current.on('connect_error', (err) => handleErrors(err));
            socketRef.current.on('connect_failed', (err) => handleErrors(err));

            function handleErrors(e) {
                console.log('socket error', e);
                toast.error('Socket connection failed, try again later.');
                reactNavigator('/');
            }

            socketRef.current.emit(ACTIONS.JOIN, {
                roomId,
                username: location.state?.username,
            });

            // Listening for joined event
            socketRef.current.on(
                ACTIONS.JOINED,
                ({ clients, username, socketId }) => {
                    if (username !== location.state?.username) {
                        toast.success(`${username} joined the room.`);
                        console.log(`${username} joined`);
                    }
                    // Update clients list with unique users
                    const uniqueClients = clients.filter((client, index, self) =>
                        index === self.findIndex((c) => c.username === client.username)
                    );
                    setClients(uniqueClients);
                    
                    if (socketId !== socketRef.current.id) {
                        socketRef.current.emit(ACTIONS.SYNC_CODE, {
                            code: codeRef.current,
                            socketId,
                        });
                    }
                }
            );

            // Listening for disconnected
            socketRef.current.on(
                ACTIONS.DISCONNECTED,
                ({ socketId, username }) => {
                    toast.success(`${username} left the room.`);
                    setClients((prev) => {
                        return prev.filter(
                            (client) => client.socketId !== socketId
                        );
                    });
                }
            );
        };
        init();
        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current.off(ACTIONS.JOINED);
                socketRef.current.off(ACTIONS.DISCONNECTED);
            }
        };
    }, [location.state?.username, roomId, reactNavigator]);

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
        <CodeEditor 
          socketRef={socketRef} 
          roomId={roomId} 
          onCodeChange={(code) => { codeRef.current = code; }} 
        />
      </div>
    </div>
  );
};

export default Editor;