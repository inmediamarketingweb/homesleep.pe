import { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';

import '../Productos.css';
import './Layout.css';

// import BtnGeneral from './Componentes/BtnGeneral/BtnGeneral';
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

function Sofas() {
    const { sub1, sub2, sub3, sub4, sub5, marca, configuracion, cuerpos, orientacion, tamaño, id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filtrosData, setFiltrosData] = useState(null);
    const [orden, setOrden] = useState("ultimo");
    const [viewMode, setViewMode] = useState(() => {
        const savedMode = localStorage.getItem('viewModeSofas');
        return savedMode || 'grid';
    });
    const queryParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);
    const filtersPanelRef = useRef(null);
    const itemsPerPage = 28;

    const [activeFilters, setActiveFilters] = useState({
        tipo: null,
        tamaño: null,
        marca: null,
        línea: null,
        modelo: null,
        configuración: null,
        posición: null,
        cuerpos: null,
        orientación: null
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
        'tipo': 'tipo',
        'tamaño': 'tamaño',
        'marca': 'marca',
        'línea': 'línea',
        'modelo': 'modelo',
        'configuración': 'configuración',
        'posición': 'posición',
        'cuerpos': 'cuerpos',
        'orientación': 'orientación'
    };

    // Determinar estructura según la ruta
    const determinarEstructura = useCallback(() => {
        const path = location.pathname;
        
        if (path.includes('/butacas/')) {
            return { tipo: 'butacas', niveles: 2 };
        } else if (path.includes('/juegos-de-sala/')) {
            return { tipo: 'juegos-de-sala', niveles: 3 };
        } else if (path.includes('/mecedoras/')) {
            return { tipo: 'mecedoras', niveles: 2 };
        } else if (path.includes('/reclinables/')) {
            return { tipo: 'reclinables', niveles: 3 };
        } else if (path.includes('/seccionales/')) {
            return { tipo: 'seccionales', niveles: 3 };
        } else if (path.includes('/sofa-cama/')) {
            return { tipo: 'sofa-cama', niveles: 3 };
        }
        
        return { tipo: 'general', niveles: 0 };
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
        const hasOtherFilters = activeFilters.tipo || activeFilters.tamaño || 
                               activeFilters.marca || activeFilters.línea || 
                               activeFilters.modelo || activeFilters['configuración'] || 
                               activeFilters['posición'] || activeFilters['cuerpos'] || 
                               activeFilters['orientación'] || filtroSkus || envioGratisActivo;
        
        setHasActiveFilters(hasPriceFilter || hasOtherFilters);
    }, [activeFilters, filtroSkus, envioGratisActivo, location.search]);

    // Sincronizar sub1 con activeFilters.tipo
    useEffect(() => {
        if (sub1) {
            const categoriaNormalizada = normalizarTexto(sub1);
            if (activeFilters.tipo !== categoriaNormalizada) {
                setActiveFilters(prev => ({
                    ...prev,
                    tipo: categoriaNormalizada
                }));
            }
        } else {
            if (activeFilters.tipo !== null) {
                setActiveFilters(prev => ({
                    ...prev,
                    tipo: null
                }));
            }
        }
    }, [sub1]);

    useEffect(() => {
        localStorage.setItem('viewModeSofas', viewMode);
    }, [viewMode]);

    useEffect(() => {
        if (sub1 && filtrosData?.filtros) {
            const categorias = filtrosData.filtros.find(f => f.categorías);
            if (categorias && activeFilters.tipo) {
                const categoriasDisponibles = categorias.categorías.map(c => normalizarTexto(c.categoría));
                if (!categoriasDisponibles.includes(normalizarTexto(activeFilters.tipo))) {
                    handleFilterChange('tipo', null);
                }
            }
        }
    }, [sub1, filtrosData]);

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
        if (id || (sub5 && !isNaN(sub5))) {
            navigate(location.pathname, { replace: true });
        }
    }, [sub1, sub2, sub3, sub4, sub5, marca, id, navigate, location.pathname, determinarEstructura]);

    useEffect(() => {
        const estructura = determinarEstructura();
        
        if (id || (sub5 && !isNaN(sub5))) {
            return;
        }

        const cargarProductosSofas = async () => {
            try {
                setLoading(true);
                const manifestResponse = await fetch('/assets/json/manifest.json');
                const manifestData = await manifestResponse.json();
                const archivos = manifestData.files || [];
                let archivosProductos = archivos.filter(url => url.startsWith('/assets/json/categorias/sofas/'));
                let rutaBuscada = '';
                
                if (estructura.tipo !== 'general') {
                    switch(estructura.tipo) {
                        case 'butacas':
                            rutaBuscada = `/sofas/butacas/${marca || ''}`;
                            break;
                        case 'juegos-de-sala':
                            rutaBuscada = `/sofas/juegos-de-sala/${configuracion || ''}/${marca || ''}`;
                            break;
                        case 'mecedoras':
                            rutaBuscada = `/sofas/mecedoras/${marca || ''}`;
                            break;
                        case 'reclinables':
                            rutaBuscada = `/sofas/reclinables/${cuerpos || ''}/${marca || ''}`;
                            break;
                        case 'seccionales':
                            rutaBuscada = `/sofas/seccionales/${orientacion || ''}/${marca || ''}`;
                            break;
                        case 'sofa-cama':
                            rutaBuscada = `/sofas/sofa-cama/${tamaño || ''}/${marca || ''}`;
                            break;
                        default:
                            break;
                    }
                } else {
                    const params = [sub1, sub2, sub3, sub4].filter(Boolean);
                    rutaBuscada = `/sofas/${params.join('/')}`;
                }

                rutaBuscada = rutaBuscada.replace(/\/+$/, '');

                if (rutaBuscada && rutaBuscada !== '/sofas') {
                    archivosProductos = archivosProductos.filter(url => {
                        const urlSinExtension = url.replace('.json', '');
                        return urlSinExtension.includes(rutaBuscada);
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
                console.error("Error cargando productos de sofás:", error);
                setLoading(false);
            }
        };

        cargarProductosSofas();
    }, [sub1, sub2, sub3, sub4, sub5, marca, configuracion, cuerpos, orientacion, tamaño, id, location.pathname, determinarEstructura]);

    useEffect(() => {
        if (id || (sub5 && !isNaN(sub5))) {
            return;
        }

        const cargarFiltros = async () => {
            try {
                const response = await fetch('/assets/json/categorias/sofas/filtros.json');
                const data = await response.json();
                setFiltrosData(data);
            } catch (error) {
                console.error("Error cargando filtros:", error);
            }
        };

        cargarFiltros();
    }, [sub1, sub2, sub3, sub4, sub5, marca, id, location.pathname, determinarEstructura]);

    const getProductValue = (product, fieldName) => {
        if (!product) return null;

        const variants = new Set();

        variants.add(fieldName);
        variants.add(fieldName.toLowerCase());
        variants.add(fieldName.toUpperCase());
        variants.add(fieldName.replace(/-/g, ' '));
        variants.add(fieldName.replace(/ /g, '-'));
        variants.add(fieldName.replace(/ /g, '_'));

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

        const newVariants = new Set(variants);
        variants.forEach(v => {
            newVariants.add(v.replace(/ /g, '-'));
            newVariants.add(v.replace(/-/g, ' '));
        });

        const fieldMappings = {
            'tipo': ['tipo', 'tipos', 'categoría', 'categorías', 'categoria', 'categorias', 'subcategoría', 'subcategorías', 'subcategoria', 'subcategorias'],
            'tamaño': ['tamaño', 'tamaños', 'medida', 'medidas', 'tamano', 'tamanos'],
            'marca': ['marca', 'marcas'],
            'línea': ['línea', 'líneas', 'linea', 'lineas'],
            'modelo': ['modelo', 'modelos'],
            'configuración': ['configuración', 'configuracion', 'configuraciones', 'config'],
            'posición': ['posición', 'posicion', 'posiciones', 'pos'],
            'cuerpos': ['cuerpos', 'cuerpo', 'plazas', 'plaza'],
            'orientación': ['orientación', 'orientacion', 'orientaciones', 'orient', 'dirección', 'direccion']
        };

        let keysToSearch = new Set();

        if (fieldMappings[fieldName]) {
            fieldMappings[fieldName].forEach(key => keysToSearch.add(key));
        } else {
            newVariants.forEach(v => keysToSearch.add(v));
        }

        for (const key of keysToSearch) {
            if (product[key] !== undefined && product[key] !== null && product[key] !== '') {
                const value = product[key];
                return typeof value === 'string' ? value : String(value);
            }
        }

        if (product['detalles-del-producto'] && product['detalles-del-producto'].length > 0) {
            const detalles = product['detalles-del-producto'][0];
            for (const key of keysToSearch) {
                if (detalles[key] !== undefined && detalles[key] !== null && detalles[key] !== '') {
                    const value = detalles[key];
                    return typeof value === 'string' ? value : String(value);
                }
            }
        }

        if (product.fichaTecnica) {
            for (const key of keysToSearch) {
                if (product.fichaTecnica[key] !== undefined && product.fichaTecnica[key] !== null && product.fichaTecnica[key] !== '') {
                    const value = product.fichaTecnica[key];
                    return typeof value === 'string' ? value : String(value);
                }
            }
        }

        if (product.ficha && product.ficha.length > 0) {
            const ficha = product.ficha[0];
            for (const key of keysToSearch) {
                if (ficha[key] !== undefined && ficha[key] !== null && ficha[key] !== '') {
                    const value = ficha[key];
                    return typeof value === 'string' ? value : String(value);
                }
            }
        }

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

    const updateURL = (filterType, value) => {
        const params = new URLSearchParams(location.search);

        const paramMap = {
            tipo: 'tipo',
            tamaño: 'tamaño',
            marca: 'marca',
            línea: 'línea',
            modelo: 'modelo',
            'configuración': 'configuración',
            'posición': 'posición',
            'cuerpos': 'cuerpos',
            'orientación': 'orientación'
        };

        const paramName = paramMap[filterType] || filterType;

        if (value === null || value === undefined) {
            params.delete(paramName);
        } else {
            params.set(paramName, value);
        }

        if (filterType === 'tipo') {
            params.delete('tamaño');
            params.delete('marca');
            params.delete('línea');
            params.delete('modelo');
            params.delete('configuración');
            params.delete('posición');
            params.delete('cuerpos');
            params.delete('orientación');
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
        if (filterType === 'configuración') {
            params.delete('posición');
            params.delete('cuerpos');
            params.delete('orientación');
        }
        if (filterType === 'posición') {
            params.delete('cuerpos');
            params.delete('orientación');
        }
        if (filterType === 'cuerpos') {
            params.delete('orientación');
        }

        const newSearch = params.toString();
        const newPath = location.pathname + (newSearch ? `?${newSearch}` : '');
        navigate(newPath, { replace: true });
        
        scrollToTop();
    };

    const handleFilterChange = (filterType, value) => {
        setActiveFilters(prev => {
            const newFilters = { ...prev };
            
            if (filterType === 'tipo') {
                newFilters.tipo = value;
                newFilters.tamaño = null;
                newFilters.marca = null;
                newFilters.línea = null;
                newFilters.modelo = null;
                newFilters['configuración'] = null;
                newFilters['posición'] = null;
                newFilters['cuerpos'] = null;
                newFilters['orientación'] = null;

                const params = new URLSearchParams(location.search);
                params.delete('tamaño');
                params.delete('marca');
                params.delete('línea');
                params.delete('modelo');
                params.delete('configuración');
                params.delete('posición');
                params.delete('cuerpos');
                params.delete('orientación');

                if (value === null) {
                    params.delete('tipo');
                } else {
                    params.set('tipo', value);
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
            } else if (filterType === 'configuración') {
                if (value === null) {
                    newFilters['configuración'] = null;
                    newFilters['posición'] = null;
                    newFilters['cuerpos'] = null;
                    newFilters['orientación'] = null;
                } else {
                    newFilters['configuración'] = value;
                    newFilters['posición'] = null;
                    newFilters['cuerpos'] = null;
                    newFilters['orientación'] = null;
                }
            } else if (filterType === 'posición') {
                if (value === null) {
                    newFilters['posición'] = null;
                    newFilters['cuerpos'] = null;
                    newFilters['orientación'] = null;
                } else {
                    newFilters['posición'] = value;
                    newFilters['cuerpos'] = null;
                    newFilters['orientación'] = null;
                }
            } else if (filterType === 'cuerpos') {
                if (value === null) {
                    newFilters['cuerpos'] = null;
                    newFilters['orientación'] = null;
                } else {
                    newFilters['cuerpos'] = value;
                    newFilters['orientación'] = null;
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

    // PRIMERO: Productos filtrados por categoría (tipo) - Base
    const productosBaseFiltrados = useMemo(() => {
        if (productos.length === 0) return [];

        const categoriaActual = sub1 || activeFilters.tipo;

        if (!categoriaActual) {
            return productos;
        }

        return productos.filter(producto => {
            let cumpleTodosLosFiltros = true;

            if (categoriaActual) {
                const subcategoriaProducto = producto.subcategoría || 
                                            getProductValue(producto, 'subcategoría') || 
                                            getProductValue(producto, 'subcategoria');
                const categoriaProducto = producto.categoria || 
                                         getProductValue(producto, 'categoria') ||
                                         getProductValue(producto, 'categoría');
                
                const subcategoriaNormalizada = normalizarTexto(subcategoriaProducto);
                const categoriaNormalizada = normalizarTexto(categoriaProducto);
                const categoriaActualNormalizada = normalizarTexto(categoriaActual);
                
                if (subcategoriaNormalizada !== categoriaActualNormalizada && 
                    categoriaNormalizada !== categoriaActualNormalizada) {
                    cumpleTodosLosFiltros = false;
                }
            }

            return cumpleTodosLosFiltros;
        });
    }, [productos, sub1, activeFilters.tipo]);

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
        const params = new URLSearchParams(location.search);
        const precioMin = params.get('min');
        const precioMax = params.get('max');
        
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

    // CUARTO: Aplicar todos los demás filtros (tamaño, marca, línea, modelo, etc.)
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

            if (cumpleTodosLosFiltros && activeFilters.modelo) {
                const modeloProducto = getProductValue(producto, 'modelo');
                if (!modeloProducto || normalizarTexto(modeloProducto) !== normalizarTexto(activeFilters.modelo)) {
                    cumpleTodosLosFiltros = false;
                }
            }

            if (cumpleTodosLosFiltros && activeFilters['configuración']) {
                const valorProducto = getProductValue(producto, 'configuración');
                if (!valorProducto || normalizarTexto(valorProducto) !== normalizarTexto(activeFilters['configuración'])) {
                    cumpleTodosLosFiltros = false;
                }
            }

            if (cumpleTodosLosFiltros && activeFilters['posición']) {
                const valorProducto = getProductValue(producto, 'posición');
                if (!valorProducto || normalizarTexto(valorProducto) !== normalizarTexto(activeFilters['posición'])) {
                    cumpleTodosLosFiltros = false;
                }
            }

            if (cumpleTodosLosFiltros && activeFilters['cuerpos']) {
                const valorProducto = getProductValue(producto, 'cuerpos');
                if (!valorProducto || normalizarTexto(valorProducto) !== normalizarTexto(activeFilters['cuerpos'])) {
                    cumpleTodosLosFiltros = false;
                }
            }

            if (cumpleTodosLosFiltros && activeFilters['orientación']) {
                const valorProducto = getProductValue(producto, 'orientación');
                if (!valorProducto || normalizarTexto(valorProducto) !== normalizarTexto(activeFilters['orientación'])) {
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
            tamaños: obtenerValoresUnicos(productosConEnvios, 'tamaño'),
            'configuración': obtenerValoresUnicos(productosConEnvios, 'configuración'),
            'posición': obtenerValoresUnicos(productosConEnvios, 'posición'),
            'cuerpos': obtenerValoresUnicos(productosConEnvios, 'cuerpos'),
            'orientación': obtenerValoresUnicos(productosConEnvios, 'orientación')
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
    }, [activeFilters, envioGratisActivo, filtroSkus, orden, sub1, location.search]);

    const productosPagina = productosOrdenados.slice(startIndex, endIndex);

    const limpiarFiltros = () => {
        setActiveFilters({
            tipo: null,
            tamaño: null,
            marca: null,
            línea: null,
            modelo: null,
            'configuración': null,
            'posición': null,
            'cuerpos': null,
            'orientación': null
        });
        
        setFiltroSkus(null);
        setEnvioGratisActivo(false);
        resetPage();
        
        // Limpiar también los filtros de precio de la URL
        const params = new URLSearchParams(location.search);
        params.delete('min');
        params.delete('max');
        const newSearch = params.toString();
        const newPath = location.pathname + (newSearch ? `?${newSearch}` : '');
        navigate(newPath, { replace: true });
        
        setResetFiltersTrigger(true);
        scrollToTop();
        
        setTimeout(() => {
            setResetFiltersTrigger(false);
        }, 100);
    };

    const renderCategoriaFilters = () => {
        if (!filtrosData?.filtros) return null;
        const categorias = filtrosData.filtros.find(f => f.categorías);
        if (!categorias) return null;

        const currentPath = location.pathname;

        return (
            <div className='prds-filter-tag'>
                <div 
                    className='prds-filter-title-container'
                    onClick={() => {
                        const tag = document.querySelector('.prds-filter-tag:first-child');
                        tag?.classList.toggle('active');
                    }}
                >
                    <p className='prds-filter-title'>Categorías</p>
                    <span className="material-symbols-outlined">keyboard_arrow_down</span>
                </div>

                <div className='prds-filter-tag-results-container'>
                    <ul>
                        {categorias.categorías.map((item, index) => {
                            const finalUrl = item.ruta;
                            const currentPathNormalized = currentPath.endsWith('/') ? currentPath.slice(0, -1) : currentPath;
                            const linkPathNormalized = finalUrl.endsWith('/') ? finalUrl.slice(0, -1) : finalUrl;
                            const isActive = currentPathNormalized === linkPathNormalized;
                            
                            return (
                                <li key={index}>
                                    <Link 
                                        to={finalUrl}
                                        className={isActive ? 'active' : ''}
                                        title={`Ver productos de ${item.categoría}`}
                                        onClick={scrollToTop}
                                    >
                                        <span></span>
                                        <p>{item.categoría}</p>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>
        );
    };

    const renderFiltroDinamico = (nombreFiltro, valores, label, soloCategoria = false) => {
        if (soloCategoria && !activeFilters.tipo && !sub1) {
            return null;
        }

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

    const renderFiltrosEspecificos = () => {
        if (!filtrosData?.filtros) return null;

        const filtrosEspecificos = filtrosData.filtros.filter(f => 
            f.modelos || f.tipos || f.configuraciones || f.posiciones
        );

        if (filtrosEspecificos.length === 0) return null;

        return filtrosEspecificos.map((filtro, index) => {
            const nombreFiltro = Object.keys(filtro)[0];
            const valores = filtro[nombreFiltro];

            if (!Array.isArray(valores)) return null;

            return (
                <div key={index} className='prds-filter-tag'>
                    <div 
                        className='prds-filter-title-container'
                        onClick={(e) => {
                            const parent = e.currentTarget.closest('.prds-filter-tag');
                            parent?.classList.toggle('active');
                        }}
                    >
                        <p className='prds-filter-title'>{nombreFiltro.replace(/-/g, ' ')}</p>
                        <span className="material-symbols-outlined">keyboard_arrow_down</span>
                    </div>

                    <div className='prds-filter-tag-results-container'>
                        {valores.map((grupo, idx) => {
                            const grupoKeys = Object.keys(grupo);
                            const nombreGrupo = grupoKeys[0];
                            let opciones = grupo[nombreGrupo];

                            if (!Array.isArray(opciones)) {
                                opciones = opciones ? [opciones] : [];
                            }

                            const opcionesDisponibles = opciones.filter(opcion => {
                                let valorOpcion = opcion;
                                if (typeof opcion === 'object' && opcion !== null) {
                                    const opcionKeys = Object.keys(opcion);
                                    if (opcionKeys.length > 0) {
                                        valorOpcion = opcion[opcionKeys[0]];
                                    }
                                }
                                
                                const stateKey = nombreFiltro === 'modelos' ? 'modelo' : 
                                               nombreFiltro === 'tipos' ? 'tipo' : 
                                               nombreFiltro === 'configuraciones' ? 'configuración' : 
                                               nombreFiltro === 'posiciones' ? 'posición' : nombreFiltro;
                                const valoresDisponibles = obtenerValoresUnicos(productosConEnvios, stateKey);
                                return valoresDisponibles.includes(valorOpcion);
                            });

                            if (opcionesDisponibles.length === 0) return null;

                            return (
                                <div key={idx} className='filter-subgroup'>
                                    <p className='filter-subgroup-title'>{nombreGrupo}</p>
                                    <ul>
                                        {opcionesDisponibles.map((opcion, mIdx) => {
                                            let valorOpcion = opcion;
                                            if (typeof opcion === 'object' && opcion !== null) {
                                                const opcionKeys = Object.keys(opcion);
                                                if (opcionKeys.length > 0) {
                                                    valorOpcion = opcion[opcionKeys[0]];
                                                }
                                            }
                                            
                                            const stateKey = nombreFiltro === 'modelos' ? 'modelo' : 
                                                           nombreFiltro === 'tipos' ? 'tipo' : 
                                                           nombreFiltro === 'configuraciones' ? 'configuración' : 
                                                           nombreFiltro === 'posiciones' ? 'posición' : nombreFiltro;
                                            const isActive = activeFilters[stateKey] === valorOpcion;
                                            
                                            return (
                                                <li key={mIdx}>
                                                    <button 
                                                        type='button'
                                                        className={isActive ? 'active' : ''}
                                                        onClick={() => {
                                                            toggleFiltro(stateKey, isActive ? null : valorOpcion);
                                                        }}
                                                    >
                                                        <span></span>
                                                        <p>{valorOpcion}</p>
                                                    </button>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            );
                        })}
                    </div>
                </div>
            );
        });
    };

    if (id || (sub5 && !isNaN(sub5))) {
        return null;
    }

    return(
        <>
            <Helmet>
                <title>Sofás | Homesleep</title>
                <meta name='description' content='Encuentra el sofá perfecto para tu hogar. Contamos con butacas, juegos de sala, mecedoras, reclinables, seccionales y sofá cama.' />
            </Helmet>

            <main className='products-page-main d-flex-column gap-10'>
                <Categorias/>

                <div className='products-page-blocks'>
                    <div className={`products-page-left ${isFiltersOpen ? 'active' : ''}`} ref={filtersPanelRef}>
                        <div className='products-page-filters-container-global'>
                            <div className='d-flex-column gap-20-to-10'>
                                <div className='hp-cat-title'>
                                    <h1>Sofás</h1>
                                    <p className='text'>Encuentra el sofá ideal para tu espacio, en las mejores marcas del mercado</p>
                                </div>

                                {/* <BtnGeneral 
                                    onEnvioGratisChange={handleEnvioGratis}
                                    onFiltroSkusChange={handleFiltroSkus}
                                    envioGratisActivo={envioGratisActivo}
                                    currentPage={currentPage}
                                    setCurrentPage={setCurrentPage}
                                    resetFilters={resetFiltersTrigger}
                                /> */}

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
                                        {renderCategoriaFilters()}
                                        {renderFiltroDinamico('marca', valoresDisponibles.marcas, 'Marcas')}
                                        {renderFiltroDinamico('tamaño', valoresDisponibles.tamaños, 'Tamaños')}
                                        {renderFiltroDinamico('línea', valoresDisponibles.líneas, 'Líneas')}
                                        {renderFiltroDinamico('configuración', valoresDisponibles['configuración'], 'Configuración')}
                                        {renderFiltroDinamico('posición', valoresDisponibles['posición'], 'Posición')}
                                        {renderFiltroDinamico('cuerpos', valoresDisponibles['cuerpos'], 'Cuerpos')}
                                        {renderFiltroDinamico('orientación', valoresDisponibles['orientación'], 'Orientación')}
                                        {renderFiltrosEspecificos()}
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
                                    <p>Cargando productos...</p>
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

export default Sofas;
