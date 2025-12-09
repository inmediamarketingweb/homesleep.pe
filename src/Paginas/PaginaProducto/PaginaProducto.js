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
import Beneficios from './Componentes/Beneficios/Beneficios';
import Envios from './Componentes/Envios/Envios';
import Colores from './Componentes/Colores/Colores';
import Cantidad from './Componentes/Cantidad/Cantidad';
import WhatsApp from './Componentes/WhatsApp/WhatsApp';
import Descripcion from './Componentes/Descripcion/Descripcion';

import './PaginaProducto.css';

const MasProductos = lazy(() => import('./Componentes/MasProductos/MasProductos'));

function normalizePathWithTrailingSlash(p = ""){
    if (!p) return "/";
    return p.endsWith("/") ? p : p + "/";
}

async function obtenerDescripcionColchonDesdeNombre(nombreProductoCompleto){
    const extraerNombreColchon = (nombreCompleto) => {
        const partes = nombreCompleto.split('+');
        
        if (partes.length >= 2) {
            const parteColchon = partes[1].trim();
            
            if (parteColchon.includes('COLCHÓN')) {
                const regex = /COLCHÓN\s+([^+]+)/i;
                const match = parteColchon.match(regex);
                
                if (match && match[1]) {
                    return `COLCHÓN ${match[1].trim()}`;
                }
                
                return parteColchon;
            }
        }
        
        return null;
    };

    const convertirNombreARuta = (nombreColchon) => {
        if (!nombreColchon) return null;
        
        let nombreNormalizado = nombreColchon
            .replace(/COLCHÓN\s*/i, '')
            .trim()
            .toLowerCase();
        
        const tamanos = ['king', 'queen', 'twin', 'full', 'individual'];
        let tamaño = null;
        
        for (const tam of tamanos) {
            if (nombreNormalizado.includes(tam)) {
                tamaño = tam;
                nombreNormalizado = nombreNormalizado.replace(tam, '').trim();
                break;
            }
        }
        
        const marca = 'el-cisne';
        
        let modelo = nombreNormalizado
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, '')
            .toLowerCase();
        
        if (!modelo) {
            if (nombreNormalizado.includes('pocket') && nombreNormalizado.includes('plus')) {
                modelo = 'pocket-plus';
            } else if (nombreNormalizado.includes('pocket')) {
                modelo = 'pocket';
            }
        }
        
        if (tamaño && modelo) {
            return `/assets/json/categorias/colchones/${tamaño}/${marca}/${modelo}.json`;
        }
        
        if (!tamaño) {
            tamaño = 'king';
        }
        
        return `/assets/json/categorias/colchones/${tamaño}/${marca}/${modelo}.json`;
    };

    try {
        const nombreColchon = extraerNombreColchon(nombreProductoCompleto);
        
        if (!nombreColchon) {
            console.warn('No se encontró nombre de colchón en:', nombreProductoCompleto);
            return null;
        }

        console.log('Nombre del colchón extraído:', nombreColchon);

        const rutaColchon = convertirNombreARuta(nombreColchon);
        
        if (!rutaColchon) {
            console.warn('No se pudo convertir a ruta:', nombreColchon);
            return null;
        }

        console.log('Ruta del colchón:', rutaColchon);

        const respuesta = await fetch(rutaColchon);
        
        if (!respuesta.ok) {
            console.warn('Archivo no encontrado:', rutaColchon);
            return null;
        }
        
        const datosColchon = await respuesta.json();
        
        console.log('Datos del colchón cargados:', datosColchon);
        
        let productoColchon = null;
        let regalosColchon = [];
        
        if (Array.isArray(datosColchon.productos) && datosColchon.productos.length > 0) {
            const nombreBusqueda = nombreColchon.toLowerCase().replace('colchón', '').trim();
            
            productoColchon = datosColchon.productos.find(p => {
                const nombreProducto = p.nombre.toLowerCase();
                return nombreProducto.includes(nombreBusqueda) || 
                       nombreBusqueda.includes(p.modelo?.toLowerCase() || '');
            });
            
            if (!productoColchon && datosColchon.productos.length > 0) {
                productoColchon = datosColchon.productos[0];
            }
            
            if (productoColchon && Array.isArray(productoColchon.regalos)) {
                regalosColchon = productoColchon.regalos;
            }
        }
        
        console.log('Producto colchón encontrado:', productoColchon);
        console.log('Regalos del colchón:', regalosColchon);
        
        return {
            ficha: datosColchon.ficha || [],
            mensajes: datosColchon.mensajes || [],
            producto: productoColchon,
            regalos: regalosColchon
        };
        
    } catch (error) {
        console.error('Error al obtener descripción del colchón:', error);
        return null;
    }
}

async function obtenerDescripcionTipoDormitorio(nombreProductoCompleto) {
    try {
        const nombreLower = nombreProductoCompleto.toLowerCase();

        console.log('Buscando tipo de dormitorio en:', nombreProductoCompleto);

        const rutaDescripciones = '/assets/json/descripciones.json';
        const respuesta = await fetch(rutaDescripciones);
        
        if (!respuesta.ok) {
            console.warn('Archivo descripciones.json no encontrado');
            return null;
        }

        const todasDescripciones = await respuesta.json();

        let tipoDescripcion = null;

        if (nombreLower.includes('americano')) {
            const contieneCajones = nombreLower.includes('cajones') || nombreLower.includes('cajón');
            tipoDescripcion = contieneCajones ? 'americano-con-cajones' : 'americano';
            console.log('Tipo detectado:', tipoDescripcion);
        }
        else if (nombreLower.includes('europeo')) {
            const contieneCajones = nombreLower.includes('cajones') || nombreLower.includes('cajón');
            tipoDescripcion = contieneCajones ? 'europeo-con-cajones' : 'europeo';
            console.log('Tipo detectado:', tipoDescripcion);
        }

        if (!tipoDescripcion) {
            console.log('No se encontró tipo americano/europeo en el nombre');
            return null;
        }

        const descripcion = todasDescripciones[tipoDescripcion];

        if (!descripcion) {
            console.warn(`No se encontró descripción para "${tipoDescripcion}"`);
            return null;
        }

        console.log('Descripción encontrada para', tipoDescripcion);

        const fichaFormateada = Array.isArray(descripcion) ? descripcion : [descripcion];
        
        return {
            ficha: fichaFormateada,
            tipo: tipoDescripcion
        };
        
    } catch (error) {
        console.error('Error al obtener descripción del tipo de dormitorio:', error);
        return null;
    }
}

async function obtenerDescripcionCabecera(nombreProductoCompleto) {
    try {
        const nombreLower = nombreProductoCompleto.toLowerCase();
        
        console.log('Buscando cabecera en:', nombreProductoCompleto);
        
        // Solo buscar si contiene "cabecera"
        if (!nombreLower.includes('cabecera')) {
            console.log('Nombre no contiene "cabecera"');
            return null;
        }
        
        // Cargar el archivo de descripciones
        const rutaDescripciones = '/assets/json/descripciones.json';
        const respuesta = await fetch(rutaDescripciones);
        
        if (!respuesta.ok) {
            console.warn('Archivo descripciones.json no encontrado');
            return null;
        }
        
        const todasDescripciones = await respuesta.json();
        
        const tipoDescripcion = 'cabecera';
        const descripcion = todasDescripciones[tipoDescripcion];
        
        if (!descripcion) {
            console.warn(`No se encontró descripción para "${tipoDescripcion}"`);
            return null;
        }
        
        console.log('Descripción de cabecera encontrada');
        
        // Formatear la descripción
        const fichaFormateada = Array.isArray(descripcion) ? descripcion : [descripcion];
        
        return {
            ficha: fichaFormateada
        };
        
    } catch (error) {
        console.error('Error al obtener descripción de cabecera:', error);
        return null;
    }
}

function PaginaProducto(){
    const location = useLocation();
    const [productoData, setProductoData] = useState({ 
        producto: null, 
        imagenes: [], 
        descripciones: [],
        mensajes: [],
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

    useEffect(() => {
        let cancelled = false;

        const fetchProducto = async () => {
            setProductoData(prev => ({ ...prev, loading: true, error: false }));
            setIsCategoryFallback(false);
            setCategoryProducts([]);
            setDescripcionColchon(null);
            setDescripcionTipoDormitorio(null);
            setDescripcionCabecera(null);

            const path = normalizePathWithTrailingSlash(location.pathname);

            try{
                let filesList = [];
                try{
                    const manifestRes = await fetch('/assets/json/manifest.json');
                    if (manifestRes.ok){
                        const manifestJson = await manifestRes.json();
                        if (Array.isArray(manifestJson)) filesList = manifestJson;
                        else if (Array.isArray(manifestJson.files)) filesList = manifestJson.files;
                        else if (typeof manifestJson === 'object' && manifestJson !== null && manifestJson[path]){
                            const productFilePath = manifestJson[path];
                            const resp = await fetch(productFilePath);
                            if (resp.ok){
                                const pd = await resp.json();
                                if (!cancelled){
                                    setProductoData({ 
                                        producto: pd, 
                                        imagenes: [], 
                                        descripciones: pd.descripciones || [],
                                        mensajes: pd.mensajes || [],
                                        error: false, 
                                        loading: false 
                                    });
                                    cargarImagenesOptimizadas(pd.fotos);
                                    return;
                                }
                            }
                        }
                    }
                } catch (errIndex){ }

                if (filesList.length === 0){
                    try{
                        const manifestRes2 = await fetch('/assets/json/manifest.json');
                        if (manifestRes2.ok){
                            const manifestJson2 = await manifestRes2.json();
                            if (Array.isArray(manifestJson2)) filesList = manifestJson2;
                            else if (Array.isArray(manifestJson2.files)) filesList = manifestJson2.files;
                        }
                    } catch (e){ }
                }

                const parts = path.split('/').filter(Boolean);
                const category = parts[1] || parts[0] || '';
                let candidates = filesList.filter(f => f.includes(`/categorias/${category}/`));
                if (candidates.length === 0) candidates = filesList;

                let productoEncontrado = null;
                let descripcionesEncontradas = [];
                let mensajesEncontrados = [];

                for(const filePath of candidates){
                    try {
                        const r = await fetch(filePath);
                        if (!r.ok) continue;
                        const json = await r.json();
                        const arr = json.productos || [];
                        const found = arr.find(p => {
                            const pr = String(p.ruta || "").trim();
                            return normalizePathWithTrailingSlash(pr) === path;
                        });
                        if (found){
                            productoEncontrado = found;
                            descripcionesEncontradas = json.descripciones || [];
                            mensajesEncontrados = json.mensajes || [];
                            break;
                        }
                    } catch (e){ continue; }
                }

                if (productoEncontrado){
                    if (!cancelled){
                        setProductoData(prev => ({ 
                            ...prev, 
                            producto: productoEncontrado, 
                            descripciones: descripcionesEncontradas,
                            mensajes: mensajesEncontrados,
                            loading: false, 
                            error: false 
                        }));
                        cargarImagenesOptimizadas(productoEncontrado.fotos);
                        
                        // Cargar todas las descripciones posibles
                        if (productoEncontrado.nombre) {
                            const nombre = productoEncontrado.nombre;
                            
                            // 1. Cargar descripción del colchón si el nombre contiene "+"
                            if (nombre.includes('+')) {
                                cargarDescripcionColchon(nombre);
                            }
                            
                            // 2. Cargar descripción de tipo (americano/europeo)
                            cargarDescripcionTipoDormitorio(nombre);
                            
                            // 3. Cargar descripción de cabecera si menciona "cabecera"
                            cargarDescripcionCabecera(nombre);
                        }
                    }
                    return;
                }

                const idMatch = path.match(/\/(\d+)\/$/);

                if (idMatch){
                    const idStr = idMatch[1];
                    for(const filePath of candidates){
                        try{
                            const r = await fetch(filePath);
                            if (!r.ok) continue;
                            const json = await r.json();
                            const arr = json.productos || [];
                            const foundById = arr.find(p => {
                                const pr = normalizePathWithTrailingSlash(String(p.ruta || ""));
                                return pr.endsWith(`/${idStr}/`);
                            });
                            if (foundById){
                                productoEncontrado = foundById;
                                descripcionesEncontradas = json.descripciones || [];
                                mensajesEncontrados = json.mensajes || [];
                                break;
                            }
                        } catch (e){ continue; }
                    }
                }

                if (productoEncontrado){
                    if (!cancelled){
                        setProductoData(prev => ({ 
                            ...prev, 
                            producto: productoEncontrado, 
                            descripciones: descripcionesEncontradas,
                            mensajes: mensajesEncontrados,
                            loading: false, 
                            error: false 
                        }));
                        cargarImagenesOptimizadas(productoEncontrado.fotos);
                        
                        if (productoEncontrado.nombre) {
                            const nombre = productoEncontrado.nombre;
                            
                            if (nombre.includes('+')) {
                                cargarDescripcionColchon(nombre);
                            }
                            
                            cargarDescripcionTipoDormitorio(nombre);
                            cargarDescripcionCabecera(nombre);
                        }
                    }
                    return;
                }

                const rel = path.replace(/^\/productos\//, '').replace(/\/$/, '');
                const categoryJsonPath = `/assets/json/categorias/${rel}.json`;

                if (filesList.includes(categoryJsonPath)){
                    try {
                        const catRes = await fetch(categoryJsonPath);
                        if (catRes.ok){
                            const catJson = await catRes.json();
                            if (Array.isArray(catJson.productos) && catJson.productos.length > 0){
                                if (!cancelled){
                                    setIsCategoryFallback(true);
                                    setCategoryProducts(catJson.productos);
                                    setProductoData(prev => ({ ...prev, loading: false, producto: null, error: false }));
                                }
                                return;
                            }
                        }
                    } catch (e){
                    }
                }

                if (!cancelled){
                    setProductoData(prev => ({ ...prev, error: true, loading: false }));
                }
            } catch (error){
                console.error("Error al buscar el producto:", error);
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

                if (primeraImagen){
                    setProductoData(prev => ({
                        ...prev,
                        imagenes: [primeraImagen]
                    }));
                }
            })();

            setTimeout(async () => {
                const promesas = [];
                const formatos = ['webp', 'jpg'];

                for(let index = 2; index <= 5; index++){
                    for(const formato of formatos){
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

        const cargarDescripcionColchon = async (nombreProducto) => {
            if (!nombreProducto || cancelled) return;
            
            setCargandoColchon(true);
            try {
                const descripcion = await obtenerDescripcionColchonDesdeNombre(nombreProducto);
                if (!cancelled) {
                    setDescripcionColchon(descripcion);
                }
            } catch (error) {
                console.error('Error al cargar descripción del colchón:', error);
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
                console.error('Error al cargar descripción del tipo de dormitorio:', error);
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
                console.error('Error al cargar descripción de cabecera:', error);
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
        if (productoData.producto){
            document.title = productoData.producto.nombre;
        }
    }, [productoData.producto]);

    if (isCategoryFallback){
        return(
            <NoProducto/>
        );
    }

    if (productoData.error){
        return(
            <NoProducto/>
        );
    }

    if (productoData.loading || !productoData.producto){
        return(
            <SpinnerLoading/>
        );
    }

    const { producto, imagenes, descripciones, mensajes } = productoData;
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

    // const renderSeccionColchon = () => {
    //     if (!descripcionColchon && !cargandoColchon) return null;
        
    //     return (
    //         <div className="seccion-colchon-detalle">
    //             <h3 className="titulo-seccion-colchon">Especificaciones del Colchón Incluido</h3>
                
    //             {cargandoColchon ? (
    //                 <div className="cargando-colchon">
    //                     <p>Cargando detalles del colchón...</p>
    //                 </div>
    //             ) : (
    //                 <>
    //                     {descripcionColchon?.mensajes?.length > 0 && (
    //                         <div className="mensajes-colchon">
    //                             <h4>Características del Colchón</h4>
    //                             {descripcionColchon.mensajes.map((mensaje, index) => (
    //                                 <p key={index} className="mensaje-colchon">{mensaje}</p>
    //                             ))}
    //                         </div>
    //                     )}
                        
    //                     {descripcionColchon?.ficha?.length > 0 && (
    //                         <div className="ficha-tecnica-colchon">
    //                             <h4>Ficha Técnica del Colchón</h4>
    //                             <div className="tabla-ficha">
    //                                 {descripcionColchon.ficha.map((item, index) => (
    //                                     <div key={index} className="fila-ficha">
    //                                         {Object.entries(item).map(([key, value]) => (
    //                                             <div key={key} className="item-ficha">
    //                                                 <span className="etiqueta-ficha">{key.replace(/-/g, ' ')}:</span>
    //                                                 <span className="valor-ficha">{value}</span>
    //                                             </div>
    //                                         ))}
    //                                     </div>
    //                                 ))}
    //                             </div>
    //                         </div>
    //                     )}
    //                 </>
    //             )}
    //         </div>
    //     );
    // };

    return(
        <>
            <Helmet>
                <title>{producto.nombre}</title>
                <meta name="description" content={producto.nombre}/>
                <link rel="preload" as="image" href={`https://homesleep.pe${producto.fotos}1.jpg`} />
                <meta property="og:image" content={`https://homesleep.pe${producto.fotos}1.jpg`}/>
                <meta property="og:title" content={producto.nombre}/>
                <meta property="og:site_name" content={producto.nombre}/>
                <meta property="og:description" content={producto.nombre}/>
                <meta property="og:type" content="website"/>
                <meta property="og:url" content={`https://homesleep.pe${producto.ruta}`}/>
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

                                <Imagenes imagenes={imagenes} producto={producto}/>

                                <Beneficios/>

                                <div className='visible-on-desktop-no-mobile'>
                                    <Descripcion producto={producto} descripciones={descripciones} 
                                        mensajes={mensajes} descripcionColchon={descripcionColchon}
                                        descripcionTipoDormitorio={descripcionTipoDormitorio}
                                        descripcionCabecera={descripcionCabecera} cargandoColchon={cargandoColchon}
                                        cargandoTipoDormitorio={cargandoTipoDormitorio} cargandoCabecera={cargandoCabecera}
                                    />
                                </div>
                            </div>

                            <div className='product-page-target product-page-target-2 d-flex-column gap-20'>
                                <div className='product-page-top-info'>
                                    <div className='visible-on-desktop-no-mobile'>
                                        <p className='product-page-category color-color-1'>{producto.categoria}</p>
                                        <h1 className='product-page-name'>{producto.nombre}</h1>
                                    </div>

                                    <div className='d-flex-center-left gap-10 margin-right'>
                                        <Sku producto={producto}/>

                                        <Compartir/>
                                    </div>
                                </div>

                                <div>
                                    <div className='d-flex-column gap-20'>
                                        <div className='d-grid-2-1fr gap-10'>
                                            <div className='d-flex-column gap-20'>
                                                <Resumen producto={producto}/>

                                                {producto.categoria.toLowerCase() !== "colchones" && (
                                                    <Colores colorName={producto.nombre.split('-').pop().trim() || "Seleccionar color"}/>
                                                )}

                                                <Regalos producto={producto} descripcionColchon={descripcionColchon}/>
                                            </div>

                                            <div className='d-flex-column gap-20'>
                                                <div className='page-product-prices'>
                                                    <div className='d-flex-center-left gap-5'>
                                                        <p className='page-product-normal-price'>S/.{producto.precioNormal}</p>
                                                        <span className="product-page-discount">-{descuento}%</span>
                                                    </div>

                                                    <p className='page-product-sale-price'>S/.{producto.precioVenta}</p>
                                                </div>

                                                <Medidas producto={producto}/>

                                                <Envios/>
                                            </div>

                                            <div className='visible-on-mobile-no-desktop'>
                                                <Descripcion producto={producto} descripciones={descripciones} 
                                                    mensajes={mensajes} descripcionColchon={descripcionColchon}
                                                    descripcionTipoDormitorio={descripcionTipoDormitorio}
                                                    descripcionCabecera={descripcionCabecera} cargandoColchon={cargandoColchon}
                                                    cargandoTipoDormitorio={cargandoTipoDormitorio} cargandoCabecera={cargandoCabecera}
                                                />
                                            </div>
                                        </div>
                                        
                                        {/* {renderSeccionColchon()} */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                <div className='button-continue-container'>
                    <Cantidad/>
                    <WhatsApp/>
                </div>

                <Suspense fallback={
                    <div className="loading-mas-productos">Cargando productos relacionados...</div>
                }>
                    <MasProductos categoriaActual={producto.categoria}/>
                </Suspense>
            </main>
        </>
    );
}

export default PaginaProducto;
