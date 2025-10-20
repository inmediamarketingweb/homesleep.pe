import { v4 as uuidv4 } from "uuid";
import { useEffect, useState } from "react";

import './Regalos.css';

function Regalos({ producto }) {
    const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 600);

    useEffect(() => {
        const handleResize = () => {
            setIsSmallScreen(window.innerWidth < 600);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const listaDeRegalos = producto.regalos;

    if (!Array.isArray(listaDeRegalos) || listaDeRegalos.length === 0) {
        return null;
    }

    return (
        <div className="product-page-gifts">
            <div className="d-flex gap-5">
                <h2 className="title uppercase color-color-1">Regalos</h2>
            </div>

            <ul className="d-flex-column gap-5">
                {listaDeRegalos.map(item => (
                    <li key={uuidv4()} className="d-flex gap-5">
                        <img loading="lazy" src={item.foto} alt={item.texto}/>
                        <p className="text">{item.texto}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Regalos;
