import { useState, useEffect, useRef, useCallback } from 'react';
import './SearchBar.css';
import LazyImage from '../../../Plantillas/LazyImage';

function SearchBar() {
    const [productos, setProductos] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 600);
    const [isLoading, setIsLoading] = useState(false);
    const [filteredProductos, setFilteredProductos] = useState([]);
    const [displayedProductos, setDisplayedProductos] = useState([]);
    const [isActive, setIsActive] = useState(false);
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const inputRef = useRef(null);
    const containerRef = useRef(null);
    const resultsContainerRef = useRef(null);
    const debounceTimerRef = useRef(null);
    const ITEMS_PER_PAGE = 10;

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
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }

        debounceTimerRef.current = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 300);

        return () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, [searchTerm]);

    useEffect(() => {
        if (!debouncedSearchTerm.trim()) {
            setFilteredProductos([]);
            setDisplayedProductos([]);
            setPage(1);
            setHasMore(false);
            return;
        }

        const normalizeStr = (str = '') => str.toString().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9\s]/g, '');
        const normalizedSearch = normalizeStr(debouncedSearchTerm);
        const searchTokens = normalizedSearch.split(/\s+/).filter(Boolean);
        
        const results = productos.filter(producto => {
            const normalizedNombre = normalizeStr(producto.nombre);
            const normalizedSku = normalizeStr(producto.sku);

            return searchTokens.every(
                token => normalizedNombre.includes(token) || normalizedSku.includes(token)
            );
        });
        
        setFilteredProductos(results);
        setPage(1);
        setHasMore(results.length > ITEMS_PER_PAGE);
        setDisplayedProductos(results.slice(0, ITEMS_PER_PAGE));
    }, [debouncedSearchTerm, productos]);

    // Detectar cuando el usuario hace scroll en los resultados
    useEffect(() => {
        const handleScroll = () => {
            if (!resultsContainerRef.current || isLoadingMore || !hasMore) return;

            const container = resultsContainerRef.current;
            const scrollTop = container.scrollTop;
            const scrollHeight = container.scrollHeight;
            const clientHeight = container.clientHeight;

            // Cuando el scroll esté cerca del final (a 50px del fondo)
            if (scrollTop + clientHeight >= scrollHeight - 50) {
                loadMoreItems();
            }
        };

        const resultsContainer = resultsContainerRef.current;
        if (resultsContainer) {
            resultsContainer.addEventListener('scroll', handleScroll);
        }

        return () => {
            if (resultsContainer) {
                resultsContainer.removeEventListener('scroll', handleScroll);
            }
        };
    }, [filteredProductos, displayedProductos, isLoadingMore, hasMore]);

    const loadMoreItems = useCallback(() => {
        if (isLoadingMore || !hasMore) return;

        setIsLoadingMore(true);
        
        // Simular carga de más items (podrías usar setTimeout para simular delay)
        setTimeout(() => {
            const nextPage = page + 1;
            const startIndex = 0;
            const endIndex = nextPage * ITEMS_PER_PAGE;
            const newItems = filteredProductos.slice(0, endIndex);
            
            setDisplayedProductos(newItems);
            setPage(nextPage);
            setHasMore(newItems.length < filteredProductos.length);
            setIsLoadingMore(false);
        }, 300);
    }, [filteredProductos, page, isLoadingMore, hasMore]);

    useEffect(() => {
        const handleResize = () => {
            setIsSmallScreen(window.innerWidth < 600);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsActive(false);
                setSearchTerm('');
                setDebouncedSearchTerm('');
                if (inputRef.current) {
                    inputRef.current.blur();
                }
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleSearch = () => {
        setIsActive(!isActive);
        if (!isActive) {
            setTimeout(() => {
                if (inputRef.current) {
                    inputRef.current.focus();
                }
            }, 100);
        } else {
            setSearchTerm('');
            setDebouncedSearchTerm('');
            if (inputRef.current) {
                inputRef.current.blur();
            }
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && searchTerm.trim()) {
            e.preventDefault();
            
            if (filteredProductos.length === 1) {
                window.location.href = filteredProductos[0].ruta;
            } else if (filteredProductos.length > 1) {
                window.location.href = `/busqueda?query=${encodeURIComponent(searchTerm)}`;
            }
        } else if (e.key === 'Escape') {
            setIsActive(false);
            setSearchTerm('');
            setDebouncedSearchTerm('');
            if (inputRef.current) {
                inputRef.current.blur();
            }
        }
    };

    const handleLayerClick = () => {
        setIsActive(false);
        setSearchTerm('');
        setDebouncedSearchTerm('');
        if (inputRef.current) {
            inputRef.current.blur();
        }
    };

    const handleIconClick = (e) => {
        e.stopPropagation();
        toggleSearch();
    };

    const renderEmptyMessage = () => (
        <div className='search-bar-empty-message'>
            <p className='title'>Busca por categoría, modelo, nombre o SKU</p>
            <p className='text'>Ej: "Dormitorios", "Sábanas", "SKU"</p>
        </div>
    );

    // Función para truncar texto
    const truncateText = (text, maxLength) => {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    };

    return(
        <>
            <div className='search-bar-container' ref={containerRef}>
                <div className='search-bar-input-container'>
                    <span 
                        className="material-icons" 
                        onClick={handleIconClick}
                        style={{ cursor: 'pointer' }}
                    >
                        search
                    </span>
                    <input 
                        ref={inputRef} 
                        type='text' 
                        placeholder='Buscar en homesleep.pe' 
                        value={searchTerm} 
                        onChange={(e) => setSearchTerm(e.target.value)} 
                        onKeyDown={handleKeyDown}
                        onFocus={() => {
                            if (!isActive) {
                                setIsActive(true);
                            }
                        }}
                    />
                </div>

                <div 
                    className={`search-bar-results-container ${isActive ? 'active' : ''}`}
                    ref={resultsContainerRef}
                >
                    <ul className='search-bar-results'>
                        {isLoading ? (
                            <li className='d-flex-center-center padding-10-0'>Cargando productos...</li>
                        ) : !searchTerm.trim() ? (
                            renderEmptyMessage()
                        ) : (
                            <>
                                {displayedProductos.length > 0 ? (
                                    displayedProductos.map((producto) => (
                                        <li key={`${producto.sku}-${producto.nombre}`}>
                                            <a href={producto.ruta} title={producto.nombre} className='search-bar-result'>
                                                <div>
                                                    {producto.categoria && (
                                                        <span className='search-bar-result-cat'>{producto.categoria}</span>
                                                    )}
                                                    <p className='text'>{truncateText(producto.nombre, 60)}</p>
                                                    <span className='search-bar-result-sku'>SKU: {producto.sku}</span>
                                                </div>
                                                <LazyImage 
                                                    width={isSmallScreen ? 80 : 60} 
                                                    height={isSmallScreen ? 80 : 60} 
                                                    src={`${producto.fotos}/1`} 
                                                    alt={producto.nombre}
                                                />
                                            </a>
                                        </li>
                                    ))
                                ) : (
                                    <li className='d-flex-center-center padding-10-0'>No se encontraron productos.</li>
                                )}
                                {isLoadingMore && (
                                    <li className='d-flex-center-center padding-10-0'>
                                        <span>Cargando más productos...</span>
                                    </li>
                                )}
                                {!hasMore && displayedProductos.length > 0 && (
                                    <li className='d-flex-center-center padding-10-0'>
                                        <span style={{ color: '#999', fontSize: '14px' }}>— No hay más productos —</span>
                                    </li>
                                )}
                            </>
                        )}
                    </ul>
                </div>
            </div>

            <div 
                className={`search-bar-layer ${isActive ? 'active' : ''}`} 
                onClick={handleLayerClick}
            />
        </>
    );
}

export default SearchBar;
