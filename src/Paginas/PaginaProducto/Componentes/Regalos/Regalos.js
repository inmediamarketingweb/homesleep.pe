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
                {/* <span className="material-symbols-outlined">featured_seasonal_and_gifts</span> */}
                <h2 className="title uppercase color-color-1">Regalos</h2>
            </div>

            <ul className="d-flex-column gap-5">
                {listaDeRegalos.map(item => (
                    <li key={uuidv4()} className="d-flex gap-5">
                        <button type="button">
                            <p className="text">{item.texto}</p>
                        </button>

                        <div>
                            <img loading="lazy" src={item.foto} alt={item.texto} />
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Regalos;
