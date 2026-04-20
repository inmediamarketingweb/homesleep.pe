import './Categorias.css';
import { useState, useEffect, useRef } from 'react';

function Categorias(){
    const [categorias, setCategorias] = useState([]);
    const [categoriaActiva, setCategoriaActiva] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [scrollPosition, setScrollPosition] = useState(0);
    const [maxScroll, setMaxScroll] = useState(0);
    const listRef = useRef(null);

    useEffect(() => {
        const fetchCategorias = async () => {
            try {
                const response = await fetch('/assets/json/categorias/nuevas-categorias.json');
                
                if (!response.ok) {
                    throw new Error(`Error ${response.status}: ${response.statusText}`);
                }
                
                const data = await response.json();
                setCategorias(data.categorias);
                
                const indexDormitorios = data.categorias.findIndex(cat => 
                    cat.categoria.toLowerCase() === "dormitorios"
                );
                
                if (indexDormitorios !== -1) {
                    setCategoriaActiva(indexDormitorios);
                }
            } catch (err) {
                setError(err.message);
                console.error('Error cargando categorías:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchCategorias();
    }, []);

    useEffect(() => {
        if (listRef.current && categorias.length > 0) {
            const list = listRef.current;
            const containerWidth = list.parentElement.offsetWidth;
            const listWidth = list.scrollWidth;
            const maxPossibleScroll = Math.max(0, listWidth - containerWidth);
            setMaxScroll(Math.min(600, maxPossibleScroll));
        }
    }, [categorias]);

    const scrollLeft = () => {
        if (scrollPosition < 0) {
            const newPosition = Math.min(scrollPosition + 200, 0);
            setScrollPosition(newPosition);
        }
    };

    const scrollRight = () => {
        if (scrollPosition > -maxScroll) {
            const newPosition = Math.max(scrollPosition - 200, -maxScroll);
            setScrollPosition(newPosition);
        }
    };

    const handleCategoriaClick = (index) => {
        setCategoriaActiva(index);
    };

    if (loading) {
        return (
            <div className='block-container'>
                <section className='block-content'>
                    <div className='loading'>Cargando categorías...</div>
                </section>
            </div>
        );
    }

    if (error) {
        return (
            <div className='block-container'>
                <section className='block-content'>
                    <div className='error'>Error: {error}</div>
                </section>
            </div>
        );
    }

    if (categorias.length === 0) {
        return (
            <div className='block-container'>
                <section className='block-content'>
                    <div className='error'>No se encontraron categorías</div>
                </section>
            </div>
        );
    }

    const categoria = categorias[categoriaActiva];

    return(
        <div className='block-container hp-categories-block-container'>
            <section className='block-content'>
                <div className='homepage-categories'>
                    <div className='homepage-categories-target homepage-categories-target-1'>
                        <div className='homepage-categories-target-banner'>
                            <img 
                                src={categoria['categoria-banner'].src} 
                                alt={categoria['categoria-banner'].alt}
                                onError={(e) => {
                                    e.target.src = 'https://www.kamas.pe/assets/imagenes/paginas/pagina-principal/categorias/dormitorios-1.webp';
                                }}
                            />
                        </div>

                        <div className='homepage-categories-target-bottom'>
                            <ul 
                                ref={listRef}
                                className='homepage-categories-target-list'
                                style={{ transform: `translateX(${scrollPosition}px)` }}
                            >
                                {categorias.map((cat, index) => (
                                    <li key={cat.id}>
                                        <div 
                                            title={`${cat.categoria} | Homesleep`}
                                            onClick={() => handleCategoriaClick(index)}
                                            className={index === categoriaActiva ? 'active' : ''}
                                        >
                                            <img 
                                                src={cat['categoria-miniatura'].src} 
                                                alt={cat['categoria-miniatura'].alt}
                                                onError={(e) => {
                                                    e.target.src = 'https://www.kamas.pe/assets/imagenes/paginas/pagina-principal/categorias/dormitorios.webp';
                                                }}
                                            />
                                            <p>{cat.categoria}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <button 
                            type='button' 
                            className='homepage-categories-target-button homepage-categories-target-button-1'
                            onClick={scrollLeft}
                            disabled={scrollPosition >= 0}
                        >
                            <span className="material-icons">chevron_left</span>
                        </button>

                        <button 
                            type='button' 
                            className='homepage-categories-target-button homepage-categories-target-button-2'
                            onClick={scrollRight}
                            disabled={scrollPosition <= -maxScroll}
                        >
                            <span className="material-icons">chevron_right</span>
                        </button>
                    </div>

                    <div className='homepage-categories-target homepage-categories-target-2 d-flex-column gap-10'>
                        <div className='d-flex-column gap-10'>
                            <p className='block-title color-color-1 text-left'>{categoria.categoria}</p>

                            <div className='text margin-bottom-10'>
                                {categoria['categoria-mensaje']?.map((mensaje, index) => (
                                    <p key={index}>{mensaje}</p>
                                ))}
                            </div>

                            <div className='homepage-categories-target-categorie-list d-flex-column gap-5'>
                                <ul className='d-flex gap-5'>
                                    {categoria['marcas'].lista.map((marca, index) => (
                                        <li key={index}>
                                            <a 
                                                href={marca.ruta} 
                                                className={`brand-link ${marca.titulo.toLowerCase().replace(/\s+/g, '-')}-button-link`} 
                                                title={`${categoria.categoria} | ${marca.titulo}`}
                                            >
                                                <p>{marca.titulo}</p>
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        
                        {/* <a href={categoria.ruta} className='button-link button-link-2 margin-left' title={`${categoria.categoria} | Homesleep`}>
                            <p className='button-link-text'>Ver todos</p>
                        </a> */}
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Categorias;
