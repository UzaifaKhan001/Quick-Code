import React, { useEffect, useRef, useState, useCallback } from "react";
import "./VoiceChat.css";

const VoiceChat = ({ socketRef, roomId, username }) => {
  const [isCallActive, setIsCallActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isDeafened, setIsDeafened] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectedPeers, setConnectedPeers] = useState(new Map());
  const [connectionStatus, setConnectionStatus] = useState("disconnected");

  const localStreamRef = useRef(null);
  const peerConnectionsRef = useRef(new Map());
  const audioElementsRef = useRef(new Map());

  // WebRTC configuration - moved outside to avoid recreation
  const rtcConfig = useRef({
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" },
      { urls: "stun:stun1.l.google.com:19302" },
      // Add more STUN servers for better connectivity
      { urls: "stun:stun2.l.google.com:19302" },
      { urls: "stun:stun3.l.google.com:19302" },
    ],
  });

  // Create peer connection
  const createPeerConnection = useCallback(
    (peerId) => {
      console.log(`Creating peer connection for ${peerId}`);

      const peerConnection = new RTCPeerConnection(rtcConfig.current);

      // Add local stream tracks
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => {
          console.log(
            `Adding track to peer connection for ${peerId}:`,
            track.kind
          );
          peerConnection.addTrack(track, localStreamRef.current);
        });
      }

      // Handle incoming stream
      peerConnection.ontrack = (event) => {
        console.log(`Received remote stream from ${peerId}`, event.streams);
        const [remoteStream] = event.streams;

        if (remoteStream) {
          setConnectedPeers((prev) => {
            const newPeers = new Map(prev);
            const existingPeer = newPeers.get(peerId) || {};
            newPeers.set(peerId, {
              ...existingPeer,
              stream: remoteStream,
              connected: true,
            });
            return newPeers;
          });

          // Remove existing audio element if it exists
          const existingAudio = audioElementsRef.current.get(peerId);
          if (existingAudio) {
            existingAudio.remove();
          }

          // Create audio element for remote stream
          const audioElement = document.createElement("audio");
          audioElement.className = "remote-audio";
          audioElement.autoplay = true;
          audioElement.playsInline = true; // Important for mobile devices
          audioElement.muted = isDeafened;
          audioElement.srcObject = remoteStream;
          audioElement.volume = 1.0;

          // Add error handling for audio element
          audioElement.onerror = (e) => {
            console.error(`Audio element error for peer ${peerId}:`, e);
          };

          audioElement.onloadedmetadata = () => {
            console.log(`Audio metadata loaded for peer ${peerId}`);
            audioElement.play().catch((e) => {
              console.error(`Failed to play audio for peer ${peerId}:`, e);
            });
          };

          document.body.appendChild(audioElement);
          audioElementsRef.current.set(peerId, audioElement);
        }
      };

      // Handle ICE candidates
      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          console.log(`Sending ICE candidate to ${peerId}:`, event.candidate);
          socketRef.current?.emit("voice-ice-candidate", {
            roomId,
            candidate: event.candidate,
            to: peerId,
          });
        } else {
          console.log(`ICE gathering completed for ${peerId}`);
        }
      };

      // Handle connection state changes
      peerConnection.onconnectionstatechange = () => {
        console.log(
          `Connection state changed for ${peerId}:`,
          peerConnection.connectionState
        );

        if (peerConnection.connectionState === "connected") {
          setConnectedPeers((prev) => {
            const newPeers = new Map(prev);
            const existingPeer = newPeers.get(peerId) || {};
            newPeers.set(peerId, {
              ...existingPeer,
              connected: true,
            });
            return newPeers;
          });
          setConnectionStatus("connected");
        } else if (peerConnection.connectionState === "connecting") {
          setConnectionStatus("connecting");
        } else if (
          peerConnection.connectionState === "disconnected" ||
          peerConnection.connectionState === "failed"
        ) {
          console.log(`Peer ${peerId} disconnected or failed`);
          setConnectedPeers((prev) => {
            const newPeers = new Map(prev);
            newPeers.delete(peerId);
            return newPeers;
          });

          // Remove audio element
          const audioElement = audioElementsRef.current.get(peerId);
          if (audioElement) {
            audioElement.remove();
            audioElementsRef.current.delete(peerId);
          }

          // Clean up peer connection
          peerConnectionsRef.current.delete(peerId);
        }
      };

      // Handle ICE connection state changes
      peerConnection.oniceconnectionstatechange = () => {
        console.log(
          `ICE connection state for ${peerId}:`,
          peerConnection.iceConnectionState
        );
      };

      peerConnectionsRef.current.set(peerId, peerConnection);
      return peerConnection;
    },
    [roomId, socketRef, isDeafened]
  );

  // End voice call
  const endVoiceCall = useCallback(() => {
    console.log("Ending voice call");

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => {
        track.stop();
        console.log("Stopped track:", track.kind);
      });
      localStreamRef.current = null;
    }

    peerConnectionsRef.current.forEach((pc, peerId) => {
      console.log(`Closing peer connection for ${peerId}`);
      pc.close();
    });
    peerConnectionsRef.current.clear();

    audioElementsRef.current.forEach((audio, peerId) => {
      console.log(`Removing audio element for ${peerId}`);
      audio.remove();
    });
    audioElementsRef.current.clear();

    setIsCallActive(false);
    setConnectedPeers(new Map());
    setConnectionStatus("disconnected");

    // Notify other users that we left the voice call
    if (socketRef.current) {
      socketRef.current.emit("voice-leave", {
        roomId,
        username,
      });
    }
  }, [roomId, socketRef, username]);

  // Start voice call
  const startVoiceCall = async () => {
    try {
      setIsConnecting(true);
      setConnectionStatus("connecting");
      console.log("Starting voice call...");

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 48000,
          sampleSize: 16,
          channelCount: 1,
        },
      });

      console.log("Got user media stream:", stream.getAudioTracks());
      localStreamRef.current = stream;
      setIsCallActive(true);
      setIsConnecting(false);

      // Notify other users that we joined the voice call
      if (socketRef.current) {
        socketRef.current.emit("voice-join", {
          roomId,
          username,
        });
      }
    } catch (error) {
      console.error("Error starting voice call:", error);
      setIsConnecting(false);
      setConnectionStatus("error");

      let errorMessage = "Could not access microphone. ";
      if (error.name === "NotAllowedError") {
        errorMessage += "Please allow microphone access and try again.";
      } else if (error.name === "NotFoundError") {
        errorMessage += "No microphone found. Please connect a microphone.";
      } else if (error.name === "NotReadableError") {
        errorMessage += "Microphone is being used by another application.";
      } else {
        errorMessage += "Please check your microphone settings.";
      }

      alert(errorMessage);
    }
  };

  // Toggle mute
  const toggleMute = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
        console.log("Mute toggled:", !audioTrack.enabled);

        if (socketRef.current) {
          socketRef.current.emit("voice-mute-status", {
            roomId,
            username,
            isMuted: !audioTrack.enabled,
          });
        }
      }
    }
  };

  // Toggle deafen
  const toggleDeafen = () => {
    const newDeafenState = !isDeafened;
    setIsDeafened(newDeafenState);
    console.log("Deafen toggled:", newDeafenState);

    audioElementsRef.current.forEach((audio, peerId) => {
      audio.muted = newDeafenState;
      console.log(`Set audio muted for ${peerId}:`, newDeafenState);
    });

    if (socketRef.current) {
      socketRef.current.emit("voice-deafen-status", {
        roomId,
        username,
        isDeafened: newDeafenState,
      });
    }
  };

  // Handle socket events
  useEffect(() => {
    if (!socketRef.current) {
      console.log("Socket not available");
      return;
    }

    const socket = socketRef.current;
    console.log("Setting up socket event listeners");

    // Handle user joining voice call
    const handleVoiceJoin = async ({
      username: joiningUser,
      socketId: joiningSocketId,
      isExistingUser,
    }) => {
      console.log(
        `Voice join event: ${joiningUser} (${joiningSocketId}) - existing: ${isExistingUser}`
      );

      if (joiningUser !== username && isCallActive) {
        // Add to connected peers first
        setConnectedPeers((prev) => {
          const newPeers = new Map(prev);
          newPeers.set(joiningSocketId, {
            username: joiningUser,
            connected: false,
            muted: false,
            deafened: false,
          });
          return newPeers;
        });

        if (!isExistingUser) {
          // New user joined, create peer connection and send offer
          try {
            const peerConnection = createPeerConnection(joiningSocketId);
            const offer = await peerConnection.createOffer({
              offerToReceiveAudio: true,
              offerToReceiveVideo: false,
            });
            await peerConnection.setLocalDescription(offer);
            console.log(`Created and set local offer for ${joiningSocketId}`);

            socket.emit("voice-offer", {
              roomId,
              offer,
              to: joiningSocketId,
            });
          } catch (error) {
            console.error("Error creating offer:", error);
          }
        }
      }
    };

    // Handle voice offer
    const handleVoiceOffer = async ({ offer, from }) => {
      console.log(`Received voice offer from ${from}`);
      if (isCallActive) {
        try {
          const peerConnection = createPeerConnection(from);
          await peerConnection.setRemoteDescription(
            new RTCSessionDescription(offer)
          );
          console.log(`Set remote description from ${from}`);

          const answer = await peerConnection.createAnswer({
            offerToReceiveAudio: true,
            offerToReceiveVideo: false,
          });
          await peerConnection.setLocalDescription(answer);
          console.log(`Created and set local answer for ${from}`);

          socket.emit("voice-answer", {
            roomId,
            answer,
            to: from,
          });
        } catch (error) {
          console.error("Error handling voice offer:", error);
        }
      }
    };

    // Handle voice answer
    const handleVoiceAnswer = async ({ answer, from }) => {
      console.log(`Received voice answer from ${from}`);
      try {
        const peerConnection = peerConnectionsRef.current.get(from);
        if (peerConnection) {
          await peerConnection.setRemoteDescription(
            new RTCSessionDescription(answer)
          );
          console.log(`Set remote description answer from ${from}`);
        } else {
          console.error(`No peer connection found for ${from}`);
        }
      } catch (error) {
        console.error("Error handling voice answer:", error);
      }
    };

    // Handle ICE candidate
    const handleIceCandidate = async ({ candidate, from }) => {
      console.log(`Received ICE candidate from ${from}`);
      try {
        const peerConnection = peerConnectionsRef.current.get(from);
        if (peerConnection && peerConnection.remoteDescription) {
          await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
          console.log(`Added ICE candidate from ${from}`);
        } else {
          console.log(
            `Queuing ICE candidate from ${from} - remote description not set yet`
          );
          // Could implement candidate queuing here if needed
        }
      } catch (error) {
        console.error("Error adding ICE candidate:", error);
      }
    };

    // Handle user leaving voice call
    const handleVoiceLeave = ({
      username: leavingUser,
      socketId: leavingSocketId,
    }) => {
      console.log(`User ${leavingUser} left voice call`);

      const peerConnection = peerConnectionsRef.current.get(leavingSocketId);
      if (peerConnection) {
        peerConnection.close();
        peerConnectionsRef.current.delete(leavingSocketId);
      }

      // Remove audio element
      const audioElement = audioElementsRef.current.get(leavingSocketId);
      if (audioElement) {
        audioElement.remove();
        audioElementsRef.current.delete(leavingSocketId);
      }

      setConnectedPeers((prev) => {
        const newPeers = new Map(prev);
        newPeers.delete(leavingSocketId);
        return newPeers;
      });
    };

    // Handle mute status updates
    const handleMuteStatus = ({
      username: mutingUser,
      socketId: mutingSocketId,
      isMuted,
    }) => {
      console.log(`${mutingUser} muted status: ${isMuted}`);
      setConnectedPeers((prev) => {
        const newPeers = new Map(prev);
        if (newPeers.has(mutingSocketId)) {
          newPeers.set(mutingSocketId, {
            ...newPeers.get(mutingSocketId),
            muted: isMuted,
          });
        }
        return newPeers;
      });
    };

    // Handle deafen status updates
    const handleDeafenStatus = ({
      username: deafeningUser,
      socketId: deafeningSocketId,
      isDeafened,
    }) => {
      console.log(`${deafeningUser} deafened status: ${isDeafened}`);
      setConnectedPeers((prev) => {
        const newPeers = new Map(prev);
        if (newPeers.has(deafeningSocketId)) {
          newPeers.set(deafeningSocketId, {
            ...newPeers.get(deafeningSocketId),
            deafened: isDeafened,
          });
        }
        return newPeers;
      });
    };

    // Register event listeners
    socket.on("voice-join", handleVoiceJoin);
    socket.on("voice-offer", handleVoiceOffer);
    socket.on("voice-answer", handleVoiceAnswer);
    socket.on("voice-ice-candidate", handleIceCandidate);
    socket.on("voice-leave", handleVoiceLeave);
    socket.on("voice-mute-status", handleMuteStatus);
    socket.on("voice-deafen-status", handleDeafenStatus);

    return () => {
      console.log("Cleaning up socket event listeners");
      socket.off("voice-join", handleVoiceJoin);
      socket.off("voice-offer", handleVoiceOffer);
      socket.off("voice-answer", handleVoiceAnswer);
      socket.off("voice-ice-candidate", handleIceCandidate);
      socket.off("voice-leave", handleVoiceLeave);
      socket.off("voice-mute-status", handleMuteStatus);
      socket.off("voice-deafen-status", handleDeafenStatus);
    };
  }, [socketRef, roomId, username, isCallActive, createPeerConnection]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (isCallActive) {
        endVoiceCall();
      }
    };
  }, [isCallActive, endVoiceCall]);

  return (
    <div className="voice-chat-container">
      <div className="voice-header">
        <h3>Voice Chat</h3>
        <div className="connection-status">
          <span className={`status-text ${connectionStatus}`}>
            {connectionStatus === "connected" && "✓"}
            {connectionStatus === "connecting" && "⟳"}
            {connectionStatus === "disconnected" && "○"}
            {connectionStatus === "error" && "✗"}
          </span>
        </div>
      </div>

      <div className="voice-controls">
        {!isCallActive ? (
          <button
            className="voice-button join-call"
            onClick={startVoiceCall}
            disabled={isConnecting}
          >
            {isConnecting ? "Connecting..." : "Join Voice"}
          </button>
        ) : (
          <div className="call-controls">
            <button
              className={`voice-button ${isMuted ? "muted" : ""}`}
              onClick={toggleMute}
              title={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? "🔇" : "🎤"}
            </button>

            <button
              className={`voice-button ${isDeafened ? "deafened" : ""}`}
              onClick={toggleDeafen}
              title={isDeafened ? "Undeafen" : "Deafen"}
            >
              {isDeafened ? "🔈" : "🔊"}
            </button>

            <button
              className="voice-button leave-call"
              onClick={endVoiceCall}
              title="Leave Call"
            >
              📞
            </button>
          </div>
        )}
      </div>

      {isCallActive && (
        <div className="voice-participants">
          <div className="participants-header">
            <span>Participants ({connectedPeers.size + 1})</span>
          </div>

          <div className="participant local-participant">
            <div className="participant-info">
              <span className="participant-name">You</span>
              {isMuted && <span className="mute-indicator">🔇</span>}
              {isDeafened && <span className="deafen-indicator">🔈</span>}
            </div>
          </div>

          {Array.from(connectedPeers.entries()).map(([peerId, peerInfo]) => (
            <div key={peerId} className="participant remote-participant">
              <div className="participant-info">
                <span className="participant-name">{peerInfo.username}</span>
                {peerInfo.muted && <span className="mute-indicator">🔇</span>}
                {peerInfo.deafened && (
                  <span className="deafen-indicator">🔈</span>
                )}
                {!peerInfo.connected && (
                  <span className="connecting-indicator">...</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VoiceChat;
