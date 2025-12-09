// // import { v4 as uuidv4 } from "uuid";

// // import './Medidas.css';

// // function Medidas({producto}){
// //     const medidas = producto["tamaños-disponibles"];

// //     if (!Array.isArray(medidas) || medidas.length === 0) {
// //         return null;
// //     }

// //     return(
// //         <div className="d-flex-column gap-5">
// //             <h2 className="title text uppercase color-color-1">Medidas</h2>

// //             <ul className="product-page-sizes d-flex-wrap gap-5">
// //                 {medidas.map(item => (
// //                     <li key={uuidv4()}>
// //                         <a href={item.ruta} title={item.ruta}>
// //                             <p>{item.nombre}</p>
// //                         </a>
// //                     </li>
// //                 ))}
// //             </ul>
// //         </div>
// //     );
// // }

// // export default Medidas;

// // Medidas.js
// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { v4 as uuidv4 } from "uuid";
// import './Medidas.css';

// function Medidas({ producto }) {
//     const medidas = producto["tamaños-disponibles"];
//     const navigate = useNavigate();
//     const [productosPorSku, setProductosPorSku] = useState([]);
//     const [cargando, setCargando] = useState(false);

//     useEffect(() => {
//         if (!Array.isArray(medidas) || medidas.length === 0) return;

//         const buscarProductosPorSkus = async () => {
//             setCargando(true);
//             const productosEncontrados = [];

//             for (const sku of medidas) {
//                 try {
//                     const producto = await buscarProductoPorSku(sku);
//                     if (producto) {
//                         productosEncontrados.push({
//                             sku: sku,
//                             producto: producto
//                         });
//                     }
//                 } catch (error) {
//                     console.error(`Error buscando producto con SKU ${sku}:`, error);
//                 }
//             }

//             setProductosPorSku(productosEncontrados);
//             setCargando(false);
//         };

//         buscarProductosPorSkus();
//     }, [medidas]);

//     const buscarProductoPorSku = async (sku) => {
//         try {
//             // Primero intenta buscar en el manifest.json
//             const manifestRes = await fetch('/assets/json/manifest.json');
//             if (!manifestRes.ok) return null;

//             const manifestJson = await manifestRes.json();
//             const filesList = Array.isArray(manifestJson) ? manifestJson : 
//                              Array.isArray(manifestJson.files) ? manifestJson.files : [];

//             for (const filePath of filesList) {
//                 try {
//                     const r = await fetch(filePath);
//                     if (!r.ok) continue;
                    
//                     const json = await r.json();
//                     const productos = json.productos || [];
                    
//                     const productoEncontrado = productos.find(p => 
//                         p.sku === sku || p.sku === sku.trim()
//                     );
                    
//                     if (productoEncontrado) {
//                         return productoEncontrado;
//                     }
//                 } catch (e) {
//                     continue;
//                 }
//             }

//             // Si no se encuentra en el manifest, intenta buscar en todas las categorias conocidas
//             const categorias = ['dormitorios', 'colchones', 'sofas', 'comedores', 'muebles'];
            
//             for (const categoria of categorias) {
//                 try {
//                     // Primero intenta obtener el archivo index de la categoría
//                     const indexPath = `/assets/json/categorias/${categoria}/index.json`;
//                     const indexRes = await fetch(indexPath);
                    
//                     if (indexRes.ok) {
//                         const indexData = await indexRes.json();
//                         const subcategorias = indexData.subcategorias || [];
                        
//                         for (const subcat of subcategorias) {
//                             try {
//                                 const catFilePath = `/assets/json/categorias/${categoria}/${subcat}.json`;
//                                 const catRes = await fetch(catFilePath);
                                
//                                 if (catRes.ok) {
//                                     const catJson = await catRes.json();
//                                     const productoEncontrado = (catJson.productos || []).find(p => 
//                                         p.sku === sku || p.sku === sku.trim()
//                                     );
                                    
//                                     if (productoEncontrado) {
//                                         return productoEncontrado;
//                                     }
//                                 }
//                             } catch (e) {
//                                 continue;
//                             }
//                         }
//                     }
//                 } catch (e) {
//                     continue;
//                 }
//             }

//             return null;
//         } catch (error) {
//             console.error('Error en búsqueda por SKU:', error);
//             return null;
//         }
//     };

//     const handleClickSku = (sku, productoEncontrado = null) => {
//         if (productoEncontrado && productoEncontrado.ruta) {
//             // Si tenemos el producto con su ruta, navegamos directamente
//             navigate(productoEncontrado.ruta);
//         } else {
//             // Si no, usamos la búsqueda por query
//             navigate(`/busqueda?query=${sku}`);
//         }
//     };

//     if (!Array.isArray(medidas) || medidas.length === 0) {
//         return null;
//     }

//     return (
//         <div className="d-flex-column gap-5">
//             <h2 className="title text uppercase color-color-1">Medidas Disponibles</h2>
            
//             {cargando ? (
//                 <div className="cargando-medidas">
//                     <p>Cargando medidas disponibles...</p>
//                 </div>
//             ) : (
//                 <ul className="product-page-sizes d-flex-wrap gap-5">
//                     {productosPorSku.length > 0 ? (
//                         // Mostrar productos encontrados con su nombre
//                         productosPorSku.map(item => (
//                             <li key={uuidv4()}>
//                                 <button 
//                                     className="boton-medida"
//                                     onClick={() => handleClickSku(item.sku, item.producto)}
//                                     title={`Ver ${item.producto.nombre}`}
//                                 >
//                                     <p>{item.producto.nombre.split('-').pop().trim() || item.sku}</p>
//                                 </button>
//                             </li>
//                         ))
//                     ) : (
//                         // Fallback: mostrar solo los SKUs
//                         medidas.map(sku => (
//                             <li key={uuidv4()}>
//                                 <button 
//                                     className="boton-medida"
//                                     onClick={() => handleClickSku(sku)}
//                                     title={`Buscar ${sku}`}
//                                 >
//                                     <p>{sku}</p>
//                                 </button>
//                             </li>
//                         ))
//                     )}
//                 </ul>
//             )}
//         </div>
//     );
// }

// export default Medidas;

// Medidas.js con caché
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from "uuid";

import './Medidas.css';

// Cache en memoria para productos buscados por SKU
const skuCache = new Map();

function Medidas({ producto }) {
    const medidas = producto["tamaños-disponibles"];
    const navigate = useNavigate();
    const [productosEncontrados, setProductosEncontrados] = useState([]);
    const [cargando, setCargando] = useState(false);
    const cacheRef = useRef(skuCache);

    useEffect(() => {
        if (!Array.isArray(medidas) || medidas.length === 0) return;

        const buscarProductosPorSkus = async () => {
            setCargando(true);
            const resultados = [];

            for (const medida of medidas) {
                if (medida.sku) {
                    try {
                        // Verificar si está en caché
                        const skuKey = medida.sku.trim();
                        let productoEncontrado = cacheRef.current.get(skuKey);
                        
                        if (!productoEncontrado) {
                            productoEncontrado = await buscarProductoPorSku(medida.sku);
                            if (productoEncontrado) {
                                cacheRef.current.set(skuKey, productoEncontrado);
                            }
                        }

                        resultados.push({
                            ...medida,
                            productoEncontrado: productoEncontrado || null,
                            encontrado: !!productoEncontrado
                        });
                    } catch (error) {
                        resultados.push({
                            ...medida,
                            productoEncontrado: null,
                            encontrado: false
                        });
                    }
                }
            }

            setProductosEncontrados(resultados);
            setCargando(false);
        };

        buscarProductosPorSkus();
    }, [medidas]);

    const buscarProductoPorSku = async (sku) => {
        try {
            // Cargar manifest.json
            const manifestRes = await fetch('/assets/json/manifest.json');
            if (!manifestRes.ok) return null;

            const manifestJson = await manifestRes.json();
            const filesList = Array.isArray(manifestJson) ? manifestJson : 
                             Array.isArray(manifestJson.files) ? manifestJson.files : [];

            // Buscar en todos los archivos del manifest
            for (const filePath of filesList) {
                try {
                    const r = await fetch(filePath);
                    if (!r.ok) continue;
                    
                    const json = await r.json();
                    const productos = json.productos || [];
                    
                    // Buscar producto por SKU
                    const productoEncontrado = productos.find(p => {
                        const skuProducto = (p.sku || "").toString().trim();
                        const skuBuscado = sku.toString().trim();
                        return skuProducto === skuBuscado;
                    });
                    
                    if (productoEncontrado) {
                        return productoEncontrado;
                    }
                } catch (e) {
                    continue;
                }
            }

            return null;
        } catch (error) {
            console.error('Error en búsqueda por SKU:', error);
            return null;
        }
    };

    const handleClickMedida = (medida) => {
        if (medida.productoEncontrado && medida.productoEncontrado.ruta) {
            navigate(medida.productoEncontrado.ruta);
        } else if (medida.sku) {
            navigate(`/busqueda?query=${encodeURIComponent(medida.sku)}`);
        }
    };

    if (!Array.isArray(medidas) || medidas.length === 0) {
        return null;
    }

    return (
        <div className="d-flex-column gap-5">
            <h2 className="title text uppercase color-color-1">Otras medidas</h2>

            {cargando ? (
                <div className="cargando-medidas">
                    <p>Cargando opciones...</p>
                </div>
            ) : (
                <>
                    <ul className="product-page-sizes d-flex-wrap gap-5">
                        {productosEncontrados.map((medida) => (
                            <li key={uuidv4()}>
                                <a className={`boton-medida ${medida.productoEncontrado ? 'disponible' : 'no-disponible'}`} onClick={() => handleClickMedida(medida)}
                                    title={medida.nombre}
                                >
                                    <p>{medida.nombre}</p>
                                </a>
                            </li>
                        ))}
                    </ul>
                    
                    {productosEncontrados.some(m => !m.encontrado) && (
                        <p className="nota-medidas">
                            * Algunas medidas pueden no estar disponibles actualmente
                        </p>
                    )}
                </>
            )}
        </div>
    );
}

export default Medidas;
