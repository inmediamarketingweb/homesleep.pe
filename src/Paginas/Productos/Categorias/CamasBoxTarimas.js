// import { useEffect, useState, useMemo, useRef } from 'react';
// import { Helmet } from 'react-helmet';
// import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';

// import '../Productos.css';
// import './Layout.css';

// import Categorias from '../Componentes/Categorias/Categorias';
// import FiltrosTop from '../Componentes/FiltrosTop/FiltrosTop';
// import { Producto } from '../../../Componentes/Plantillas/Producto/Producto';
// import RangoPrecios from '../Componentes/RangoPrecios/RangoPrecios';

// const normalizarTexto = (texto) => {
//     if (!texto || typeof texto !== 'string') {
//         return '';
//     }
//     return texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
// };

// const filtroKeyMap = {
//     "tamaño": "tamaño",
//     "marca": "marca",
//     "línea": "línea",
//     "base-encajonada": "base-encajonada",
//     "tipo-de-cabecera": "tipo-de-cabecera",
//     "diseño-de-cabecera": "diseño-de-cabecera",
//     "brazos-de-cabecera": "brazos-de-cabecera"
// };

// function CamasBoxTarimas() {
//     const { sub1, sub2, sub3, sub4 } = useParams();
//     const location = useLocation();
//     const navigate = useNavigate();
//     const [productos, setProductos] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [filtros, setFiltros] = useState([]);
//     const [orden, setOrden] = useState("ultimo");
//     const [envioGratisActivo, setEnvioGratisActivo] = useState(false);
//     const [isHotSaleActive, setIsHotSaleActive] = useState(() => {
//         const saved = localStorage.getItem('hotSaleActive');
//         return saved === 'true';
//     });
//     const [hotSaleSKUs, setHotSaleSKUs] = useState([]);
//     const queryParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
//     const [isFiltersOpen, setIsFiltersOpen] = useState(false);
//     const filtersPanelRef = useRef(null);
//     const [currentPage, setCurrentPage] = useState(1);
//     const itemsPerPage = 20;
//     const [hasActiveFilters, setHasActiveFilters] = useState(false);
//     const closeFilters = () => { setIsFiltersOpen(false); };
//     const toggleEnvioGratis = () => { setEnvioGratisActivo(!envioGratisActivo); setCurrentPage(1); };

//     const handleHotSaleToggle = () => {
//         const newState = !isHotSaleActive;
//         setIsHotSaleActive(newState);
//         localStorage.setItem('hotSaleActive', newState);
//         setCurrentPage(1);
//     };

//     useEffect(() => {
//         const params = new URLSearchParams(location.search);
//         const hasPriceFilter = params.has('min') || params.has('max');
//         const hasOtherFilters = queryParams.toString() || envioGratisActivo || isHotSaleActive;
        
//         setHasActiveFilters(hasPriceFilter || hasOtherFilters);
//     }, [queryParams, envioGratisActivo, isHotSaleActive, location.search]);

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

//     const construirRutaProducto = (producto) => {
//         const detalles = producto["detalles-del-producto"]?.[0] || {};
//         let tamaño = detalles.tamaño?.toLowerCase() || '';
//         tamaño = tamaño.replace(/\s+/g, '-');
//         let marca = detalles.marca?.toLowerCase() || '';
//         marca = marca.replace(/\s+/g, '-');
//         let linea = detalles.línea?.toLowerCase() || '';
//         linea = linea.replace(/\s+/g, '-');
//         const sku = producto.sku || '';
//         return `/productos/camas-box-tarimas/${tamaño}/${marca}/${linea}/${sku}/`;
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

//     const obtenerArchivosJSONPorEstructura = async (sub1, sub2, sub3) => {
//         const archivosEncontrados = [];
        
//         if (sub3) {
//             const ruta = `/assets/json/categorias/camas-box-tarimas/${sub1}/${sub2}/${sub3}.json`;
//             archivosEncontrados.push(ruta);
//             return archivosEncontrados;
//         }
        
//         if (sub2) {
//             const lineasPosibles = ['americanas', 'europeas', 'clasicas', 'modernas', 'rusticas', 'americanas-con-cajones'];
//             for (const linea of lineasPosibles) {
//                 const ruta = `/assets/json/categorias/camas-box-tarimas/${sub1}/${sub2}/${linea}.json`;
//                 archivosEncontrados.push(ruta);
//             }
//             return archivosEncontrados;
//         }
        
//         if (sub1) {
//             const marcasPosibles = ['kamas', 'rosell', 'homesleep'];
//             const lineasPosibles = ['americanas', 'europeas', 'clasicas', 'modernas', 'rusticas', 'americanas-con-cajones'];
//             for (const marca of marcasPosibles) {
//                 for (const linea of lineasPosibles) {
//                     const ruta = `/assets/json/categorias/camas-box-tarimas/${sub1}/${marca}/${linea}.json`;
//                     archivosEncontrados.push(ruta);
//                 }
//             }
//             return archivosEncontrados;
//         }
        
//         const tamanos = ['king', 'queen', '2-plazas', '1-5-plazas', '1-plaza'];
//         const marcas = ['kamas', 'rosell', 'homesleep'];
//         const lineas = ['americanas', 'europeas', 'clasicas', 'modernas', 'rusticas', 'americanas-con-cajones'];
        
//         for (const tamaño of tamanos) {
//             for (const marca of marcas) {
//                 for (const linea of lineas) {
//                     const ruta = `/assets/json/categorias/camas-box-tarimas/${tamaño}/${marca}/${linea}.json`;
//                     archivosEncontrados.push(ruta);
//                 }
//             }
//         }
        
//         return archivosEncontrados;
//     };

//     const cargarProductosPorRuta = async (sub1, sub2, sub3) => {
//         try {
//             setLoading(true);
//             console.log('Cargando productos para:', { sub1, sub2, sub3 });

//             let archivosJSON = [];

//             try {
//                 const carpetaBase = `/assets/json/categorias/camas-box-tarimas`;
//                 let carpetaEspecifica = carpetaBase;
                
//                 if (sub1) carpetaEspecifica += `/${sub1}`;
//                 if (sub2) carpetaEspecifica += `/${sub2}`;
//                 if (sub3) carpetaEspecifica += `/${sub3}`;
                
//                 archivosJSON = await obtenerArchivosJSONEnCarpeta(carpetaEspecifica);
                
//                 if (archivosJSON.length > 0) {
//                     console.log('Usando manifest.json, archivos encontrados:', archivosJSON);
//                 } else {
//                     console.log('No se encontraron archivos en manifest, usando estrategia alternativa');
//                     archivosJSON = [];
//                 }
//             } catch (error) {
//                 console.log('Error con manifest, usando estrategia alternativa:', error);
//                 archivosJSON = [];
//             }

//             if (archivosJSON.length === 0) {
//                 archivosJSON = await obtenerArchivosJSONPorEstructura(sub1, sub2, sub3);
//             }

//             const productosPromesas = archivosJSON.map(async (url) => {
//                 try {
//                     console.log('Intentando cargar:', url);
//                     const response = await fetch(url);
//                     if (!response.ok) {
//                         console.warn(`Archivo no encontrado: ${url}`);
//                         return [];
//                     }
//                     const data = await response.json();
//                     return data.productos || [];
//                 } catch (error) {
//                     console.error(`Error cargando ${url}:`, error);
//                     return [];
//                 }
//             });

//             const productosPorArchivo = await Promise.all(productosPromesas);
//             let todosProductos = productosPorArchivo.flat();
            
//             todosProductos = todosProductos.map(producto => {
//                 const ruta = construirRutaProducto(producto);
//                 return {
//                     ...producto,
//                     ruta: ruta
//                 };
//             });
            
//             console.log(`Total de productos cargados: ${todosProductos.length}`);
//             if (todosProductos.length > 0) {
//                 console.log('Primer producto con ruta:', {
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

//     useEffect(() => {
//         if (sub4) {
//             setProductos([]);
//             setLoading(false);
//             return;
//         }

//         const cargarProductos = async () => {
//             const productosCargados = await cargarProductosPorRuta(sub1, sub2, sub3);
//             setProductos(productosCargados);
//             setCurrentPage(1);
//         };

//         cargarProductos();
//     }, [sub1, sub2, sub3, sub4]);

//     useEffect(() => {
//         if (sub4) return;

//         const cargarFiltros = async () => {
//             try {
//                 const response = await fetch('/assets/json/categorias/camas-box-tarimas/filtros.json');
//                 const data = await response.json();
//                 setFiltros(data.filtros || []);
//             } catch (error) {
//                 console.error("Error cargando filtros:", error);
//             }
//         };

//         cargarFiltros();
//     }, [sub4]);

//     const productosBaseFiltrados = useMemo(() => {
//         if (productos.length === 0) return [];

//         let filtrados = productos;

//         if (queryParams.entries().length !== 0 || envioGratisActivo) {
//             filtrados = productos.filter(producto => {
//                 if (envioGratisActivo) {
//                     if (producto["tipo-de-envio"] !== "Gratis") {
//                         return false;
//                     }
//                 }

//                 for (let [paramUrl, valorFiltro] of queryParams.entries()) {
//                     if (paramUrl === 'min' || paramUrl === 'max') continue;

//                     const claveJson = filtroKeyMap[paramUrl];
//                     if (!claveJson) continue;

//                     const normalizadoFiltro = normalizarTexto(valorFiltro);
//                     const detalles = producto["detalles-del-producto"] || [];

//                     const cumpleFiltro = detalles.some(detalle => {
//                         const valorProducto = detalle[claveJson];
//                         if (!valorProducto) return false;

//                         const normalizadoProducto = normalizarTexto(valorProducto.toString());
//                         return normalizadoProducto === normalizadoFiltro;
//                     });

//                     if (!cumpleFiltro) return false;
//                 }
//                 return true;
//             });
//         }

//         if (isHotSaleActive && hotSaleSKUs.length > 0) {
//             filtrados = filtrados.filter(producto => hotSaleSKUs.includes(producto.sku));
//         }

//         return filtrados;
//     }, [productos, queryParams, envioGratisActivo, isHotSaleActive, hotSaleSKUs]);

//     const productosFiltrados = useMemo(() => {
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

//     const productosOrdenados = useMemo(() => {
//         return [...productosFiltrados].sort((a, b) => {
//             const precioA = a.precioVenta || 0;
//             const precioB = b.precioVenta || 0;

//             if (orden === "menor-mayor") return precioA - precioB;
//             if (orden === "mayor-menor") return precioB - precioA;
//             return 0;
//         });
//     }, [productosFiltrados, orden]);

//     const totalItems = productosOrdenados.length;
//     const totalPages = Math.ceil(totalItems / itemsPerPage);
//     const startIndex = (currentPage - 1) * itemsPerPage;
//     const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
//     const productosPagina = productosOrdenados.slice(startIndex, endIndex);

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

//     const toggleFiltro = (nombreFiltro, valor) => {
//         const normalizadoValor = normalizarTexto(valor);
//         const newParams = new URLSearchParams(location.search);
//         const valorActual = newParams.get(nombreFiltro);

//         if (valorActual === normalizadoValor) {
//             newParams.delete(nombreFiltro);
//         } else {
//             newParams.set(nombreFiltro, normalizadoValor);
//         }

//         setCurrentPage(1);
//         navigate(`${location.pathname}?${newParams.toString()}`, { replace: true });
//     };

//     const isFiltroActivo = (nombreFiltro, valor) => {
//         const normalizadoValor = normalizarTexto(valor);
//         return queryParams.get(nombreFiltro) === normalizadoValor;
//     };

//     const limpiarFiltros = () => {
//         setCurrentPage(1);
//         setIsHotSaleActive(false);
//         localStorage.setItem('hotSaleActive', 'false');
//         setEnvioGratisActivo(false);
        
//         const params = new URLSearchParams(location.search);
//         params.delete('min');
//         params.delete('max');
//         const newSearch = params.toString();
//         const newPath = location.pathname + (newSearch ? `?${newSearch}` : '');
//         navigate(newPath, { replace: true });
//     };

//     if (sub4) {
//         return null;
//     }

//     const getPageMeta = () => {
//         const titleParts = ['Camas Box Tarimas'];
//         if (sub1) titleParts.unshift(sub1.charAt(0).toUpperCase() + sub1.slice(1));
//         if (sub2) titleParts.unshift(sub2.charAt(0).toUpperCase() + sub2.slice(1));
//         if (sub3) titleParts.unshift(sub3.charAt(0).toUpperCase() + sub3.slice(1));
        
//         return {
//             title: `${titleParts.join(' | ')} | Homesleep`,
//             description: `Encuentra las mejores camas box tarimas ${sub1 ? `tamaño ${sub1}` : ''} ${sub2 ? `marca ${sub2}` : ''} ${sub3 ? `línea ${sub3}` : ''} en Homesleep.`
//         };
//     };

//     const meta = getPageMeta();

//     return(
//         <>
//             <Helmet>
//                 <title>{meta.title}</title>
//                 <meta name="description" content={meta.description} />
//                 <meta property="og:title" content={meta.title}/>
//             </Helmet>

//             <main className='products-page-main d-flex-column gap-20'>
//                 <Categorias/>

//                 <div className='products-page-blocks'>
//                     <div className='products-page-left'>
//                         <div className={`products-page-left ${isFiltersOpen ? 'active' : ''}`} ref={filtersPanelRef}>
//                             <div className='d-flex-column gap-20'>
//                                 <div className='d-flex-column padding-bottom-20 border-bottom-2-solid-component'>
//                                     <p className='block-title color-color-1 uppercase w-100 d-flex'>Homesleep</p>
//                                     <button type='button' className='filters-button-close margin-left' onClick={closeFilters}>
//                                         <span className="material-icons color-color-1">close</span>
//                                     </button>
//                                     <p className='uppercase w-100 d-flex'>Las mejores marcas en productos para el descanso</p>
//                                 </div>

//                                 {/* <div className='envio-gratis-button-container'>
//                                     <div className='d-flex-center-center'>
//                                         <p className='weight-bold uppercase color-color-1 font-bold'>Envío gratis</p>
//                                     </div>
//                                     <div type='button' className={`envio-gratis-button ${envioGratisActivo ? 'active' : ''}`} onClick={toggleEnvioGratis}>
//                                         <span></span>
//                                     </div>
//                                 </div> */}

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

//                                 <div className='products-page-filters-container d-flex-column gap-20'>
//                                     {filtros.map((filtro, index) => {
//                                         const nombreFiltro = Object.keys(filtro)[0];
//                                         const valoresFiltro = filtro[nombreFiltro];

//                                         if (nombreFiltro === "tamaño") {
//                                             return(
//                                                 <div className='products-page-filter' key={index}>
//                                                     <p className='filter-title uppercase'>Tamaño</p>
//                                                     <ul className='products-page-filter-list'>
//                                                         {valoresFiltro.map((item, i) => (
//                                                             <li key={i}>
//                                                                 <Link 
//                                                                     to={item.ruta} 
//                                                                     className={location.pathname === item.ruta ? "products-page-filter-list-link active" : "products-page-filter-list-link"}
//                                                                 >
//                                                                     <p>{item.tamaño}</p>
//                                                                 </Link>
//                                                             </li>
//                                                         ))}
//                                                     </ul>
//                                                 </div>
//                                             );
//                                         }

//                                         return(
//                                             <div className='products-page-filter' key={index}>
//                                                 <p className='filter-title uppercase'>{nombreFiltro}</p>
//                                                 <ul className='products-page-filter-list'>
//                                                     {valoresFiltro.map((valor, i) => (
//                                                         <li key={i}>
//                                                             <button type='button' className={isFiltroActivo(nombreFiltro, valor) ? "active" : ""} onClick={() => toggleFiltro(nombreFiltro, valor)}>
//                                                                 <p>{valor}</p>
//                                                             </button>
//                                                         </li>
//                                                     ))}
//                                                 </ul>
//                                             </div>
//                                         );
//                                     })}
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
//                             itemsPerPage={itemsPerPage}
//                             startIndex={startIndex} 
//                             endIndex={endIndex}
//                         />

//                         <div className='products-page-products-container'>
//                             {loading ? (
//                                 <div className="loading-products d-flex-center-center d-flex-column gap-10">
//                                     <div className="spinner"></div>
//                                     <p>Cargando productos...</p>
//                                 </div>
//                             ) : (
//                                 <>
//                                     <ul className="products-page-products">
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
//                                                         <button key={index} className={`pagination-page ${currentPage === page ? 'active' : ''}`} onClick={() => handlePageChange(page)}>{page}</button>
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

// export default CamasBoxTarimas;

import { useEffect, useState, useMemo, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';

import '../Productos.css';
import './Layout.css';

// import BtnGeneral from './Componentes/BtnGeneral/BtnGeneral';
import FiltrosTop from '../Componentes/FiltrosTop/FiltrosTop';
import { Producto } from '../../../Componentes/Plantillas/Producto/Producto';
import { usePagination } from '../../../Hooks/usePagination';
import RangoPrecios from '../Componentes/RangoPrecios/RangoPrecios';
import Categorias from '../Componentes/Categorias/Categorias';

const normalizarTexto = (texto) => {
    if (!texto || typeof texto !== 'string') {
        return '';
    }
    return texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
};

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

const getLineasCamaByMarca = (marca) => {
    const marcaNormalizada = normalizarTexto(marca);
    const excepciones = {
        'kamas': {
            lineasPermitidas: ['americanas', 'europeas', 'nube']
        }
    };

    if (excepciones[marcaNormalizada]) {
        return excepciones[marcaNormalizada].lineasPermitidas;
    }

    return null;
};

// ============ FUNCIÓN PARA OBTENER VALOR DEL PRODUCTO ============
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

    const fieldMappings = {
        'linea': ['línea', 'linea-de-cama', 'linea-cama', 'línea-de-cama', 'linea'],
        'tipoCabecera': ['tipo-de-cabecera', 'tipo-cabecera', 'tipo-de-cabeceras'],
        'diseñoCabecera': ['diseño-de-cabecera', 'diseño-cabecera', 'diseños-de-cabecera'],
        'cajon': ['cajón', 'cajon', 'cajones', 'tiene-cajon', 'tiene-cajón'],
        'cantidadCajones': ['cantidad-de-cajones', 'cantidad-cajones', 'cantidad-de-cajon', 'cantidad de cajones'],
        'piecera': ['piecera']
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

function CamasBoxTarimas() {
    const { sub1, sub2, sub3, sub4 } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filtrosData, setFiltrosData] = useState(null);
    const [orden, setOrden] = useState("ultimo");
    const queryParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);
    const filtersPanelRef = useRef(null);
    const itemsPerPage = 28;

    const [viewMode, setViewMode] = useState(() => {
        const savedMode = localStorage.getItem('viewMode');
        return savedMode || 'grid';
    });

    const [activeFilters, setActiveFilters] = useState({
        tamaño: null,
        marca: null,
        linea: null,
        tipoCabecera: null,
        diseñoCabecera: null,
        cajon: null,
        cantidadCajones: null,
        piecera: null
    });

    const [envioGratisActivo, setEnvioGratisActivo] = useState(false);
    const [filtroSkus, setFiltroSkus] = useState(null);
    const [resetFiltersTrigger, setResetFiltersTrigger] = useState(false);
    const [hasActiveFilters, setHasActiveFilters] = useState(false);

    const closeFilters = () => {
        setIsFiltersOpen(false);
    };

    const filterParamMap = {
        'tamaño': 'tamaño',
        'marca': 'marca',
        'linea': 'linea',
        'tipo-cabecera': 'tipoCabecera',
        'diseño-cabecera': 'diseñoCabecera',
        'cajon': 'cajon',
        'cantidad-cajones': 'cantidadCajones',
        'piecera': 'piecera'
    };

    const paramMap = {
        tamaño: 'tamaño',
        marca: 'marca',
        linea: 'linea',
        tipoCabecera: 'tipo-cabecera',
        diseñoCabecera: 'diseño-cabecera',
        cajon: 'cajon',
        cantidadCajones: 'cantidad-cajones',
        piecera: 'piecera'
    };

    const filtrosDependientesDeLinea = [
        'tipoCabecera', 'diseñoCabecera', 'cajon', 'cantidadCajones', 'piecera'
    ];

    const ordenFiltrosInferiores = [
        'tipoCabecera', 'diseñoCabecera', 'cajon', 'cantidadCajones', 'piecera'
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

    // Detectar si hay filtros activos (incluyendo precio)
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const hasPriceFilter = params.has('min') || params.has('max');
        const hasOtherFilters = Object.values(activeFilters).some(v => v !== null) ||
                               filtroSkus || envioGratisActivo;
        
        setHasActiveFilters(hasPriceFilter || hasOtherFilters);
    }, [activeFilters, filtroSkus, envioGratisActivo, location.search]);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const marcaFromUrl = params.get('marca');
        
        if (marcaFromUrl) {
            setActiveFilters(prev => ({
                ...prev,
                marca: marcaFromUrl
            }));
        }
    }, []);

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

    // ============ CARGA DE PRODUCTOS ============

    useEffect(() => {
        const cargarProductosCamasBoxTarimas = async () => {
            try {
                setLoading(true);

                const manifestResponse = await fetch('/assets/json/manifest.json');
                const manifestData = await manifestResponse.json();
                const archivos = manifestData.files || [];
                const pathParts = location.pathname.split('/');
                const tamanioIndex = pathParts.indexOf('camas-box-tarimas') + 1;
                const tamanio = pathParts[tamanioIndex];

                let archivosProductos = archivos.filter(url =>
                    url.startsWith('/assets/json/categorias/camas-box-tarimas/')
                );

                if (tamanio) {
                    const tamanioNormalizado = normalizarTexto(tamanio);
                    archivosProductos = archivosProductos.filter(url => {
                        const urlParts = url.split('/');
                        const tamanioIndexInUrl = urlParts.indexOf('camas-box-tarimas') + 1;
                        const tamanioFromUrl = urlParts[tamanioIndexInUrl];
                        const tamanioNormalizadoFromUrl = normalizarTexto(tamanioFromUrl);
                        return tamanioNormalizadoFromUrl === tamanioNormalizado;
                    });
                }

                if (archivosProductos.length === 0) {
                    archivosProductos = archivos.filter(url =>
                        url.startsWith('/assets/json/categorias/camas-box-tarimas/')
                    );
                }

                if (sub2 && archivosProductos.length > 0) {
                    const marcaNormalizada = normalizarTexto(sub2);
                    archivosProductos = archivosProductos.filter(url => {
                        const urlParts = url.split('/');
                        const marcaIndex = urlParts.indexOf('camas-box-tarimas') + 2;
                        const marcaFromUrl = urlParts[marcaIndex];
                        return marcaFromUrl && normalizarTexto(marcaFromUrl) === marcaNormalizada;
                    });
                }

                if (sub3 && archivosProductos.length > 0) {
                    const modeloNormalizado = normalizarTexto(sub3);
                    archivosProductos = archivosProductos.filter(url => {
                        const urlParts = url.split('/');
                        const modeloIndex = urlParts.indexOf('camas-box-tarimas') + 3;
                        const modeloFromUrl = urlParts[modeloIndex];
                        return modeloFromUrl && normalizarTexto(modeloFromUrl) === modeloNormalizado;
                    });
                }

                if (sub4 && archivosProductos.length > 0) {
                    const tipoNormalizado = normalizarTexto(sub4);
                    archivosProductos = archivosProductos.filter(url => {
                        const urlParts = url.split('/');
                        const tipoIndex = urlParts.indexOf('camas-box-tarimas') + 4;
                        const tipoFromUrl = urlParts[tipoIndex];
                        return tipoFromUrl && normalizarTexto(tipoFromUrl) === tipoNormalizado;
                    });
                }

                const productosPromesas = archivosProductos.map(async (url) => {
                    try {
                        const response = await fetch(url);
                        const data = await response.json();

                        const productosConFicha = data.productos?.map(producto => {
                            if (!producto.tamaño) {
                                const urlParts = url.split('/');
                                const tamanioIndex = urlParts.indexOf('camas-box-tarimas') + 1;
                                const tamanioFromUrl = urlParts[tamanioIndex];
                                if (tamanioFromUrl) {
                                    producto.tamaño = tamanioFromUrl;
                                }
                            }
                            return {
                                ...producto,
                                fichaTecnica: data.ficha?.[0] || {}
                            };
                        }) || [];
                        
                        return productosConFicha;
                    } catch (error) {
                        console.error(`Error cargando archivo ${url}:`, error);
                        return [];
                    }
                });

                const productosPorArchivo = await Promise.all(productosPromesas);
                const todosProductos = productosPorArchivo.flat();

                setProductos(todosProductos);
                setLoading(false);
            } catch (error) {
                console.error("Error cargando productos de camas box tarimas:", error);
                setLoading(false);
            }
        };

        cargarProductosCamasBoxTarimas();
    }, [sub1, sub2, sub3, sub4, location.pathname]);

    // ============ CARGA DE FILTROS ============

    useEffect(() => {
        const cargarFiltros = async () => {
            try {
                const response = await fetch('/assets/json/categorias/camas-box-tarimas/filtros.json');
                const data = await response.json();
                setFiltrosData(data);
            } catch (error) {
                console.error("Error cargando filtros:", error);
            }
        };

        cargarFiltros();
    }, []);

    // ============ FUNCIONES DE FILTRADO ============

    const updateURL = (filterType, value) => {
        const params = new URLSearchParams(location.search);
        const paramName = paramMap[filterType] || filterType;

        if (value === null || value === undefined) {
            params.delete(paramName);
        } else {
            params.set(paramName, value);
        }

        const hierarchy = {
            'marca': ['linea', 'tipoCabecera', 'diseñoCabecera', 'cajon', 'cantidadCajones', 'piecera'],
            'linea': ['tipoCabecera', 'diseñoCabecera', 'cajon', 'cantidadCajones', 'piecera'],
            'tipoCabecera': ['diseñoCabecera', 'cajon', 'cantidadCajones', 'piecera'],
            'diseñoCabecera': ['cajon', 'cantidadCajones', 'piecera'],
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

    const handleFilterChange = (filterType, value) => {
        setActiveFilters(prev => {
            const newFilters = { ...prev };
            
            if (filterType === 'marca') {
                newFilters.marca = value;
                newFilters.linea = null;
                newFilters.tipoCabecera = null;
                newFilters.diseñoCabecera = null;
                newFilters.cajon = null;
                newFilters.cantidadCajones = null;
                newFilters.piecera = null;
            } else if (filterType === 'linea') {
                newFilters.linea = value;
                filtrosDependientesDeLinea.forEach(filtro => {
                    newFilters[filtro] = null;
                });
            } else if (filterType === 'tipoCabecera') {
                newFilters.tipoCabecera = value;
                if (value === null) {
                    newFilters.diseñoCabecera = null;
                    newFilters.cajon = null;
                    newFilters.cantidadCajones = null;
                    newFilters.piecera = null;
                }
            } else if (filterType === 'diseñoCabecera') {
                newFilters.diseñoCabecera = value;
                if (value === null) {
                    newFilters.cajon = null;
                    newFilters.cantidadCajones = null;
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
            return newFilters;
        });
    };

    const handleFiltroSkus = (skus) => {
        setFiltroSkus(skus);
    };

    const handleEnvioGratis = (activo) => {
        setEnvioGratisActivo(activo);
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

    const filtrarProductosPorFiltros = (productosList, filtrosAplicar) => {
        if (!productosList || productosList.length === 0) return [];
        if (!filtrosAplicar || Object.keys(filtrosAplicar).length === 0) return productosList;

        return productosList.filter(producto => {
            let cumpleTodos = true;

            const filtrosSuperiores = ['tamaño', 'marca', 'linea'];
            
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

    // PASO 1: Filtros base (tamaño, marca, linea, envio gratis, skus)
    const productosBaseFiltrados = useMemo(() => {
        if (productos.length === 0) return [];

        return productos.filter(producto => {
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

            const filtrosSuperiores = ['tamaño', 'marca', 'linea'];
            
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
    }, [productos, activeFilters.tamaño, activeFilters.marca, activeFilters.linea, envioGratisActivo, filtroSkus]);

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

    // PASO 3: Filtros jerárquicos (tipoCabecera, diseñoCabecera, cajon, etc.)
    const productosFiltrados = useMemo(() => {
        return filtrarProductosPorFiltros(productosFiltradosPorPrecio, activeFilters);
    }, [productosFiltradosPorPrecio, activeFilters]);

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
        if (!activeFilters.linea) return false;
        
        const dependencias = {
            'tipoCabecera': 'linea',
            'diseñoCabecera': 'tipoCabecera',
            'cajon': 'tipoCabecera',
            'cantidadCajones': 'cajon',
            'piecera': 'tipoCabecera'
        };

        if (dependencias[campo]) {
            const dependencia = dependencias[campo];
            if (campo === 'cantidadCajones') {
                return activeFilters.cajon === 'si';
            }
            return !!activeFilters[dependencia];
        }

        return true;
    };

    // ============ FUNCIONES PARA RENDERIZAR FILTROS DINÁMICOS ============

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
        if (!activeFilters.linea) return null;
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

        // Línea de cama (filtrada por marca)
        if (filtrosData.filtros[1] && filtrosData.filtros[1]['líneas']) {
            const todasLasLineas = filtrosData.filtros[1]['líneas'];
            let lineasFiltradas = todasLasLineas;

            if (activeFilters.marca) {
                const lineasPermitidas = getLineasCamaByMarca(activeFilters.marca);
                
                if (lineasPermitidas) {
                    lineasFiltradas = todasLasLineas.filter(item => {
                        const nombreLinea = item['línea'] || item['línea-de-cama'];
                        return lineasPermitidas.some(permitida => 
                            normalizarTexto(permitida) === normalizarTexto(nombreLinea)
                        );
                    });
                }
            }
            
            // Filtrar líneas que tienen productos
            const lineasConProductos = lineasFiltradas.filter(item => {
                const nombreLinea = item['línea'] || item['línea-de-cama'];
                const productosConLinea = productosBaseFiltrados.filter(producto => {
                    const valor = getProductValue(producto, 'linea');
                    if (!valor) return false;
                    return normalizarTexto(valor) === normalizarTexto(nombreLinea);
                });
                return productosConLinea.length > 0;
            });
            
            if (lineasConProductos.length > 0) {
                elementos.push(
                    <div className={`prds-filter-tag ${activeFilters.linea ? 'active' : ''}`} key="linea">
                        <div 
                            className='prds-filter-title-container' 
                            onClick={(e) => {
                                const parent = e.currentTarget.closest('.prds-filter-tag');
                                parent?.classList.toggle('active');
                            }}
                        >
                            <p className='prds-filter-title'>Línea de cama</p>
                            <span className="material-symbols-outlined">keyboard_arrow_down</span>
                        </div>

                        <div className='prds-filter-tag-results-container'>
                            <ul>
                                {lineasConProductos.map((item, index) => {
                                    const nombreLinea = item['línea'] || item['línea-de-cama'];
                                    const isActive = activeFilters.linea === nombreLinea;
                                    
                                    return (
                                        <li key={index}>
                                            <button 
                                                type='button' 
                                                className={isActive ? 'active' : ''} 
                                                onClick={() => toggleFiltro('linea', isActive ? null : nombreLinea)}
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

        // Filtros inferiores (dependientes de línea)
        if (activeFilters.linea) {
            const filtroTipoCabecera = renderFiltroDinamico('tipoCabecera', 'Tipo de cabecera', 'tipo-cabecera');
            if (filtroTipoCabecera) elementos.push(filtroTipoCabecera);

            if (activeFilters.tipoCabecera) {
                const filtroDiseñoCabecera = renderFiltroDinamico('diseñoCabecera', 'Diseño de cabecera', 'diseño-cabecera');
                if (filtroDiseñoCabecera) elementos.push(filtroDiseñoCabecera);
            }

            if (activeFilters.tipoCabecera) {
                const filtroCajon = renderFiltroDinamico('cajon', 'Cajones', 'cajon');
                if (filtroCajon) elementos.push(filtroCajon);
            }

            if (activeFilters.cajon === 'si') {
                const filtroCantidadCajones = renderCantidadCajonesDinamico();
                if (filtroCantidadCajones) elementos.push(filtroCantidadCajones);
            }

            if (activeFilters.tipoCabecera) {
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
                    <p className='prds-filter-title'>Tamaños</p>
                    <span className="material-symbols-outlined">keyboard_arrow_down</span>
                </div>

                <div className='prds-filter-tag-results-container'>
                    <ul>
                        {tamaños.map((item, index) => {
                            const finalUrl = item.ruta;
                            const currentPathNormalized = currentPath.endsWith('/') ? currentPath.slice(0, -1) : currentPath;
                            const linkPathNormalized = finalUrl.endsWith('/') ? finalUrl.slice(0, -1) : finalUrl;
                            const isActive = currentPathNormalized === linkPathNormalized;

                            return (
                                <li key={index}>
                                    <Link 
                                        to={finalUrl} 
                                        className={isActive ? 'active' : ''} 
                                        title={`Ver productos tamaño ${item.tamaño}`}
                                    >
                                        <span></span>
                                        <p>{item.tamaño}</p>
                                    </Link>
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

    // ============ ORDENAMIENTO Y PAGINACIÓN ============

    const productosOrdenados = useMemo(() => {
        return [...productosFiltrados].sort((a, b) => {
            if (orden === "menor-mayor") {
                return (a.precioVenta || 0) - (b.precioVenta || 0);
            } else if (orden === "mayor-menor") {
                return (b.precioVenta || 0) - (a.precioVenta || 0);
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

    // Resetear página cuando cambian los filtros
    useEffect(() => {
        resetPage();
    }, [activeFilters, envioGratisActivo, filtroSkus, orden, location.search]);

    const productosPagina = productosOrdenados.slice(startIndex, endIndex);

    // ============ LIMPIAR FILTROS ============

    const limpiarFiltros = () => {
        setActiveFilters({
            tamaño: null,
            marca: null,
            linea: null,
            tipoCabecera: null,
            diseñoCabecera: null,
            cajon: null,
            cantidadCajones: null,
            piecera: null
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
        setTimeout(() => {
            setResetFiltersTrigger(false);
        }, 100);
    };

    // ============ RENDER ============

    return (
        <>
            <Helmet>
                <title>Camas Box Tarimas | Homesleep</title>
                <meta name='description' content='En Homesleep contamos con una gran variedad en camas box tarimas. Contamos con las mejores marcas del mercado.' />
            </Helmet>

            <main className='products-page-main d-flex-column gap-10'>
                <Categorias/>

                <div className='products-page-blocks'>
                    {/* <img src='/assets/imagenes/productos/camas-box-tarimas/cat-banner.png' className='h-cat-banner' alt=''/> */}

                    <div className={`products-page-left ${isFiltersOpen ? 'active' : ''}`} ref={filtersPanelRef}>
                        <div className='products-page-filters-container-global'>
                            <div className='d-flex-column gap-20-to-10'>
                                <div className='hp-cat-title'>
                                    <h1>Camas Box Tarimas</h1>
                                    <p className='text'>Encuentra la cama box tarima ideal para tu descanso, en las mejores marcas del mercado</p>
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
                                        {renderTamañosFilters()}
                                        {renderMarcaFilters()}
                                        {renderFiltrosJerarquicos()}
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
                                        <div className='pagination-container'>
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

export default CamasBoxTarimas;
