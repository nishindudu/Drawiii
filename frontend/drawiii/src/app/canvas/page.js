'use client'

import { io } from "socket.io-client";
import { useEffect, useRef, useState } from "react";
import { ColourPicker, DownloadButton, QuickColourPicker, ThicknessChanger } from "../components/inputs";

let socket = null;
let roomCodePub;
let colourPub = '#ffffff';
let canvasPub;
let thicknessPub = 2;

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
  // console.log(roomCode);
  socket.emit('join_room', { room: roomCode});
}

async function copyLink() {
  if (roomCodePub === undefined) {
    await setRoomCode();
  }
  try {
    await navigator.clipboard.writeText(window.location.href);
    alert(`Link copied to clipboard!\nShare this link with your friends to join the same room and start drawing together!\n\n${window.location.href}`);
  } catch (err) {
    alert(`Failed to copy link. But you can share it manually: ${window.location.href}.\nCopy this and share it with your friends to join the same room and start drawing together!`);
  }
}


function Canvas() {
  // console.log(roomCodePub);
  const canvasRef = useRef(null);
  const isDrawing = useRef(false);
  useEffect(() => {
    connectToRoom(roomCodePub);
    copyLink();
  }, []);

  useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) {
          return;
      }
      canvasPub = canvas;

      const context = canvas.getContext('2d');

      canvas.width = 1920;
      canvas.height = 1080;
      context.fillStyle = "black";
      context.fillRect(0, 0, canvas.width, canvas.height);
      canvas.style.touchAction = 'none';

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
        // canvas.setPointerCapture(e.pointerId);
        // console.log('start ', e.pointerId, e.pointerType)

        if (roomCodePub === null || roomCodePub === undefined) {
          setRoomCode();
          connectToRoom(roomCodePub);
        }
          // console.log('Startdraw');
          // console.log(roomCodePub);
          isDrawing.current = true;
          const pos = getMousePos(e);
          context.beginPath();
          context.moveTo(pos.x, pos.y);
          socket.emit('draw_stroke', {
            room: roomCodePub,
            from: null,
            to: [pos.x, pos.y],
            colour: colourPub,
            thickness: thicknessPub
          })

          context.currentX = pos.x;
          context.currentY = pos.y;
      };

      const draw = (e) => {
        // console.log('draw ', e.pointerId, e.pointerType)
        e.preventDefault();
        if (!isDrawing.current) return;
        const pos = getMousePos(e);
        // console.log(pos);
        context.lineTo(pos.x, pos.y);
        context.strokeStyle = colourPub;
        context.lineWidth = thicknessPub;
        context.stroke();
        socket.emit('draw_stroke', {
          room: roomCodePub,
          from: [context.currentX, context.currentY],
          to: [pos.x, pos.y],
          colour: colourPub,
          thickness: thicknessPub
        })
        context.currentX = pos.x;
        context.currentY = pos.y;
      };

      const stopDraw = (e) => {
        e.preventDefault();
        // console.log('stop ', e.pointerId, e.pointerType)
        // canvas.releasePointerCapture(e.pointerId);

        if (isDrawing.current) {
          isDrawing.current = false;
          // context.closePath();
        }
      }

      const handleIncomingStroke = (data) => {
        const { from, to, colour, thickness } = data;
        // console.log(`from: ${from},,, to: ${to}`);

        context.strokeStyle = colour;
        context.lineWidth = thickness;
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
  // console.log('para' + params);
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

async function handleDownload() {
  const canvas = canvasPub;
  if (!canvas) return;

  const dataUrl = canvas.toDataURL("image/png");
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = "canvas.png";
  link.click();
  link.remove();
}

export default function CanvasPage() {
    // const roomCode = getQueryParam('room');
    // console.log(`Roo code : ${roomCode}`);
    // roomCodePub = roomCode;
    setRoomCode();
    useEffect(() => {
      connectToRoom(roomCodePub);
    }, []);

    const [color, setColour] = useState('#ffffff');
    const HandleColorChange = (e) => {
      // console.log(e.target.value);
      try {
        setColour(e.target.value);
        colourPub = e.target.value;
      } catch (error) {
        if (error instanceof TypeError) {
          setColour(e);
          colourPub = e;
        }
      }
    }

    const [thickness, setThickness] = useState(2);
    const handleThicknessChange = (e) => {
      setThickness(e.target.value);
      thicknessPub = e.target.value;
    }

    return(
      <>
        <Canvas />
        <QuickColourPicker color={color} onChange={HandleColorChange} />
        <div className="canvas-controls">
          <ThicknessChanger thickness={thickness} onChange={handleThicknessChange} />
          <ColourPicker color={color} onChange={HandleColorChange} />
          <DownloadButton onclick={handleDownload} color="#ffffff" />
        </div>
      </>
  );
}