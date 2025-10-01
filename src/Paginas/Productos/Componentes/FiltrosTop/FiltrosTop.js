import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';

import './FiltrosTop.css';

const normalizarTexto = (texto) => {
    return texto
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, "-");
};

function FiltrosTop() {
    const location = useLocation();
    const navigate = useNavigate();
    const [ordenActivo, setOrdenActivo] = useState(false);
    const menuRef = useRef(null);
    const marcas = ["El cisne", "Kamas", "Paraiso", "Komfort"];

    const manejarFiltroMarca = (marca) => {
        const params = new URLSearchParams(location.search);
        const valorNormalizado = normalizarTexto(marca);

        if (params.get("marca") === valorNormalizado) {
            params.delete("marca");
        } else {
            params.set("marca", valorNormalizado);
        }

        navigate(`${location.pathname}?${params.toString()}`);
    };

    const toggleOrdenMenu = () => {
        setOrdenActivo(!ordenActivo);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setOrdenActivo(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className='filtros-top-container'>
            <div className='d-flex-column gap-5'>
                <p className='title'>Marcas:</p>

                <div className='filtros-top-brands d-flex-wrap'>
                    {marcas.map((marca, index) => {
                        const queryParams = new URLSearchParams(location.search);
                        const activo = queryParams.get("marca") === normalizarTexto(marca);

                        return(
                            <button key={index} type='button' className={activo ? 'active' : ''} onClick={() => manejarFiltroMarca(marca)}>
                                <p>{marca}</p>
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className='filtros-top-order-container' ref={menuRef}>
                <button type='button' className={`filtros-top-order-header ${ordenActivo ? 'active' : ''}`} onClick={toggleOrdenMenu}>
                    <div className='d-flex-center-center gap-10'>
                        <span className="material-icons">swap_vert</span>
                        <p className='text'>Ordenar:</p>
                    </div>
                    <span className="material-icons">keyboard_arrow_down</span>
                </button>

                <ul className={`filtros-top-order-list ${ordenActivo ? 'active' : ''}`}>
                    <li>
                        <button type='button'>
                            <span className="material-icons">update</span>
                            <p>Últimos modelos</p>
                        </button>
                    </li>
                    <li>
                        <button type='button'>
                            <span className="material-icons">trending_up</span>
                            <p>Menor a mayor precio</p>
                        </button>
                    </li>
                    <li>
                        <button type='button'>
                            <span className="material-icons">trending_down</span>
                            <p>Mayor a menor precio</p>
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default FiltrosTop;
