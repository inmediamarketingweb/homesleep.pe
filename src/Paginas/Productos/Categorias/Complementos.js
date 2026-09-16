import { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { useParams, useLocation, useNavigate } from 'react-router-dom';

import '../Productos.css';
import './Layout.css';

import Categorias from '../Componentes/Categorias/Categorias';
import FiltrosTop from '../Componentes/FiltrosTop/FiltrosTop';
import { Producto } from '../../../Componentes/Plantillas/Producto/Producto';
import { usePagination } from '../../../Hooks/usePagination';
import RangoPrecios from '../Componentes/RangoPrecios/RangoPrecios';

const normalizarTexto = (texto) => {
    if (!texto || typeof texto !== 'string') {
        return '';
    }
    return texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
};

function Complementos() {
    const params = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filtrosData, setFiltrosData] = useState(null);
    const [orden, setOrden] = useState("ultimo");
    const [viewMode, setViewMode] = useState(() => {
        const savedMode = localStorage.getItem('viewModeComplementos');
        return savedMode || 'grid';
    });
    const queryParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);
    const filtersPanelRef = useRef(null);
    const itemsPerPage = 48;

    const [activeFilters, setActiveFilters] = useState({
        subcategoría: null,
        tamaño: null,
        marca: null,
        línea: null,
        modelo: null,
        'estilo': null,
        'categoría': null
    });

    const [envioGratisActivo, setEnvioGratisActivo] = useState(false);
    const [filtroSkus, setFiltroSkus] = useState(null);
    const [resetFiltersTrigger, setResetFiltersTrigger] = useState(false);
    const [hasActiveFilters, setHasActiveFilters] = useState(false);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    const closeFilters = () => {
        setIsFiltersOpen(false);
    };

    const filterParamMap = {
        'subcategoría': 'subcategoría',
        'tamaño': 'tamaño',
        'marca': 'marca',
        'línea': 'línea',
        'modelo': 'modelo',
        'estilo': 'estilo',
        'categoría': 'categoría'
    };

    // Obtener ruta exacta para carga de productos
    const obtenerRutaExacta = useCallback(() => {
        const path = location.pathname;
        const partes = path.split('/').filter(Boolean);
        const partesRelevantes = partes.slice(1);

        return partesRelevantes.join('/');
    }, [location.pathname]);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const newActiveFilters = { ...activeFilters };
        let hasChanges = false;

        Object.entries(filterParamMap).forEach(([paramKey, stateKey]) => {
            const value = params.get(paramKey);
            if (value !== null) {
                newActiveFilters[stateKey] = value;
                hasChanges = true;
            } else if (newActiveFilters[stateKey] !== null) {
                newActiveFilters[stateKey] = null;
                hasChanges = true;
            }
        });

        if (hasChanges) {
            setActiveFilters(newActiveFilters);
        }
    }, [location.search]);

    // Detectar si hay filtros activos (incluyendo precio)
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const hasPriceFilter = params.has('min') || params.has('max');
        const hasOtherFilters = activeFilters['subcategoría'] || activeFilters.tamaño || 
                               activeFilters.marca || activeFilters.línea || 
                               activeFilters.modelo || activeFilters['estilo'] || 
                               activeFilters['categoría'] || filtroSkus || envioGratisActivo;
        
        setHasActiveFilters(hasPriceFilter || hasOtherFilters);
    }, [activeFilters, filtroSkus, envioGratisActivo, location.search]);

    // Sincronizar sub1 con activeFilters['subcategoría']
    useEffect(() => {
        const sub1 = params.sub1;
        if (sub1) {
            const categoriaNormalizada = normalizarTexto(sub1);
            if (activeFilters['subcategoría'] !== categoriaNormalizada) {
                setActiveFilters(prev => ({
                    ...prev,
                    'subcategoría': categoriaNormalizada
                }));
            }
        } else {
            if (activeFilters['subcategoría'] !== null) {
                setActiveFilters(prev => ({
                    ...prev,
                    'subcategoría': null
                }));
            }
        }
    }, [params.sub1]);

    useEffect(() => {
        localStorage.setItem('viewModeComplementos', viewMode);
    }, [viewMode]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (filtersPanelRef.current && 
                !filtersPanelRef.current.contains(event.target) &&
                !event.target.closest('.filters-button-open')) {
                setIsFiltersOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const cargarProductosComplementos = async () => {
            try {
                setLoading(true);
                const manifestResponse = await fetch('/assets/json/manifest.json');
                const manifestData = await manifestResponse.json();
                const archivos = manifestData.files || [];

                let archivosProductos = archivos.filter(url =>
                    url.startsWith('/assets/json/categorias/complementos/')
                );

                const rutaActual = obtenerRutaExacta();

                if (rutaActual) {
                    archivosProductos = archivosProductos.filter(url => {
                        const rutaArchivo = url
                            .replace('/assets/json/categorias/', '')
                            .replace('.json', '');

                        return rutaArchivo.startsWith(rutaActual);
                    });
                }

                const productosPromesas = archivosProductos.map(async (url) => {
                    try {
                        const response = await fetch(url);
                        const data = await response.json();

                        const productosConFicha = data.productos?.map(producto => ({
                            ...producto,
                            fichaTecnica: data.ficha?.[0] || {}
                        })) || [];
                        
                        return productosConFicha;
                    } catch (error) {
                        console.error(`Error cargando ${url}:`, error);
                        return [];
                    }
                });

                const productosPorArchivo = await Promise.all(productosPromesas);
                const todosProductos = productosPorArchivo.flat();

                setProductos(todosProductos);
                setLoading(false);
            } catch (error) {
                console.error("Error cargando productos de complementos:", error);
                setLoading(false);
            }
        };

        cargarProductosComplementos();
    }, [location.pathname, obtenerRutaExacta]);

    useEffect(() => {
        const cargarFiltros = async () => {
            try {
                const response = await fetch('/assets/json/categorias/complementos/filtros.json');
                const data = await response.json();
                setFiltrosData(data);
            } catch (error) {
                console.error("Error cargando filtros:", error);
            }
        };

        cargarFiltros();
    }, [location.pathname]);

    /**
     * Obtiene el valor de un campo SOLO desde 'detalles-del-producto'.
     * Orden: tamaño, marca, línea.
     * No se usa id, sku, ni ninguna otra clave.
     */
    const getProductValue = (product, fieldName) => {
        if (!product) return null;

        // Mapeo directo de los campos permitidos
        const fieldMappings = {
            'tamaño': ['tamaño', 'tamaños', 'medida', 'medidas', 'tamano', 'tamanos'],
            'marca': ['marca', 'marcas'],
            'línea': ['línea', 'líneas', 'linea', 'lineas']
        };

        const keysToSearch = fieldMappings[fieldName];
        if (!keysToSearch) return null;

        // Buscar SOLO en detalles-del-producto
        if (product['detalles-del-producto'] && product['detalles-del-producto'].length > 0) {
            const detalles = product['detalles-del-producto'][0];
            for (const key of keysToSearch) {
                if (detalles[key] !== undefined && detalles[key] !== null && detalles[key] !== '') {
                    const value = detalles[key];
                    return typeof value === 'string' ? value : String(value);
                }
            }
        }

        return null;
    };

    const updateURL = (filterType, value) => {
        const params = new URLSearchParams(location.search);

        const paramMap = {
            subcategoría: 'subcategoría',
            tamaño: 'tamaño',
            marca: 'marca',
            línea: 'línea',
            modelo: 'modelo',
            'estilo': 'estilo',
            'categoría': 'categoría'
        };

        const paramName = paramMap[filterType] || filterType;

        if (value === null || value === undefined) {
            params.delete(paramName);
        } else {
            params.set(paramName, value);
        }

        if (filterType === 'subcategoría') {
            params.delete('tamaño');
            params.delete('marca');
            params.delete('línea');
            params.delete('modelo');
            params.delete('estilo');
            params.delete('categoría');
        }
        if (filterType === 'tamaño') {
            params.delete('marca');
            params.delete('línea');
            params.delete('modelo');
        }
        if (filterType === 'marca') {
            params.delete('línea');
            params.delete('modelo');
        }
        if (filterType === 'línea') {
            params.delete('modelo');
        }
        if (filterType === 'estilo') {
            params.delete('categoría');
        }

        const newSearch = params.toString();
        const newPath = location.pathname + (newSearch ? `?${newSearch}` : '');
        navigate(newPath, { replace: true });
        
        scrollToTop();
    };

    const handleFilterChange = (filterType, value) => {
        setActiveFilters(prev => {
            const newFilters = { ...prev };
            
            if (filterType === 'subcategoría') {
                newFilters['subcategoría'] = value;
                newFilters.tamaño = null;
                newFilters.marca = null;
                newFilters.línea = null;
                newFilters.modelo = null;
                newFilters['estilo'] = null;
                newFilters['categoría'] = null;

                const params = new URLSearchParams(location.search);
                params.delete('tamaño');
                params.delete('marca');
                params.delete('línea');
                params.delete('modelo');
                params.delete('estilo');
                params.delete('categoría');

                if (value === null) {
                    params.delete('subcategoría');
                } else {
                    params.set('subcategoría', value);
                }

                const newSearch = params.toString();
                const newPath = location.pathname + (newSearch ? `?${newSearch}` : '');
                navigate(newPath, { replace: true });
                
                scrollToTop();
                
                return newFilters;
            }

            if (filterType === 'tamaño') {
                if (value === null) {
                    newFilters.tamaño = null;
                    newFilters.marca = null;
                    newFilters.línea = null;
                    newFilters.modelo = null;
                } else {
                    newFilters.tamaño = value;
                    newFilters.marca = null;
                    newFilters.línea = null;
                    newFilters.modelo = null;
                }
            } else if (filterType === 'marca') {
                if (value === null) {
                    newFilters.marca = null;
                    newFilters.línea = null;
                    newFilters.modelo = null;
                } else {
                    newFilters.marca = value;
                    newFilters.línea = null;
                    newFilters.modelo = null;
                }
            } else if (filterType === 'línea') {
                if (value === null) {
                    newFilters.línea = null;
                    newFilters.modelo = null;
                } else {
                    newFilters.línea = value;
                    newFilters.modelo = null;
                }
            } else if (filterType === 'estilo') {
                if (value === null) {
                    newFilters['estilo'] = null;
                    newFilters['categoría'] = null;
                } else {
                    newFilters['estilo'] = value;
                    newFilters['categoría'] = null;
                }
            } else {
                if (value === null) {
                    newFilters[filterType] = null;
                } else {
                    newFilters[filterType] = value;
                }
            }
            
            const filterToUpdate = value === null ? filterType : filterType;
            updateURL(filterToUpdate, value);
            
            return newFilters;
        });
    };

    const handleFiltroSkus = (skus) => {
        setFiltroSkus(skus);
        scrollToTop();
    };

    const handleEnvioGratis = (activo) => {
        setEnvioGratisActivo(activo);
        scrollToTop();
    };

    const isFiltroActivo = (nombreFiltro, valor) => {
        const stateKey = filterParamMap[nombreFiltro] || nombreFiltro;
        return activeFilters[stateKey] === valor;
    };

    const toggleFiltro = (nombreFiltro, valor) => {
        const stateKey = filterParamMap[nombreFiltro] || nombreFiltro;
        const isActive = activeFilters[stateKey] === valor;
        handleFilterChange(stateKey, isActive ? null : valor);
    };

    const obtenerValoresUnicos = (productosList, campo) => {
        const valores = new Set();
        productosList.forEach(producto => {
            const valor = getProductValue(producto, campo);
            if (valor && typeof valor === 'string') {
                valores.add(valor);
            }
        });
        return Array.from(valores).sort();
    };

    // PRIMERO: Productos filtrados por subcategoría - Base
    const productosBaseFiltrados = useMemo(() => {
        if (productos.length === 0) return [];

        const subcategoriaActual = params.sub1 || activeFilters['subcategoría'];

        if (!subcategoriaActual) {
            return productos;
        }

        return productos.filter(producto => {
            let cumpleTodosLosFiltros = true;

            if (subcategoriaActual) {
                const subcategoriaProducto = producto.subcategoría || 
                                            producto.subcategoria ||
                                            getProductValue(producto, 'subcategoría');
                
                const subcategoriaNormalizada = normalizarTexto(subcategoriaProducto);
                const subcategoriaActualNormalizada = normalizarTexto(subcategoriaActual);
                
                if (subcategoriaNormalizada !== subcategoriaActualNormalizada) {
                    cumpleTodosLosFiltros = false;
                }
            }

            return cumpleTodosLosFiltros;
        });
    }, [productos, params.sub1, activeFilters['subcategoría']]);

    // SEGUNDO: Aplicar filtros de envío gratis y SKUs
    const productosConEnvios = useMemo(() => {
        if (productosBaseFiltrados.length === 0) return [];

        return productosBaseFiltrados.filter(producto => {
            let cumpleTodosLosFiltros = true;

            if (envioGratisActivo) {
                if (producto["tipo-de-envio"] !== "Gratis") {
                    cumpleTodosLosFiltros = false;
                }
            }

            if (cumpleTodosLosFiltros && filtroSkus && Array.isArray(filtroSkus) && filtroSkus.length > 0) {
                if (!filtroSkus.includes(producto.sku)) {
                    cumpleTodosLosFiltros = false;
                }
            }

            return cumpleTodosLosFiltros;
        });
    }, [productosBaseFiltrados, envioGratisActivo, filtroSkus]);

    // TERCERO: Aplicar filtro de precio
    const productosFiltradosPorPrecio = useMemo(() => {
        const searchParams = new URLSearchParams(location.search);
        const precioMin = searchParams.get('min');
        const precioMax = searchParams.get('max');
        
        if (precioMin === null || precioMax === null) {
            return productosConEnvios;
        }

        const min = parseInt(precioMin);
        const max = parseInt(precioMax);

        if (isNaN(min) || isNaN(max)) {
            return productosConEnvios;
        }

        return productosConEnvios.filter(producto => {
            const precio = producto.precioVenta;
            return precio >= min && precio <= max;
        });
    }, [productosConEnvios, location.search]);

    // CUARTO: Aplicar todos los demás filtros (tamaño, marca, línea)
    const productosFiltrados = useMemo(() => {
        if (productosFiltradosPorPrecio.length === 0) return [];

        return productosFiltradosPorPrecio.filter(producto => {
            let cumpleTodosLosFiltros = true;

            if (cumpleTodosLosFiltros && activeFilters.tamaño) {
                const tamañoProducto = getProductValue(producto, 'tamaño');
                if (!tamañoProducto || normalizarTexto(tamañoProducto) !== normalizarTexto(activeFilters.tamaño)) {
                    cumpleTodosLosFiltros = false;
                }
            }

            if (cumpleTodosLosFiltros && activeFilters.marca) {
                const marcaProducto = getProductValue(producto, 'marca');
                if (!marcaProducto || normalizarTexto(marcaProducto) !== normalizarTexto(activeFilters.marca)) {
                    cumpleTodosLosFiltros = false;
                }
            }

            if (cumpleTodosLosFiltros && activeFilters.línea) {
                const lineaProducto = getProductValue(producto, 'línea');
                if (!lineaProducto || normalizarTexto(lineaProducto) !== normalizarTexto(activeFilters.línea)) {
                    cumpleTodosLosFiltros = false;
                }
            }

            return cumpleTodosLosFiltros;
        });
    }, [productosFiltradosPorPrecio, activeFilters]);

    const valoresDisponibles = useMemo(() => {
        const valores = {
            marcas: obtenerValoresUnicos(productosConEnvios, 'marca'),
            líneas: obtenerValoresUnicos(productosConEnvios, 'línea'),
            tamaños: obtenerValoresUnicos(productosConEnvios, 'tamaño')
        };

        return valores;
    }, [productosConEnvios]);

    const productosOrdenados = useMemo(() => {
        return [...productosFiltrados].sort((a, b) => {
            if (orden === "menor-mayor") {
                return a.precioVenta - b.precioVenta;
            } else if (orden === "mayor-menor") {
                return b.precioVenta - a.precioVenta;
            }
            return 0;
        });
    }, [productosFiltrados, orden]);

    const {
        currentPage,
        setCurrentPage,
        totalPages,
        startIndex,
        endIndex,
        getVisiblePages,
        handlePageChange,
        handlePreviousPage,
        handleNextPage,
        resetPage
    } = usePagination(productosOrdenados.length, itemsPerPage);

    useEffect(() => {
        resetPage();
        scrollToTop();
    }, [activeFilters, envioGratisActivo, filtroSkus, orden, params.sub1, location.search]);

    const productosPagina = productosOrdenados.slice(startIndex, endIndex);

    const limpiarFiltros = () => {
        setActiveFilters({
            subcategoría: null,
            tamaño: null,
            marca: null,
            línea: null,
            modelo: null,
            'estilo': null,
            'categoría': null
        });
        
        setFiltroSkus(null);
        setEnvioGratisActivo(false);
        resetPage();
        
        // Limpiar también los filtros de precio de la URL
        const searchParams = new URLSearchParams(location.search);
        searchParams.delete('min');
        searchParams.delete('max');
        const newSearch = searchParams.toString();
        const newPath = location.pathname + (newSearch ? `?${newSearch}` : '');
        navigate(newPath, { replace: true });
        
        setResetFiltersTrigger(true);
        scrollToTop();
        
        setTimeout(() => {
            setResetFiltersTrigger(false);
        }, 100);
    };

    /**
     * Renderiza el filtro de "complementos" como BOTONES (no links).
     * Los datos vienen de filtros.json -> filtros[0].complementos
     * El valor usado para filtrar es el nombre del complemento,
     * y se guarda en activeFilters['subcategoría'].
     */
    const renderComplementosFiltro = () => {
        if (!filtrosData?.filtros) return null;

        // Buscar el objeto que tenga la clave "complementos"
        const complementosObj = filtrosData.filtros.find(f => f.complementos);
        if (!complementosObj) return null;

        const complementos = complementosObj.complementos;
        if (!Array.isArray(complementos)) return null;

        // Extraer solo los nombres
        const valores = complementos
            .map(item => item.complementos)
            .filter(Boolean);

        if (valores.length === 0) return null;

        const stateKey = 'subcategoría';
        const isActive = activeFilters[stateKey] !== null;

        return (
            <div className={`prds-filter-tag ${isActive ? 'active' : ''}`}>
                <div 
                    className='prds-filter-title-container'
                    onClick={(e) => {
                        const parent = e.currentTarget.closest('.prds-filter-tag');
                        parent?.classList.toggle('active');
                    }}
                >
                    <p className='prds-filter-title'>Complementos</p>
                    <span className="material-symbols-outlined">keyboard_arrow_down</span>
                </div>

                <div className='prds-filter-tag-results-container'>
                    <ul>
                        {valores.map((valor, index) => {
                            const isActiveVal = activeFilters[stateKey] === valor;
                            return (
                                <li key={index}>
                                    <button 
                                        type='button'
                                        className={isActiveVal ? 'active' : ''}
                                        onClick={() => toggleFiltro(stateKey, isActiveVal ? null : valor)}
                                    >
                                        <span></span>
                                        <p>{valor}</p>
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>
        );
    };

    const renderFiltroDinamico = (nombreFiltro, valores, label) => {
        if (!valores || valores.length === 0) {
            return null;
        }

        const stateKey = filterParamMap[nombreFiltro] || nombreFiltro;
        const isActive = activeFilters[stateKey] !== null;

        return (
            <div className={`prds-filter-tag ${isActive ? 'active' : ''}`}>
                <div 
                    className='prds-filter-title-container'
                    onClick={(e) => {
                        const parent = e.currentTarget.closest('.prds-filter-tag');
                        parent?.classList.toggle('active');
                    }}
                >
                    <p className='prds-filter-title'>{label}</p>
                    <span className="material-symbols-outlined">keyboard_arrow_down</span>
                </div>

                <div className='prds-filter-tag-results-container'>
                    <ul>
                        {valores.map((valor, index) => {
                            const isActiveVal = activeFilters[stateKey] === valor;
                            return (
                                <li key={index}>
                                    <button 
                                        type='button'
                                        className={isActiveVal ? 'active' : ''}
                                        onClick={() => toggleFiltro(nombreFiltro, isActiveVal ? null : valor)}
                                    >
                                        <span></span>
                                        <p>{valor}</p>
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>
        );
    };

    return(
        <>
            <Helmet>
                <title>Complementos | Homesleep</title>
                <meta name='description' content='Encuentra los mejores complementos para tu descanso. Contamos con una gran variedad en almohadas, protectores, edredones y más.' />
            </Helmet>

            <main className='products-page-main d-flex-column gap-10'>
                <Categorias/>

                <div className='products-page-blocks'>
                    <div className={`products-page-left ${isFiltersOpen ? 'active' : ''}`} ref={filtersPanelRef}>
                        <div className='products-page-filters-container-global'>
                            <div className='d-flex-column gap-20-to-10'>
                                <div className='hp-cat-title'>
                                    <h1>Complementos</h1>
                                    <p className='text'>Encuentra los complementos ideales para tu descanso, en las mejores marcas del mercado</p>
                                </div>
                                <div className='d-flex-column gap-20'>
                                    <div className='d-flex-center-left gap-5'>
                                        <span className="material-symbols-outlined">filter_alt</span>
                                        <p className='text title'>Filtros</p>

                                        {hasActiveFilters && (
                                            <button 
                                                type="button" 
                                                className="limpiar-filtros-btn" 
                                                onClick={limpiarFiltros}
                                                style={{ marginLeft: '10px', fontSize: '12px', color: 'var(--color-1)' }}
                                            >
                                                Limpiar filtros
                                            </button>
                                        )}
                                    </div>

                                    <RangoPrecios productos={productosFiltrados} loading={loading}/>

                                    <div className='prds-filters-container'>
                                        {renderComplementosFiltro()}
                                        {renderFiltroDinamico('marca', valoresDisponibles.marcas, 'Marcas')}
                                        {renderFiltroDinamico('tamaño', valoresDisponibles.tamaños, 'Tamaños')}
                                        {renderFiltroDinamico('línea', valoresDisponibles.líneas, 'Líneas')}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='products-page-right'>
                        <FiltrosTop 
                            setOrden={setOrden} 
                            orden={orden} 
                            toggleFiltro={toggleFiltro} 
                            isFiltroActivo={isFiltroActivo} 
                            setIsFiltersOpen={setIsFiltersOpen} 
                            isFiltersOpen={isFiltersOpen} 
                            productosCount={productosOrdenados.length}
                            totalProductos={productos.length} 
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                            onPreviousPage={handlePreviousPage}
                            onNextPage={handleNextPage}
                            getVisiblePages={getVisiblePages}
                            viewMode={viewMode}
                            setViewMode={setViewMode}
                        />

                        <div className='products-page-products-container'>
                            {loading ? (
                                <div className="loading-products d-flex-center-center d-flex-column gap-10">
                                    <div className="spinner"></div>
                                    <p>Cargando complementos...</p>
                                </div>
                            ) : (
                                <>
                                    <ul className={`products-page-products ${viewMode}`}>
                                        {productosPagina.length === 0 ? (
                                            <div className='d-grid-1-1'>
                                                <div className="d-flex-column gap-10">
                                                    <p className='text'>No se encontraron productos con los filtros seleccionados.</p>

                                                    {hasActiveFilters && (
                                                        <button type="button" className="margin-right button-link button-link-2" onClick={limpiarFiltros}>
                                                            <span className="material-icons">delete</span>
                                                            <p className='button-link-text'>Limpiar filtros</p>
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ) : (
                                            productosPagina.map(producto => (
                                                <Producto 
                                                    key={producto.sku} 
                                                    producto={producto} 
                                                    truncate={(str, maxLength) => str?.length > maxLength ? str.slice(0, maxLength - 3) + "..." : str}
                                                />
                                            ))
                                        )}
                                    </ul>

                                    {productosPagina.length > 0 && totalPages > 1 && (
                                        <div className='pagination-controls'>
                                            <button type='button' className='pagination-arrow' onClick={handlePreviousPage} disabled={currentPage === 1}>
                                                <span className="material-symbols-outlined">chevron_left</span>
                                                <p>Anterior</p>
                                            </button>

                                            <ul className='pagination-list'>
                                                {getVisiblePages().map((page, index) => 
                                                    typeof page === 'number' ? (
                                                        <li key={index}>
                                                            <button 
                                                                type='button'
                                                                className={`pagination-page ${currentPage === page ? 'active' : ''}`}
                                                                onClick={() => handlePageChange(page)}
                                                            >
                                                                <p>{page}</p>
                                                            </button>
                                                        </li>
                                                    ) : (
                                                        <li key={index}>
                                                            <div className='dots'>
                                                                <span>...</span>
                                                            </div>
                                                        </li>
                                                    )
                                                )}
                                            </ul>

                                            <button type='button' className='pagination-arrow' onClick={handleNextPage} disabled={currentPage === totalPages}>
                                                <p>Siguiente</p>
                                                <span className="material-symbols-outlined">chevron_right</span>
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            <div className={`filters-layout ${isFiltersOpen ? 'active' : ''}`} onClick={closeFilters}></div>
        </>
    );
}

export default Complementos;
