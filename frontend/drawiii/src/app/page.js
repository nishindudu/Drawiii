'use client'

import Image from "next/image";
import styles from "./page.module.css";
import { Dancing_Script, Arima } from "next/font/google";
import Textbox from "./components/inputs";
import { Button } from "./components/inputs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { io } from "socket.io-client";
import Link from "next/link";



const dancingScript = Dancing_Script({
  weight: '400',
  subsets: ['latin']
})

const arima = Arima({
  weight: 'variable',
  subsets: ['latin']
})

function connectToRoom(roomCode, router) {
  // router.push(`/canvas?room=${roomCode}`)
  window.location.href = `/canvas?room=${roomCode}`;
}

export default function Home() {
  const [roomCode, setRoomCode] = useState('')
  const router = useRouter();

  const handleInputChange = (e) => {
    setRoomCode(e.target.value);
  };

  return (
    <>
      <div className={styles.page}>
        <div className={`${styles.mainWrapper} glow-box`}>
          <h1 className={`${dancingScript.className} ${styles.mainHead}`}>Drawiii</h1><br />
          <Textbox text="Room code" id="room-code" value={roomCode} onchange={handleInputChange}/><br />
          <Button text="Connect!" size="1.2rem" onclick={() => connectToRoom(roomCode, router)} />
          {/* <Button text="Connect!" size="1.2rem" onclick={() => connectToRoom(roomCode)} /> */}
        </div>
      </div>
      <Link href="/privacy" className={`${styles.privacyLink} ${arima.className}`}>Privacy Policy</Link>
    </>
  );
}


