import { useEffect, useRef } from 'react';

export default function EmotionChart({ data, width = 600, height = 200 }) {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;

        const draw = () => {
            // Clear
            ctx.clearRect(0, 0, width, height);

            // Draw Background Grid
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
            ctx.lineWidth = 1;

            for (let i = 0; i < width; i += 50) {
                ctx.beginPath();
                ctx.moveTo(i, 0);
                ctx.lineTo(i, height);
                ctx.stroke();
            }
            for (let i = 0; i < height; i += 40) {
                ctx.beginPath();
                ctx.moveTo(0, i);
                ctx.lineTo(width, i);
                ctx.stroke();
            }

            if (data.length < 2) return;

            // Gradient for area under curve
            const gradient = ctx.createLinearGradient(0, 0, 0, height);
            gradient.addColorStop(0, 'rgba(124, 58, 237, 0.5)'); // Purple
            gradient.addColorStop(1, 'rgba(124, 58, 237, 0.0)');

            // Draw Curve
            ctx.beginPath();

            // Map data to coordinates
            const stepX = width / (data.length - 1);

            data.forEach((point, index) => {
                const x = index * stepX;
                const y = height - (point / 100) * height; // Invert Y (0 is top)

                if (index === 0) {
                    ctx.moveTo(x, y);
                } else {
                    // Smooth curve using quadratic bezier (simplified)
                    const prevX = (index - 1) * stepX;
                    const prevY = height - (data[index - 1] / 100) * height;
                    const cpX = (prevX + x) / 2;
                    ctx.quadraticCurveTo(prevX, prevY, cpX, (prevY + y) / 2);
                    ctx.lineTo(x, y);
                }
            });

            // Close path for fill
            ctx.lineTo(width, height);
            ctx.lineTo(0, height);
            ctx.closePath();
            ctx.fillStyle = gradient;
            ctx.fill();

            // Draw Line on top
            ctx.beginPath();
            ctx.strokeStyle = '#a855f7'; // Purple Accent
            ctx.lineWidth = 3;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';

            data.forEach((point, index) => {
                const x = index * stepX;
                const y = height - (point / 100) * height;
                if (index === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            });
            ctx.stroke();

            // Pulse effect at the end
            if (data.length > 0) {
                const lastX = width;
                const lastY = height - (data[data.length - 1] / 100) * height;

                ctx.beginPath();
                ctx.arc(lastX, lastY, 6, 0, Math.PI * 2);
                ctx.fillStyle = '#fff';
                ctx.fill();

                ctx.beginPath();
                ctx.arc(lastX, lastY, 12, 0, Math.PI * 2);
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
                ctx.stroke();
            }
        };

        draw();

        return () => {
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
        };
    }, [data, width, height]);

    return (
        <div style={{ position: 'relative', width: width, height: height }}>
            <canvas
                ref={canvasRef}
                width={width}
                height={height}
                style={{ width: '100%', height: '100%' }}
            />
            <div style={{ position: 'absolute', top: 5, right: 10, color: '#a855f7', fontSize: '0.8rem', fontWeight: 'bold' }}>
                AO VIVO
            </div>
        </div>
    );
}
