import { useEffect, useState, useMemo, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';

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

const ORDEN_FILTROS = [
    'tamaño',
    'marca',
    'tipo-de-cabecera',
    'diseño-de-cabecera',
    'brazos-de-cabecera'
];

function Cabeceras() {
    const { sub1, sub2, sub3, sub4 } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filtrosData, setFiltrosData] = useState(null);
    const [orden, setOrden] = useState("ultimo");
    const [viewMode, setViewMode] = useState(() => {
        const savedMode = localStorage.getItem('viewModeCabeceras');
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
        'tipo-de-cabecera': null,
        'diseño-de-cabecera': null,
        'brazos-de-cabecera': null
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
        'tipo-de-cabecera': 'tipo-de-cabecera',
        'diseño-de-cabecera': 'diseño-de-cabecera',
        'brazos-de-cabecera': 'brazos-de-cabecera'
    };

    const filtroAJsonKey = {
        'tamaño': 'tamaño',
        'marca': 'marcas',
        'tipo-de-cabecera': 'tipos-de-cabecera',
        'diseño-de-cabecera': 'diseños-de-cabecera',
        'brazos-de-cabecera': 'brazos-de-cabecera'
    };

    const filtroLabels = {
        'tamaño': 'Tamaños',
        'marca': 'Marcas',
        'tipo-de-cabecera': 'Tipo de Cabecera',
        'diseño-de-cabecera': 'Diseño de Cabecera',
        'brazos-de-cabecera': 'Brazos de Cabecera'
    };

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

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const hasPriceFilter = params.has('min') || params.has('max');
        const hasOtherFilters = activeFilters.tipo || activeFilters.tamaño || 
                               activeFilters.marca || activeFilters.línea || 
                               activeFilters.modelo || activeFilters['tipo-de-cabecera'] || 
                               activeFilters['diseño-de-cabecera'] || activeFilters['brazos-de-cabecera'] || 
                               filtroSkus || envioGratisActivo;
        
        setHasActiveFilters(hasPriceFilter || hasOtherFilters);
    }, [activeFilters, filtroSkus, envioGratisActivo, location.search]);

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
        localStorage.setItem('viewModeCabeceras', viewMode);
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
        if (sub4) {
            const rutaProducto = `/productos/cabeceras/${sub1}/${sub2}/${sub3}/${sub4}`;
            navigate(rutaProducto, { replace: true });
        }
    }, [sub4, sub1, sub2, sub3, navigate]);

    useEffect(() => {
        if (sub4) return;

        const cargarProductosCabeceras = async () => {
            try {
                setLoading(true);

                const manifestResponse = await fetch('/assets/json/manifest.json');
                const manifestData = await manifestResponse.json();
                const archivos = manifestData.files || [];

                let archivosProductos = archivos.filter(url =>
                    url.startsWith('/assets/json/categorias/cabeceras/')
                );

                if (sub1) {
                    archivosProductos = archivosProductos.filter(
                        url => url.includes(`/cabeceras/${sub1}/`)
                    );
                }

                if (sub2) {
                    archivosProductos = archivosProductos.filter(
                        url => url.includes(`/cabeceras/${sub1}/${sub2}/`)
                    );
                }

                if (sub3) {
                    archivosProductos = archivosProductos.filter(
                        url => url.includes(`/cabeceras/${sub1}/${sub2}/${sub3}.json`)
                    );
                }

                const productosPromesas = archivosProductos.map(async (url) => {
                    const response = await fetch(url);
                    const data = await response.json();

                    const productosConFicha = data.productos?.map(producto => ({
                        ...producto,
                        fichaTecnica: data.ficha?.[0] || {}
                    })) || [];
                    
                    return productosConFicha;
                });

                const productosPorArchivo = await Promise.all(productosPromesas);
                const todosProductos = productosPorArchivo.flat();

                setProductos(todosProductos);
                setLoading(false);
            } catch (error) {
                console.error("Error cargando productos de cabeceras:", error);
                setLoading(false);
            }
        };

        cargarProductosCabeceras();
    }, [sub1, sub2, sub3, sub4]);

    useEffect(() => {
        if (sub4) return;

        const cargarFiltros = async () => {
            try {
                const response = await fetch('/assets/json/categorias/cabeceras/filtros.json');
                const data = await response.json();
                setFiltrosData(data);
            } catch (error) {
                console.error("Error cargando filtros:", error);
            }
        };

        cargarFiltros();
    }, [sub4]);

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
            'tipo-de-cabecera': ['tipo-de-cabecera', 'tipo-cabecera', 'cabecera', 'tipo'],
            'diseño-de-cabecera': ['diseño-de-cabecera', 'diseno-de-cabecera', 'diseño', 'diseno', 'diseño-cabecera'],
            'brazos-de-cabecera': ['brazos-de-cabecera', 'brazos-cabecera', 'brazos', 'brazo']
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
            'tipo-de-cabecera': 'tipo-de-cabecera',
            'diseño-de-cabecera': 'diseño-de-cabecera',
            'brazos-de-cabecera': 'brazos-de-cabecera'
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
            params.delete('tipo-de-cabecera');
            params.delete('diseño-de-cabecera');
            params.delete('brazos-de-cabecera');
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
        if (filterType === 'tipo-de-cabecera') {
            params.delete('diseño-de-cabecera');
            params.delete('brazos-de-cabecera');
        }
        if (filterType === 'diseño-de-cabecera') {
            params.delete('brazos-de-cabecera');
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
                newFilters['tipo-de-cabecera'] = null;
                newFilters['diseño-de-cabecera'] = null;
                newFilters['brazos-de-cabecera'] = null;

                const params = new URLSearchParams(location.search);
                params.delete('tamaño');
                params.delete('marca');
                params.delete('línea');
                params.delete('modelo');
                params.delete('tipo-de-cabecera');
                params.delete('diseño-de-cabecera');
                params.delete('brazos-de-cabecera');

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
            } else if (filterType === 'tipo-de-cabecera') {
                if (value === null) {
                    newFilters['tipo-de-cabecera'] = null;
                    newFilters['diseño-de-cabecera'] = null;
                    newFilters['brazos-de-cabecera'] = null;
                } else {
                    newFilters['tipo-de-cabecera'] = value;
                    newFilters['diseño-de-cabecera'] = null;
                    newFilters['brazos-de-cabecera'] = null;
                }
            } else if (filterType === 'diseño-de-cabecera') {
                if (value === null) {
                    newFilters['diseño-de-cabecera'] = null;
                    newFilters['brazos-de-cabecera'] = null;
                } else {
                    newFilters['diseño-de-cabecera'] = value;
                    newFilters['brazos-de-cabecera'] = null;
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

    // ============================================================
    // Aplicar TODOS los filtros activos (para mostrar productos)
    // ============================================================
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

            if (cumpleTodosLosFiltros && activeFilters['tipo-de-cabecera']) {
                const valorProducto = getProductValue(producto, 'tipo-de-cabecera');
                if (!valorProducto || normalizarTexto(valorProducto) !== normalizarTexto(activeFilters['tipo-de-cabecera'])) {
                    cumpleTodosLosFiltros = false;
                }
            }

            if (cumpleTodosLosFiltros && activeFilters['diseño-de-cabecera']) {
                const valorProducto = getProductValue(producto, 'diseño-de-cabecera');
                if (!valorProducto || normalizarTexto(valorProducto) !== normalizarTexto(activeFilters['diseño-de-cabecera'])) {
                    cumpleTodosLosFiltros = false;
                }
            }

            if (cumpleTodosLosFiltros && activeFilters['brazos-de-cabecera']) {
                const valorProducto = getProductValue(producto, 'brazos-de-cabecera');
                if (!valorProducto || normalizarTexto(valorProducto) !== normalizarTexto(activeFilters['brazos-de-cabecera'])) {
                    cumpleTodosLosFiltros = false;
                }
            }

            return cumpleTodosLosFiltros;
        });
    }, [productosFiltradosPorPrecio, activeFilters]);

    // ============================================================
    // Productos filtrados EXCLUYENDO el filtro actual Y TODOS los
    // filtros posteriores en la jerarquía (para calcular opciones)
    // ============================================================
    const productosParaCalcularOpciones = (nombreFiltro) => {
        if (productosFiltradosPorPrecio.length === 0) return [];

        // Índice del filtro actual en la jerarquía
        const indexActual = ORDEN_FILTROS.indexOf(nombreFiltro);

        // Filtros a aplicar: solo los que están ANTES del filtro actual
        const filtrosAAplicar = indexActual === -1 
            ? [] 
            : ORDEN_FILTROS.slice(0, indexActual);

        return productosFiltradosPorPrecio.filter(producto => {
            let cumpleTodosLosFiltros = true;

            // Aplicar solo los filtros anteriores en la jerarquía
            for (const filtro of filtrosAAplicar) {
                if (!cumpleTodosLosFiltros) break;

                const valorFiltro = activeFilters[filtro];
                if (!valorFiltro) continue;

                const valorProducto = getProductValue(producto, filtro);
                if (!valorProducto || normalizarTexto(valorProducto) !== normalizarTexto(valorFiltro)) {
                    cumpleTodosLosFiltros = false;
                }
            }

            return cumpleTodosLosFiltros;
        });
    };

    // ============================================================
    // Obtener valores disponibles desde el JSON, aplicando solo
    // los filtros ANTERIORES en la jerarquía
    // ============================================================
    const obtenerValoresDisponiblesDesdeJSON = (nombreFiltro) => {
        if (!filtrosData?.filtros) return [];

        const claveJson = filtroAJsonKey[nombreFiltro] || nombreFiltro;
        const filtroJson = filtrosData.filtros.find(f => f[claveJson]);

        if (!filtroJson) return [];

        const valores = filtroJson[claveJson];
        if (!Array.isArray(valores)) return [];

        const valoresJson = valores.map(item => {
            if (typeof item === 'object' && item !== null) {
                const keys = Object.keys(item);
                if (keys.length === 0) return null;
                const keyValor = keys.find(k => k !== 'ruta') || keys[0];
                return item[keyValor];
            }
            return item;
        }).filter(v => v !== null && v !== undefined && v !== '' && v !== 'Ver todos');

        // Productos que cumplen solo los filtros ANTERIORES
        const productosRelevantes = productosParaCalcularOpciones(nombreFiltro);

        const valoresDisponibles = obtenerValoresUnicos(productosRelevantes, nombreFiltro);
        const disponiblesNormalizados = valoresDisponibles.map(v => normalizarTexto(v));

        return valoresJson.filter(valor => {
            const valorNormalizado = normalizarTexto(valor);
            return disponiblesNormalizados.includes(valorNormalizado);
        });
    };

    const renderFiltrosDesdeJSON = () => {
        if (!filtrosData?.filtros) return null;

        return filtrosData.filtros.map((filtroObj, index) => {
            const claveJson = Object.keys(filtroObj)[0];
            if (claveJson === 'categorías') return null;

            const nombreFiltro = Object.entries(filtroAJsonKey).find(
                ([, jsonKey]) => jsonKey === claveJson
            )?.[0];

            if (!nombreFiltro) return null;

            const valores = obtenerValoresDisponiblesDesdeJSON(nombreFiltro);
            const label = filtroLabels[nombreFiltro] || nombreFiltro.replace(/-/g, ' ');

            if (valores.length === 0) return null;

            return (
                <div key={index}>
                    {renderFiltroDinamico(nombreFiltro, valores, label)}
                </div>
            );
        });
    };

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
            'tipo-de-cabecera': null,
            'diseño-de-cabecera': null,
            'brazos-de-cabecera': null
        });
        
        setFiltroSkus(null);
        setEnvioGratisActivo(false);
        resetPage();

        navigate('/productos/cabeceras/', { replace: true });

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
            f.modelos || f.diseños || f.estilos
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

                            if (opciones.length === 0) return null;

                            return (
                                <div key={idx} className='filter-subgroup'>
                                    <p className='filter-subgroup-title'>{nombreGrupo}</p>
                                    <ul>
                                        {opciones.map((opcion, mIdx) => {
                                            let valorOpcion = opcion;
                                            if (typeof opcion === 'object' && opcion !== null) {
                                                const opcionKeys = Object.keys(opcion);
                                                if (opcionKeys.length > 0) {
                                                    valorOpcion = opcion[opcionKeys[0]];
                                                }
                                            }
                                            
                                            const stateKey = nombreFiltro === 'modelos' ? 'modelo' : 
                                                           nombreFiltro === 'diseños' ? 'diseño-de-cabecera' : 
                                                           nombreFiltro === 'estilos' ? 'estilo' : nombreFiltro;
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

    if (sub4) {
        return null;
    }

    return(
        <>
            <Helmet>
                <title>Cabeceras | Homesleep</title>
                <meta name='description' content='Encuentra la cabecera perfecta para tu cama. Contamos con una gran variedad en diseños, estilos y tamaños.' />
            </Helmet>

            <main className='products-page-main d-flex-column gap-10'>
                <Categorias/>

                <div className='products-page-blocks'>
                    <div className={`products-page-left ${isFiltersOpen ? 'active' : ''}`} ref={filtersPanelRef}>
                        <div className='products-page-filters-container-global'>
                            <div className='d-flex-column gap-20-to-10'>
                                <div className='hp-cat-title'>
                                    <h1>Cabeceras</h1>
                                    <p className='text'>Encuentra la cabecera ideal para tu espacio, en las mejores marcas del mercado</p>
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
                                        {renderCategoriaFilters()}
                                        {renderFiltrosDesdeJSON()}
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
                                                <Producto key={producto.sku} producto={producto} />
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
                                                            <button type='button' className={`pagination-page ${currentPage === page ? 'active' : ''}`} onClick={() => handlePageChange(page)}>
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

export default Cabeceras;
