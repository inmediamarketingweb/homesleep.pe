import { useState, useEffect } from "react";

import './CursorAnimation.css';

const CursorAnimation = () => {
    const [ripples, setRipples] = useState([]);

    useEffect(() => {
        const handleClick = (e) => {
            const x = e.clientX;
            const y = e.clientY;
            const newRipple = { x, y, id: Date.now() };

            setRipples((prev) => [...prev, newRipple]);

            setTimeout(() => {
              setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
            }, 600);
        };

        document.addEventListener("click", handleClick);
        return () => document.removeEventListener("click", handleClick);
    }, []);

    return(
        <div className="click-ripple-container">
            {ripples.map((ripple) => (
                <span key={ripple.id} className="click-ripple"
                    style={{
                        left: ripple.x,
                        top: ripple.y,
                        transform: "translate(-50%, -50%) scale(0)"
                    }}
                />
            ))}
        </div>
    );
};

export default CursorAnimation;
