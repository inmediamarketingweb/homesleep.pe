import { useEffect, useState, useMemo, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { useParams, useLocation, useNavigate } from 'react-router-dom';

import '../Productos.css';
import './Layout.css';

import Categorias from '../Componentes/Categorias/Categorias';
import FiltrosTop from '../Componentes/FiltrosTop/FiltrosTop';
import { Producto } from '../../../Componentes/Plantillas/Producto/Producto';
import RangoPrecios from '../Componentes/RangoPrecios/RangoPrecios';

// ============ UTILIDADES ============
const normalizarTexto = (texto) => {
    if (!texto || typeof texto !== 'string') {
        return '';
    }
    return texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
};

// ============ OBTENER VALOR DEL PRODUCTO ============
const getProductValue = (product, fieldName) => {
    if (!product) return null;

    const variants = new Set();

    variants.add(fieldName);
    variants.add(fieldName.toLowerCase());
    variants.add(fieldName.toUpperCase());
    variants.add(fieldName.replace(/-/g, ' '));
    variants.add(fieldName.replace(/ /g, '-'));
    variants.add(fieldName.replace(/ /g, '_'));

    // Variaciones plurales
    if (fieldName.endsWith('ón')) {
        variants.add(fieldName.slice(0, -1) + 'es');
    } else if (fieldName.endsWith('or')) {
        variants.add(fieldName + 's');
        variants.add(fieldName.toLowerCase() + 's');
    } else if (fieldName.endsWith('e')) {
        variants.add(fieldName.slice(0, -1) + 'as');
        variants.add(fieldName.toLowerCase().slice(0, -1) + 'as');
    } else if (fieldName.endsWith('a') || fieldName.endsWith('o')) {
        variants.add(fieldName + 's');
        variants.add(fieldName.toLowerCase() + 's');
    } else if (fieldName.endsWith('l')) {
        variants.add(fieldName + 'es');
        variants.add(fieldName.toLowerCase() + 'es');
    } else {
        variants.add(fieldName + 's');
        variants.add(fieldName.toLowerCase() + 's');
    }

    // Variaciones con guiones y espacios
    const newVariants = new Set(variants);
    variants.forEach(v => {
        newVariants.add(v.replace(/ /g, '-'));
        newVariants.add(v.replace(/-/g, ' '));
    });

    // Mapeo de campos específicos para colchones
    const fieldMappings = {
        'nivelDeConfort': ['nivel-de-confort', 'nivel-confort', 'confort', 'nivel'],
        'modelo': ['modelo-de-colchón', 'modelo-colchon', 'modelo', 'modelos'],
        'linea': ['línea-de-colchón', 'linea-colchon', 'línea', 'linea'],
        'resorte': ['tipo-de-resorte', 'resorte', 'resortes', 'tipo-resorte'],
        'marca': ['marca', 'brand'],
        'tamaño': ['tamaño', 'tamano', 'size']
    };

    let keysToSearch = new Set();

    if (fieldMappings[fieldName]) {
        fieldMappings[fieldName].forEach(key => keysToSearch.add(key));
    } else {
        newVariants.forEach(v => keysToSearch.add(v));
    }

    // Buscar en el producto directamente
    for (const key of keysToSearch) {
        if (product[key] !== undefined && product[key] !== null && product[key] !== '') {
            const value = product[key];
            return typeof value === 'string' ? value : String(value);
        }
    }

    // Buscar en detalles-del-producto
    if (product['detalles-del-producto'] && product['detalles-del-producto'].length > 0) {
        const detalles = product['detalles-del-producto'][0];
        for (const key of keysToSearch) {
            if (detalles[key] !== undefined && detalles[key] !== null && detalles[key] !== '') {
                const value = detalles[key];
                return typeof value === 'string' ? value : String(value);
            }
        }
    }

    // Buscar en fichaTecnica
    if (product.fichaTecnica) {
        for (const key of keysToSearch) {
            if (product.fichaTecnica[key] !== undefined && product.fichaTecnica[key] !== null && product.fichaTecnica[key] !== '') {
                const value = product.fichaTecnica[key];
                return typeof value === 'string' ? value : String(value);
            }
        }
    }

    // Búsqueda flexible por coincidencia de claves
    for (const key of Object.keys(product)) {
        const keyLower = key.toLowerCase().replace(/[^a-z0-9]/g, '');
        for (const searchKey of keysToSearch) {
            const searchLower = searchKey.toLowerCase().replace(/[^a-z0-9]/g, '');
            if (keyLower === searchLower || keyLower.includes(searchLower) || searchLower.includes(keyLower)) {
                if (product[key] !== undefined && product[key] !== null && product[key] !== '') {
                    const value = product[key];
                    return typeof value === 'string' ? value : String(value);
                }
            }
        }
    }

    return null;
};

// ============ COMPARAR MARCAS ============
const compararMarcas = (marcaProducto, marcaFiltro) => {
    if (!marcaProducto || !marcaFiltro) return false;

    const marcaProductoNormalizado = normalizarTexto(marcaProducto);
    const marcaFiltroNormalizado = normalizarTexto(marcaFiltro);

    if (marcaFiltroNormalizado === 'kamas') {
        return marcaProductoNormalizado === 'kamas';
    }

    if (marcaFiltroNormalizado === 'komfort') {
        return marcaProductoNormalizado.includes('komfort');
    }

    if (marcaFiltroNormalizado === 'paraiso') {
        return marcaProductoNormalizado.includes('paraiso');
    }

    if (marcaFiltroNormalizado === 'el-cisne') {
        return marcaProductoNormalizado.includes('el-cisne');
    }

    return marcaProductoNormalizado === marcaFiltroNormalizado;
};

function Colchones() {
    const { sub1, sub2, sub3 } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filtrosData, setFiltrosData] = useState(null);
    const [envioGratisActivo, setEnvioGratisActivo] = useState(false);
    const [isHotSaleActive, setIsHotSaleActive] = useState(() => {
        const saved = localStorage.getItem('hotSaleActive');
        return saved === 'true';
    });
    const [hotSaleSKUs, setHotSaleSKUs] = useState([]);
    const queryParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);
    const filtersPanelRef = useRef(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 32;
    const [hasActiveFilters, setHasActiveFilters] = useState(false);
    const [viewMode, setViewMode] = useState(() => {
        const savedMode = localStorage.getItem('viewMode');
        return savedMode || 'grid';
    });

    // Estado de filtros activos (para filtros dinámicos)
    const [activeFilters, setActiveFilters] = useState({
        tamaño: null,
        marca: null,
        nivelDeConfort: null,
        modelo: null,
        linea: null,
        resorte: null
    });

    // Orden jerárquico de los filtros
    const ordenFiltros = ['tamaño', 'marca', 'nivelDeConfort', 'linea', 'modelo', 'resorte'];

    // Mapeo de parámetros de URL a estado
    const filterParamMap = {
        'tamaño': 'tamaño',
        'marca': 'marca',
        'nivel-de-confort': 'nivelDeConfort',
        'modelo': 'modelo',
        'linea': 'linea',
        'resorte': 'resorte'
    };

    const paramMap = {
        tamaño: 'tamaño',
        marca: 'marca',
        nivelDeConfort: 'nivel-de-confort',
        modelo: 'modelo',
        linea: 'linea',
        resorte: 'resorte'
    };

    // Leer el orden desde la URL
    const [orden, setOrden] = useState(() => {
        const params = new URLSearchParams(location.search);
        return params.get('orden') || 'ultimo';
    });

    // ============ EFFECTS ============

    // Sincronizar filtros desde URL
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

    // Detectar si hay filtros activos
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const hasPriceFilter = params.has('min') || params.has('max');
        const hasOtherFilters = Object.values(activeFilters).some(v => v !== null) ||
                               envioGratisActivo || isHotSaleActive;
        
        setHasActiveFilters(hasPriceFilter || hasOtherFilters);
    }, [activeFilters, envioGratisActivo, isHotSaleActive, location.search]);

    // Sincronizar orden con la URL
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const ordenFromUrl = params.get('orden');
        if (ordenFromUrl && ordenFromUrl !== orden) {
            setOrden(ordenFromUrl);
        }
    }, [location.search]);

    // Cerrar filtros al hacer click fuera
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

    // Cargar Hot Sale SKUs
    useEffect(() => {
        const cargarHotSaleSKUs = async () => {
            try {
                const response = await fetch('/assets/json/mas-vendidos.json');
                const skus = await response.json();
                setHotSaleSKUs(skus);
            } catch (error) {
                console.error("Error cargando mas-vendidos.json:", error);
                setHotSaleSKUs([]);
            }
        };
        
        cargarHotSaleSKUs();
    }, []);

    // ============ CARGA DE PRODUCTOS ============

    useEffect(() => {
        const cargarProductosColchones = async () => {
            try {
                setLoading(true);

                const manifestResponse = await fetch('/assets/json/manifest.json');
                const manifestData = await manifestResponse.json();
                const archivos = manifestData.files || [];

                let archivosColchones = archivos.filter(url =>
                    url.startsWith('/assets/json/categorias/colchones/')
                );

                if (sub1) {
                    archivosColchones = archivosColchones.filter(
                        url => url.includes(`/colchones/${sub1}/`)
                    );
                }

                if (sub2) {
                    archivosColchones = archivosColchones.filter(
                        url => url.includes(`/colchones/${sub1}/${sub2}/`)
                    );
                }

                if (sub3) {
                    archivosColchones = archivosColchones.filter(
                        url => url.includes(`/colchones/${sub1}/${sub2}/${sub3}.json`)
                    );
                }

                const productosPromesas = archivosColchones.map(async (url) => {
                    try {
                        const response = await fetch(url);
                        const data = await response.json();

                        const productosConFicha = data.productos?.map(producto => ({
                            ...producto,
                            fichaTecnica: data.ficha?.[0] || {}
                        })) || [];
                        
                        return productosConFicha;
                    } catch (error) {
                        console.error(`Error cargando archivo ${url}:`, error);
                        return [];
                    }
                });

                const productosPorArchivo = await Promise.all(productosPromesas);
                const todosProductos = productosPorArchivo.flat();

                setProductos(todosProductos);
                setCurrentPage(1);
                setLoading(false);
            } catch (error) {
                console.error("Error cargando productos de colchones:", error);
                setLoading(false);
            }
        };

        cargarProductosColchones();
    }, [sub1, sub2, sub3]);

    // ============ CARGA DE FILTROS ============

    useEffect(() => {
        const cargarFiltros = async () => {
            try {
                const response = await fetch('/assets/json/categorias/colchones/filtros.json');
                const data = await response.json();
                setFiltrosData(data);
            } catch (error) {
                console.error("Error cargando filtros:", error);
            }
        };

        cargarFiltros();
    }, []);

    // ============ FUNCIONES DE FILTRADO ============

    // Actualizar URL con filtros
    const updateURL = (filterType, value) => {
        const params = new URLSearchParams(location.search);
        const paramName = paramMap[filterType] || filterType;

        if (value === null || value === undefined) {
            params.delete(paramName);
        } else {
            params.set(paramName, value);
        }

        // Jerarquía de filtros (limpiar dependientes)
        const hierarchy = {
            'marca': ['nivelDeConfort', 'linea', 'modelo', 'resorte'],
            'nivelDeConfort': ['linea', 'modelo', 'resorte'],
            'linea': ['modelo', 'resorte'],
            'modelo': ['resorte']
        };

        if (hierarchy[filterType]) {
            hierarchy[filterType].forEach(dependent => {
                params.delete(paramMap[dependent] || dependent);
            });
        }

        const newSearch = params.toString();
        const newPath = location.pathname + (newSearch ? `?${newSearch}` : '');
        navigate(newPath, { replace: true });
    };

    // Manejar cambio de filtro
    const handleFilterChange = (filterType, value) => {
        setActiveFilters(prev => {
            const newFilters = { ...prev };
            
            if (filterType === 'marca') {
                newFilters.marca = value;
                newFilters.nivelDeConfort = null;
                newFilters.linea = null;
                newFilters.modelo = null;
                newFilters.resorte = null;
            } else if (filterType === 'nivelDeConfort') {
                newFilters.nivelDeConfort = value;
                if (value === null) {
                    newFilters.linea = null;
                    newFilters.modelo = null;
                    newFilters.resorte = null;
                }
            } else if (filterType === 'linea') {
                newFilters.linea = value;
                if (value === null) {
                    newFilters.modelo = null;
                    newFilters.resorte = null;
                }
            } else if (filterType === 'modelo') {
                newFilters.modelo = value;
                if (value === null) {
                    newFilters.resorte = null;
                }
            } else {
                newFilters[filterType] = value;
            }
            
            updateURL(filterType, value);
            setCurrentPage(1);
            return newFilters;
        });
    };

    // Toggle filtro
    const toggleFiltro = (nombreFiltro, valor) => {
        const stateKey = filterParamMap[nombreFiltro] || nombreFiltro;
        const isActive = activeFilters[stateKey] === valor;
        handleFilterChange(stateKey, isActive ? null : valor);
    };

    const isFiltroActivo = (nombreFiltro, valor) => {
        const stateKey = filterParamMap[nombreFiltro] || nombreFiltro;
        return activeFilters[stateKey] === valor;
    };

    // Filtrar productos por filtros
    const filtrarProductosPorFiltros = (productosList, filtrosAplicar) => {
        if (!productosList || productosList.length === 0) return [];
        if (!filtrosAplicar || Object.keys(filtrosAplicar).length === 0) return productosList;

        return productosList.filter(producto => {
            let cumpleTodos = true;

            for (const filterKey of ordenFiltros) {
                if (cumpleTodos && filtrosAplicar[filterKey]) {
                    const valorProducto = getProductValue(producto, filterKey);
                    
                    if (!valorProducto) {
                        cumpleTodos = false;
                        break;
                    }
                    
                    if (filterKey === 'marca') {
                        if (!compararMarcas(valorProducto, filtrosAplicar.marca)) {
                            cumpleTodos = false;
                            break;
                        }
                    } else {
                        const valorNormalizado = normalizarTexto(valorProducto);
                        const filtroNormalizado = normalizarTexto(filtrosAplicar[filterKey]);
                        
                        if (valorNormalizado !== filtroNormalizado) {
                            cumpleTodos = false;
                            break;
                        }
                    }
                }
            }

            return cumpleTodos;
        });
    };

    // Obtener valores únicos de productos
    const obtenerValoresUnicosDeProductos = (productosList, campo) => {
        const valores = new Set();
        productosList.forEach(producto => {
            const valor = getProductValue(producto, campo);
            if (valor && typeof valor === 'string' && valor.trim() !== '') {
                valores.add(valor.trim());
            }
        });
        return Array.from(valores).sort();
    };

    // ============ FILTRADO POR PASOS ============

    // PASO 1: Filtros base (tamaño, marca, envio gratis, hot sale)
    const productosBaseFiltrados = useMemo(() => {
        if (productos.length === 0) return [];

        return productos.filter(producto => {
            let cumpleTodosLosFiltros = true;

            // Filtro envío gratis
            if (envioGratisActivo) {
                if (producto["tipo-de-envio"] !== "Gratis") {
                    cumpleTodosLosFiltros = false;
                }
            }

            // Filtro Hot Sale
            if (cumpleTodosLosFiltros && isHotSaleActive && hotSaleSKUs.length > 0) {
                if (!hotSaleSKUs.includes(producto.sku)) {
                    cumpleTodosLosFiltros = false;
                }
            }

            // Filtros base (tamaño, marca)
            const filtrosBase = ['tamaño', 'marca'];
            
            for (const filterKey of filtrosBase) {
                if (cumpleTodosLosFiltros && activeFilters[filterKey]) {
                    const valorProducto = getProductValue(producto, filterKey);
                    
                    if (!valorProducto) {
                        cumpleTodosLosFiltros = false;
                        break;
                    }
                    
                    if (filterKey === 'marca') {
                        if (!compararMarcas(valorProducto, activeFilters.marca)) {
                            cumpleTodosLosFiltros = false;
                            break;
                        }
                    } else {
                        const valorNormalizado = normalizarTexto(valorProducto);
                        const filtroNormalizado = normalizarTexto(activeFilters[filterKey]);
                        
                        if (valorNormalizado !== filtroNormalizado) {
                            cumpleTodosLosFiltros = false;
                            break;
                        }
                    }
                }
            }

            return cumpleTodosLosFiltros;
        });
    }, [productos, activeFilters.tamaño, activeFilters.marca, envioGratisActivo, isHotSaleActive, hotSaleSKUs]);

    // PASO 2: Filtro de precio
    const productosFiltradosPorPrecio = useMemo(() => {
        const params = new URLSearchParams(location.search);
        const precioMin = params.get('min');
        const precioMax = params.get('max');
        
        if (precioMin === null || precioMax === null) {
            return productosBaseFiltrados;
        }

        const min = parseInt(precioMin);
        const max = parseInt(precioMax);

        if (isNaN(min) || isNaN(max)) {
            return productosBaseFiltrados;
        }

        return productosBaseFiltrados.filter(producto => {
            const precio = producto.precioVenta || 0;
            return precio >= min && precio <= max;
        });
    }, [productosBaseFiltrados, location.search]);

    // PASO 3: Filtros jerárquicos (nivelDeConfort, linea, modelo, resorte)
    const productosFiltrados = useMemo(() => {
        return filtrarProductosPorFiltros(productosFiltradosPorPrecio, activeFilters);
    }, [productosFiltradosPorPrecio, activeFilters]);

    // PASO 4: Ordenamiento
    const productosOrdenados = useMemo(() => {
        const productosParaOrdenar = [...productosFiltrados];
        
        if (orden === "ultimo") {
            return productosParaOrdenar;
        }
        
        if (orden === "menor-mayor") {
            return productosParaOrdenar.sort((a, b) => {
                const precioA = a.precioVenta || 0;
                const precioB = b.precioVenta || 0;
                return precioA - precioB;
            });
        }
        
        if (orden === "mayor-menor") {
            return productosParaOrdenar.sort((a, b) => {
                const precioA = a.precioVenta || 0;
                const precioB = b.precioVenta || 0;
                return precioB - precioA;
            });
        }

        return productosParaOrdenar;
    }, [productosFiltrados, orden]);

    // ============ FUNCIONES PARA RENDERIZAR FILTROS DINÁMICOS ============

    const obtenerProductosHastaFiltro = (filtroActual) => {
        const filtrosHasta = { ...activeFilters };
        const indexActual = ordenFiltros.indexOf(filtroActual);
        if (indexActual !== -1) {
            for (let i = indexActual; i < ordenFiltros.length; i++) {
                delete filtrosHasta[ordenFiltros[i]];
            }
        }
        return filtrarProductosPorFiltros(productosFiltradosPorPrecio, filtrosHasta);
    };

    const debeMostrarFiltro = (campo) => {
        const dependencias = {
            'nivelDeConfort': ['marca'],
            'linea': ['nivelDeConfort'],
            'modelo': ['linea'],
            'resorte': ['modelo']
        };

        if (dependencias[campo]) {
            const dependencia = dependencias[campo];
            if (Array.isArray(dependencia)) {
                return dependencia.every(dep => !!activeFilters[dep]);
            }
            return !!activeFilters[dependencia];
        }

        // Siempre mostrar tamaño y marca
        if (campo === 'tamaño' || campo === 'marca') {
            return true;
        }

        return true;
    };

    const renderFiltroDinamico = (campo, titulo, paramName) => {
        if (!debeMostrarFiltro(campo)) return null;
        
        const productosFiltradosHasta = obtenerProductosHastaFiltro(campo);
        const valores = obtenerValoresUnicosDeProductos(productosFiltradosHasta, campo);
        
        if (valores.length === 0) return null;

        // Para tamaño y marca, usar el estilo de filtro normal
        if (campo === 'tamaño' || campo === 'marca') {
            return (
                <div className={`prds-filter-tag ${activeFilters[campo] ? 'active' : ''}`}>
                    <div 
                        className='prds-filter-title-container'
                        onClick={(e) => {
                            const parent = e.currentTarget.closest('.prds-filter-tag');
                            parent?.classList.toggle('active');
                        }}
                    >
                        <p className='prds-filter-title'>{titulo}</p>
                        <span className="material-symbols-outlined">keyboard_arrow_down</span>
                    </div>

                    <div className='prds-filter-tag-results-container'>
                        <ul>
                            {valores.map((valor, index) => {
                                const isActive = activeFilters[campo] === valor;
                                return (
                                    <li key={index}>
                                        <button 
                                            type='button'
                                            className={isActive ? 'active' : ''}
                                            onClick={() => toggleFiltro(paramName, isActive ? null : valor)}
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
        }

        // Para filtros jerárquicos (nivelDeConfort, linea, modelo, resorte)
        return (
            <div className={`prds-filter-tag ${activeFilters[campo] ? 'active' : ''}`}>
                <div 
                    className='prds-filter-title-container'
                    onClick={(e) => {
                        const parent = e.currentTarget.closest('.prds-filter-tag');
                        parent?.classList.toggle('active');
                    }}
                >
                    <p className='prds-filter-title'>{titulo}</p>
                    <span className="material-symbols-outlined">keyboard_arrow_down</span>
                </div>

                <div className='prds-filter-tag-results-container'>
                    <ul>
                        {valores.map((valor, index) => {
                            const isActive = activeFilters[campo] === valor;
                            return (
                                <li key={index}>
                                    <button 
                                        type='button'
                                        className={isActive ? 'active' : ''}
                                        onClick={() => toggleFiltro(paramName, isActive ? null : valor)}
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

    const renderFiltrosJerarquicos = () => {
        const elementos = [];

        // Tamaño
        const filtroTamaño = renderFiltroDinamico('tamaño', 'Tamaño', 'tamaño');
        if (filtroTamaño) elementos.push(filtroTamaño);

        // Marca (solo si hay tamaño seleccionado o productos disponibles)
        if (activeFilters.tamaño || productosBaseFiltrados.length > 0) {
            const filtroMarca = renderFiltroDinamico('marca', 'Marca', 'marca');
            if (filtroMarca) elementos.push(filtroMarca);
        }

        // Nivel de Confort (depende de marca)
        if (activeFilters.marca) {
            const filtroNivel = renderFiltroDinamico('nivelDeConfort', 'Nivel de confort', 'nivel-de-confort');
            if (filtroNivel) elementos.push(filtroNivel);
        }

        // Línea (depende de nivelDeConfort)
        if (activeFilters.nivelDeConfort) {
            const filtroLinea = renderFiltroDinamico('linea', 'Línea', 'linea');
            if (filtroLinea) elementos.push(filtroLinea);
        }

        // Modelo (depende de linea)
        if (activeFilters.linea) {
            const filtroModelo = renderFiltroDinamico('modelo', 'Modelo', 'modelo');
            if (filtroModelo) elementos.push(filtroModelo);
        }

        // Resorte (depende de modelo)
        if (activeFilters.modelo) {
            const filtroResorte = renderFiltroDinamico('resorte', 'Resorte', 'resorte');
            if (filtroResorte) elementos.push(filtroResorte);
        }

        return elementos.length > 0 ? elementos : null;
    };

    // ============ FUNCIONES DE PAGINACIÓN ============

    const totalItems = productosOrdenados.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
    const productosPagina = productosOrdenados.slice(startIndex, endIndex);

    const getVisiblePages = () => {
        const visiblePages = [];
        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) visiblePages.push(i);
        } else {
            if (currentPage <= 3) { 
                visiblePages.push(1, 2, 3, 4, '...', totalPages); 
            } else if (currentPage >= totalPages - 2) {
                visiblePages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
            } else {
                visiblePages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
            }
        }
        return visiblePages;
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(Math.max(1, Math.min(totalPages, newPage)));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handlePreviousPage = () => handlePageChange(currentPage - 1);
    const handleNextPage = () => handlePageChange(currentPage + 1);

    // Reset page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [activeFilters, envioGratisActivo, isHotSaleActive, location.search]);

    // ============ LIMPIAR FILTROS ============

    const limpiarFiltros = () => {
        setActiveFilters({
            tamaño: null,
            marca: null,
            nivelDeConfort: null,
            modelo: null,
            linea: null,
            resorte: null
        });
        
        setEnvioGratisActivo(false);
        setIsHotSaleActive(false);
        localStorage.setItem('hotSaleActive', 'false');
        setCurrentPage(1);
        
        // Limpiar filtros de precio y orden de la URL
        const params = new URLSearchParams(location.search);
        params.delete('min');
        params.delete('max');
        params.delete('orden');
        const newSearch = params.toString();
        const newPath = location.pathname + (newSearch ? `?${newSearch}` : '');
        navigate(newPath, { replace: true });
    };

    // ============ TOGGLES ============

    const closeFilters = () => {
        setIsFiltersOpen(false);
    };

    const toggleEnvioGratis = () => {
        setEnvioGratisActivo(!envioGratisActivo);
        setCurrentPage(1);
    };

    const handleHotSaleToggle = () => {
        const newState = !isHotSaleActive;
        setIsHotSaleActive(newState);
        localStorage.setItem('hotSaleActive', newState);
        setCurrentPage(1);
    };

    // Manejar cambio de orden
    const handleOrdenChange = (nuevoOrden) => {
        const params = new URLSearchParams(location.search);
        
        if (nuevoOrden === 'ultimo') {
            params.delete('orden');
        } else {
            params.set('orden', nuevoOrden);
        }
        
        setOrden(nuevoOrden);
        setCurrentPage(1);
        navigate(`${location.pathname}?${params.toString()}`, { replace: true });
    };

    // ============ RENDER ============

    return (
        <>
            <Helmet>
                <title>Colchones | Homesleep</title>
                <meta name="description" content="Encuentra el colchón ideal para ti, compara marcas, precios, modelos, confort y encuentra tu colchón ideal." />
                <meta property="og:title" content="Colchones | Homesleep"/>
            </Helmet>

            <main className='products-page-main d-flex-column gap-10'>
                <Categorias/>

                <div className='products-page-blocks'>
                    <div className={`products-page-left ${isFiltersOpen ? 'active' : ''}`} ref={filtersPanelRef}>
                        <div className='products-page-filters-container-global d-flex-column gap-10'>
                            <div className='d-flex-column gap-20'>
                                <div className='d-flex-column padding-bottom-20 border-bottom-2-solid-component'>
                                    <p className='block-title color-color-1 uppercase w-100 d-flex'>Homesleep</p>
                                    <button type='button' className='filters-button-close margin-left' onClick={closeFilters}>
                                        <span className="material-icons color-color-1">close</span>
                                    </button>
                                    <p className='uppercase w-100 d-flex'>Las mejores marcas en productos para el descanso</p>
                                </div>

                                {/* <div className='envio-gratis-button-container'>
                                    <div className='d-flex-center-center'>
                                        <p className='weight-bold uppercase color-color-1 font-bold'>Envío gratis</p>
                                    </div>
                                    <div type='button' className={`envio-gratis-button ${envioGratisActivo ? 'active' : ''}`} onClick={toggleEnvioGratis}>
                                        <span></span>
                                    </div>
                                </div> */}

                                <RangoPrecios productos={productosFiltrados} loading={loading}/>

                                <button type='button' className={`filter-hot-sale ${isHotSaleActive ? 'active' : ''}`} onClick={handleHotSaleToggle}>
                                    <div className='d-flex-center-left'>
                                        <span className="material-symbols-outlined">local_fire_department</span>
                                        <div className='d-flex-column'>
                                            <p className='title color-gray-dark'>Hot sale</p>
                                            <span className='color-gray-dark'>(Más vendidos)</span>
                                        </div>
                                    </div>
                                    <div className='switch'></div>
                                </button>

                                {/* ============ FILTROS DINÁMICOS ============ */}
                                <div className='products-page-filters-container d-flex-column'>
                                    {renderFiltrosJerarquicos()}
                                </div>

                                {hasActiveFilters && (
                                    <button type="button" className="button-link button-link-2" onClick={limpiarFiltros}>
                                        <span className="material-icons">delete</span>
                                        <p className="button-link-text">Limpiar filtros</p>
                                    </button>
                                )}
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
                                    <p>Cargando productos...</p>
                                </div>
                            ) : (
                                <>
                                    <ul className={`products-page-products ${viewMode}`}>
                                        {productosPagina.length === 0 ? (
                                            <div className='d-grid-1-1'>
                                                <div className="w-100 d-flex-column d-flex-center-center text-center gap-10">
                                                    <img src="/assets/imagenes/paginas/not-found.svg" alt="" width={320} />
                                                    <p className='text'>No se encontraron productos con los filtros seleccionados.</p>
                                                    {hasActiveFilters && (
                                                        <button type="button" className="button-link button-link-2" onClick={limpiarFiltros}>
                                                            <span className="material-icons">delete</span>
                                                            <p className="button-link-text">Limpiar filtros</p>
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ) : (
                                            productosPagina.map(producto => (
                                                <Producto key={producto.sku} producto={producto} />
                                            ))
                                        )}
                                    </ul>
                                    
                                    {productosPagina.length > 0 && totalPages > 1 && (
                                        <div className="pagination-controls d-grid-column-2-3 margin-top-20">
                                            <button className="pagination-arrow" onClick={handlePreviousPage} disabled={currentPage === 1}>
                                                <span className="material-icons">chevron_left</span>
                                            </button>

                                            <div className="d-flex-center-center gap-10">
                                                {getVisiblePages().map((page, index) => 
                                                    typeof page === 'number' ? (
                                                        <button key={index} className={`pagination-page ${currentPage === page ? 'active' : ''}`} onClick={() => handlePageChange(page)}>
                                                            {page}
                                                        </button>
                                                    ) : (
                                                        <span key={index} className="pagination-ellipsis">...</span>
                                                    )
                                                )}
                                            </div>

                                            <button className="pagination-arrow" onClick={handleNextPage} disabled={currentPage === totalPages}>
                                                <span className="material-icons">chevron_right</span>
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

export default Colchones;
