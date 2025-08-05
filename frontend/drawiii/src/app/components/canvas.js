'use client';

import { useEffect, useRef, useState } from "react";

export default function Canvas() {
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
        };

        const draw = (e) => {
            if (!isDrawing.current) return;
            const pos = getMousePos(e);
            context.lineTo(pos.x, pos.y);
            context.strokeStyle = 'white';
            context.lineWidth = 2;
            context.stroke();
        };

        const stopDraw = (e) => {
            if (isDrawing.current) {
                isDrawing.current = false;
                // context.closePath();
            }
        }

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        canvas.addEventListener('mousedown', startDraw);
        canvas.addEventListener('mousemove', draw);
        canvas.addEventListener('mouseup', stopDraw);
        canvas.addEventListener('mouseleave', stopDraw);

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            canvas.removeEventListener('mousedown', startDraw);
            canvas.removeEventListener('mousemove', draw);
            canvas.removeEventListener('mouseup', stopDraw);
            canvas.removeEventListener('mouseleave', stopDraw);
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