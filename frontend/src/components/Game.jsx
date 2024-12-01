import  { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import io from 'socket.io-client';
import Peer from 'peerjs';
const CanvasGame = (props) => {
  const canvasRef = useRef(null);
  const socketRef = useRef(null);
  const [peerId, setPeerId] = useState(null);
  const callsRef = useRef(new Map());
  const peerRef = useRef(null);
  const peerIdref=useRef(null);
  const localStreamRef = useRef(null);
  const [remoteStreams, setRemoteStreams] = useState([]);
  const randomSpawnX=Math.random() * 1000;
  const randomSpawnY=Math.random() * 1000;
  const gameStateRef = useRef({
    player: {
      id: null,
      x: randomSpawnX,
      y: randomSpawnY,
      width: 52,
      height: 42,
      speed: 2.1,
      direction: 'front',
      name: props.name
    },
    otherPlayers: new Map(),
    camera: {
      x: 0,
      y: 0
    },
    world: {
      width: 2000,
      height: 2000
    },
    keys: {
      up: false,
      down: false,
      left: false,
      right: false
    },
    sprites: {
      front: null,
      back: null,
      left: null,
      right: null,
      background: null
    }
  });
  const calculateDistance = (x1, y1, x2, y2) => {
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  };
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const gameState = gameStateRef.current;

    // Set canvas size
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    socketRef.current = io('http://localhost:3001');
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    .then((stream) => {
      localStreamRef.current = stream;
    })
    .catch((err) => {
      console.error("Failed to access media devices:", err);
    });
   
    peerRef.current = new Peer();
    const handlePeerConnection = (otherPlayer) => {
      if (otherPlayer.id !== gameState.player.id && otherPlayer.peerId) {
        const existingCall = callsRef.current.get(otherPlayer.peerId);
        
        if (!existingCall) {
          const call = peerRef.current.call(otherPlayer.peerId, localStreamRef.current);
          
          call.on('stream', (remoteStream) => {
            console.log(`Received remote stream from ${otherPlayer.peerId}`);
            callsRef.current.set(otherPlayer.peerId, remoteStream);
            
            // Update remote streams state
            setRemoteStreams(prev => {
              const streamExists = prev.some(stream => stream.id === remoteStream.id);
              return streamExists ? prev : [...prev, remoteStream];
            });
          });
        }
      }
    };

    // Initialize socket connection
    
    
    // Socket event handlers
    socketRef.current.on('connect', () => {
      
      peerRef.current.on('open', (id) => {
        setPeerId(id+"");
        peerIdref.current=id;
      
     
      console.log('Connected to server');
      gameState.player.id = socketRef.current.id;
      
      console.log(peerId+"PeerId")
      console.log(peerRef+"PeerRef")
      console.log(peerIdref+"PeerIdRef")
      // Join game
      socketRef.current.emit('player-join', {
        name: gameState.player.name,
        x: gameState.player.x,
        y: gameState.player.y,
        room: props.gameId,
        peerId: id
      });
    });
    });
    peerRef.current.on('call', (call) => {
      console.log(`Incoming call from ${call.peer}`);
      call.answer(localStreamRef.current);
      
      call.on('stream', (remoteStream) => {
        console.log(`Received stream from ${call.peer}`);
        callsRef.current.set(call.peer, remoteStream);
        
        // Update remote streams state
        setRemoteStreams(prev => {
          const streamExists = prev.some(stream => stream.id === remoteStream.id);
          return streamExists ? prev : [...prev, remoteStream];
        });
      });
      
      call.on('close', () => {
        console.log(`Call with ${call.peer} closed`);
        callsRef.current.delete(call.peer);
        
        // Remove stream from state
        setRemoteStreams(prev => prev.filter(stream => stream.id !== call.peer));
      });
    });
    socketRef.current.on('players-sync', (players) => {
      gameState.otherPlayers.clear();
      players.forEach(player => {
        if (player.id !== gameState.player.id) {
          gameState.otherPlayers.set(player.id, player);
          console.log("Player sync:", player)
          handlePeerConnection(player);
        }
      });
    });

    socketRef.current.on('player-joined', (player) => {
      if (player.id !== gameState.player.id) {
        gameState.otherPlayers.set(player.id, player);
        console.log("Player joined:", player);

        handlePeerConnection(player);
           
      
      }
    });
    
    socketRef.current.on('player-moved', (player) => {
      if (player.id !== gameState.player.id) {
        gameState.otherPlayers.set(player.id, player);
      }
    });

    socketRef.current.on('player-left', (playerId) => {
      gameState.otherPlayers.delete(playerId);
      const removedStream = callsRef.current.get(playerId);
      if (removedStream) {
        callsRef.current.delete(playerId);
        setRemoteStreams(prev => prev.filter(stream => stream.id !== removedStream.id));
      }
    });

    // Load sprites
    const loadImage = (src) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.src = src;
      });
    };

    const loadSprites = async () => {
      gameState.sprites.front = await loadImage('front (2).png');
      gameState.sprites.back = await loadImage('back (1).png');
      gameState.sprites.left = await loadImage('left.png');
      gameState.sprites.right = await loadImage('righ.png');
      gameState.sprites.background = await loadImage('/ex.png');
    };

    // Handle keyboard input
    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'ArrowUp': gameState.keys.up = true; break;
        case 'ArrowDown': gameState.keys.down = true; break;
        case 'ArrowLeft': gameState.keys.left = true; break;
        case 'ArrowRight': gameState.keys.right = true; break;
      }
    };

    const handleKeyUp = (e) => {
      switch (e.key) {
        case 'ArrowUp': gameState.keys.up = false; break;
        case 'ArrowDown': gameState.keys.down = false; break;
        case 'ArrowLeft': gameState.keys.left = false; break;
        case 'ArrowRight': gameState.keys.right = false; break;
      }
    };

    // Update game state
    const update = () => {
      let moved = false;

      if (gameState.keys.left) {
        gameState.player.x -= gameState.player.speed;
        gameState.player.direction = 'left';
        moved = true;
      }
      if (gameState.keys.right) {
        gameState.player.x += gameState.player.speed;
        gameState.player.direction = 'right';
        moved = true;
      }
      if (gameState.keys.up) {
        gameState.player.y -= gameState.player.speed;
        gameState.player.direction = 'back';
        moved = true;
      }
      if (gameState.keys.down) {
        gameState.player.y += gameState.player.speed;
        gameState.player.direction = 'front';
        moved = true;
      }

      // Keep player within bounds
      gameState.player.x = Math.max(0, Math.min(gameState.player.x, gameState.world.width - gameState.player.width));
      gameState.player.y = Math.max(0, Math.min(gameState.player.y, gameState.world.height - gameState.player.height));

      // Update camera
      gameState.camera.x = gameState.player.x - canvas.width / 2;
      gameState.camera.y = gameState.player.y - canvas.height / 2;
      gameState.camera.x = Math.max(0, Math.min(gameState.camera.x, gameState.world.width - canvas.width));
      gameState.camera.y = Math.max(0, Math.min(gameState.camera.y, gameState.world.height - canvas.height));
      
      const inRangeStreams = [];
  gameState.otherPlayers.forEach((player) => {
    const distance = calculateDistance(gameState.player.x, gameState.player.y, player.x, player.y);
    if (distance <= 100) {
      const stream = callsRef.current.get(player.peerId);
      if (stream) {
        inRangeStreams.push({ id: player.peerId, stream });
      }
    }
  });

  // Update remote streams state
  setRemoteStreams(inRangeStreams);
    

      // Emit movement if player moved
      if (moved && socketRef.current) {
        socketRef.current.emit('player-move', {
          x: gameState.player.x,
          y: gameState.player.y,
          direction: gameState.player.direction,
          room: props.gameId,
        });
      }
    };

    // Render game
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw background
      if (gameState.sprites.background) {
        const pattern = ctx.createPattern(gameState.sprites.background, 'repeat');
        ctx.save();
        ctx.translate(
          -gameState.camera.x % gameState.sprites.background.width,
          -gameState.camera.y % gameState.sprites.background.height
        );
        ctx.fillStyle = pattern;
        ctx.fillRect(
          0,
          0,
          canvas.width + gameState.sprites.background.width,
          canvas.height + gameState.sprites.background.height
        );
        ctx.restore();
      }

      // Draw function for both player and other players
      const drawPlayer = (player) => {
        const sprite = gameState.sprites[player.direction];
        if (sprite) {
          ctx.drawImage(
            sprite,
            0,
            0,
            gameState.player.width,
            gameState.player.height,
            player.x - gameState.camera.x,
            player.y - gameState.camera.y,
            gameState.player.width,
            gameState.player.height
          );

          // Draw player name
          ctx.font = '10px Arial';
          ctx.fillStyle = 'white';
          ctx.textAlign = 'center';
          ctx.fillText(
            player.name,
            player.x - gameState.camera.x + gameState.player.width / 2,
            player.y - gameState.camera.y - 10
          );
        }
      };

      // Draw other players
      gameState.otherPlayers.forEach(player => {
        drawPlayer(player);
      });

      // Draw main player
      drawPlayer(gameState.player);
    };

    // Game loop
    const gameLoop = () => {
      update();
      render();
      requestAnimationFrame(gameLoop);
    };

    // Initialize game
    const init = async () => {
      await loadSprites();
      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('keyup', handleKeyUp);
      gameLoop();
    };

    init();

    // Cleanup
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ imageRendering: 'pixelated' }}
      />
      {remoteStreams.map(({ id, stream }, index) => (
  <video
    key={id}
    autoPlay
    playsInline
    className="absolute"
    style={{
      top: '25px',
      left: `${105 * index}px`, // Arrange videos horizontally
      width: '100px',
      height: '100px',
    }}
    ref={(video) => {
      if (video && video.srcObject !== stream) {
        console.log(`Setting video stream for player: ${id}`);
        video.srcObject = stream;
      }
    }}
  />
))}


    </>
  );
};
CanvasGame.propTypes = {
  name: PropTypes.string.isRequired,
  gameId: PropTypes.string.isRequired
};

export default CanvasGame;
