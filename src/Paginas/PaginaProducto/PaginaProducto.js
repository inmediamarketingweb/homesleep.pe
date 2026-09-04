// import { useState, useEffect, lazy, Suspense } from 'react';
// import { Helmet } from 'react-helmet';
// import { useLocation } from 'react-router-dom';
// import NoProducto from '../../Paginas/NoProducto/NoProducto';
// import SpinnerLoading from '../../Componentes/SpinnerLoading/SpinnerLoading';
// import Jerarquia from './Componentes/Jerarquia/Jerarquia';
// import Sku from './Componentes/Sku/Sku';
// import Compartir from './Componentes/Compartir/Compartir';
// import Imagenes from './Componentes/Imagenes/Imagenes';
// import Regalos from './Componentes/Regalos/Regalos';
// import Resumen from './Componentes/Resumen/Resumen';
// import Medidas from './Componentes/Medidas/Medidas';
// import Envios from './Componentes/Envios/Envios';
// import Beneficios from './Componentes/Beneficios/Beneficios';
// // import Colores from './Componentes/Colores/Colores';
// import Cantidad from './Componentes/Cantidad/Cantidad';
// import WhatsApp from './Componentes/WhatsApp/WhatsApp';
// import Descripcion from './Componentes/Descripcion/Descripcion';

// import './PaginaProducto.css';

// const MasProductos = lazy(() => import('./Componentes/MasProductos/MasProductos'));

// function normalizePathWithTrailingSlash(p = "") {
//     if (!p) return "/";
//     return p.endsWith("/") ? p : p + "/";
// }

// async function obtenerDescripcionColchonDesdeNombre(nombreProductoCompleto, tamañoProductoPrincipal = null) {
//     const extraerNombreColchon = (nombreCompleto) => {
//         const partes = nombreCompleto.split('+');

//         if (partes.length >= 2) {
//             const parteColchon = partes[1].trim();

//             if (parteColchon.toLowerCase().includes('colchón')) {
//                 const regex = /COLCHÓN\s+(.+)/i;
//                 const match = parteColchon.match(regex);

//                 if (match && match[1]) {
//                     return `COLCHÓN ${match[1].trim()}`;
//                 }

//                 return parteColchon;
//             }
//         }

//         return null;
//     };

//     const extraerTamañoDelNombreProducto = (nombreCompleto) => {
//         const nombreLower = nombreCompleto.toLowerCase();

//         if (/\bking\b/i.test(nombreLower)) {
//             return 'king';
//         } else if (/\bqueen\b/i.test(nombreLower)) {
//             return 'queen';
//         } else if (/\b2\s*plazas\b/i.test(nombreLower)) {
//             return '2-plazas';
//         } else if (/\b1\s*plaza\s*y\s*media\b/i.test(nombreLower)) {
//             return '1-plaza-y-media';
//         } else if (/\b1\s*plaza\b/i.test(nombreLower)) {
//             return '1-plaza';
//         } else if (/\b4\s*plazas\b/i.test(nombreLower)) {
//             return '4-plazas';
//         }

//         return null;
//     };

//     const convertirNombreARuta = (nombreColchon, tamañoPrincipal) => {
//         if (!nombreColchon) return null;

//         let nombreNormalizado = nombreColchon.replace(/COLCHÓN\s*/i, '').trim().toLowerCase();
//         let tamaño = tamañoPrincipal;

//         if (!tamaño) {
//             if (/\b4\s*plazas\b/i.test(nombreNormalizado)) {
//                 tamaño = '4-plazas';
//                 nombreNormalizado = nombreNormalizado.replace(/\b4\s*plazas\b/i, '').trim();
//             } else if (/\bking\b/i.test(nombreNormalizado)) {
//                 tamaño = 'king';
//                 nombreNormalizado = nombreNormalizado.replace(/\bking\b/i, '').trim();
//             } else if (/\bqueen\b/i.test(nombreNormalizado)) {
//                 tamaño = 'queen';
//                 nombreNormalizado = nombreNormalizado.replace(/\bqueen\b/i, '').trim();
//             } else if (/\b2\s*plazas\b/i.test(nombreNormalizado)) {
//                 tamaño = '2-plazas';
//                 nombreNormalizado = nombreNormalizado.replace(/\b2\s*plazas\b/i, '').trim();
//             }
//         }

//         if (!tamaño) {
//             return null;
//         }

//         let marca = 'el-cisne';

//         if (/\bkamas\b/i.test(nombreNormalizado)) {
//             marca = 'kamas';
//             nombreNormalizado = nombreNormalizado.replace(/\bkamas\b/i, '').trim();
//         } else if (/\bparaiso\b/i.test(nombreNormalizado)) {
//             marca = 'paraiso';
//             nombreNormalizado = nombreNormalizado.replace(/\bparaiso\b/i, '').trim();
//         } else if (/\bkomfort\b/i.test(nombreNormalizado)) {
//             marca = 'komfort';
//             nombreNormalizado = nombreNormalizado.replace(/\bkomfort\b/i, '').trim();
//         } else if (/\bel\s*cisne\b/i.test(nombreNormalizado)) {
//             marca = 'el-cisne';
//             nombreNormalizado = nombreNormalizado.replace(/\bel\s*cisne\b/i, '').trim();
//         }

//         let modelo = nombreNormalizado.trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/gi, '').toLowerCase().replace(/^-+|-+$/g, '');

//         if (!modelo) {
//             return null;
//         }

//         const rutaFinal = `/assets/json/categorias/colchones/${tamaño}/${marca}/${modelo}.json`;

//         return rutaFinal;
//     };

//     try {
//         const nombreColchon = extraerNombreColchon(nombreProductoCompleto);

//         if (!nombreColchon) {
//             return null;
//         }

//         let tamañoParaBuscar = tamañoProductoPrincipal;
//         if (!tamañoParaBuscar) {
//             tamañoParaBuscar = extraerTamañoDelNombreProducto(nombreProductoCompleto);
//         }

//         const rutaColchon = convertirNombreARuta(nombreColchon, tamañoParaBuscar);

//         if (!rutaColchon) {
//             return null;
//         }

//         try {
//             const respuesta = await fetch(rutaColchon);

//             if (!respuesta.ok) {
//                 return null;
//             }

//             const contentType = respuesta.headers.get('content-type');
//             if (!contentType || !contentType.includes('application/json')) {
//                 return null;
//             }

//             const datosColchon = await respuesta.json();
//             let productoColchon = null;
//             let regalosColchon = [];
//             let fichaColchon = [];
//             let mensajesColchon = [];

//             if (Array.isArray(datosColchon.productos) && datosColchon.productos.length > 0) {
//                 productoColchon = datosColchon.productos[0];

//                 if (productoColchon && Array.isArray(productoColchon.regalos)) {
//                     regalosColchon = productoColchon.regalos;
//                 }
//             }

//             if (Array.isArray(datosColchon.ficha)) {
//                 fichaColchon = datosColchon.ficha;
//             }

//             if (Array.isArray(datosColchon.mensajes)) {
//                 mensajesColchon = datosColchon.mensajes;
//             }

//             return {
//                 ficha: fichaColchon,
//                 mensajes: mensajesColchon,
//                 producto: productoColchon,
//                 regalos: regalosColchon
//             };

//         } catch (fetchError) {
//             return null;
//         }

//     } catch (error) {
//         return null;
//     }
// }

// async function obtenerDescripcionTipoDormitorio(nombreProductoCompleto) {
//     try {
//         const nombreLower = nombreProductoCompleto.toLowerCase();
//         const rutaDescripciones = '/assets/json/descripciones.json';
//         const respuesta = await fetch(rutaDescripciones);

//         if (!respuesta.ok) {
//             return null;
//         }

//         const todasDescripciones = await respuesta.json();
//         let tipoDescripcion = null;

//         if (nombreLower.includes('americano')) {
//             const contieneCajones = nombreLower.includes('cajones') || nombreLower.includes('cajón');
//             tipoDescripcion = contieneCajones ? 'americano-con-cajones' : 'americano';
//         } else if (nombreLower.includes('europeo')) {
//             const contieneCajones = nombreLower.includes('cajones') || nombreLower.includes('cajón');
//             tipoDescripcion = contieneCajones ? 'europeo-con-cajones' : 'europeo';
//         }

//         if (!tipoDescripcion) {
//             return null;
//         }

//         const descripcion = todasDescripciones[tipoDescripcion];

//         if (!descripcion) {
//             return null;
//         }

//         const fichaFormateada = Array.isArray(descripcion) ? descripcion : [descripcion];

//         return {
//             ficha: fichaFormateada,
//             tipo: tipoDescripcion
//         };

//     } catch (error) {
//         return null;
//     }
// }

// async function obtenerDescripcionCabecera(nombreProductoCompleto) {
//     try {
//         const nombreLower = nombreProductoCompleto.toLowerCase();

//         if (!nombreLower.includes('cabecera')) {
//             return null;
//         }

//         const rutaDescripciones = '/assets/json/descripciones.json';
//         const respuesta = await fetch(rutaDescripciones);

//         if (!respuesta.ok) {
//             return null;
//         }

//         const todasDescripciones = await respuesta.json();
//         const tipoDescripcion = 'cabecera';
//         const descripcion = todasDescripciones[tipoDescripcion];

//         if (!descripcion) {
//             return null;
//         }

//         const fichaFormateada = Array.isArray(descripcion) ? descripcion : [descripcion];

//         return {
//             ficha: fichaFormateada
//         };

//     } catch (error) {
//         return null;
//     }
// }

// async function buscarProductoPorSKU(sku, tamaño, marca, linea) {
//     try {
//         const manifestResponse = await fetch('/assets/json/manifest.json');
//         const manifestData = await manifestResponse.json();
//         const archivos = manifestData.files || [];

//         const tamañoNormalizado = tamaño?.replace(/-/g, ' ') || '';
//         const marcaNormalizada = marca?.replace(/-/g, ' ') || '';
//         const lineaNormalizada = linea?.replace(/-/g, ' ') || '';

//         console.log('Buscando producto:', { sku, tamañoNormalizado, marcaNormalizada, lineaNormalizada });

//         const archivosCamasBox = archivos.filter(url =>
//             url.startsWith('/assets/json/categorias/camas-box-tarimas/') &&
//             url.endsWith('.json')
//         );

//         console.log('Archivos a revisar:', archivosCamasBox.length);

//         for (const url of archivosCamasBox) {
//             try {
//                 const response = await fetch(url);
//                 if (!response.ok) continue;

//                 const data = await response.json();
//                 const productos = data.productos || [];

//                 const encontrado = productos.find(p => String(p.sku) === String(sku));
//                 if (encontrado) {
//                     const detalles = encontrado["detalles-del-producto"]?.[0] || {};
//                     const tamañoProducto = detalles.tamaño?.toLowerCase() || '';
//                     const marcaProducto = detalles.marca?.toLowerCase() || '';
//                     const lineaProducto = detalles.línea?.toLowerCase() || '';

//                     if (!tamaño || !marca || !linea ||
//                         (tamañoProducto === tamañoNormalizado &&
//                             marcaProducto === marcaNormalizada &&
//                             lineaProducto === lineaNormalizada)) {
//                         console.log('Producto encontrado en:', url);
//                         return {
//                             producto: encontrado,
//                             mensajes: data.mensajes || [],
//                             ficha: data.ficha || []
//                         };
//                     }
//                 }
//             } catch (error) {
//                 console.error('Error cargando archivo:', url, error);
//             }
//         }

//         console.error('Producto no encontrado con SKU:', sku);
//         return null;
//     } catch (error) {
//         console.error('Error buscando producto por SKU:', error);
//         return null;
//     }
// }

// function PaginaProducto() {
//     console.log("PAGINA PRODUCTO MONTADA");

//     const location = useLocation();
//     const [productoData, setProductoData] = useState({
//         producto: null,
//         imagenes: [],
//         mensajes: [],
//         ficha: [],
//         error: false,
//         loading: true
//     });
//     const [isCategoryFallback, setIsCategoryFallback] = useState(false);
//     const [categoryProducts, setCategoryProducts] = useState([]);
//     const [descripcionColchon, setDescripcionColchon] = useState(null);
//     const [descripcionTipoDormitorio, setDescripcionTipoDormitorio] = useState(null);
//     const [descripcionCabecera, setDescripcionCabecera] = useState(null);
//     const [cargandoColchon, setCargandoColchon] = useState(false);
//     const [cargandoTipoDormitorio, setCargandoTipoDormitorio] = useState(false);
//     const [cargandoCabecera, setCargandoCabecera] = useState(false);
//     const [cantidad, setCantidad] = useState(1);
//     const [shippingInfo, setShippingInfo] = useState(null);

//     useEffect(() => {
//         let cancelled = false;

//         const fetchProducto = async () => {
//             setProductoData(prev => ({ ...prev, loading: true, error: false }));
//             setIsCategoryFallback(false);
//             setCategoryProducts([]);
//             setDescripcionColchon(null);
//             setDescripcionTipoDormitorio(null);
//             setDescripcionCabecera(null);
//             setShippingInfo(null);

//             const path = normalizePathWithTrailingSlash(location.pathname);

//             try {
//                 const pathParts = path.split('/').filter(Boolean);
//                 const skuFromUrl = pathParts[pathParts.length - 1];

//                 const esSKU = /^[A-Z0-9]+$/.test(skuFromUrl);

//                 if (esSKU && path.includes('camas-box-tarimas')) {
//                     console.log('Buscando producto por SKU:', skuFromUrl);

//                     const tamañoFromUrl = pathParts[2] || '';
//                     const marcaFromUrl = pathParts[3] || '';
//                     const lineaFromUrl = pathParts[4] || '';

//                     const resultado = await buscarProductoPorSKU(skuFromUrl, tamañoFromUrl, marcaFromUrl, lineaFromUrl);

//                     if (resultado && !cancelled) {
//                         setProductoData({
//                             producto: resultado.producto,
//                             imagenes: [],
//                             mensajes: resultado.mensajes || [],
//                             ficha: resultado.ficha || [],
//                             error: false,
//                             loading: false
//                         });
//                         cargarImagenesOptimizadas(resultado.producto.fotos);

//                         if (resultado.producto.nombre) {
//                             const nombre = resultado.producto.nombre;
//                             if (nombre.includes('+')) {
//                                 cargarDescripcionColchon(nombre, resultado.producto);
//                             }
//                             cargarDescripcionTipoDormitorio(nombre);
//                             cargarDescripcionCabecera(nombre);
//                         }
//                         return;
//                     }
//                 }

//                 let filesList = [];
//                 try {
//                     const manifestRes = await fetch('/assets/json/manifest.json');
//                     if (manifestRes.ok) {
//                         const manifestJson = await manifestRes.json();
//                         if (Array.isArray(manifestJson)) filesList = manifestJson;
//                         else if (Array.isArray(manifestJson.files)) filesList = manifestJson.files;
//                         else if (typeof manifestJson === 'object' && manifestJson !== null && manifestJson[path]) {
//                             const productFilePath = manifestJson[path];
//                             const resp = await fetch(productFilePath);
//                             if (resp.ok) {
//                                 const pd = await resp.json();
//                                 if (!cancelled) {
//                                     setProductoData({
//                                         producto: pd.productos?.[0] || pd,
//                                         imagenes: [],
//                                         mensajes: pd.mensajes || [],
//                                         ficha: pd.ficha || [],
//                                         error: false,
//                                         loading: false
//                                     });
//                                     cargarImagenesOptimizadas(pd.productos?.[0]?.fotos || pd.fotos || '');
//                                     return;
//                                 }
//                             }
//                         }
//                     }
//                 } catch (errIndex) { }

//                 if (filesList.length === 0) {
//                     try {
//                         const manifestRes2 = await fetch('/assets/json/manifest.json');
//                         if (manifestRes2.ok) {
//                             const manifestJson2 = await manifestRes2.json();
//                             if (Array.isArray(manifestJson2)) filesList = manifestJson2;
//                             else if (Array.isArray(manifestJson2.files)) filesList = manifestJson2.files;
//                         }
//                     } catch (e) { }
//                 }

//                 const parts = path.split('/').filter(Boolean);
//                 const category = parts[1] || parts[0] || '';
//                 let candidates = filesList.filter(f => f.includes(`/categorias/${category}/`));
//                 if (candidates.length === 0) candidates = filesList;
//                 let productoEncontrado = null;

//                 for (const filePath of candidates) {
//                     try {
//                         const r = await fetch(filePath);
//                         if (!r.ok) continue;
//                         const json = await r.json();
//                         const arr = json.productos || [];
//                         const found = arr.find(p => {
//                             const pr = String(p.ruta || "").trim();
//                             return normalizePathWithTrailingSlash(pr) === path;
//                         });
//                         if (found) {
//                             productoEncontrado = found;

//                             if (!cancelled) {
//                                 setProductoData({
//                                     producto: productoEncontrado,
//                                     imagenes: [],
//                                     mensajes: json.mensajes || [],
//                                     ficha: json.ficha || [],
//                                     error: false,
//                                     loading: false
//                                 });
//                                 cargarImagenesOptimizadas(productoEncontrado.fotos);

//                                 if (productoEncontrado.nombre) {
//                                     const nombre = productoEncontrado.nombre;
//                                     if (nombre.includes('+')) {
//                                         cargarDescripcionColchon(nombre, productoEncontrado);
//                                     }
//                                     cargarDescripcionTipoDormitorio(nombre);
//                                     cargarDescripcionCabecera(nombre);
//                                 }
//                             }
//                             return;
//                         }
//                     } catch (e) { continue; }
//                 }

//                 const idMatch = path.match(/\/(\d+)\/$/);

//                 if (idMatch) {
//                     const idStr = idMatch[1];
//                     for (const filePath of candidates) {
//                         try {
//                             const r = await fetch(filePath);
//                             if (!r.ok) continue;
//                             const json = await r.json();
//                             const arr = json.productos || [];
//                             const foundById = arr.find(p => {
//                                 const pr = normalizePathWithTrailingSlash(String(p.ruta || ""));
//                                 return pr.endsWith(`/${idStr}/`);
//                             });
//                             if (foundById) {
//                                 productoEncontrado = foundById;

//                                 if (!cancelled) {
//                                     setProductoData({
//                                         producto: productoEncontrado,
//                                         imagenes: [],
//                                         mensajes: json.mensajes || [],
//                                         ficha: json.ficha || [],
//                                         error: false,
//                                         loading: false
//                                     });
//                                     cargarImagenesOptimizadas(productoEncontrado.fotos);

//                                     if (productoEncontrado.nombre) {
//                                         const nombre = productoEncontrado.nombre;
//                                         if (nombre.includes('+')) {
//                                             cargarDescripcionColchon(nombre, productoEncontrado);
//                                         }
//                                         cargarDescripcionTipoDormitorio(nombre);
//                                         cargarDescripcionCabecera(nombre);
//                                     }
//                                 }
//                                 return;
//                             }
//                         } catch (e) { continue; }
//                     }
//                 }

//                 const rel = path.replace(/^\/productos\//, '').replace(/\/$/, '');
//                 const categoryJsonPath = `/assets/json/categorias/${rel}.json`;

//                 if (filesList.includes(categoryJsonPath)) {
//                     try {
//                         const catRes = await fetch(categoryJsonPath);
//                         if (catRes.ok) {
//                             const catJson = await catRes.json();
//                             if (Array.isArray(catJson.productos) && catJson.productos.length > 0) {
//                                 if (!cancelled) {
//                                     setIsCategoryFallback(true);
//                                     setCategoryProducts(catJson.productos);
//                                     setProductoData(prev => ({ ...prev, loading: false, producto: null, error: false }));
//                                 }
//                                 return;
//                             }
//                         }
//                     } catch (e) {
//                     }
//                 }

//                 if (!cancelled) {
//                     setProductoData(prev => ({ ...prev, error: true, loading: false }));
//                 }
//             } catch (error) {
//                 if (!cancelled) setProductoData(prev => ({ ...prev, error: true, loading: false }));
//             }
//         };

//         const cargarImagenesOptimizadas = (carpetaFotos) => {
//             const cargarImagen = async (index, formato) => {
//                 const url = `${carpetaFotos}${index}.${formato}`;
//                 return new Promise((resolve) => {
//                     const img = new Image();
//                     img.onload = () => resolve(url);
//                     img.onerror = () => resolve(null);
//                     img.src = url;
//                 });
//             };

//             (async () => {
//                 const primeraImagen = await cargarImagen(1, 'webp') || await cargarImagen(1, 'jpg') || await cargarImagen(1, 'png');

//                 if (primeraImagen) {
//                     setProductoData(prev => ({
//                         ...prev,
//                         imagenes: [primeraImagen]
//                     }));
//                 }
//             })();

//             setTimeout(async () => {
//                 const promesas = [];
//                 const formatos = ['webp', 'jpg'];

//                 for (let index = 2; index <= 5; index++) {
//                     for (const formato of formatos) {
//                         promesas.push(cargarImagen(index, formato));
//                     }
//                 }

//                 const resultados = await Promise.all(promesas);
//                 const nuevasImagenes = resultados.filter(url => url !== null);

//                 setProductoData(prev => ({
//                     ...prev,
//                     imagenes: [...prev.imagenes, ...nuevasImagenes]
//                 }));
//             }, 100);
//         };

//         const cargarDescripcionColchon = async (nombreProducto, productoPrincipal) => {
//             if (!nombreProducto || cancelled) return;

//             setCargandoColchon(true);
//             try {
//                 let tamañoProducto = null;
//                 if (productoPrincipal && productoPrincipal.tamaño) {
//                     tamañoProducto = productoPrincipal.tamaño.toLowerCase().replace(/\s+/g, '-');
//                 }

//                 const descripcion = await obtenerDescripcionColchonDesdeNombre(nombreProducto, tamañoProducto);

//                 if (!cancelled) {
//                     setDescripcionColchon(descripcion);
//                 }
//             } catch (error) {
//                 if (!cancelled) {
//                     setDescripcionColchon(null);
//                 }
//             } finally {
//                 if (!cancelled) {
//                     setCargandoColchon(false);
//                 }
//             }
//         };

//         const cargarDescripcionTipoDormitorio = async (nombreProducto) => {
//             if (!nombreProducto || cancelled) return;

//             setCargandoTipoDormitorio(true);
//             try {
//                 const descripcion = await obtenerDescripcionTipoDormitorio(nombreProducto);
//                 if (!cancelled) {
//                     setDescripcionTipoDormitorio(descripcion);
//                 }
//             } catch (error) {
//                 if (!cancelled) {
//                     setDescripcionTipoDormitorio(null);
//                 }
//             } finally {
//                 if (!cancelled) {
//                     setCargandoTipoDormitorio(false);
//                 }
//             }
//         };

//         const cargarDescripcionCabecera = async (nombreProducto) => {
//             if (!nombreProducto || cancelled) return;

//             setCargandoCabecera(true);
//             try {
//                 const descripcion = await obtenerDescripcionCabecera(nombreProducto);
//                 if (!cancelled) {
//                     setDescripcionCabecera(descripcion);
//                 }
//             } catch (error) {
//                 if (!cancelled) {
//                     setDescripcionCabecera(null);
//                 }
//             } finally {
//                 if (!cancelled) {
//                     setCargandoCabecera(false);
//                 }
//             }
//         };

//         fetchProducto();

//         return () => {
//             cancelled = true;
//         };
//     }, [location.pathname]);

//     useEffect(() => {
//         if (productoData.producto) {
//             document.title = productoData.producto.nombre;
//         }
//     }, [productoData.producto]);

//     const handleEnviosConfirm = (shippingData) => {
//         setShippingInfo(shippingData);
//         console.log('Información de envío seleccionada:', shippingData);
//     };

//     const getEnviosComponent = () => {
//         if (!productoData.producto) return null;

//         const productoConEnvio = {
//             ...productoData.producto,
//             'tipo-de-envio': productoData.producto['tipo-de-envio'] || 'Gratis'
//         };

//         return <Envios producto={productoConEnvio} onConfirm={handleEnviosConfirm} />;
//     };

//     if (isCategoryFallback) {
//         return (
//             <NoProducto />
//         );
//     }

//     if (productoData.error) {
//         return (
//             <NoProducto />
//         );
//     }

//     if (productoData.loading || !productoData.producto) {
//         return (
//             <SpinnerLoading />
//         );
//     }

//     const { producto, imagenes, mensajes, ficha } = productoData;
//     const descuento = Math.round(((producto.precioNormal - producto.precioVenta) * 100) / producto.precioNormal);

//     const productSchema = {
//         "@context": "https://schema.org/",
//         "@type": "Product",
//         "name": producto.nombre,
//         "image": [
//             `https://homesleep.pe${producto.fotos}1.jpg`
//         ],
//         "description": producto["resumen-del-producto"]?.map(d => Object.values(d)[0]).join(' – '),
//         "sku": producto.sku,
//         "brand": {
//             "@type": "Brand",
//             "name": "Homesleep"
//         },
//         "offers": {
//             "@type": "Offer",
//             "url": `https://homesleep.pe${producto.ruta}`,
//             "priceCurrency": "PEN",
//             "price": producto.precioVenta,
//             "priceValidUntil": "2025-12-31",
//             "itemCondition": "https://schema.org/NewCondition",
//             "availability": producto.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
//         }
//     };

//     // Verificación antes de renderizar MasProductos
//     console.log('=== DATOS PARA MASPRODUCTOS ===');
//     console.log('producto existe?', !!producto);
//     console.log('producto.categoria:', producto?.categoria);
//     console.log('producto.nombre:', producto?.nombre);
//     console.log('producto.sku:', producto?.sku);

//     return (
//         <>
//             <Helmet>
//                 <title>{producto.nombre}</title>
//                 <meta name="description" content={producto.nombre} />
//                 <link rel="preload" as="image" href={`https://homesleep.pe${producto.fotos}1.jpg`} />
//                 <meta property="og:image" content={`https://homesleep.pe${producto.fotos}1.jpg`} />
//                 <meta property="og:title" content={producto.nombre} />
//                 <meta property="og:site_name" content={producto.nombre} />
//                 <meta property="og:description" content={producto.nombre} />
//                 <meta property="og:type" content="website" />
//                 <meta property="og:url" content={`https://homesleep.pe${producto.ruta}`} />
//                 <script type="application/ld+json">{JSON.stringify(productSchema)}</script>
//             </Helmet>

//             <main className='page-main-product-page'>
//                 <div className='block-container product-page-block-container'>
//                     <section className='block-content product-page-block-content'>
//                         <div className='product-page-container'>
//                             <div className='product-page-target product-page-target-1 gap-20'>
//                                 <Jerarquia producto={producto} />

//                                 <div className='visible-on-mobile-no-desktop'>
//                                     <p className='product-page-category color-color-1'>{producto.categoria}</p>
//                                     <h1 className='product-page-name'>{producto.nombre}</h1>
//                                 </div>

//                                 <Imagenes imagenes={imagenes} producto={producto} />

//                                 <Beneficios />

//                                 <div className='visible-on-desktop-no-mobile'>
//                                     <Descripcion
//                                         producto={producto}
//                                         mensajes={mensajes}
//                                         ficha={ficha}
//                                         descripcionColchon={descripcionColchon}
//                                         descripcionTipoDormitorio={descripcionTipoDormitorio}
//                                         descripcionCabecera={descripcionCabecera}
//                                         cargandoColchon={cargandoColchon}
//                                         cargandoTipoDormitorio={cargandoTipoDormitorio}
//                                         cargandoCabecera={cargandoCabecera}
//                                     />
//                                 </div>
//                             </div>

//                             <div className='product-page-target product-page-target-2 d-flex-column gap-20'>
//                                 <div className='product-page-top-info'>
//                                     <div className='visible-on-desktop-no-mobile'>
//                                         <p className='product-page-category color-color-1'>{producto.categoria}</p>
//                                         <h1 className='product-page-name'>{producto.nombre}</h1>
//                                     </div>

//                                     <div className='visible-on-desktop-no-mobile'>
//                                         <div className='d-flex-center-left gap-10 margin-right'>
//                                             <Sku producto={producto} />
//                                             <Compartir />
//                                         </div>
//                                     </div>
//                                 </div>

//                                 <div>
//                                     <div className='d-flex-column gap-20'>
//                                         <div className='d-grid-3-1fr gap-10'>
//                                             <div className='d-flex-column gap-20-to-10'>
//                                                 <div className='visible-on-mobile-no-desktop'>
//                                                     <div className='page-product-prices'>
//                                                         <div className='d-flex-center-left gap-5'>
//                                                             <p className='page-product-normal-price'>S/.{producto.precioNormal}</p>
//                                                             <span className="product-page-discount">-{descuento}%</span>
//                                                         </div>

//                                                         <p className='page-product-sale-price'>S/.{producto.precioVenta}</p>
//                                                     </div>
//                                                 </div>

//                                                 <Resumen producto={producto} ficha={ficha} />

//                                                 <div className='visible-on-desktop-no-mobile'>
//                                                     <div className='d-flex-column gap-20'>
//                                                         <Regalos producto={producto} descripcionColchon={descripcionColchon} />
//                                                     </div>
//                                                 </div>
//                                             </div>

//                                             {getEnviosComponent()}

//                                             <div className='d-flex-column gap-20-to-10'>
//                                                 <div className='visible-on-desktop-no-mobiles'>
//                                                     <div className='d-flex-column gap-10'>
//                                                         <div className='page-product-prices'>
//                                                             <div className='d-flex-center-left gap-5'>
//                                                                 <p className='page-product-normal-price'>S/.{producto.precioNormal}</p>
//                                                                 <span className="product-page-discount">-{descuento}%</span>
//                                                             </div>

//                                                             <p className='page-product-sale-price'>S/.{producto.precioVenta}</p>
//                                                         </div>
//                                                     </div>
//                                                 </div>

//                                                 <div className='visible-on-mobile-no-desktop'>
//                                                     <div className='d-flex-column gap-10'>
//                                                         <div className='d-flex d-flex-wrap gap-10'>
//                                                             <Regalos producto={producto} descripcionColchon={descripcionColchon} />
//                                                         </div>

//                                                         <Medidas producto={producto} />
//                                                     </div>
//                                                 </div>

//                                                 <div className='visible-on-desktop-no-mobile'>
//                                                     <div className='button-continue-container'>
//                                                         <Cantidad onChange={setCantidad} />
//                                                         <WhatsApp producto={producto} quantity={cantidad} shippingInfo={shippingInfo} />
//                                                     </div>
//                                                 </div>
//                                             </div>

//                                             <div className='visible-on-mobile-no-desktop'>
//                                                 <Descripcion
//                                                     producto={producto}
//                                                     mensajes={mensajes}
//                                                     ficha={ficha}
//                                                     descripcionColchon={descripcionColchon}
//                                                     descripcionTipoDormitorio={descripcionTipoDormitorio}
//                                                     descripcionCabecera={descripcionCabecera}
//                                                     cargandoColchon={cargandoColchon}
//                                                     cargandoTipoDormitorio={cargandoTipoDormitorio}
//                                                     cargandoCabecera={cargandoCabecera}
//                                                 />
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </section>
//                 </div>

//                 <div className='visible-on-mobile-no-desktop'>
//                     <div className='button-continue-container'>
//                         <Cantidad onChange={setCantidad} />
//                         <WhatsApp producto={producto} quantity={cantidad} shippingInfo={shippingInfo} />
//                     </div>
//                 </div>

//                 <Suspense fallback={
//                     <div className="loading-mas-productos">Cargando productos relacionados...</div>
//                 }>
//                     <MasProductos categoriaActual={producto.categoría} productoActual={producto} />
//                 </Suspense>
//             </main>
//         </>
//     );
// }

// export default PaginaProducto;

import { useState, useEffect, lazy, Suspense } from 'react';
import { Helmet } from 'react-helmet';
import { useLocation } from 'react-router-dom';
import NoProducto from '../../Paginas/NoProducto/NoProducto';
import SpinnerLoading from '../../Componentes/SpinnerLoading/SpinnerLoading';
import Jerarquia from './Componentes/Jerarquia/Jerarquia';
import Sku from './Componentes/Sku/Sku';
import Compartir from './Componentes/Compartir/Compartir';
import Imagenes from './Componentes/Imagenes/Imagenes';
import Regalos from './Componentes/Regalos/Regalos';
import Resumen from './Componentes/Resumen/Resumen';
import Medidas from './Componentes/Medidas/Medidas';
import Envios from './Componentes/Envios/Envios';
import Beneficios from './Componentes/Beneficios/Beneficios';
// import Colores from './Componentes/Colores/Colores';
import Cantidad from './Componentes/Cantidad/Cantidad';
import WhatsApp from './Componentes/WhatsApp/WhatsApp';
import Descripcion from './Componentes/Descripcion/Descripcion';

import './PaginaProducto.css';

const MasProductos = lazy(() => import('./Componentes/MasProductos/MasProductos'));

function normalizePathWithTrailingSlash(p = "") {
    if (!p) return "/";
    return p.endsWith("/") ? p : p + "/";
}

async function obtenerDescripcionColchonDesdeNombre(nombreProductoCompleto, tamañoProductoPrincipal = null) {
    const extraerNombreColchon = (nombreCompleto) => {
        const partes = nombreCompleto.split('+');

        if (partes.length >= 2) {
            const parteColchon = partes[1].trim();

            if (parteColchon.toLowerCase().includes('colchón')) {
                const regex = /COLCHÓN\s+(.+)/i;
                const match = parteColchon.match(regex);

                if (match && match[1]) {
                    return `COLCHÓN ${match[1].trim()}`;
                }

                return parteColchon;
            }
        }

        return null;
    };

    const extraerTamañoDelNombreProducto = (nombreCompleto) => {
        const nombreLower = nombreCompleto.toLowerCase();

        if (/\bking\b/i.test(nombreLower)) {
            return 'king';
        } else if (/\bqueen\b/i.test(nombreLower)) {
            return 'queen';
        } else if (/\b2\s*plazas\b/i.test(nombreLower)) {
            return '2-plazas';
        } else if (/\b1\s*plaza\s*y\s*media\b/i.test(nombreLower)) {
            return '1-plaza-y-media';
        } else if (/\b1\s*plaza\b/i.test(nombreLower)) {
            return '1-plaza';
        } else if (/\b4\s*plazas\b/i.test(nombreLower)) {
            return '4-plazas';
        }

        return null;
    };

    const convertirNombreARuta = (nombreColchon, tamañoPrincipal) => {
        if (!nombreColchon) return null;

        let nombreNormalizado = nombreColchon.replace(/COLCHÓN\s*/i, '').trim().toLowerCase();
        let tamaño = tamañoPrincipal;

        if (!tamaño) {
            if (/\b4\s*plazas\b/i.test(nombreNormalizado)) {
                tamaño = '4-plazas';
                nombreNormalizado = nombreNormalizado.replace(/\b4\s*plazas\b/i, '').trim();
            } else if (/\bking\b/i.test(nombreNormalizado)) {
                tamaño = 'king';
                nombreNormalizado = nombreNormalizado.replace(/\bking\b/i, '').trim();
            } else if (/\bqueen\b/i.test(nombreNormalizado)) {
                tamaño = 'queen';
                nombreNormalizado = nombreNormalizado.replace(/\bqueen\b/i, '').trim();
            } else if (/\b2\s*plazas\b/i.test(nombreNormalizado)) {
                tamaño = '2-plazas';
                nombreNormalizado = nombreNormalizado.replace(/\b2\s*plazas\b/i, '').trim();
            }
        }

        if (!tamaño) {
            return null;
        }

        let marca = 'el-cisne';

        if (/\bkamas\b/i.test(nombreNormalizado)) {
            marca = 'kamas';
            nombreNormalizado = nombreNormalizado.replace(/\bkamas\b/i, '').trim();
        } else if (/\bparaiso\b/i.test(nombreNormalizado)) {
            marca = 'paraiso';
            nombreNormalizado = nombreNormalizado.replace(/\bparaiso\b/i, '').trim();
        } else if (/\bkomfort\b/i.test(nombreNormalizado)) {
            marca = 'komfort';
            nombreNormalizado = nombreNormalizado.replace(/\bkomfort\b/i, '').trim();
        } else if (/\bel\s*cisne\b/i.test(nombreNormalizado)) {
            marca = 'el-cisne';
            nombreNormalizado = nombreNormalizado.replace(/\bel\s*cisne\b/i, '').trim();
        }

        let modelo = nombreNormalizado.trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/gi, '').toLowerCase().replace(/^-+|-+$/g, '');

        if (!modelo) {
            return null;
        }

        const rutaFinal = `/assets/json/categorias/colchones/${tamaño}/${marca}/${modelo}.json`;

        return rutaFinal;
    };

    try {
        const nombreColchon = extraerNombreColchon(nombreProductoCompleto);

        if (!nombreColchon) {
            return null;
        }

        let tamañoParaBuscar = tamañoProductoPrincipal;
        if (!tamañoParaBuscar) {
            tamañoParaBuscar = extraerTamañoDelNombreProducto(nombreProductoCompleto);
        }

        const rutaColchon = convertirNombreARuta(nombreColchon, tamañoParaBuscar);

        if (!rutaColchon) {
            return null;
        }

        try {
            const respuesta = await fetch(rutaColchon);

            if (!respuesta.ok) {
                return null;
            }

            const contentType = respuesta.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                return null;
            }

            const datosColchon = await respuesta.json();
            let productoColchon = null;
            let regalosColchon = [];
            let fichaColchon = [];
            let mensajesColchon = [];

            if (Array.isArray(datosColchon.productos) && datosColchon.productos.length > 0) {
                productoColchon = datosColchon.productos[0];

                if (productoColchon && Array.isArray(productoColchon.regalos)) {
                    regalosColchon = productoColchon.regalos;
                }
            }

            if (Array.isArray(datosColchon.ficha)) {
                fichaColchon = datosColchon.ficha;
            }

            if (Array.isArray(datosColchon.mensajes)) {
                mensajesColchon = datosColchon.mensajes;
            }

            return {
                ficha: fichaColchon,
                mensajes: mensajesColchon,
                producto: productoColchon,
                regalos: regalosColchon
            };

        } catch (fetchError) {
            return null;
        }

    } catch (error) {
        return null;
    }
}

async function obtenerDescripcionTipoDormitorio(nombreProductoCompleto) {
    try {
        const nombreLower = nombreProductoCompleto.toLowerCase();
        const rutaDescripciones = '/assets/json/descripciones.json';
        const respuesta = await fetch(rutaDescripciones);

        if (!respuesta.ok) {
            return null;
        }

        const todasDescripciones = await respuesta.json();
        let tipoDescripcion = null;

        if (nombreLower.includes('americano')) {
            const contieneCajones = nombreLower.includes('cajones') || nombreLower.includes('cajón');
            tipoDescripcion = contieneCajones ? 'americano-con-cajones' : 'americano';
        } else if (nombreLower.includes('europeo')) {
            const contieneCajones = nombreLower.includes('cajones') || nombreLower.includes('cajón');
            tipoDescripcion = contieneCajones ? 'europeo-con-cajones' : 'europeo';
        }

        if (!tipoDescripcion) {
            return null;
        }

        const descripcion = todasDescripciones[tipoDescripcion];

        if (!descripcion) {
            return null;
        }

        const fichaFormateada = Array.isArray(descripcion) ? descripcion : [descripcion];

        return {
            ficha: fichaFormateada,
            tipo: tipoDescripcion
        };

    } catch (error) {
        return null;
    }
}

async function obtenerDescripcionCabecera(nombreProductoCompleto) {
    try {
        const nombreLower = nombreProductoCompleto.toLowerCase();

        if (!nombreLower.includes('cabecera')) {
            return null;
        }

        const rutaDescripciones = '/assets/json/descripciones.json';
        const respuesta = await fetch(rutaDescripciones);

        if (!respuesta.ok) {
            return null;
        }

        const todasDescripciones = await respuesta.json();
        const tipoDescripcion = 'cabecera';
        const descripcion = todasDescripciones[tipoDescripcion];

        if (!descripcion) {
            return null;
        }

        const fichaFormateada = Array.isArray(descripcion) ? descripcion : [descripcion];

        return {
            ficha: fichaFormateada
        };

    } catch (error) {
        return null;
    }
}

// Función mejorada para buscar producto por SKU en TODAS las categorías
async function buscarProductoPorSKUEnTodasCategorias(sku) {
    try {
        const manifestResponse = await fetch('/assets/json/manifest.json');
        const manifestData = await manifestResponse.json();
        const archivos = manifestData.files || [];

        console.log('Buscando SKU:', sku, 'en todos los archivos');

        // Buscar en TODOS los archivos JSON de todas las categorías
        const archivosJSON = archivos.filter(url =>
            url.startsWith('/assets/json/categorias/') &&
            url.endsWith('.json')
        );

        console.log('Archivos JSON totales a revisar:', archivosJSON.length);

        for (const url of archivosJSON) {
            try {
                const response = await fetch(url);
                if (!response.ok) continue;

                const data = await response.json();
                const productos = data.productos || [];

                const encontrado = productos.find(p => String(p.sku) === String(sku));
                if (encontrado) {
                    console.log('Producto encontrado en:', url);
                    return {
                        producto: encontrado,
                        mensajes: data.mensajes || [],
                        ficha: data.ficha || [],
                        categoria: url.split('/categorias/')[1]?.split('/')[0] || ''
                    };
                }
            } catch (error) {
                console.error('Error cargando archivo:', url, error);
            }
        }

        console.error('Producto no encontrado con SKU:', sku);
        return null;
    } catch (error) {
        console.error('Error buscando producto por SKU:', error);
        return null;
    }
}

function PaginaProducto() {
    console.log("PAGINA PRODUCTO MONTADA");

    const location = useLocation();
    const [productoData, setProductoData] = useState({
        producto: null,
        imagenes: [],
        mensajes: [],
        ficha: [],
        error: false,
        loading: true
    });
    const [isCategoryFallback, setIsCategoryFallback] = useState(false);
    const [categoryProducts, setCategoryProducts] = useState([]);
    const [descripcionColchon, setDescripcionColchon] = useState(null);
    const [descripcionTipoDormitorio, setDescripcionTipoDormitorio] = useState(null);
    const [descripcionCabecera, setDescripcionCabecera] = useState(null);
    const [cargandoColchon, setCargandoColchon] = useState(false);
    const [cargandoTipoDormitorio, setCargandoTipoDormitorio] = useState(false);
    const [cargandoCabecera, setCargandoCabecera] = useState(false);
    const [cantidad, setCantidad] = useState(1);
    const [shippingInfo, setShippingInfo] = useState(null);

    useEffect(() => {
        let cancelled = false;

        const fetchProducto = async () => {
            setProductoData(prev => ({ ...prev, loading: true, error: false }));
            setIsCategoryFallback(false);
            setCategoryProducts([]);
            setDescripcionColchon(null);
            setDescripcionTipoDormitorio(null);
            setDescripcionCabecera(null);
            setShippingInfo(null);

            const path = normalizePathWithTrailingSlash(location.pathname);

            try {
                const pathParts = path.split('/').filter(Boolean);
                const skuFromUrl = pathParts[pathParts.length - 1];

                // Verificar si el último segmento es un SKU (alfanumérico con mayúsculas)
                const esSKU = /^[A-Z0-9]+$/.test(skuFromUrl);

                if (esSKU) {
                    console.log('Buscando producto por SKU:', skuFromUrl);

                    // Buscar en TODAS las categorías
                    const resultado = await buscarProductoPorSKUEnTodasCategorias(skuFromUrl);

                    if (resultado && !cancelled) {
                        setProductoData({
                            producto: resultado.producto,
                            imagenes: [],
                            mensajes: resultado.mensajes || [],
                            ficha: resultado.ficha || [],
                            error: false,
                            loading: false
                        });
                        cargarImagenesOptimizadas(resultado.producto.fotos);

                        if (resultado.producto.nombre) {
                            const nombre = resultado.producto.nombre;
                            if (nombre.includes('+')) {
                                cargarDescripcionColchon(nombre, resultado.producto);
                            }
                            cargarDescripcionTipoDormitorio(nombre);
                            cargarDescripcionCabecera(nombre);
                        }
                        return;
                    }
                }

                // Si no se encontró por SKU, buscar por ruta (método existente)
                let filesList = [];
                try {
                    const manifestRes = await fetch('/assets/json/manifest.json');
                    if (manifestRes.ok) {
                        const manifestJson = await manifestRes.json();
                        if (Array.isArray(manifestJson)) filesList = manifestJson;
                        else if (Array.isArray(manifestJson.files)) filesList = manifestJson.files;
                        else if (typeof manifestJson === 'object' && manifestJson !== null && manifestJson[path]) {
                            const productFilePath = manifestJson[path];
                            const resp = await fetch(productFilePath);
                            if (resp.ok) {
                                const pd = await resp.json();
                                if (!cancelled) {
                                    setProductoData({
                                        producto: pd.productos?.[0] || pd,
                                        imagenes: [],
                                        mensajes: pd.mensajes || [],
                                        ficha: pd.ficha || [],
                                        error: false,
                                        loading: false
                                    });
                                    cargarImagenesOptimizadas(pd.productos?.[0]?.fotos || pd.fotos || '');
                                    return;
                                }
                            }
                        }
                    }
                } catch (errIndex) { }

                if (filesList.length === 0) {
                    try {
                        const manifestRes2 = await fetch('/assets/json/manifest.json');
                        if (manifestRes2.ok) {
                            const manifestJson2 = await manifestRes2.json();
                            if (Array.isArray(manifestJson2)) filesList = manifestJson2;
                            else if (Array.isArray(manifestJson2.files)) filesList = manifestJson2.files;
                        }
                    } catch (e) { }
                }

                const parts = path.split('/').filter(Boolean);
                const category = parts[1] || parts[0] || '';
                let candidates = filesList.filter(f => f.includes(`/categorias/${category}/`));
                if (candidates.length === 0) candidates = filesList;
                let productoEncontrado = null;

                for (const filePath of candidates) {
                    try {
                        const r = await fetch(filePath);
                        if (!r.ok) continue;
                        const json = await r.json();
                        const arr = json.productos || [];
                        const found = arr.find(p => {
                            const pr = String(p.ruta || "").trim();
                            return normalizePathWithTrailingSlash(pr) === path;
                        });
                        if (found) {
                            productoEncontrado = found;

                            if (!cancelled) {
                                setProductoData({
                                    producto: productoEncontrado,
                                    imagenes: [],
                                    mensajes: json.mensajes || [],
                                    ficha: json.ficha || [],
                                    error: false,
                                    loading: false
                                });
                                cargarImagenesOptimizadas(productoEncontrado.fotos);

                                if (productoEncontrado.nombre) {
                                    const nombre = productoEncontrado.nombre;
                                    if (nombre.includes('+')) {
                                        cargarDescripcionColchon(nombre, productoEncontrado);
                                    }
                                    cargarDescripcionTipoDormitorio(nombre);
                                    cargarDescripcionCabecera(nombre);
                                }
                            }
                            return;
                        }
                    } catch (e) { continue; }
                }

                const idMatch = path.match(/\/(\d+)\/$/);

                if (idMatch) {
                    const idStr = idMatch[1];
                    for (const filePath of candidates) {
                        try {
                            const r = await fetch(filePath);
                            if (!r.ok) continue;
                            const json = await r.json();
                            const arr = json.productos || [];
                            const foundById = arr.find(p => {
                                const pr = normalizePathWithTrailingSlash(String(p.ruta || ""));
                                return pr.endsWith(`/${idStr}/`);
                            });
                            if (foundById) {
                                productoEncontrado = foundById;

                                if (!cancelled) {
                                    setProductoData({
                                        producto: productoEncontrado,
                                        imagenes: [],
                                        mensajes: json.mensajes || [],
                                        ficha: json.ficha || [],
                                        error: false,
                                        loading: false
                                    });
                                    cargarImagenesOptimizadas(productoEncontrado.fotos);

                                    if (productoEncontrado.nombre) {
                                        const nombre = productoEncontrado.nombre;
                                        if (nombre.includes('+')) {
                                            cargarDescripcionColchon(nombre, productoEncontrado);
                                        }
                                        cargarDescripcionTipoDormitorio(nombre);
                                        cargarDescripcionCabecera(nombre);
                                    }
                                }
                                return;
                            }
                        } catch (e) { continue; }
                    }
                }

                const rel = path.replace(/^\/productos\//, '').replace(/\/$/, '');
                const categoryJsonPath = `/assets/json/categorias/${rel}.json`;

                if (filesList.includes(categoryJsonPath)) {
                    try {
                        const catRes = await fetch(categoryJsonPath);
                        if (catRes.ok) {
                            const catJson = await catRes.json();
                            if (Array.isArray(catJson.productos) && catJson.productos.length > 0) {
                                if (!cancelled) {
                                    setIsCategoryFallback(true);
                                    setCategoryProducts(catJson.productos);
                                    setProductoData(prev => ({ ...prev, loading: false, producto: null, error: false }));
                                }
                                return;
                            }
                        }
                    } catch (e) {
                    }
                }

                if (!cancelled) {
                    setProductoData(prev => ({ ...prev, error: true, loading: false }));
                }
            } catch (error) {
                if (!cancelled) setProductoData(prev => ({ ...prev, error: true, loading: false }));
            }
        };

        const cargarImagenesOptimizadas = (carpetaFotos) => {
            const cargarImagen = async (index, formato) => {
                const url = `${carpetaFotos}${index}.${formato}`;
                return new Promise((resolve) => {
                    const img = new Image();
                    img.onload = () => resolve(url);
                    img.onerror = () => resolve(null);
                    img.src = url;
                });
            };

            (async () => {
                const primeraImagen = await cargarImagen(1, 'webp') || await cargarImagen(1, 'jpg') || await cargarImagen(1, 'png');

                if (primeraImagen) {
                    setProductoData(prev => ({
                        ...prev,
                        imagenes: [primeraImagen]
                    }));
                }
            })();

            setTimeout(async () => {
                const promesas = [];
                const formatos = ['webp', 'jpg'];

                for (let index = 2; index <= 5; index++) {
                    for (const formato of formatos) {
                        promesas.push(cargarImagen(index, formato));
                    }
                }

                const resultados = await Promise.all(promesas);
                const nuevasImagenes = resultados.filter(url => url !== null);

                setProductoData(prev => ({
                    ...prev,
                    imagenes: [...prev.imagenes, ...nuevasImagenes]
                }));
            }, 100);
        };

        const cargarDescripcionColchon = async (nombreProducto, productoPrincipal) => {
            if (!nombreProducto || cancelled) return;

            setCargandoColchon(true);
            try {
                let tamañoProducto = null;
                if (productoPrincipal && productoPrincipal.tamaño) {
                    tamañoProducto = productoPrincipal.tamaño.toLowerCase().replace(/\s+/g, '-');
                }

                const descripcion = await obtenerDescripcionColchonDesdeNombre(nombreProducto, tamañoProducto);

                if (!cancelled) {
                    setDescripcionColchon(descripcion);
                }
            } catch (error) {
                if (!cancelled) {
                    setDescripcionColchon(null);
                }
            } finally {
                if (!cancelled) {
                    setCargandoColchon(false);
                }
            }
        };

        const cargarDescripcionTipoDormitorio = async (nombreProducto) => {
            if (!nombreProducto || cancelled) return;

            setCargandoTipoDormitorio(true);
            try {
                const descripcion = await obtenerDescripcionTipoDormitorio(nombreProducto);
                if (!cancelled) {
                    setDescripcionTipoDormitorio(descripcion);
                }
            } catch (error) {
                if (!cancelled) {
                    setDescripcionTipoDormitorio(null);
                }
            } finally {
                if (!cancelled) {
                    setCargandoTipoDormitorio(false);
                }
            }
        };

        const cargarDescripcionCabecera = async (nombreProducto) => {
            if (!nombreProducto || cancelled) return;

            setCargandoCabecera(true);
            try {
                const descripcion = await obtenerDescripcionCabecera(nombreProducto);
                if (!cancelled) {
                    setDescripcionCabecera(descripcion);
                }
            } catch (error) {
                if (!cancelled) {
                    setDescripcionCabecera(null);
                }
            } finally {
                if (!cancelled) {
                    setCargandoCabecera(false);
                }
            }
        };

        fetchProducto();

        return () => {
            cancelled = true;
        };
    }, [location.pathname]);

    useEffect(() => {
        if (productoData.producto) {
            document.title = productoData.producto.nombre;
        }
    }, [productoData.producto]);

    const handleEnviosConfirm = (shippingData) => {
        setShippingInfo(shippingData);
        console.log('Información de envío seleccionada:', shippingData);
    };

    const getEnviosComponent = () => {
        if (!productoData.producto) return null;

        const productoConEnvio = {
            ...productoData.producto,
            'tipo-de-envio': productoData.producto['tipo-de-envio'] || 'Gratis'
        };

        return <Envios producto={productoConEnvio} onConfirm={handleEnviosConfirm} />;
    };

    if (isCategoryFallback) {
        return (
            <NoProducto />
        );
    }

    if (productoData.error) {
        return (
            <NoProducto />
        );
    }

    if (productoData.loading || !productoData.producto) {
        return (
            <SpinnerLoading />
        );
    }

    const { producto, imagenes, mensajes, ficha } = productoData;
    const descuento = Math.round(((producto.precioNormal - producto.precioVenta) * 100) / producto.precioNormal);

    const productSchema = {
        "@context": "https://schema.org/",
        "@type": "Product",
        "name": producto.nombre,
        "image": [
            `https://homesleep.pe${producto.fotos}1.jpg`
        ],
        "description": producto["resumen-del-producto"]?.map(d => Object.values(d)[0]).join(' – '),
        "sku": producto.sku,
        "brand": {
            "@type": "Brand",
            "name": "Homesleep"
        },
        "offers": {
            "@type": "Offer",
            "url": `https://homesleep.pe${producto.ruta}`,
            "priceCurrency": "PEN",
            "price": producto.precioVenta,
            "priceValidUntil": "2025-12-31",
            "itemCondition": "https://schema.org/NewCondition",
            "availability": producto.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
        }
    };

    // Verificación antes de renderizar MasProductos
    console.log('=== DATOS PARA MASPRODUCTOS ===');
    console.log('producto existe?', !!producto);
    console.log('producto.categoria:', producto?.categoria);
    console.log('producto.nombre:', producto?.nombre);
    console.log('producto.sku:', producto?.sku);

    return (
        <>
            <Helmet>
                <title>{producto.nombre}</title>
                <meta name="description" content={producto.nombre} />
                <link rel="preload" as="image" href={`https://homesleep.pe${producto.fotos}1.jpg`} />
                <meta property="og:image" content={`https://homesleep.pe${producto.fotos}1.jpg`} />
                <meta property="og:title" content={producto.nombre} />
                <meta property="og:site_name" content={producto.nombre} />
                <meta property="og:description" content={producto.nombre} />
                <meta property="og:type" content="website" />
                <meta property="og:url" content={`https://homesleep.pe${producto.ruta}`} />
                <script type="application/ld+json">{JSON.stringify(productSchema)}</script>
            </Helmet>

            <main className='page-main-product-page'>
                <div className='block-container product-page-block-container'>
                    <section className='block-content product-page-block-content'>
                        <div className='product-page-container'>
                            <div className='product-page-target product-page-target-1 gap-20'>
                                <Jerarquia producto={producto} />

                                <div className='visible-on-mobile-no-desktop'>
                                    <p className='product-page-category color-color-1'>{producto.categoria}</p>
                                    <h1 className='product-page-name'>{producto.nombre}</h1>
                                </div>

                                <Imagenes imagenes={imagenes} producto={producto} />

                                <Beneficios />

                                <div className='visible-on-desktop-no-mobile'>
                                    <Descripcion
                                        producto={producto}
                                        mensajes={mensajes}
                                        ficha={ficha}
                                        descripcionColchon={descripcionColchon}
                                        descripcionTipoDormitorio={descripcionTipoDormitorio}
                                        descripcionCabecera={descripcionCabecera}
                                        cargandoColchon={cargandoColchon}
                                        cargandoTipoDormitorio={cargandoTipoDormitorio}
                                        cargandoCabecera={cargandoCabecera}
                                    />
                                </div>
                            </div>

                            <div className='product-page-target product-page-target-2 d-flex-column gap-20'>
                                <div className='product-page-top-info'>
                                    <div className='visible-on-desktop-no-mobile'>
                                        <p className='product-page-category color-color-1'>{producto.categoria}</p>
                                        <h1 className='product-page-name'>{producto.nombre}</h1>
                                    </div>

                                    <div className='visible-on-desktop-no-mobile'>
                                        <div className='d-flex-center-left gap-10 margin-right'>
                                            <Sku producto={producto} />
                                            <Compartir />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <div className='d-flex-column gap-20'>
                                        <div className='d-grid-3-1fr gap-10'>
                                            <div className='d-flex-column gap-20-to-10'>
                                                <div className='visible-on-mobile-no-desktop'>
                                                    <div className='page-product-prices'>
                                                        <div className='d-flex-center-left gap-5'>
                                                            <p className='page-product-normal-price'>S/.{producto.precioNormal}</p>
                                                            <span className="product-page-discount">-{descuento}%</span>
                                                        </div>

                                                        <p className='page-product-sale-price'>S/.{producto.precioVenta}</p>
                                                    </div>
                                                </div>

                                                <Resumen producto={producto} ficha={ficha} />

                                                <div className='visible-on-desktop-no-mobile'>
                                                    <div className='d-flex-column gap-20'>
                                                        <Regalos producto={producto} descripcionColchon={descripcionColchon} />
                                                    </div>
                                                </div>
                                            </div>

                                            {getEnviosComponent()}

                                            <div className='d-flex-column gap-20-to-10'>
                                                <div className='visible-on-desktop-no-mobiles'>
                                                    <div className='d-flex-column gap-10'>
                                                        <div className='page-product-prices'>
                                                            <div className='d-flex-center-left gap-5'>
                                                                <p className='page-product-normal-price'>S/.{producto.precioNormal}</p>
                                                                <span className="product-page-discount">-{descuento}%</span>
                                                            </div>

                                                            <p className='page-product-sale-price'>S/.{producto.precioVenta}</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className='visible-on-mobile-no-desktop'>
                                                    <div className='d-flex-column gap-10'>
                                                        <div className='d-flex d-flex-wrap gap-10'>
                                                            <Regalos producto={producto} descripcionColchon={descripcionColchon} />
                                                        </div>

                                                        <Medidas producto={producto} />
                                                    </div>
                                                </div>

                                                <div className='visible-on-desktop-no-mobile'>
                                                    <div className='button-continue-container'>
                                                        <Cantidad onChange={setCantidad} />
                                                        <WhatsApp producto={producto} quantity={cantidad} shippingInfo={shippingInfo} />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className='visible-on-mobile-no-desktop'>
                                                <Descripcion
                                                    producto={producto}
                                                    mensajes={mensajes}
                                                    ficha={ficha}
                                                    descripcionColchon={descripcionColchon}
                                                    descripcionTipoDormitorio={descripcionTipoDormitorio}
                                                    descripcionCabecera={descripcionCabecera}
                                                    cargandoColchon={cargandoColchon}
                                                    cargandoTipoDormitorio={cargandoTipoDormitorio}
                                                    cargandoCabecera={cargandoCabecera}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                <div className='visible-on-mobile-no-desktop'>
                    <div className='button-continue-container'>
                        <Cantidad onChange={setCantidad} />
                        <WhatsApp producto={producto} quantity={cantidad} shippingInfo={shippingInfo} />
                    </div>
                </div>

                <Suspense fallback={
                    <div className="loading-mas-productos">Cargando productos relacionados...</div>
                }>
                    <MasProductos categoriaActual={producto.categoría || producto.categoria} productoActual={producto} />
                </Suspense>
            </main>
        </>
    );
}

export default PaginaProducto;
