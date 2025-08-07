'use client'

import { io } from "socket.io-client";
import { useEffect, useRef } from "react";

let socket = null;
let roomCodePub;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function connectToServer() {
  if (socket && socket.connected) {
    console.log('already connected to server');
    return;
  }

  socket = io(window.location.origin); //todo: replace with actual url
  console.log('connected to server');

  socket.on('user_joined', () => {
    console.log('User connected to room');
  });
}

async function connectToRoom(roomCode) {
  if (!(socket && socket.connected)) {
    connectToServer();
  }
  if (roomCode === undefined) {
    await setRoomCode();
  }
//   console.log(roomCode);
  socket.emit('join_room', { room: roomCode});
}


function Canvas() {
  console.log(roomCodePub);
  connectToRoom(roomCodePub);
  const canvasRef = useRef(null);
  const isDrawing = useRef(false);

  useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) {
          return;
      }

      const context = canvas.getContext('2d');

      canvas.width = 1920;
      canvas.height = 1080;
      context.fillStyle = "black";
      context.fillRect(0, 0, canvas.width, canvas.height);

      const resizeCanvas = () => {
          const aspectRatio = 1920/1080;
          let width = window.innerWidth;
          let height = window.innerHeight;

          if (width / height > aspectRatio) {
              width = height * aspectRatio;
          } else {
              height = width / aspectRatio;
          }

          canvas.style.width = `${width}px`;
          canvas.style.height = `${height}px`;
      };

      const getMousePos = (e) => {
          const rect = canvas.getBoundingClientRect();
          const scaleX = canvas.width / rect.width;
          const scaleY = canvas.height / rect.height;

          return {
              x: (e.clientX - rect.left) * scaleX,
              y: (e.clientY - rect.top) * scaleY
          };
      };

      const startDraw = (e) => {
        e.preventDefault();
        if (roomCodePub === null) {
          setRoomCode();
          connectToRoom(roomCodePub);
        }
          console.log('Startdraw');
          // console.log(roomCodePub);
          isDrawing.current = true;
          const pos = getMousePos(e);
          context.beginPath();
          context.moveTo(pos.x, pos.y);
          socket.emit('draw_stroke', {
            room: roomCodePub,
            from: null,
            to: [pos.x, pos.y]
          })

          context.currentX = pos.x;
          context.currentY = pos.y;
      };

      const draw = (e) => {
        e.preventDefault();
        if (!isDrawing.current) return;
        const pos = getMousePos(e);
        context.lineTo(pos.x, pos.y);
        context.strokeStyle = 'white';
        context.lineWidth = 2;
        context.stroke();
        socket.emit('draw_stroke', {
          room: roomCodePub,
          from: [context.currentX, context.currentY],
          to: [pos.x, pos.y]
        })
        context.currentX = pos.x;
        context.currentY = pos.y;
      };

      const stopDraw = (e) => {
        e.preventDefault();
        if (isDrawing.current) {
          isDrawing.current = false;
          // context.closePath();
        }
      }

      const handleIncomingStroke = (data) => {
        const { from, to } = data;
        console.log(`from: ${from},,, to: ${to}`);

        context.strokeStyle = 'white';
        context.lineWidth = 2;
        context.beginPath();

        if (from) {
          context.moveTo(from[0], from[1]);
        } else {
          context.moveTo(to[0], to[1]);
        }
        context.lineTo(to[0], to[1]);
        context.stroke();
        context.closePath()
      }

      window.addEventListener('resize', resizeCanvas);
      resizeCanvas();

      canvas.addEventListener('pointerdown', startDraw);
      canvas.addEventListener('pointermove', draw);
      canvas.addEventListener('pointerup', stopDraw);
      canvas.addEventListener('pointerleave', stopDraw);

      
      async function setSocketListener() {
        if (socket === null) {
          console.log('socket null');
          await sleep(2000);
        }
        if (socket.connected) {
          socket.on('receive_stroke', handleIncomingStroke);
        } else {
          socket.once('connect', () => {
          socket.on('receive_stroke', handleIncomingStroke);
          })
        }
      }
      setSocketListener();

      return () => {
          window.removeEventListener('resize', resizeCanvas);
          canvas.removeEventListener('pointerdown', startDraw);
          canvas.removeEventListener('pointermove', draw);
          canvas.removeEventListener('pointerup', stopDraw);
          canvas.removeEventListener('pointerleave', stopDraw);
          socket.off('receive_stroke', handleIncomingStroke);
      };
  }, [isDrawing]);

  return (
      <canvas
          ref={canvasRef}
          style={{
              display: 'block',
              position: 'fixed',
              top: 0,
              left: 0,
          }}
      />
  )
}

async function getQueryParam(param) {
  if (typeof window === 'undefined') {
    await sleep(500);
  };
  const params = new URLSearchParams(window.location.search);
  console.log('para' + params);
  if (!params.get(param)) {
    await sleep(500);
    getQueryParam('room');
  }
  return params.get(param);
}

async function setRoomCode() {
  const roomCode = await getQueryParam('room');
  // console.log(`Roo code : ${roomCode}`);
  roomCodePub = roomCode;
}

export default function CanvasPage() {
    // const roomCode = getQueryParam('room');
    // console.log(`Roo code : ${roomCode}`);
    // roomCodePub = roomCode;
    setRoomCode();
    connectToRoom(roomCodePub);

    // useEffect(() => {
    //     if (roomCode) {
    //         connectToRoom(roomCode);
    //     }
    // }, [roomCode]);

    return(
        <Canvas />
    );
}