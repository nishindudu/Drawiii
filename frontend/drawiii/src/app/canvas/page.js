'use client'

import { io } from "socket.io-client";
import { useSearchParams } from "next/navigation";
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

  socket = io("http://localhost:5000"); //todo: replace with actual url
  console.log('connected to server');

  socket.on('user_joined', () => {
    console.log('User connected to room');
  });
}

function connectToRoom(roomCode) {
  if (!(socket && socket.connected)) {
    connectToServer();
  }
//   console.log(roomCode);
  socket.emit('join_room', { room: roomCode});
}


function Canvas() {
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
            console.log('Startdraw')
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

        canvas.addEventListener('mousedown', startDraw);
        canvas.addEventListener('mousemove', draw);
        canvas.addEventListener('mouseup', stopDraw);
        canvas.addEventListener('mouseleave', stopDraw);

        
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
            canvas.removeEventListener('mousedown', startDraw);
            canvas.removeEventListener('mousemove', draw);
            canvas.removeEventListener('mouseup', stopDraw);
            canvas.removeEventListener('mouseleave', stopDraw);
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

function getQueryParam(param) {
  if (typeof window === 'undefined') return;
  const params = new URLSearchParams(window.location.search);
  return params.get(param);
}

export default function CanvasPage() {
    // const searchParams = useSearchParams();
    // const roomCode = searchParams.get('room');
    const roomCode = getQueryParam('room');
    roomCodePub = roomCode;

    useEffect(() => {
        if (roomCode) {
            connectToRoom(roomCode);
        }
    }, [roomCode]);

    return(
        <Canvas />
    );
}