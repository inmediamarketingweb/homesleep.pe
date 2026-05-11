import { useState, useEffect, useRef } from 'react';

import './SearchBar.css';

import LazyImage from '../../../Plantillas/LazyImage';

function SearchBar({ isSearchActive, toggleSearch, setIsSearchActive }) {
    const [productos, setProductos] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 600);
    const [isLoading, setIsLoading] = useState(false);
    const [filteredProductos, setFilteredProductos] = useState([]);
    const inputRef = useRef(null);

    useEffect(() => {
        const fetchProductos = async () => {
            setIsLoading(true);
            try {
                const manifestResponse = await fetch('/assets/json/manifest.json');
                if (!manifestResponse.ok) {
                    throw new Error(`HTTP error! status: ${manifestResponse.status}`);
                }

                const contentType = manifestResponse.headers.get('content-type');
                if (!contentType || !contentType.includes('application/json')) {
                    throw new Error('Response is not JSON');
                }

                const manifestData = await manifestResponse.json();
                const archivos = manifestData.files || [];

                const productosArrays = await Promise.all(
                    archivos.map(async (archivo) => {
                        try {
                            const res = await fetch(archivo);
                            if (!res.ok) {
                                console.error(`Archivo no encontrado: ${archivo}`);
                                return [];
                            }
                            
                            const fileContentType = res.headers.get('content-type');
                            if (!fileContentType || !fileContentType.includes('application/json')) {
                                console.error(`Respuesta no JSON en: ${archivo}`);
                                return [];
                            }
                            
                            const data = await res.json();
                            return data.productos || [];
                        } catch (error) {
                            console.error(`Error cargando ${archivo}:`, error);
                            return [];
                        }
                    })
                );

                setProductos(productosArrays.flat());
            } catch (error) {
                console.error('Error al cargar productos:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProductos();
    }, []);

    useEffect(() => {
        if (!searchTerm.trim()) {
            setFilteredProductos([]);
            return;
        }

        const normalizeStr = (str = '') => str.toString().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9\s]/g, '');
        const normalizedSearch = normalizeStr(searchTerm);
        const searchTokens = normalizedSearch.split(/\s+/).filter(Boolean);
        
        const results = productos.filter(producto => {
            const normalizedNombre = normalizeStr(producto.nombre);
            const normalizedSku = normalizeStr(producto.sku);

            return searchTokens.every(
                token => normalizedNombre.includes(token) || normalizedSku.includes(token)
            );
        });
        
        setFilteredProductos(results);
    }, [searchTerm, productos]);

    useEffect(() => {
        const handleResize = () => {
            setIsSmallScreen(window.innerWidth < 600);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (isSearchActive && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isSearchActive]);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && searchTerm.trim()) {
            e.preventDefault();
            
            if (filteredProductos.length === 1) {
                window.location.href = filteredProductos[0].ruta;
            } else if (filteredProductos.length > 1) {
                window.location.href = `/busqueda?query=${encodeURIComponent(searchTerm)}`;
            } else {
                <p className='text color-color-1'>No encontramos coincidencias</p>
            }
        } else if (e.key === 'Escape') {
            setSearchTerm('');
            setIsSearchActive(false);
        }
    };

    return(
        <>
            <div className='barra-de-busqueda'>
                <button type='button' className='search-bar-button' onClick={toggleSearch}>
                    <span className="material-icons">search</span>
                </button>

                <div className={`search-bar-container ${isSearchActive ? 'active' : ''}`}>
                    <div className='search-bar'>
                        <input ref={inputRef} type='text' placeholder='Buscar en homesleep.pe' value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} onKeyDown={handleKeyDown}/>
                        <span className='material-icons close-icon' onClick={() => setIsSearchActive(false)}>close</span>
                    </div>

                    <div className={`search-bar-items-container ${searchTerm.trim() ? 'active' : ''}`}>
                        <ul className='search-bar-items'>
                            {isLoading ? (
                                <li className='d-flex-center-center padding-10-0'>Cargando productos...</li>
                            ) : searchTerm.trim() ? (
                                filteredProductos.length > 0 ? (
                                    filteredProductos.map((producto) => (
                                        <li key={`${producto.sku}-${producto.nombre}`}>
                                            <a href={producto.ruta} title={producto.nombre}>
                                                <div className='d-flex-column gap-5'>
                                                    <p className='text'>{producto.nombre}</p>
                                                    <p className="sku">SKU: {producto.sku}</p>
                                                </div>

                                                <LazyImage width={isSmallScreen ? 80 : 60} height={isSmallScreen ? 80 : 60} src={`${producto.fotos}/1`} alt={producto.nombre}/>
                                            </a>
                                        </li>
                                    ))
                                ) : (
                                    <li className='d-flex-center-center padding-10-0'>No se encontraron productos.</li>
                                )
                            ) : null}
                        </ul>
                    </div>
                </div>
            </div>

            <div className={`search-bar-layer ${isSearchActive ? 'active' : ''}`} 
                onClick={() => setIsSearchActive(false)} 
            />
        </>
    );
}

export default SearchBar;
