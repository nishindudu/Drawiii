'use client'

import Image from "next/image";
import styles from "./page.module.css";
import { Dancing_Script } from "next/font/google";
import Textbox from "./components/inputs";
import { Button } from "./components/inputs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { io } from "socket.io-client";



const dancingScript = Dancing_Script({
  weight: '400',
  subsets: ['latin']
})

// let socket = null;

// function connectToServer(router) {
//   if (socket && socket.connected) {
//     console.log('already connected');
//     return;
//   }

//   socket = io("http://localhost:5000");
//   console.log('connected');

//   socket.on('user_joined', () => {
//     console.log('User connected to room');
//     router.push('/canvas');
//   });
// }

// // function connectToRoom(roomCode, router) {
// //   if (!(socket && socket.connected)) {
// //     connectToServer(router);
// //   }
// //   console.log(roomCode);
// //   socket.emit('join_room', { room: roomCode});
// // }

function connectToRoom(roomCode, router) {
  router.push(`/canvas?room=${roomCode}`)
}

export default function Home() {
  const [roomCode, setRoomCode] = useState('')
  const router = useRouter();

  const handleInputChange = (e) => {
    setRoomCode(e.target.value);
  };

  return (
    <div className={styles.page}>
      <div className={`${styles.mainWrapper} glow-box`}>
        <h1 className={`${dancingScript.className} ${styles.mainHead}`}>Drawiii</h1><br />
        <Textbox text="Room code" id="room-code" value={roomCode} onchange={handleInputChange}/><br />
        <Button text="Connect!" size="1.2rem" onclick={() => connectToRoom(roomCode, router)} />
        {/* <Button text="Connect!" size="1.2rem" onclick={() => connectToRoom(roomCode)} /> */}
      </div>
    </div>
  );
}


