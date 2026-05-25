import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'

import './CategoriasLeft.css';

function CategoriasLeft({ onHotSaleChange }) {
    const [categorias, setCategorias] = useState([]);
    const [activeIndex, setActiveIndex] = useState(null);
    const [isHotSaleActive, setIsHotSaleActive] = useState(() => {
        const saved = localStorage.getItem('hotSaleActive');
        return saved === 'true';
    });

    useEffect(() => {
        fetch('/assets/json/categorias/nuevas-categorias.json')
            .then((response) => response.json())
            .then((data) => {
                setCategorias(data.categorias);
            })
            .catch((error) => {
                console.error('Error al cargar categorías:', error);
            });
    }, []);

    useEffect(() => {
        if (onHotSaleChange) {
            onHotSaleChange(isHotSaleActive);
        }
    }, [isHotSaleActive, onHotSaleChange]);

    const handleToggle = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    const handleHotSaleToggle = () => {
        const newState = !isHotSaleActive;
        setIsHotSaleActive(newState);
        localStorage.setItem('hotSaleActive', newState);
    };

    return(
        <div className='product-page-filters-container'>
            <nav className='product-page-filters d-flex-column gap-10'>
                <p className='title anton'>Categorías</p>
                <p className='text uppercase'>Las mejores marcas en productos para el descanso</p>
                <div className='d-flex-column gap-10'>
                    <button type='button' className={`filter-hot-sale ${isHotSaleActive ? 'active' : ''}`} onClick={handleHotSaleToggle}>
                        <div className='d-flex-center-left'>
                            <span className="material-symbols-outlined">local_fire_department</span>
                            <div className='d-flex-column'>
                                <p className='title color-gray-dark'>Hot sale</p>
                                <span className=' color-gray-dark'>(Más vendidos)</span>
                            </div>
                        </div>

                        <div className='switch'></div>
                    </button>
                </div>

                <ul className='product-page-filters-categories'>
                    {categorias.map((item, index) => (
                        <li key={item.id} className='d-flex-column gap-10'>
                            <Link to={item.ruta} title={item["meta-titulo"]} className='pro-pag-fil-cat-title-link'>
                                <p>{item.categoria}</p>
                                <span className="material-symbols-outlined">chevron_right</span>
                            </Link>
                        </li>
                    ))}
                </ul>

                <img src="/assets/imagenes/productos/oferta-left.jpg" className='w-100 d-flex margin-bottom-10 border-radius-15' alt="En Homesleep encontrarás las mejores ofertas en productos de dormitorios"/>
            </nav>
        </div>
    )
}

export default CategoriasLeft;
