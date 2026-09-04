// import { useEffect, useState, useMemo, useRef } from 'react';
// import { Helmet } from 'react-helmet';
// import { useParams, useLocation, useNavigate } from 'react-router-dom';

// import '../Productos.css';
// import './Layout.css';

// import Categorias from '../Componentes/Categorias/Categorias';
// import FiltrosTop from '../Componentes/FiltrosTop/FiltrosTop';
// import { Producto } from '../../../Componentes/Plantillas/Producto/Producto';
// import RangoPrecios from '../Componentes/RangoPrecios/RangoPrecios';

// // ============ UTILIDADES ============
// const normalizarTexto = (texto) => {
//     if (!texto || typeof texto !== 'string') {
//         return '';
//     }
//     return texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
// };

// // ============ FUNCIONES DE FILTRADO DINÁMICO ============

// // Obtener valor de un producto por campo (busca en múltiples ubicaciones)
// const getProductValue = (product, fieldName) => {
//     if (!product) return null;

//     const variants = new Set();

//     variants.add(fieldName);
//     variants.add(fieldName.toLowerCase());
//     variants.add(fieldName.toUpperCase());
//     variants.add(fieldName.replace(/-/g, ' '));
//     variants.add(fieldName.replace(/ /g, '-'));
//     variants.add(fieldName.replace(/ /g, '_'));

//     // Variaciones plurales
//     if (fieldName.endsWith('ón')) {
//         variants.add(fieldName.slice(0, -1) + 'es');
//     } else if (fieldName.endsWith('or')) {
//         variants.add(fieldName + 's');
//         variants.add(fieldName.toLowerCase() + 's');
//     } else if (fieldName.endsWith('e')) {
//         variants.add(fieldName.slice(0, -1) + 'as');
//         variants.add(fieldName.toLowerCase().slice(0, -1) + 'as');
//     } else if (fieldName.endsWith('a') || fieldName.endsWith('o')) {
//         variants.add(fieldName + 's');
//         variants.add(fieldName.toLowerCase() + 's');
//     } else if (fieldName.endsWith('l')) {
//         variants.add(fieldName + 'es');
//         variants.add(fieldName.toLowerCase() + 'es');
//     } else {
//         variants.add(fieldName + 's');
//         variants.add(fieldName.toLowerCase() + 's');
//     }

//     // Variaciones con guiones y espacios
//     const newVariants = new Set(variants);
//     variants.forEach(v => {
//         newVariants.add(v.replace(/ /g, '-'));
//         newVariants.add(v.replace(/-/g, ' '));
//     });

//     // Mapeo de campos específicos
//     const fieldMappings = {
//         'lineaDormitorio': ['línea-de-dormitorio', 'linea-de-dormitorio', 'linea-dormitorio', 'línea-dormitorio', 'línea'],
//         'lineaColchon': [
//             'línea-de-colchón', 
//             'linea-colchon', 
//             'linea-colchón', 
//             'línea-de-colchones', 
//             'linea-colchones',
//             'línea-de-colchon'
//         ],
//         'resorte': ['resorte', 'resortes', 'tipo-de-resorte', 'tipo-resorte'],
//         'modelo': ['modelo', 'modelos', 'modelo-de-colchón', 'modelo-de-colchones', 'modelo-de-colchon'],
//         'tipoCabecera': ['tipo-de-cabecera', 'tipo-cabecera', 'tipo-de-cabeceras'],
//         'diseñoCabecera': ['diseño-de-cabecera', 'diseño-cabecera', 'diseños-de-cabecera'],
//         'cajon': ['cajón', 'cajon', 'cajones', 'tiene-cajon', 'tiene-cajón'],
//         'cantidadCajones': ['cantidad-de-cajones', 'cantidad-cajones', 'cantidad-de-cajon', 'cantidad de cajones'],
//         'baul': ['baúl', 'baul'],
//         'piecera': ['piecera'],
//         'tamaño': ['tamaño', 'tamano', 'size'],
//         'marca': ['marca', 'brand'],
//         'línea': ['línea', 'linea', 'line']
//     };

//     let keysToSearch = new Set();

//     if (fieldMappings[fieldName]) {
//         fieldMappings[fieldName].forEach(key => keysToSearch.add(key));
//     } else {
//         newVariants.forEach(v => keysToSearch.add(v));
//     }

//     // Buscar en el producto directamente
//     for (const key of keysToSearch) {
//         if (product[key] !== undefined && product[key] !== null && product[key] !== '') {
//             const value = product[key];
//             return typeof value === 'string' ? value : String(value);
//         }
//     }

//     // Buscar en detalles-del-producto
//     if (product['detalles-del-producto'] && product['detalles-del-producto'].length > 0) {
//         const detalles = product['detalles-del-producto'][0];
//         for (const key of keysToSearch) {
//             if (detalles[key] !== undefined && detalles[key] !== null && detalles[key] !== '') {
//                 const value = detalles[key];
//                 return typeof value === 'string' ? value : String(value);
//             }
//         }
//     }

//     // Buscar en fichaTecnica
//     if (product.fichaTecnica) {
//         for (const key of keysToSearch) {
//             if (product.fichaTecnica[key] !== undefined && product.fichaTecnica[key] !== null && product.fichaTecnica[key] !== '') {
//                 const value = product.fichaTecnica[key];
//                 return typeof value === 'string' ? value : String(value);
//             }
//         }
//     }

//     // Búsqueda flexible por coincidencia de claves
//     for (const key of Object.keys(product)) {
//         const keyLower = key.toLowerCase().replace(/[^a-z0-9]/g, '');
//         for (const searchKey of keysToSearch) {
//             const searchLower = searchKey.toLowerCase().replace(/[^a-z0-9]/g, '');
//             if (keyLower === searchLower || keyLower.includes(searchLower) || searchLower.includes(keyLower)) {
//                 if (product[key] !== undefined && product[key] !== null && product[key] !== '') {
//                     const value = product[key];
//                     return typeof value === 'string' ? value : String(value);
//                 }
//             }
//         }
//     }

//     return null;
// };

// // Comparar marcas con manejo especial
// const compararMarcas = (marcaProducto, marcaFiltro) => {
//     if (!marcaProducto || !marcaFiltro) return false;

//     const marcaProductoNormalizado = normalizarTexto(marcaProducto);
//     const marcaFiltroNormalizado = normalizarTexto(marcaFiltro);

//     if (marcaFiltroNormalizado === 'kamas') {
//         return marcaProductoNormalizado === 'kamas';
//     }

//     if (marcaFiltroNormalizado === 'komfort') {
//         return marcaProductoNormalizado.includes('komfort');
//     }

//     if (marcaFiltroNormalizado === 'paraiso') {
//         return marcaProductoNormalizado.includes('paraiso');
//     }

//     if (marcaFiltroNormalizado === 'el-cisne') {
//         return marcaProductoNormalizado.includes('el-cisne');
//     }

//     return marcaProductoNormalizado === marcaFiltroNormalizado;
// };

// // Obtener líneas permitidas por marca
// const getLineasDormitorioByMarca = (marca) => {
//     const marcaNormalizada = normalizarTexto(marca);
//     const excepciones = {
//         'kamas': {
//             lineasPermitidas: ['americanos', 'europeos', 'circulares', 'nube', 'clásicos']
//         },
//         'paraiso': {
//             lineasPermitidas: ['americanos', 'europeos']
//         },
//         'el-cisne': {
//             lineasPermitidas: ['americanos', 'europeos']
//         },
//         'komfort': {
//             lineasPermitidas: ['americanos']
//         }
//     };

//     if (excepciones[marcaNormalizada]) {
//         return excepciones[marcaNormalizada].lineasPermitidas;
//     }

//     return null;
// };

// // ============ COMPONENTE PRINCIPAL ============
// function Dormitorios() {
//     const { sub1, sub2, sub3, sub4, sub5 } = useParams();
//     const location = useLocation();
//     const navigate = useNavigate();
    
//     // ============ ESTADOS ============
//     const [productos, setProductos] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [filtrosData, setFiltrosData] = useState(null);
//     const [orden, setOrden] = useState("ultimo");
//     const queryParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
//     const [isFiltersOpen, setIsFiltersOpen] = useState(false);
//     const filtersPanelRef = useRef(null);
//     const itemsPerPage = 48;
//     const [viewMode, setViewMode] = useState(() => {
//         const savedMode = localStorage.getItem('viewMode');
//         return savedMode || 'grid';
//     });

//     // Estado de filtros activos
//     const [activeFilters, setActiveFilters] = useState({
//         tamaño: null,
//         marca: null,
//         lineaDormitorio: null,
//         resorte: null,
//         lineaColchon: null,
//         modelo: null,
//         tipoCabecera: null,
//         diseñoCabecera: null,
//         cajon: null,
//         cantidadCajones: null,
//         baul: null,
//         piecera: null
//     });

//     const [envioGratisActivo, setEnvioGratisActivo] = useState(false);
//     const [isHotSaleActive, setIsHotSaleActive] = useState(() => {
//         const saved = localStorage.getItem('hotSaleActive');
//         return saved === 'true';
//     });
//     const [hotSaleSKUs, setHotSaleSKUs] = useState([]);
//     const [resetFiltersTrigger, setResetFiltersTrigger] = useState(false);
//     const [hasActiveFilters, setHasActiveFilters] = useState(false);
//     const [currentPage, setCurrentPage] = useState(1);

//     // ============ MAPEOS DE FILTROS ============
//     const filterParamMap = {
//         'tamaño': 'tamaño',
//         'marca': 'marca',
//         'linea-dormitorio': 'lineaDormitorio',
//         'resorte': 'resorte',
//         'linea-colchon': 'lineaColchon',
//         'modelo': 'modelo',
//         'tipo-cabecera': 'tipoCabecera',
//         'diseño-cabecera': 'diseñoCabecera',
//         'cajon': 'cajon',
//         'cantidad-cajones': 'cantidadCajones',
//         'baul': 'baul',
//         'piecera': 'piecera'
//     };

//     const paramMap = {
//         tamaño: 'tamaño',
//         marca: 'marca',
//         lineaDormitorio: 'linea-dormitorio',
//         resorte: 'resorte',
//         lineaColchon: 'linea-colchon',
//         modelo: 'modelo',
//         tipoCabecera: 'tipo-cabecera',
//         diseñoCabecera: 'diseño-cabecera',
//         cajon: 'cajon',
//         cantidadCajones: 'cantidad-cajones',
//         baul: 'baul',
//         piecera: 'piecera'
//     };

//     const filtrosDependientesDeLineaDormitorio = [
//         'resorte', 'lineaColchon', 'modelo', 'tipoCabecera', 
//         'diseñoCabecera', 'cajon', 'cantidadCajones', 'baul', 'piecera'
//     ];

//     const ordenFiltrosInferiores = [
//         'resorte', 'lineaColchon', 'modelo', 'tipoCabecera', 
//         'diseñoCabecera', 'cajon', 'cantidadCajones', 'baul', 'piecera'
//     ];

//     // ============ EFFECTS ============
    
//     // Sincronizar filtros desde URL
//     useEffect(() => {
//         const params = new URLSearchParams(location.search);
//         const newActiveFilters = { ...activeFilters };
//         let hasChanges = false;

//         Object.entries(filterParamMap).forEach(([paramKey, stateKey]) => {
//             const value = params.get(paramKey);
//             if (value !== null) {
//                 newActiveFilters[stateKey] = value;
//                 hasChanges = true;
//             } else if (newActiveFilters[stateKey] !== null) {
//                 newActiveFilters[stateKey] = null;
//                 hasChanges = true;
//             }
//         });

//         if (hasChanges) {
//             setActiveFilters(newActiveFilters);
//         }
//     }, [location.search]);

//     // Detectar filtros activos
//     useEffect(() => {
//         const params = new URLSearchParams(location.search);
//         const hasPriceFilter = params.has('min') || params.has('max');
//         const hasOtherFilters = Object.values(activeFilters).some(v => v !== null) ||
//                                envioGratisActivo || isHotSaleActive;
        
//         setHasActiveFilters(hasPriceFilter || hasOtherFilters);
//     }, [activeFilters, envioGratisActivo, isHotSaleActive, location.search]);

//     // Cerrar filtros al hacer click fuera
//     useEffect(() => {
//         const handleClickOutside = (event) => {
//             if (filtersPanelRef.current && 
//                 !filtersPanelRef.current.contains(event.target) &&
//                 !event.target.closest('.filters-button-open')) {
//                 setIsFiltersOpen(false);
//             }
//         };

//         document.addEventListener('mousedown', handleClickOutside);
//         return () => {
//             document.removeEventListener('mousedown', handleClickOutside);
//         };
//     }, []);

//     // Cargar Hot Sale SKUs
//     useEffect(() => {
//         const cargarHotSaleSKUs = async () => {
//             try {
//                 const response = await fetch('/assets/json/mas-vendidos.json');
//                 const skus = await response.json();
//                 setHotSaleSKUs(skus);
//             } catch (error) {
//                 console.error("Error cargando mas-vendidos.json:", error);
//                 setHotSaleSKUs([]);
//             }
//         };
        
//         cargarHotSaleSKUs();
//     }, []);

//     // Verificar si hay sub5 y redirigir a PaginaProducto
//     useEffect(() => {
//         if (sub5) {
//             const rutaProducto = `/productos/dormitorios/${sub1}/${sub2}/${sub3}/${sub4}/${sub5}/`;
//             navigate(rutaProducto, { replace: true });
//         }
//     }, [sub5, sub1, sub2, sub3, sub4, navigate]);

//     // ============ FUNCIONES DE CARGA ============
    
//     const construirRutaProducto = (producto) => {
//         const detalles = producto["detalles-del-producto"]?.[0] || {};
        
//         let tamaño = getProductValue(producto, 'tamaño') || '';
//         tamaño = normalizarTexto(tamaño);
        
//         let marca = getProductValue(producto, 'marca') || '';
//         marca = normalizarTexto(marca);
        
//         let modelo = getProductValue(producto, 'modelo') || '';
//         modelo = normalizarTexto(modelo);
        
//         let linea = getProductValue(producto, 'lineaDormitorio') || '';
//         linea = normalizarTexto(linea);
        
//         const sku = producto.sku || '';

//         return `/productos/dormitorios/${tamaño}/${marca}/${modelo}/${linea}/${sku}/`;
//     };

//     const obtenerArchivosJSONEnCarpeta = async (carpeta) => {
//         try {
//             const manifestResponse = await fetch('/assets/json/manifest.json');
//             const manifestData = await manifestResponse.json();
//             const archivos = manifestData.files || [];

//             const carpetaNormalizada = carpeta.replace(/^\//, '');
            
//             const archivosFiltrados = archivos.filter(url => {
//                 const urlNormalizada = url.replace(/^\//, '');
//                 return urlNormalizada.startsWith(carpetaNormalizada) && urlNormalizada.endsWith('.json');
//             });

//             return archivosFiltrados;
//         } catch (error) {
//             console.error("Error cargando manifest.json:", error);
//             return [];
//         }
//     };

//     const cargarProductosPorRuta = async (sub1, sub2, sub3, sub4) => {
//         try {
//             setLoading(true);
//             console.log('=== CARGANDO DORMITORIOS (con filtros dinámicos) ===');
//             console.log('sub1 (tamaño):', sub1);
//             console.log('sub2 (marca):', sub2);
//             console.log('sub3 (modelo):', sub3);
//             console.log('sub4 (línea):', sub4);

//             let archivosJSON = [];

//             // Estrategia 1: Usar manifest.json
//             try {
//                 let carpeta = '/assets/json/categorias/dormitorios';
//                 if (sub1) carpeta += `/${sub1}`;
//                 if (sub2) carpeta += `/${sub2}`;
//                 if (sub3) carpeta += `/${sub3}`;
//                 if (sub4) carpeta += `/${sub4}`;

//                 console.log('Buscando archivos en carpeta:', carpeta);
//                 archivosJSON = await obtenerArchivosJSONEnCarpeta(carpeta);
                
//                 if (archivosJSON.length > 0) {
//                     console.log('Usando manifest.json, archivos encontrados:', archivosJSON.length);
//                 } else {
//                     console.log('No se encontraron archivos en manifest');
//                     archivosJSON = [];
//                 }
//             } catch (error) {
//                 console.log('Error con manifest:', error);
//                 archivosJSON = [];
//             }

//             // Estrategia 2: Si no hay archivos, usar estructura con filtros dinámicos
//             if (archivosJSON.length === 0) {
//                 console.log('Usando estrategia por estructura');
//                 // Buscar todos los archivos en la carpeta dormitorios
//                 const todosArchivos = await obtenerArchivosJSONEnCarpeta('/assets/json/categorias/dormitorios');
                
//                 // Filtrar por sub1 (tamaño) si existe
//                 if (sub1) {
//                     archivosJSON = todosArchivos.filter(url => {
//                         const partes = url.split('/');
//                         const tamañoIndex = partes.indexOf('dormitorios') + 1;
//                         return partes[tamañoIndex] === sub1;
//                     });
//                 } else {
//                     archivosJSON = todosArchivos;
//                 }

//                 // Filtrar por sub2 (marca) si existe
//                 if (sub2 && archivosJSON.length > 0) {
//                     archivosJSON = archivosJSON.filter(url => {
//                         const partes = url.split('/');
//                         const marcaIndex = partes.indexOf('dormitorios') + 2;
//                         return partes[marcaIndex] === sub2;
//                     });
//                 }

//                 // Filtrar por sub3 (modelo) si existe
//                 if (sub3 && archivosJSON.length > 0) {
//                     archivosJSON = archivosJSON.filter(url => {
//                         const partes = url.split('/');
//                         const modeloIndex = partes.indexOf('dormitorios') + 3;
//                         return partes[modeloIndex] === sub3;
//                     });
//                 }

//                 // Filtrar por sub4 (línea) si existe
//                 if (sub4 && archivosJSON.length > 0) {
//                     archivosJSON = archivosJSON.filter(url => {
//                         const partes = url.split('/');
//                         const lineaIndex = partes.indexOf('dormitorios') + 4;
//                         return partes[lineaIndex] === sub4;
//                     });
//                 }
//             }

//             console.log('Archivos a cargar:', archivosJSON.length);
//             if (archivosJSON.length > 0) {
//                 console.log('Ejemplos:', archivosJSON.slice(0, 3));
//             }

//             if (archivosJSON.length === 0) {
//                 console.warn('No se encontraron archivos para la ruta');
//                 setProductos([]);
//                 setLoading(false);
//                 return [];
//             }

//             // Cargar cada archivo JSON
//             const productosPromesas = archivosJSON.map(async (url) => {
//                 try {
//                     const response = await fetch(url);
//                     if (!response.ok) return [];
//                     const data = await response.json();
                    
//                     // Agregar ficha técnica a cada producto
//                     const productosConFicha = data.productos?.map(producto => ({
//                         ...producto,
//                         fichaTecnica: data.ficha?.[0] || {}
//                     })) || [];
                    
//                     return productosConFicha;
//                 } catch (error) {
//                     console.error(`Error cargando ${url}:`, error);
//                     return [];
//                 }
//             });

//             const productosPorArchivo = await Promise.all(productosPromesas);
//             let todosProductos = productosPorArchivo.flat();
            
//             console.log('Productos sin procesar:', todosProductos.length);

//             // Asignar rutas a cada producto
//             todosProductos = todosProductos.map(producto => {
//                 const ruta = construirRutaProducto(producto);
//                 return {
//                     ...producto,
//                     ruta: ruta
//                 };
//             });
            
//             console.log(`Total de productos cargados: ${todosProductos.length}`);
//             if (todosProductos.length > 0) {
//                 console.log('Primer producto:', {
//                     nombre: todosProductos[0].nombre,
//                     sku: todosProductos[0].sku,
//                     ruta: todosProductos[0].ruta
//                 });
//             }
            
//             return todosProductos;
//         } catch (error) {
//             console.error("Error cargando productos:", error);
//             return [];
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Cargar productos según la URL actual
//     useEffect(() => {
//         if (sub5) {
//             setProductos([]);
//             setLoading(false);
//             return;
//         }

//         const cargarProductos = async () => {
//             const productosCargados = await cargarProductosPorRuta(sub1, sub2, sub3, sub4);
//             setProductos(productosCargados);
//             setCurrentPage(1);
//         };

//         cargarProductos();
//     }, [sub1, sub2, sub3, sub4, sub5]);

//     // Cargar filtros
//     useEffect(() => {
//         if (sub5) return;

//         const cargarFiltros = async () => {
//             try {
//                 const response = await fetch('/assets/json/categorias/dormitorios/filtros.json');
//                 const data = await response.json();
//                 setFiltrosData(data);
//             } catch (error) {
//                 console.error("Error cargando filtros:", error);
//             }
//         };

//         cargarFiltros();
//     }, [sub5]);

//     // ============ FUNCIONES DE FILTRADO ============

//     // Actualizar URL con filtros
//     const updateURL = (filterType, value) => {
//         const params = new URLSearchParams(location.search);
//         const paramName = paramMap[filterType] || filterType;

//         if (value === null || value === undefined) {
//             params.delete(paramName);
//         } else {
//             params.set(paramName, value);
//         }

//         const hierarchy = {
//             'marca': ['lineaDormitorio', 'resorte', 'lineaColchon', 'modelo', 'tipoCabecera', 'diseñoCabecera', 'cajon', 'cantidadCajones', 'baul', 'piecera'],
//             'lineaDormitorio': ['resorte', 'lineaColchon', 'modelo', 'tipoCabecera', 'diseñoCabecera', 'cajon', 'cantidadCajones', 'baul', 'piecera'],
//             'resorte': ['lineaColchon', 'modelo', 'tipoCabecera', 'diseñoCabecera', 'cajon', 'cantidadCajones', 'baul', 'piecera'],
//             'lineaColchon': ['modelo', 'tipoCabecera', 'diseñoCabecera', 'cajon', 'cantidadCajones', 'baul', 'piecera'],
//             'modelo': ['tipoCabecera', 'diseñoCabecera', 'cajon', 'cantidadCajones', 'baul', 'piecera'],
//             'tipoCabecera': ['diseñoCabecera', 'cajon', 'cantidadCajones', 'baul', 'piecera'],
//             'diseñoCabecera': ['cajon', 'cantidadCajones', 'baul', 'piecera'],
//             'cajon': ['cantidadCajones']
//         };

//         if (hierarchy[filterType]) {
//             hierarchy[filterType].forEach(dependent => {
//                 params.delete(paramMap[dependent] || dependent);
//             });
//         }

//         const newSearch = params.toString();
//         const newPath = location.pathname + (newSearch ? `?${newSearch}` : '');
//         navigate(newPath, { replace: true });
//     };

//     // Manejar cambio de filtro
//     const handleFilterChange = (filterType, value) => {
//         setActiveFilters(prev => {
//             const newFilters = { ...prev };
            
//             if (filterType === 'marca') {
//                 newFilters.marca = value;
//                 newFilters.lineaDormitorio = null;
//                 newFilters.resorte = null;
//                 newFilters.lineaColchon = null;
//                 newFilters.modelo = null;
//                 newFilters.tipoCabecera = null;
//                 newFilters.diseñoCabecera = null;
//                 newFilters.cajon = null;
//                 newFilters.cantidadCajones = null;
//                 newFilters.baul = null;
//                 newFilters.piecera = null;
//             } else if (filterType === 'lineaDormitorio') {
//                 newFilters.lineaDormitorio = value;
//                 filtrosDependientesDeLineaDormitorio.forEach(filtro => {
//                     newFilters[filtro] = null;
//                 });
//             } else if (filterType === 'resorte') {
//                 newFilters.resorte = value;
//                 if (value === null) {
//                     newFilters.lineaColchon = null;
//                     newFilters.modelo = null;
//                     newFilters.tipoCabecera = null;
//                     newFilters.diseñoCabecera = null;
//                     newFilters.cajon = null;
//                     newFilters.cantidadCajones = null;
//                     newFilters.baul = null;
//                     newFilters.piecera = null;
//                 }
//             } else if (filterType === 'lineaColchon') {
//                 newFilters.lineaColchon = value;
//                 if (value === null) {
//                     newFilters.modelo = null;
//                     newFilters.tipoCabecera = null;
//                     newFilters.diseñoCabecera = null;
//                     newFilters.cajon = null;
//                     newFilters.cantidadCajones = null;
//                     newFilters.baul = null;
//                     newFilters.piecera = null;
//                 }
//             } else if (filterType === 'modelo') {
//                 newFilters.modelo = value;
//                 if (value === null) {
//                     newFilters.tipoCabecera = null;
//                     newFilters.diseñoCabecera = null;
//                     newFilters.cajon = null;
//                     newFilters.cantidadCajones = null;
//                     newFilters.baul = null;
//                     newFilters.piecera = null;
//                 }
//             } else if (filterType === 'tipoCabecera') {
//                 newFilters.tipoCabecera = value;
//                 if (value === null) {
//                     newFilters.diseñoCabecera = null;
//                     newFilters.cajon = null;
//                     newFilters.cantidadCajones = null;
//                     newFilters.baul = null;
//                     newFilters.piecera = null;
//                 }
//             } else if (filterType === 'diseñoCabecera') {
//                 newFilters.diseñoCabecera = value;
//                 if (value === null) {
//                     newFilters.cajon = null;
//                     newFilters.cantidadCajones = null;
//                     newFilters.baul = null;
//                     newFilters.piecera = null;
//                 }
//             } else if (filterType === 'cajon') {
//                 newFilters.cajon = value;
//                 if (value === null) {
//                     newFilters.cantidadCajones = null;
//                 }
//             } else {
//                 newFilters[filterType] = value;
//             }
            
//             updateURL(filterType, value);
//             setCurrentPage(1);
//             return newFilters;
//         });
//     };

//     // Toggle filtro
//     const toggleFiltro = (nombreFiltro, valor) => {
//         const stateKey = filterParamMap[nombreFiltro] || nombreFiltro;
//         const isActive = activeFilters[stateKey] === valor;
//         handleFilterChange(stateKey, isActive ? null : valor);
//     };

//     const isFiltroActivo = (nombreFiltro, valor) => {
//         const stateKey = filterParamMap[nombreFiltro] || nombreFiltro;
//         return activeFilters[stateKey] === valor;
//     };

//     // Filtrar productos por filtros (versión mejorada)
//     const filtrarProductosPorFiltros = (productosList, filtrosAplicar) => {
//         if (!productosList || productosList.length === 0) return [];
//         if (!filtrosAplicar || Object.keys(filtrosAplicar).length === 0) return productosList;

//         return productosList.filter(producto => {
//             let cumpleTodos = true;

//             const filtrosSuperiores = ['tamaño', 'marca', 'lineaDormitorio'];
            
//             for (const filterKey of filtrosSuperiores) {
//                 if (cumpleTodos && filtrosAplicar[filterKey]) {
//                     const valorProducto = getProductValue(producto, filterKey);
                    
//                     if (!valorProducto) {
//                         cumpleTodos = false;
//                         break;
//                     }
                    
//                     if (filterKey === 'marca') {
//                         if (!compararMarcas(valorProducto, filtrosAplicar.marca)) {
//                             cumpleTodos = false;
//                             break;
//                         }
//                     } else {
//                         const valorNormalizado = normalizarTexto(valorProducto);
//                         const filtroNormalizado = normalizarTexto(filtrosAplicar[filterKey]);
                        
//                         if (valorNormalizado !== filtroNormalizado) {
//                             cumpleTodos = false;
//                             break;
//                         }
//                     }
//                 }
//             }

//             if (cumpleTodos) {
//                 for (const filterKey of ordenFiltrosInferiores) {
//                     if (filtrosAplicar[filterKey]) {
//                         const valorProducto = getProductValue(producto, filterKey);
                        
//                         if (!valorProducto) {
//                             cumpleTodos = false;
//                             break;
//                         }
                        
//                         const valorNormalizado = normalizarTexto(valorProducto);
//                         const filtroNormalizado = normalizarTexto(filtrosAplicar[filterKey]);
                        
//                         if (valorNormalizado !== filtroNormalizado) {
//                             cumpleTodos = false;
//                             break;
//                         }
//                     }
//                 }
//             }

//             return cumpleTodos;
//         });
//     };

//     // Obtener valores únicos de productos
//     const obtenerValoresUnicosDeProductos = (productosList, campo) => {
//         const valores = new Set();
//         productosList.forEach(producto => {
//             const valor = getProductValue(producto, campo);
//             if (valor && typeof valor === 'string' && valor.trim() !== '') {
//                 valores.add(valor.trim());
//             }
//         });
//         return Array.from(valores).sort();
//     };

//     // ============ FILTRADO POR PASOS ============

//     // PASO 1: Filtros base (tamaño, marca, lineaDormitorio, envio gratis, hot sale)
//     const productosBaseFiltrados = useMemo(() => {
//         if (productos.length === 0) return [];

//         return productos.filter(producto => {
//             let cumpleTodosLosFiltros = true;

//             // Filtro envío gratis
//             if (envioGratisActivo) {
//                 if (producto["tipo-de-envio"] !== "Gratis") {
//                     cumpleTodosLosFiltros = false;
//                 }
//             }

//             // Filtro Hot Sale
//             if (cumpleTodosLosFiltros && isHotSaleActive && hotSaleSKUs.length > 0) {
//                 if (!hotSaleSKUs.includes(producto.sku)) {
//                     cumpleTodosLosFiltros = false;
//                 }
//             }

//             // Filtros superiores (tamaño, marca, lineaDormitorio)
//             const filtrosSuperiores = ['tamaño', 'marca', 'lineaDormitorio'];
            
//             for (const filterKey of filtrosSuperiores) {
//                 if (cumpleTodosLosFiltros && activeFilters[filterKey]) {
//                     const valorProducto = getProductValue(producto, filterKey);
                    
//                     if (!valorProducto) {
//                         cumpleTodosLosFiltros = false;
//                         break;
//                     }
                    
//                     if (filterKey === 'marca') {
//                         if (!compararMarcas(valorProducto, activeFilters.marca)) {
//                             cumpleTodosLosFiltros = false;
//                             break;
//                         }
//                     } else {
//                         const valorNormalizado = normalizarTexto(valorProducto);
//                         const filtroNormalizado = normalizarTexto(activeFilters[filterKey]);
                        
//                         if (valorNormalizado !== filtroNormalizado) {
//                             cumpleTodosLosFiltros = false;
//                             break;
//                         }
//                     }
//                 }
//             }

//             return cumpleTodosLosFiltros;
//         });
//     }, [productos, activeFilters.tamaño, activeFilters.marca, activeFilters.lineaDormitorio, envioGratisActivo, isHotSaleActive, hotSaleSKUs]);

//     // PASO 2: Filtro de precio
//     const productosFiltradosPorPrecio = useMemo(() => {
//         const params = new URLSearchParams(location.search);
//         const precioMin = params.get('min');
//         const precioMax = params.get('max');
        
//         if (precioMin === null || precioMax === null) {
//             return productosBaseFiltrados;
//         }

//         const min = parseInt(precioMin);
//         const max = parseInt(precioMax);

//         if (isNaN(min) || isNaN(max)) {
//             return productosBaseFiltrados;
//         }

//         return productosBaseFiltrados.filter(producto => {
//             const precio = producto.precioVenta || 0;
//             return precio >= min && precio <= max;
//         });
//     }, [productosBaseFiltrados, location.search]);

//     // PASO 3: Filtros jerárquicos (resorte, lineaColchon, modelo, etc.)
//     const productosFiltrados = useMemo(() => {
//         return filtrarProductosPorFiltros(productosFiltradosPorPrecio, activeFilters);
//     }, [productosFiltradosPorPrecio, activeFilters]);

//     // ============ FUNCIONES PARA RENDERIZAR FILTROS DINÁMICOS ============

//     const obtenerProductosHastaFiltro = (filtroActual) => {
//         const filtrosHasta = { ...activeFilters };
//         const indexActual = ordenFiltrosInferiores.indexOf(filtroActual);
//         if (indexActual !== -1) {
//             for (let i = indexActual; i < ordenFiltrosInferiores.length; i++) {
//                 delete filtrosHasta[ordenFiltrosInferiores[i]];
//             }
//         }
//         return filtrarProductosPorFiltros(productosFiltradosPorPrecio, filtrosHasta);
//     };

//     const debeMostrarFiltro = (campo) => {
//         if (!activeFilters.lineaDormitorio) return false;
        
//         const dependencias = {
//             'lineaColchon': 'resorte',
//             'modelo': 'lineaColchon',
//             'tipoCabecera': 'modelo',
//             'diseñoCabecera': 'tipoCabecera',
//             'cajon': 'modelo',
//             'cantidadCajones': 'cajon',
//             'baul': 'modelo',
//             'piecera': 'modelo'
//         };

//         if (dependencias[campo]) {
//             const dependencia = dependencias[campo];
//             if (campo === 'cantidadCajones') {
//                 return activeFilters.cajon === 'si';
//             }
//             return !!activeFilters[dependencia];
//         }

//         if (campo === 'resorte') {
//             return !!activeFilters.lineaDormitorio;
//         }

//         return true;
//     };

//     const renderFiltroDinamico = (campo, titulo, paramName) => {
//         if (!debeMostrarFiltro(campo)) return null;
        
//         const productosFiltradosHasta = obtenerProductosHastaFiltro(campo);
//         const valores = obtenerValoresUnicosDeProductos(productosFiltradosHasta, campo);
        
//         if (valores.length === 0) return null;

//         return (
//             <div className={`prds-filter-tag ${activeFilters[campo] ? 'active' : ''}`}>
//                 <div 
//                     className='prds-filter-title-container'
//                     onClick={(e) => {
//                         const parent = e.currentTarget.closest('.prds-filter-tag');
//                         parent?.classList.toggle('active');
//                     }}
//                 >
//                     <p className='prds-filter-title'>{titulo}</p>
//                     <span className="material-symbols-outlined">keyboard_arrow_down</span>
//                 </div>

//                 <div className='prds-filter-tag-results-container'>
//                     <ul>
//                         {valores.map((valor, index) => {
//                             const isActive = activeFilters[campo] === valor;
//                             return (
//                                 <li key={index}>
//                                     <button 
//                                         type='button'
//                                         className={isActive ? 'active' : ''}
//                                         onClick={() => toggleFiltro(paramName, isActive ? null : valor)}
//                                     >
//                                         <span></span>
//                                         <p>{valor}</p>
//                                     </button>
//                                 </li>
//                             );
//                         })}
//                     </ul>
//                 </div>
//             </div>
//         );
//     };

//     const renderCantidadCajonesDinamico = () => {
//         if (!activeFilters.lineaDormitorio) return null;
//         if (activeFilters.cajon !== 'si') return null;
        
//         const productosFiltradosHasta = obtenerProductosHastaFiltro('cantidadCajones');
//         const valores = obtenerValoresUnicosDeProductos(productosFiltradosHasta, 'cantidadCajones');
        
//         if (valores.length === 0) return null;

//         return (
//             <div className={`prds-filter-tag ${activeFilters.cantidadCajones ? 'active' : ''}`}>
//                 <div 
//                     className='prds-filter-title-container'
//                     onClick={(e) => {
//                         const parent = e.currentTarget.closest('.prds-filter-tag');
//                         parent?.classList.toggle('active');
//                     }}
//                 >
//                     <p className='prds-filter-title'>Cantidad de cajones</p>
//                     <span className="material-symbols-outlined">keyboard_arrow_down</span>
//                 </div>

//                 <div className='prds-filter-tag-results-container'>
//                     <ul>
//                         {valores.map((valor, index) => {
//                             const isActive = activeFilters.cantidadCajones === valor;
//                             return (
//                                 <li key={index}>
//                                     <button 
//                                         type='button'
//                                         className={isActive ? 'active' : ''}
//                                         onClick={() => toggleFiltro('cantidad-cajones', isActive ? null : valor)}
//                                     >
//                                         <span></span>
//                                         <p>{valor}</p>
//                                     </button>
//                                 </li>
//                             );
//                         })}
//                     </ul>
//                 </div>
//             </div>
//         );
//     };

//     const renderFiltrosJerarquicos = () => {
//         if (!filtrosData?.filtros?.[0]?.tamaño) return null;
        
//         // Solo mostrar filtros jerárquicos si hay una marca seleccionada
//         if (!activeFilters.marca) return null;
        
//         const elementos = [];

//         // Línea de dormitorio (filtrada por marca)
//         if (filtrosData.filtros[1] && filtrosData.filtros[1]['líneas-de-dormitorios']) {
//             const todasLasLineas = filtrosData.filtros[1]['líneas-de-dormitorios'];
//             let lineasFiltradas = todasLasLineas;
            
//             if (activeFilters.marca) {
//                 const lineasPermitidas = getLineasDormitorioByMarca(activeFilters.marca);
                
//                 if (lineasPermitidas) {
//                     lineasFiltradas = todasLasLineas.filter(item => {
//                         const nombreLinea = item['línea-de-dormitorio'] || item['línea-de-dormitorios'];
//                         return lineasPermitidas.some(permitida => 
//                             normalizarTexto(permitida) === normalizarTexto(nombreLinea)
//                         );
//                     });
//                 }
//             }
            
//             // Filtrar líneas que tienen productos
//             const lineasConProductos = lineasFiltradas.filter(item => {
//                 const nombreLinea = item['línea-de-dormitorio'] || item['línea-de-dormitorios'];
//                 const productosConLinea = productosBaseFiltrados.filter(producto => {
//                     const valor = getProductValue(producto, 'lineaDormitorio');
//                     if (!valor) return false;
//                     return normalizarTexto(valor) === normalizarTexto(nombreLinea);
//                 });
//                 return productosConLinea.length > 0;
//             });
            
//             if (lineasConProductos.length > 0) {
//                 elementos.push(
//                     <div className={`prds-filter-tag ${activeFilters.lineaDormitorio ? 'active' : ''}`} key="lineaDormitorio">
//                         <div 
//                             className='prds-filter-title-container'
//                             onClick={(e) => {
//                                 const parent = e.currentTarget.closest('.prds-filter-tag');
//                                 parent?.classList.toggle('active');
//                             }}
//                         >
//                             <p className='prds-filter-title'>Línea de dormitorio</p>
//                             <span className="material-symbols-outlined">keyboard_arrow_down</span>
//                         </div>

//                         <div className='prds-filter-tag-results-container'>
//                             <ul>
//                                 {lineasConProductos.map((item, index) => {
//                                     const nombreLinea = item['línea-de-dormitorio'] || item['línea-de-dormitorios'];
//                                     const isActive = activeFilters.lineaDormitorio === nombreLinea;
//                                     return (
//                                         <li key={index}>
//                                             <button 
//                                                 type='button'
//                                                 className={isActive ? 'active' : ''}
//                                                 onClick={() => toggleFiltro('linea-dormitorio', isActive ? null : nombreLinea)}
//                                             >
//                                                 <span></span>
//                                                 <p>{nombreLinea}</p>
//                                             </button>
//                                         </li>
//                                     );
//                                 })}
//                             </ul>
//                         </div>
//                     </div>
//                 );
//             }
//         }

//         // Filtros inferiores (dependientes de línea de dormitorio)
//         if (activeFilters.lineaDormitorio) {
//             const filtroResorte = renderFiltroDinamico('resorte', 'Resorte', 'resorte');
//             if (filtroResorte) elementos.push(filtroResorte);

//             if (activeFilters.resorte || !activeFilters.resorte) {
//                 const filtroLineaColchon = renderFiltroDinamico('lineaColchon', 'Línea de colchón', 'linea-colchon');
//                 if (filtroLineaColchon) elementos.push(filtroLineaColchon);
//             }

//             if (activeFilters.lineaColchon) {
//                 const filtroModelo = renderFiltroDinamico('modelo', 'Modelo', 'modelo');
//                 if (filtroModelo) elementos.push(filtroModelo);
//             }

//             if (activeFilters.modelo) {
//                 const filtroTipoCabecera = renderFiltroDinamico('tipoCabecera', 'Tipo de cabecera', 'tipo-cabecera');
//                 if (filtroTipoCabecera) elementos.push(filtroTipoCabecera);
//             }

//             if (activeFilters.tipoCabecera) {
//                 const filtroDiseñoCabecera = renderFiltroDinamico('diseñoCabecera', 'Diseño de cabecera', 'diseño-cabecera');
//                 if (filtroDiseñoCabecera) elementos.push(filtroDiseñoCabecera);
//             }

//             if (activeFilters.modelo) {
//                 const filtroCajon = renderFiltroDinamico('cajon', 'Cajones', 'cajon');
//                 if (filtroCajon) elementos.push(filtroCajon);
//             }

//             if (activeFilters.cajon === 'si') {
//                 const filtroCantidadCajones = renderCantidadCajonesDinamico();
//                 if (filtroCantidadCajones) elementos.push(filtroCantidadCajones);
//             }

//             if (activeFilters.modelo) {
//                 const filtroBaul = renderFiltroDinamico('baul', 'Baúl', 'baul');
//                 if (filtroBaul) elementos.push(filtroBaul);
//             }

//             if (activeFilters.modelo) {
//                 const filtroPiecera = renderFiltroDinamico('piecera', 'Piecera', 'piecera');
//                 if (filtroPiecera) elementos.push(filtroPiecera);
//             }
//         }

//         return elementos.length > 0 ? elementos : null;
//     };

//     // ============ RENDERIZADO DE FILTROS DE TAMAÑO Y MARCA ============

//     const renderTamañosFilters = () => {
//         if (!filtrosData?.filtros?.[0]?.tamaño) return null;
//         const tamaños = filtrosData.filtros[0].tamaño;

//         return (
//             <div className='prds-filter-tag'>
//                 <div 
//                     className='prds-filter-title-container'
//                     onClick={() => {
//                         const tag = document.querySelector('.prds-filter-tag:first-child');
//                         tag?.classList.toggle('active');
//                     }}
//                 >
//                     <p className='prds-filter-title'>Tamaños</p>
//                     <span className="material-symbols-outlined">keyboard_arrow_down</span>
//                 </div>

//                 <div className='prds-filter-tag-results-container'>
//                     <ul>
//                         {tamaños.map((item, index) => {
//                             const isActive = activeFilters.tamaño === item.tamaño;
//                             return (
//                                 <li key={index}>
//                                     <button 
//                                         type='button'
//                                         className={isActive ? 'active' : ''}
//                                         onClick={() => toggleFiltro('tamaño', isActive ? null : item.tamaño)}
//                                     >
//                                         <span></span>
//                                         <p>{item.tamaño}</p>
//                                     </button>
//                                 </li>
//                             );
//                         })}
//                     </ul>
//                 </div>
//             </div>
//         );
//     };

//     const renderMarcaFilters = () => {
//         if (!filtrosData?.filtros?.[0]?.tamaño) return null;
        
//         const tamañoActual = sub1 || activeFilters.tamaño || null;
        
//         if (!tamañoActual) {
//             // Mostrar todas las marcas si no hay tamaño seleccionado
//             const todasLasMarcas = new Set();
//             const tamaños = filtrosData.filtros[0].tamaño;
            
//             tamaños.forEach(tamaño => {
//                 if (tamaño.marcas && Array.isArray(tamaño.marcas)) {
//                     tamaño.marcas.forEach(marcaItem => {
//                         if (marcaItem.marca) {
//                             todasLasMarcas.add(marcaItem.marca);
//                         }
//                     });
//                 }
//             });
            
//             const marcasUnicas = Array.from(todasLasMarcas);
//             if (marcasUnicas.length === 0) return null;

//             return (
//                 <div className={`prds-filter-tag ${activeFilters.marca ? 'active' : ''}`}>
//                     <div 
//                         className='prds-filter-title-container'
//                         onClick={() => {
//                             const tag = document.querySelectorAll('.prds-filter-tag')[1];
//                             tag?.classList.toggle('active');
//                         }}
//                     >
//                         <p className='prds-filter-title'>Marcas</p>
//                         <span className="material-symbols-outlined">keyboard_arrow_down</span>
//                     </div>

//                     <div className='prds-filter-tag-results-container'>
//                         <ul>
//                             {marcasUnicas.map((marca, index) => {
//                                 const isActive = activeFilters.marca === marca;
//                                 return (
//                                     <li key={index}>
//                                         <button 
//                                             type='button'
//                                             className={isActive ? 'active' : ''}
//                                             onClick={() => toggleFiltro('marca', isActive ? null : marca)}
//                                         >
//                                             <span></span>
//                                             <p>{marca}</p>
//                                         </button>
//                                     </li>
//                                 );
//                             })}
//                         </ul>
//                     </div>
//                 </div>
//             );
//         }
        
//         const tamañoData = filtrosData.filtros[0].tamaño.find(
//             t => normalizarTexto(t.tamaño) === normalizarTexto(tamañoActual)
//         );
        
//         if (!tamañoData || !tamañoData.marcas || tamañoData.marcas.length === 0) {
//             return null;
//         }
        
//         const marcasDisponibles = tamañoData.marcas.map(m => m.marca);
        
//         return (
//             <div className={`prds-filter-tag ${activeFilters.marca ? 'active' : ''}`}>
//                 <div 
//                     className='prds-filter-title-container'
//                     onClick={() => {
//                         const tag = document.querySelectorAll('.prds-filter-tag')[1];
//                         tag?.classList.toggle('active');
//                     }}
//                 >
//                     <p className='prds-filter-title'>Marcas</p>
//                     <span className="material-symbols-outlined">keyboard_arrow_down</span>
//                 </div>

//                 <div className='prds-filter-tag-results-container'>
//                     <ul>
//                         {marcasDisponibles.map((marca, index) => {
//                             const isActive = activeFilters.marca === marca;
//                             return (
//                                 <li key={index}>
//                                     <button 
//                                         type='button'
//                                         className={isActive ? 'active' : ''}
//                                         onClick={() => toggleFiltro('marca', isActive ? null : marca)}
//                                     >
//                                         <span></span>
//                                         <p>{marca}</p>
//                                     </button>
//                                 </li>
//                             );
//                         })}
//                     </ul>
//                 </div>
//             </div>
//         );
//     };

//     // ============ FUNCIONES DE PAGINACIÓN ============

//     const totalItems = productosFiltrados.length;
//     const totalPages = Math.ceil(totalItems / itemsPerPage);
//     const startIndex = (currentPage - 1) * itemsPerPage;
//     const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
//     const productosPagina = productosFiltrados.slice(startIndex, endIndex);

//     const getVisiblePages = () => {
//         const visiblePages = [];
//         if (totalPages <= 5) {
//             for (let i = 1; i <= totalPages; i++) visiblePages.push(i);
//         } else {
//             if (currentPage <= 3) { 
//                 visiblePages.push(1, 2, 3, 4, '...', totalPages); 
//             } else if (currentPage >= totalPages - 2) {
//                 visiblePages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
//             } else {
//                 visiblePages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
//             }
//         }
//         return visiblePages;
//     };

//     const handlePageChange = (newPage) => {
//         setCurrentPage(Math.max(1, Math.min(totalPages, newPage)));
//         window.scrollTo({ top: 0, behavior: 'smooth' });
//     };

//     const handlePreviousPage = () => handlePageChange(currentPage - 1);
//     const handleNextPage = () => handlePageChange(currentPage + 1);

//     // Reset page when filters change
//     useEffect(() => {
//         setCurrentPage(1);
//     }, [activeFilters, envioGratisActivo, isHotSaleActive, location.search]);

//     // ============ LIMPIAR FILTROS ============

//     const limpiarFiltros = () => {
//         setActiveFilters({
//             tamaño: null,
//             marca: null,
//             lineaDormitorio: null,
//             resorte: null,
//             lineaColchon: null,
//             modelo: null,
//             tipoCabecera: null,
//             diseñoCabecera: null,
//             cajon: null,
//             cantidadCajones: null,
//             baul: null,
//             piecera: null
//         });
        
//         setEnvioGratisActivo(false);
//         setIsHotSaleActive(false);
//         localStorage.setItem('hotSaleActive', 'false');
//         setCurrentPage(1);
        
//         // Limpiar filtros de precio de la URL
//         const params = new URLSearchParams(location.search);
//         params.delete('min');
//         params.delete('max');
//         const newSearch = params.toString();
//         const newPath = location.pathname + (newSearch ? `?${newSearch}` : '');
//         navigate(newPath, { replace: true });
        
//         setResetFiltersTrigger(true);
//         setTimeout(() => {
//             setResetFiltersTrigger(false);
//         }, 100);
//     };

//     // ============ TOGGLES ============

//     const closeFilters = () => {
//         setIsFiltersOpen(false);
//     };

//     const toggleEnvioGratis = () => {
//         setEnvioGratisActivo(!envioGratisActivo);
//         setCurrentPage(1);
//     };

//     const handleHotSaleToggle = () => {
//         const newState = !isHotSaleActive;
//         setIsHotSaleActive(newState);
//         localStorage.setItem('hotSaleActive', newState);
//         setCurrentPage(1);
//     };

//     // ============ RENDER ============

//     if (sub5) {
//         return null;
//     }

//     const getPageMeta = () => {
//         const titleParts = ['Dormitorios'];
//         if (sub1) titleParts.unshift(sub1.charAt(0).toUpperCase() + sub1.slice(1));
//         if (sub2) titleParts.unshift(sub2.charAt(0).toUpperCase() + sub2.slice(1));
//         if (sub3) titleParts.unshift(sub3.charAt(0).toUpperCase() + sub3.slice(1));
//         if (sub4) titleParts.unshift(sub4.charAt(0).toUpperCase() + sub4.slice(1));
        
//         return {
//             title: `${titleParts.join(' | ')} | Homesleep`,
//             description: `Encuentra los mejores dormitorios ${sub1 ? `tamaño ${sub1}` : ''} ${sub2 ? `marca ${sub2}` : ''} ${sub3 ? `modelo ${sub3}` : ''} ${sub4 ? `línea ${sub4}` : ''} en Homesleep.`
//         };
//     };

//     const meta = getPageMeta();

//     return (
//         <>
//             <Helmet>
//                 <title>{meta.title}</title>
//                 <meta name="description" content={meta.description} />
//                 <meta property="og:title" content={meta.title}/>
//             </Helmet>

//             <main className='products-page-main d-flex-column gap-20'>
//                 <Categorias/>

//                 <div className='products-page-blocks'>
//                     <div className={`products-page-left ${isFiltersOpen ? 'active' : ''}`} ref={filtersPanelRef}>
//                         <div className='products-page-filters-container-global'>
//                             <div className='d-flex-column gap-20'>
//                                 <div className='d-flex-column padding-bottom-20 border-bottom-2-solid-component'>
//                                     <p className='block-title color-color-1 uppercase w-100 d-flex'>Homesleep</p>
//                                     <button type='button' className='filters-button-close margin-left' onClick={closeFilters}>
//                                         <span className="material-icons color-color-1">close</span>
//                                     </button>
//                                     <p className='uppercase w-100 d-flex'>Las mejores marcas en productos para el descanso</p>
//                                 </div>

//                                 <div className='envio-gratis-button-container'>
//                                     <div className='d-flex-center-center'>
//                                         <p className='weight-bold uppercase color-color-1 font-bold'>Envío gratis</p>
//                                     </div>
//                                     <div type='button' className={`envio-gratis-button ${envioGratisActivo ? 'active' : ''}`} onClick={toggleEnvioGratis}>
//                                         <span></span>
//                                     </div>
//                                 </div>

//                                 <RangoPrecios productos={productosFiltrados} loading={loading}/>

//                                 <button type='button' className={`filter-hot-sale ${isHotSaleActive ? 'active' : ''}`} onClick={handleHotSaleToggle}>
//                                     <div className='d-flex-center-left'>
//                                         <span className="material-symbols-outlined">local_fire_department</span>
//                                         <div className='d-flex-column'>
//                                             <p className='title color-gray-dark'>Hot sale</p>
//                                             <span className='color-gray-dark'>(Más vendidos)</span>
//                                         </div>
//                                     </div>
//                                     <div className='switch'></div>
//                                 </button>

//                                 {/* ============ FILTROS DINÁMICOS ============ */}
//                                 <div className='products-page-filters-container d-flex-column'>
//                                     {renderTamañosFilters()}
//                                     {renderMarcaFilters()}
//                                     {renderFiltrosJerarquicos()}
//                                 </div>

//                                 {hasActiveFilters && (
//                                     <button type="button" className="button-link button-link-2" onClick={limpiarFiltros}>
//                                         <span className="material-icons">delete</span>
//                                         <p className="button-link-text">Limpiar filtros</p>
//                                     </button>
//                                 )}
//                             </div>
//                         </div>
//                     </div>

//                     <div className='products-page-right'>
//                         <FiltrosTop 
//                             setOrden={setOrden} 
//                             orden={orden} 
//                             toggleFiltro={toggleFiltro} 
//                             isFiltroActivo={isFiltroActivo} 
//                             setIsFiltersOpen={setIsFiltersOpen} 
//                             isFiltersOpen={isFiltersOpen} 
//                             productosCount={productosOrdenados.length}
//                             totalProductos={productos.length} 
//                             currentPage={currentPage}
//                             totalPages={totalPages}
//                             onPageChange={handlePageChange}
//                             onPreviousPage={handlePreviousPage}
//                             onNextPage={handleNextPage}
//                             getVisiblePages={getVisiblePages}
//                             viewMode={viewMode}
//                             setViewMode={setViewMode}
//                         />

//                         <div className='products-page-products-container'>
//                             {loading ? (
//                                 <div className="loading-products d-flex-center-center d-flex-column gap-10">
//                                     <div className="spinner"></div>
//                                     <p>Cargando productos...</p>
//                                 </div>
//                             ) : (
//                                 <>
//                                     <ul className={`products-page-products ${viewMode}`}>
//                                         {productosPagina.length === 0 ? (
//                                             <div className='d-grid-1-1'>
//                                                 <div className="w-100 d-flex-column d-flex-center-center text-center gap-10">
//                                                     <img src="/assets/imagenes/paginas/not-found.svg" alt="" width={320} />
//                                                     <p className='text'>No se encontraron productos con los filtros seleccionados.</p>
//                                                     {hasActiveFilters && (
//                                                         <button type="button" className="button-link button-link-2" onClick={limpiarFiltros}>
//                                                             <span className="material-icons">delete</span>
//                                                             <p className="button-link-text">Limpiar filtros</p>
//                                                         </button>
//                                                     )}
//                                                 </div>
//                                             </div>
//                                         ) : (
//                                             productosPagina.map(producto => (
//                                                 <Producto key={producto.sku} producto={producto} />
//                                             ))
//                                         )}
//                                     </ul>
                                    
//                                     {productosPagina.length > 0 && totalPages > 1 && (
//                                         <div className="pagination-controls d-grid-column-2-3 margin-top-20">
//                                             <button className="pagination-arrow" onClick={handlePreviousPage} disabled={currentPage === 1}>
//                                                 <span className="material-icons">chevron_left</span>
//                                             </button>

//                                             <div className="d-flex-center-center gap-10">
//                                                 {getVisiblePages().map((page, index) => 
//                                                     typeof page === 'number' ? (
//                                                         <button key={index} className={`pagination-page ${currentPage === page ? 'active' : ''}`} onClick={() => handlePageChange(page)}>
//                                                             {page}
//                                                         </button>
//                                                     ) : (
//                                                         <span key={index} className="pagination-ellipsis">...</span>
//                                                     )
//                                                 )}
//                                             </div>

//                                             <button className="pagination-arrow" onClick={handleNextPage} disabled={currentPage === totalPages}>
//                                                 <span className="material-icons">chevron_right</span>
//                                             </button>
//                                         </div>
//                                     )}
//                                 </>
//                             )}
//                         </div>
//                     </div>
//                 </div>
//             </main>

//             <div className={`filters-layout ${isFiltersOpen ? 'active' : ''}`} onClick={closeFilters}></div>
//         </>
//     );
// }

// export default Dormitorios;

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

// ============ FUNCIONES DE FILTRADO DINÁMICO ============

// Obtener valor de un producto por campo (busca en múltiples ubicaciones)
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

    // Mapeo de campos específicos
    const fieldMappings = {
        'lineaDormitorio': ['línea-de-dormitorio', 'linea-de-dormitorio', 'linea-dormitorio', 'línea-dormitorio', 'línea'],
        'lineaColchon': [
            'línea-de-colchón', 
            'linea-colchon', 
            'linea-colchón', 
            'línea-de-colchones', 
            'linea-colchones',
            'línea-de-colchon'
        ],
        'resorte': ['resorte', 'resortes', 'tipo-de-resorte', 'tipo-resorte'],
        'modelo': ['modelo', 'modelos', 'modelo-de-colchón', 'modelo-de-colchones', 'modelo-de-colchon'],
        'tipoCabecera': ['tipo-de-cabecera', 'tipo-cabecera', 'tipo-de-cabeceras'],
        'diseñoCabecera': ['diseño-de-cabecera', 'diseño-cabecera', 'diseños-de-cabecera'],
        'cajon': ['cajón', 'cajon', 'cajones', 'tiene-cajon', 'tiene-cajón'],
        'cantidadCajones': ['cantidad-de-cajones', 'cantidad-cajones', 'cantidad-de-cajon', 'cantidad de cajones'],
        'baul': ['baúl', 'baul'],
        'piecera': ['piecera'],
        'tamaño': ['tamaño', 'tamano', 'size'],
        'marca': ['marca', 'brand'],
        'línea': ['línea', 'linea', 'line']
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

// Comparar marcas con manejo especial
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

// Obtener líneas permitidas por marca
const getLineasDormitorioByMarca = (marca) => {
    const marcaNormalizada = normalizarTexto(marca);
    const excepciones = {
        'kamas': {
            lineasPermitidas: ['americanos', 'europeos', 'circulares', 'nube', 'clásicos']
        },
        'paraiso': {
            lineasPermitidas: ['americanos', 'europeos']
        },
        'el-cisne': {
            lineasPermitidas: ['americanos', 'europeos']
        },
        'komfort': {
            lineasPermitidas: ['americanos']
        }
    };

    if (excepciones[marcaNormalizada]) {
        return excepciones[marcaNormalizada].lineasPermitidas;
    }

    return null;
};

// ============ COMPONENTE PRINCIPAL ============
function Dormitorios() {
    const { sub1, sub2, sub3, sub4, sub5 } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    
    // ============ ESTADOS ============
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filtrosData, setFiltrosData] = useState(null);
    const [orden, setOrden] = useState("ultimo");
    const queryParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);
    const filtersPanelRef = useRef(null);
    const itemsPerPage = 48;
    const [viewMode, setViewMode] = useState(() => {
        const savedMode = localStorage.getItem('viewMode');
        return savedMode || 'grid';
    });

    // Estado de filtros activos
    const [activeFilters, setActiveFilters] = useState({
        tamaño: null,
        marca: null,
        lineaDormitorio: null,
        resorte: null,
        lineaColchon: null,
        modelo: null,
        tipoCabecera: null,
        diseñoCabecera: null,
        cajon: null,
        cantidadCajones: null,
        baul: null,
        piecera: null
    });

    const [envioGratisActivo, setEnvioGratisActivo] = useState(false);
    const [isHotSaleActive, setIsHotSaleActive] = useState(() => {
        const saved = localStorage.getItem('hotSaleActive');
        return saved === 'true';
    });
    const [hotSaleSKUs, setHotSaleSKUs] = useState([]);
    const [resetFiltersTrigger, setResetFiltersTrigger] = useState(false);
    const [hasActiveFilters, setHasActiveFilters] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    // ============ MAPEOS DE FILTROS ============
    const filterParamMap = {
        'tamaño': 'tamaño',
        'marca': 'marca',
        'linea-dormitorio': 'lineaDormitorio',
        'resorte': 'resorte',
        'linea-colchon': 'lineaColchon',
        'modelo': 'modelo',
        'tipo-cabecera': 'tipoCabecera',
        'diseño-cabecera': 'diseñoCabecera',
        'cajon': 'cajon',
        'cantidad-cajones': 'cantidadCajones',
        'baul': 'baul',
        'piecera': 'piecera'
    };

    const paramMap = {
        tamaño: 'tamaño',
        marca: 'marca',
        lineaDormitorio: 'linea-dormitorio',
        resorte: 'resorte',
        lineaColchon: 'linea-colchon',
        modelo: 'modelo',
        tipoCabecera: 'tipo-cabecera',
        diseñoCabecera: 'diseño-cabecera',
        cajon: 'cajon',
        cantidadCajones: 'cantidad-cajones',
        baul: 'baul',
        piecera: 'piecera'
    };

    const filtrosDependientesDeLineaDormitorio = [
        'resorte', 'lineaColchon', 'modelo', 'tipoCabecera', 
        'diseñoCabecera', 'cajon', 'cantidadCajones', 'baul', 'piecera'
    ];

    const ordenFiltrosInferiores = [
        'resorte', 'lineaColchon', 'modelo', 'tipoCabecera', 
        'diseñoCabecera', 'cajon', 'cantidadCajones', 'baul', 'piecera'
    ];

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

    // Detectar filtros activos
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const hasPriceFilter = params.has('min') || params.has('max');
        const hasOtherFilters = Object.values(activeFilters).some(v => v !== null) ||
                               envioGratisActivo || isHotSaleActive;
        
        setHasActiveFilters(hasPriceFilter || hasOtherFilters);
    }, [activeFilters, envioGratisActivo, isHotSaleActive, location.search]);

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

    // Verificar si hay sub5 y redirigir a PaginaProducto
    useEffect(() => {
        if (sub5) {
            const rutaProducto = `/productos/dormitorios/${sub1}/${sub2}/${sub3}/${sub4}/${sub5}/`;
            navigate(rutaProducto, { replace: true });
        }
    }, [sub5, sub1, sub2, sub3, sub4, navigate]);

    // ============ FUNCIONES DE CARGA ============
    
    const construirRutaProducto = (producto) => {
        const detalles = producto["detalles-del-producto"]?.[0] || {};
        
        let tamaño = getProductValue(producto, 'tamaño') || '';
        tamaño = normalizarTexto(tamaño);
        
        let marca = getProductValue(producto, 'marca') || '';
        marca = normalizarTexto(marca);
        
        let modelo = getProductValue(producto, 'modelo') || '';
        modelo = normalizarTexto(modelo);
        
        let linea = getProductValue(producto, 'lineaDormitorio') || '';
        linea = normalizarTexto(linea);
        
        const sku = producto.sku || '';

        return `/productos/dormitorios/${tamaño}/${marca}/${modelo}/${linea}/${sku}/`;
    };

    const obtenerArchivosJSONEnCarpeta = async (carpeta) => {
        try {
            const manifestResponse = await fetch('/assets/json/manifest.json');
            const manifestData = await manifestResponse.json();
            const archivos = manifestData.files || [];

            const carpetaNormalizada = carpeta.replace(/^\//, '');
            
            const archivosFiltrados = archivos.filter(url => {
                const urlNormalizada = url.replace(/^\//, '');
                return urlNormalizada.startsWith(carpetaNormalizada) && urlNormalizada.endsWith('.json');
            });

            return archivosFiltrados;
        } catch (error) {
            console.error("Error cargando manifest.json:", error);
            return [];
        }
    };

    const cargarProductosPorRuta = async (sub1, sub2, sub3, sub4) => {
        try {
            setLoading(true);
            console.log('=== CARGANDO DORMITORIOS (con filtros dinámicos) ===');
            console.log('sub1 (tamaño):', sub1);
            console.log('sub2 (marca):', sub2);
            console.log('sub3 (modelo):', sub3);
            console.log('sub4 (línea):', sub4);

            let archivosJSON = [];

            // Estrategia 1: Usar manifest.json
            try {
                let carpeta = '/assets/json/categorias/dormitorios';
                if (sub1) carpeta += `/${sub1}`;
                if (sub2) carpeta += `/${sub2}`;
                if (sub3) carpeta += `/${sub3}`;
                if (sub4) carpeta += `/${sub4}`;

                console.log('Buscando archivos en carpeta:', carpeta);
                archivosJSON = await obtenerArchivosJSONEnCarpeta(carpeta);
                
                if (archivosJSON.length > 0) {
                    console.log('Usando manifest.json, archivos encontrados:', archivosJSON.length);
                } else {
                    console.log('No se encontraron archivos en manifest');
                    archivosJSON = [];
                }
            } catch (error) {
                console.log('Error con manifest:', error);
                archivosJSON = [];
            }

            // Estrategia 2: Si no hay archivos, usar estructura con filtros dinámicos
            if (archivosJSON.length === 0) {
                console.log('Usando estrategia por estructura');
                // Buscar todos los archivos en la carpeta dormitorios
                const todosArchivos = await obtenerArchivosJSONEnCarpeta('/assets/json/categorias/dormitorios');
                
                // Filtrar por sub1 (tamaño) si existe
                if (sub1) {
                    archivosJSON = todosArchivos.filter(url => {
                        const partes = url.split('/');
                        const tamañoIndex = partes.indexOf('dormitorios') + 1;
                        return partes[tamañoIndex] === sub1;
                    });
                } else {
                    archivosJSON = todosArchivos;
                }

                // Filtrar por sub2 (marca) si existe
                if (sub2 && archivosJSON.length > 0) {
                    archivosJSON = archivosJSON.filter(url => {
                        const partes = url.split('/');
                        const marcaIndex = partes.indexOf('dormitorios') + 2;
                        return partes[marcaIndex] === sub2;
                    });
                }

                // Filtrar por sub3 (modelo) si existe
                if (sub3 && archivosJSON.length > 0) {
                    archivosJSON = archivosJSON.filter(url => {
                        const partes = url.split('/');
                        const modeloIndex = partes.indexOf('dormitorios') + 3;
                        return partes[modeloIndex] === sub3;
                    });
                }

                // Filtrar por sub4 (línea) si existe
                if (sub4 && archivosJSON.length > 0) {
                    archivosJSON = archivosJSON.filter(url => {
                        const partes = url.split('/');
                        const lineaIndex = partes.indexOf('dormitorios') + 4;
                        return partes[lineaIndex] === sub4;
                    });
                }
            }

            console.log('Archivos a cargar:', archivosJSON.length);
            if (archivosJSON.length > 0) {
                console.log('Ejemplos:', archivosJSON.slice(0, 3));
            }

            if (archivosJSON.length === 0) {
                console.warn('No se encontraron archivos para la ruta');
                setProductos([]);
                setLoading(false);
                return [];
            }

            // Cargar cada archivo JSON
            const productosPromesas = archivosJSON.map(async (url) => {
                try {
                    const response = await fetch(url);
                    if (!response.ok) return [];
                    const data = await response.json();
                    
                    // Agregar ficha técnica a cada producto
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
            let todosProductos = productosPorArchivo.flat();
            
            console.log('Productos sin procesar:', todosProductos.length);

            // Asignar rutas a cada producto
            todosProductos = todosProductos.map(producto => {
                const ruta = construirRutaProducto(producto);
                return {
                    ...producto,
                    ruta: ruta
                };
            });
            
            console.log(`Total de productos cargados: ${todosProductos.length}`);
            if (todosProductos.length > 0) {
                console.log('Primer producto:', {
                    nombre: todosProductos[0].nombre,
                    sku: todosProductos[0].sku,
                    ruta: todosProductos[0].ruta
                });
            }
            
            return todosProductos;
        } catch (error) {
            console.error("Error cargando productos:", error);
            return [];
        } finally {
            setLoading(false);
        }
    };

    // Cargar productos según la URL actual
    useEffect(() => {
        if (sub5) {
            setProductos([]);
            setLoading(false);
            return;
        }

        const cargarProductos = async () => {
            const productosCargados = await cargarProductosPorRuta(sub1, sub2, sub3, sub4);
            setProductos(productosCargados);
            setCurrentPage(1);
        };

        cargarProductos();
    }, [sub1, sub2, sub3, sub4, sub5]);

    // Cargar filtros
    useEffect(() => {
        if (sub5) return;

        const cargarFiltros = async () => {
            try {
                const response = await fetch('/assets/json/categorias/dormitorios/filtros.json');
                const data = await response.json();
                setFiltrosData(data);
            } catch (error) {
                console.error("Error cargando filtros:", error);
            }
        };

        cargarFiltros();
    }, [sub5]);

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

        const hierarchy = {
            'marca': ['lineaDormitorio', 'resorte', 'lineaColchon', 'modelo', 'tipoCabecera', 'diseñoCabecera', 'cajon', 'cantidadCajones', 'baul', 'piecera'],
            'lineaDormitorio': ['resorte', 'lineaColchon', 'modelo', 'tipoCabecera', 'diseñoCabecera', 'cajon', 'cantidadCajones', 'baul', 'piecera'],
            'resorte': ['lineaColchon', 'modelo', 'tipoCabecera', 'diseñoCabecera', 'cajon', 'cantidadCajones', 'baul', 'piecera'],
            'lineaColchon': ['modelo', 'tipoCabecera', 'diseñoCabecera', 'cajon', 'cantidadCajones', 'baul', 'piecera'],
            'modelo': ['tipoCabecera', 'diseñoCabecera', 'cajon', 'cantidadCajones', 'baul', 'piecera'],
            'tipoCabecera': ['diseñoCabecera', 'cajon', 'cantidadCajones', 'baul', 'piecera'],
            'diseñoCabecera': ['cajon', 'cantidadCajones', 'baul', 'piecera'],
            'cajon': ['cantidadCajones']
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
                newFilters.lineaDormitorio = null;
                newFilters.resorte = null;
                newFilters.lineaColchon = null;
                newFilters.modelo = null;
                newFilters.tipoCabecera = null;
                newFilters.diseñoCabecera = null;
                newFilters.cajon = null;
                newFilters.cantidadCajones = null;
                newFilters.baul = null;
                newFilters.piecera = null;
            } else if (filterType === 'lineaDormitorio') {
                newFilters.lineaDormitorio = value;
                filtrosDependientesDeLineaDormitorio.forEach(filtro => {
                    newFilters[filtro] = null;
                });
            } else if (filterType === 'resorte') {
                newFilters.resorte = value;
                if (value === null) {
                    newFilters.lineaColchon = null;
                    newFilters.modelo = null;
                    newFilters.tipoCabecera = null;
                    newFilters.diseñoCabecera = null;
                    newFilters.cajon = null;
                    newFilters.cantidadCajones = null;
                    newFilters.baul = null;
                    newFilters.piecera = null;
                }
            } else if (filterType === 'lineaColchon') {
                newFilters.lineaColchon = value;
                if (value === null) {
                    newFilters.modelo = null;
                    newFilters.tipoCabecera = null;
                    newFilters.diseñoCabecera = null;
                    newFilters.cajon = null;
                    newFilters.cantidadCajones = null;
                    newFilters.baul = null;
                    newFilters.piecera = null;
                }
            } else if (filterType === 'modelo') {
                newFilters.modelo = value;
                if (value === null) {
                    newFilters.tipoCabecera = null;
                    newFilters.diseñoCabecera = null;
                    newFilters.cajon = null;
                    newFilters.cantidadCajones = null;
                    newFilters.baul = null;
                    newFilters.piecera = null;
                }
            } else if (filterType === 'tipoCabecera') {
                newFilters.tipoCabecera = value;
                if (value === null) {
                    newFilters.diseñoCabecera = null;
                    newFilters.cajon = null;
                    newFilters.cantidadCajones = null;
                    newFilters.baul = null;
                    newFilters.piecera = null;
                }
            } else if (filterType === 'diseñoCabecera') {
                newFilters.diseñoCabecera = value;
                if (value === null) {
                    newFilters.cajon = null;
                    newFilters.cantidadCajones = null;
                    newFilters.baul = null;
                    newFilters.piecera = null;
                }
            } else if (filterType === 'cajon') {
                newFilters.cajon = value;
                if (value === null) {
                    newFilters.cantidadCajones = null;
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

    // Filtrar productos por filtros (versión mejorada)
    const filtrarProductosPorFiltros = (productosList, filtrosAplicar) => {
        if (!productosList || productosList.length === 0) return [];
        if (!filtrosAplicar || Object.keys(filtrosAplicar).length === 0) return productosList;

        return productosList.filter(producto => {
            let cumpleTodos = true;

            const filtrosSuperiores = ['tamaño', 'marca', 'lineaDormitorio'];
            
            for (const filterKey of filtrosSuperiores) {
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

            if (cumpleTodos) {
                for (const filterKey of ordenFiltrosInferiores) {
                    if (filtrosAplicar[filterKey]) {
                        const valorProducto = getProductValue(producto, filterKey);
                        
                        if (!valorProducto) {
                            cumpleTodos = false;
                            break;
                        }
                        
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

    // PASO 1: Filtros base (tamaño, marca, lineaDormitorio, envio gratis, hot sale)
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

            // Filtros superiores (tamaño, marca, lineaDormitorio)
            const filtrosSuperiores = ['tamaño', 'marca', 'lineaDormitorio'];
            
            for (const filterKey of filtrosSuperiores) {
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
    }, [productos, activeFilters.tamaño, activeFilters.marca, activeFilters.lineaDormitorio, envioGratisActivo, isHotSaleActive, hotSaleSKUs]);

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

    // PASO 3: Filtros jerárquicos (resorte, lineaColchon, modelo, etc.)
    const productosFiltrados = useMemo(() => {
        return filtrarProductosPorFiltros(productosFiltradosPorPrecio, activeFilters);
    }, [productosFiltradosPorPrecio, activeFilters]);

    // PASO 4: Ordenamiento (NUEVO)
    const productosOrdenados = useMemo(() => {
        if (!productosFiltrados || productosFiltrados.length === 0) return [];
        
        const productosCopy = [...productosFiltrados];
        
        if (orden === 'menor-mayor') {
            return productosCopy.sort((a, b) => (a.precioVenta || 0) - (b.precioVenta || 0));
        } else if (orden === 'mayor-menor') {
            return productosCopy.sort((a, b) => (b.precioVenta || 0) - (a.precioVenta || 0));
        }
        
        // 'ultimo' o cualquier otro - mantener orden original
        return productosCopy;
    }, [productosFiltrados, orden]);

    // ============ FUNCIONES PARA RENDERIZAR FILTROS DINÁMICOS ============

    const obtenerProductosHastaFiltro = (filtroActual) => {
        const filtrosHasta = { ...activeFilters };
        const indexActual = ordenFiltrosInferiores.indexOf(filtroActual);
        if (indexActual !== -1) {
            for (let i = indexActual; i < ordenFiltrosInferiores.length; i++) {
                delete filtrosHasta[ordenFiltrosInferiores[i]];
            }
        }
        return filtrarProductosPorFiltros(productosFiltradosPorPrecio, filtrosHasta);
    };

    const debeMostrarFiltro = (campo) => {
        if (!activeFilters.lineaDormitorio) return false;
        
        const dependencias = {
            'lineaColchon': 'resorte',
            'modelo': 'lineaColchon',
            'tipoCabecera': 'modelo',
            'diseñoCabecera': 'tipoCabecera',
            'cajon': 'modelo',
            'cantidadCajones': 'cajon',
            'baul': 'modelo',
            'piecera': 'modelo'
        };

        if (dependencias[campo]) {
            const dependencia = dependencias[campo];
            if (campo === 'cantidadCajones') {
                return activeFilters.cajon === 'si';
            }
            return !!activeFilters[dependencia];
        }

        if (campo === 'resorte') {
            return !!activeFilters.lineaDormitorio;
        }

        return true;
    };

    const renderFiltroDinamico = (campo, titulo, paramName) => {
        if (!debeMostrarFiltro(campo)) return null;
        
        const productosFiltradosHasta = obtenerProductosHastaFiltro(campo);
        const valores = obtenerValoresUnicosDeProductos(productosFiltradosHasta, campo);
        
        if (valores.length === 0) return null;

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

    const renderCantidadCajonesDinamico = () => {
        if (!activeFilters.lineaDormitorio) return null;
        if (activeFilters.cajon !== 'si') return null;
        
        const productosFiltradosHasta = obtenerProductosHastaFiltro('cantidadCajones');
        const valores = obtenerValoresUnicosDeProductos(productosFiltradosHasta, 'cantidadCajones');
        
        if (valores.length === 0) return null;

        return (
            <div className={`prds-filter-tag ${activeFilters.cantidadCajones ? 'active' : ''}`}>
                <div 
                    className='prds-filter-title-container'
                    onClick={(e) => {
                        const parent = e.currentTarget.closest('.prds-filter-tag');
                        parent?.classList.toggle('active');
                    }}
                >
                    <p className='prds-filter-title'>Cantidad de cajones</p>
                    <span className="material-symbols-outlined">keyboard_arrow_down</span>
                </div>

                <div className='prds-filter-tag-results-container'>
                    <ul>
                        {valores.map((valor, index) => {
                            const isActive = activeFilters.cantidadCajones === valor;
                            return (
                                <li key={index}>
                                    <button 
                                        type='button'
                                        className={isActive ? 'active' : ''}
                                        onClick={() => toggleFiltro('cantidad-cajones', isActive ? null : valor)}
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
        if (!filtrosData?.filtros?.[0]?.tamaño) return null;
        
        // Solo mostrar filtros jerárquicos si hay una marca seleccionada
        if (!activeFilters.marca) return null;
        
        const elementos = [];

        // Línea de dormitorio (filtrada por marca)
        if (filtrosData.filtros[1] && filtrosData.filtros[1]['líneas-de-dormitorios']) {
            const todasLasLineas = filtrosData.filtros[1]['líneas-de-dormitorios'];
            let lineasFiltradas = todasLasLineas;
            
            if (activeFilters.marca) {
                const lineasPermitidas = getLineasDormitorioByMarca(activeFilters.marca);
                
                if (lineasPermitidas) {
                    lineasFiltradas = todasLasLineas.filter(item => {
                        const nombreLinea = item['línea-de-dormitorio'] || item['línea-de-dormitorios'];
                        return lineasPermitidas.some(permitida => 
                            normalizarTexto(permitida) === normalizarTexto(nombreLinea)
                        );
                    });
                }
            }
            
            // Filtrar líneas que tienen productos
            const lineasConProductos = lineasFiltradas.filter(item => {
                const nombreLinea = item['línea-de-dormitorio'] || item['línea-de-dormitorios'];
                const productosConLinea = productosBaseFiltrados.filter(producto => {
                    const valor = getProductValue(producto, 'lineaDormitorio');
                    if (!valor) return false;
                    return normalizarTexto(valor) === normalizarTexto(nombreLinea);
                });
                return productosConLinea.length > 0;
            });
            
            if (lineasConProductos.length > 0) {
                elementos.push(
                    <div className={`prds-filter-tag ${activeFilters.lineaDormitorio ? 'active' : ''}`} key="lineaDormitorio">
                        <div 
                            className='prds-filter-title-container'
                            onClick={(e) => {
                                const parent = e.currentTarget.closest('.prds-filter-tag');
                                parent?.classList.toggle('active');
                            }}
                        >
                            <p className='prds-filter-title'>Línea de dormitorio</p>
                            <span className="material-symbols-outlined">keyboard_arrow_down</span>
                        </div>

                        <div className='prds-filter-tag-results-container'>
                            <ul>
                                {lineasConProductos.map((item, index) => {
                                    const nombreLinea = item['línea-de-dormitorio'] || item['línea-de-dormitorios'];
                                    const isActive = activeFilters.lineaDormitorio === nombreLinea;
                                    return (
                                        <li key={index}>
                                            <button 
                                                type='button'
                                                className={isActive ? 'active' : ''}
                                                onClick={() => toggleFiltro('linea-dormitorio', isActive ? null : nombreLinea)}
                                            >
                                                <span></span>
                                                <p>{nombreLinea}</p>
                                            </button>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    </div>
                );
            }
        }

        // Filtros inferiores (dependientes de línea de dormitorio)
        if (activeFilters.lineaDormitorio) {
            const filtroResorte = renderFiltroDinamico('resorte', 'Resorte', 'resorte');
            if (filtroResorte) elementos.push(filtroResorte);

            if (activeFilters.resorte || !activeFilters.resorte) {
                const filtroLineaColchon = renderFiltroDinamico('lineaColchon', 'Línea de colchón', 'linea-colchon');
                if (filtroLineaColchon) elementos.push(filtroLineaColchon);
            }

            if (activeFilters.lineaColchon) {
                const filtroModelo = renderFiltroDinamico('modelo', 'Modelo', 'modelo');
                if (filtroModelo) elementos.push(filtroModelo);
            }

            if (activeFilters.modelo) {
                const filtroTipoCabecera = renderFiltroDinamico('tipoCabecera', 'Tipo de cabecera', 'tipo-cabecera');
                if (filtroTipoCabecera) elementos.push(filtroTipoCabecera);
            }

            if (activeFilters.tipoCabecera) {
                const filtroDiseñoCabecera = renderFiltroDinamico('diseñoCabecera', 'Diseño de cabecera', 'diseño-cabecera');
                if (filtroDiseñoCabecera) elementos.push(filtroDiseñoCabecera);
            }

            if (activeFilters.modelo) {
                const filtroCajon = renderFiltroDinamico('cajon', 'Cajones', 'cajon');
                if (filtroCajon) elementos.push(filtroCajon);
            }

            if (activeFilters.cajon === 'si') {
                const filtroCantidadCajones = renderCantidadCajonesDinamico();
                if (filtroCantidadCajones) elementos.push(filtroCantidadCajones);
            }

            if (activeFilters.modelo) {
                const filtroBaul = renderFiltroDinamico('baul', 'Baúl', 'baul');
                if (filtroBaul) elementos.push(filtroBaul);
            }

            if (activeFilters.modelo) {
                const filtroPiecera = renderFiltroDinamico('piecera', 'Piecera', 'piecera');
                if (filtroPiecera) elementos.push(filtroPiecera);
            }
        }

        return elementos.length > 0 ? elementos : null;
    };

    // ============ RENDERIZADO DE FILTROS DE TAMAÑO Y MARCA ============

    const renderTamañosFilters = () => {
        if (!filtrosData?.filtros?.[0]?.tamaño) return null;
        const tamaños = filtrosData.filtros[0].tamaño;

        return (
            <div className='prds-filter-tag'>
                <div 
                    className='prds-filter-title-container'
                    onClick={() => {
                        const tag = document.querySelector('.prds-filter-tag:first-child');
                        tag?.classList.toggle('active');
                    }}
                >
                    <p className='prds-filter-title'>Tamaños</p>
                    <span className="material-symbols-outlined">keyboard_arrow_down</span>
                </div>

                <div className='prds-filter-tag-results-container'>
                    <ul>
                        {tamaños.map((item, index) => {
                            const isActive = activeFilters.tamaño === item.tamaño;
                            return (
                                <li key={index}>
                                    <button 
                                        type='button'
                                        className={isActive ? 'active' : ''}
                                        onClick={() => toggleFiltro('tamaño', isActive ? null : item.tamaño)}
                                    >
                                        <span></span>
                                        <p>{item.tamaño}</p>
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>
        );
    };

    const renderMarcaFilters = () => {
        if (!filtrosData?.filtros?.[0]?.tamaño) return null;
        
        const tamañoActual = sub1 || activeFilters.tamaño || null;
        
        if (!tamañoActual) {
            // Mostrar todas las marcas si no hay tamaño seleccionado
            const todasLasMarcas = new Set();
            const tamaños = filtrosData.filtros[0].tamaño;
            
            tamaños.forEach(tamaño => {
                if (tamaño.marcas && Array.isArray(tamaño.marcas)) {
                    tamaño.marcas.forEach(marcaItem => {
                        if (marcaItem.marca) {
                            todasLasMarcas.add(marcaItem.marca);
                        }
                    });
                }
            });
            
            const marcasUnicas = Array.from(todasLasMarcas);
            if (marcasUnicas.length === 0) return null;

            return (
                <div className={`prds-filter-tag ${activeFilters.marca ? 'active' : ''}`}>
                    <div 
                        className='prds-filter-title-container'
                        onClick={() => {
                            const tag = document.querySelectorAll('.prds-filter-tag')[1];
                            tag?.classList.toggle('active');
                        }}
                    >
                        <p className='prds-filter-title'>Marcas</p>
                        <span className="material-symbols-outlined">keyboard_arrow_down</span>
                    </div>

                    <div className='prds-filter-tag-results-container'>
                        <ul>
                            {marcasUnicas.map((marca, index) => {
                                const isActive = activeFilters.marca === marca;
                                return (
                                    <li key={index}>
                                        <button 
                                            type='button'
                                            className={isActive ? 'active' : ''}
                                            onClick={() => toggleFiltro('marca', isActive ? null : marca)}
                                        >
                                            <span></span>
                                            <p>{marca}</p>
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>
            );
        }
        
        const tamañoData = filtrosData.filtros[0].tamaño.find(
            t => normalizarTexto(t.tamaño) === normalizarTexto(tamañoActual)
        );
        
        if (!tamañoData || !tamañoData.marcas || tamañoData.marcas.length === 0) {
            return null;
        }
        
        const marcasDisponibles = tamañoData.marcas.map(m => m.marca);
        
        return (
            <div className={`prds-filter-tag ${activeFilters.marca ? 'active' : ''}`}>
                <div 
                    className='prds-filter-title-container'
                    onClick={() => {
                        const tag = document.querySelectorAll('.prds-filter-tag')[1];
                        tag?.classList.toggle('active');
                    }}
                >
                    <p className='prds-filter-title'>Marcas</p>
                    <span className="material-symbols-outlined">keyboard_arrow_down</span>
                </div>

                <div className='prds-filter-tag-results-container'>
                    <ul>
                        {marcasDisponibles.map((marca, index) => {
                            const isActive = activeFilters.marca === marca;
                            return (
                                <li key={index}>
                                    <button 
                                        type='button'
                                        className={isActive ? 'active' : ''}
                                        onClick={() => toggleFiltro('marca', isActive ? null : marca)}
                                    >
                                        <span></span>
                                        <p>{marca}</p>
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>
        );
    };

    // ============ FUNCIONES DE PAGINACIÓN ============

    // Usar productosOrdenados en lugar de productosFiltrados
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
            lineaDormitorio: null,
            resorte: null,
            lineaColchon: null,
            modelo: null,
            tipoCabecera: null,
            diseñoCabecera: null,
            cajon: null,
            cantidadCajones: null,
            baul: null,
            piecera: null
        });
        
        setEnvioGratisActivo(false);
        setIsHotSaleActive(false);
        localStorage.setItem('hotSaleActive', 'false');
        setCurrentPage(1);
        
        // Limpiar filtros de precio de la URL
        const params = new URLSearchParams(location.search);
        params.delete('min');
        params.delete('max');
        const newSearch = params.toString();
        const newPath = location.pathname + (newSearch ? `?${newSearch}` : '');
        navigate(newPath, { replace: true });
        
        setResetFiltersTrigger(true);
        setTimeout(() => {
            setResetFiltersTrigger(false);
        }, 100);
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

    // ============ RENDER ============

    if (sub5) {
        return null;
    }

    const getPageMeta = () => {
        const titleParts = ['Dormitorios'];
        if (sub1) titleParts.unshift(sub1.charAt(0).toUpperCase() + sub1.slice(1));
        if (sub2) titleParts.unshift(sub2.charAt(0).toUpperCase() + sub2.slice(1));
        if (sub3) titleParts.unshift(sub3.charAt(0).toUpperCase() + sub3.slice(1));
        if (sub4) titleParts.unshift(sub4.charAt(0).toUpperCase() + sub4.slice(1));
        
        return {
            title: `${titleParts.join(' | ')} | Homesleep`,
            description: `Encuentra los mejores dormitorios ${sub1 ? `tamaño ${sub1}` : ''} ${sub2 ? `marca ${sub2}` : ''} ${sub3 ? `modelo ${sub3}` : ''} ${sub4 ? `línea ${sub4}` : ''} en Homesleep.`
        };
    };

    const meta = getPageMeta();

    return (
        <>
            <Helmet>
                <title>{meta.title}</title>
                <meta name="description" content={meta.description} />
                <meta property="og:title" content={meta.title}/>
            </Helmet>

            <main className='products-page-main d-flex-column gap-20'>
                <Categorias/>

                <div className='products-page-blocks'>
                    <div className={`products-page-left ${isFiltersOpen ? 'active' : ''}`} ref={filtersPanelRef}>
                        <div className='products-page-filters-container-global'>
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
                                    {renderTamañosFilters()}
                                    {renderMarcaFilters()}
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

export default Dormitorios;
