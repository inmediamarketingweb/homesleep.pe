// import { useEffect, useState } from "react";
// import { useParams, useLocation } from "react-router-dom";
// import { Helmet } from "react-helmet-async";

// import "./PaginaDeCategoria.css";

// import Filtros from './Componentes/Filtros/Filtros';
// import { Producto } from '../../Componentes/Plantillas/Producto/Producto';

// function PaginaDeCategoria(){
//     const { categoria, sub1, sub2, sub3, sub4 } = useParams();
//     const location = useLocation();
//     const [productos, setProductos] = useState([]);
//     const [isLoading, setIsLoading] = useState(true);

//     useEffect(() => {
//         const fetchProductos = async () => {
//             setIsLoading(true);

//             try{
//                 const manifestRes = await fetch("/assets/json/manifest.json");
//                 if (!manifestRes.ok) throw new Error("No se pudo cargar manifest.json");

//                 const manifestData = await manifestRes.json();
//                 const todasLasRutas = manifestData.files;

//                 const partes = location.pathname.replace("/productos/", "").split("/").filter(Boolean);

//                 let rutasFiltradas = [];

//                 if (categoria === "camas-box-tarimas"){
//                     if (partes.length === 1) {
//                         rutasFiltradas = todasLasRutas.filter(
//                             ruta => ruta.includes(`/categorias/${categoria}/`)
//                         );
//                     } else if (partes.length === 2) {
//                         rutasFiltradas = todasLasRutas.filter(
//                             ruta => ruta.includes(`/categorias/${categoria}/${sub1}/`)
//                         );
//                     } else if (partes.length === 3) {
//                         rutasFiltradas = todasLasRutas.filter(
//                             ruta => ruta.includes(`/categorias/${categoria}/${sub1}/${sub2}/`)
//                         );
//                     } else if (partes.length === 4) {
//                         rutasFiltradas = todasLasRutas.filter(
//                             ruta => ruta.endsWith( `/categorias/${categoria}/${sub1}/${sub2}/${sub3}.json` )
//                         );
//                     }
//                 } else {
//                     if (partes.length === 1) {
//                         rutasFiltradas = todasLasRutas.filter(
//                             ruta => ruta.includes(`/categorias/${categoria}/`)
//                         );
//                     } else if (partes.length === 2) {
//                         rutasFiltradas = todasLasRutas.filter(
//                             ruta => ruta.includes(`/categorias/${categoria}/${sub1}/`)
//                         );
//                     } else if (partes.length === 3) {
//                         rutasFiltradas = todasLasRutas.filter(
//                             ruta => ruta.includes(`/categorias/${categoria}/${sub1}/${sub2}/`)
//                         );
//                     } else if (partes.length === 4) {
//                         rutasFiltradas = todasLasRutas.filter(
//                             ruta => ruta.endsWith(
//                                 `/categorias/${categoria}/${sub1}/${sub2}/${sub3}.json`
//                             )
//                         );
//                     }
//                 }

//                 if (rutasFiltradas.length === 0) {
//                     console.warn("No se encontraron JSONs para esta ruta:", location.pathname);
//                     setProductos([]);
//                     setIsLoading(false);
//                     return;
//                 }

//                 const productosPromises = rutasFiltradas.map(async ruta => {
//                     const res = await fetch(ruta);
//                     if (!res.ok) return [];
//                     const data = await res.json();
//                     return data.productos || [];
//                 });

//                 const productosArrays = await Promise.all(productosPromises);

//                 setProductos(productosArrays.flat());
//             } catch (error) {
//                 console.error("Error cargando productos:", error);
//                 setProductos([]);
//             } finally {
//                 setIsLoading(false);
//             }
//         };

//         fetchProductos();
//     }, [categoria, sub1, sub2, sub3, sub4, location.pathname]);

//     return(
//         <>
//             <Helmet>
//                 <title>{categoria} | Homesleep</title>
//             </Helmet>

//             <main>
//                 <div className="block-container">
//                     <div className="block-content">
//                         <section className="category-page-container">
//                             <div className="category-page-left">
//                                 <Filtros/>
//                             </div>

//                             <div className="category-page-right">
//                                 {isLoading ? (
//                                     <div className="category-loading-container">
//                                         <span className="loader"></span>
//                                     </div>
//                                 ) : productos.length > 0 ? (
//                                     <ul className="category-page-products">
//                                         {productos.map((producto) => (
//                                             <Producto producto={producto} />
//                                         ))}
//                                     </ul>
//                                 ) : (
//                                     <p>No se encontraron productos en esta categoría.</p>
//                                 )}
//                             </div>
//                         </section>
//                     </div>
//                 </div>
//             </main>
//         </>
//     );
// }

// export default PaginaDeCategoria;

import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";

import "./PaginaDeCategoria.css";

import Filtros from './Componentes/Filtros/Filtros';
import { Producto } from '../../Componentes/Plantillas/Producto/Producto';

function PaginaDeCategoria(){
    const { categoria, sub1, sub2, sub3, sub4 } = useParams();
    const location = useLocation();
    const [productos, setProductos] = useState([]);
    const [productosFiltrados, setProductosFiltrados] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filtersActive, setFiltersActive] = useState(false);

    useEffect(() => {
        const fetchProductos = async () => {
            setIsLoading(true);

            try{
                const manifestRes = await fetch("/assets/json/manifest.json");
                if (!manifestRes.ok) throw new Error("No se pudo cargar manifest.json");

                const manifestData = await manifestRes.json();
                const todasLasRutas = manifestData.files;

                const partes = location.pathname.replace("/productos/", "").split("/").filter(Boolean);

                let rutasFiltradas = [];

                if (categoria === "camas-box-tarimas"){
                    if (partes.length === 1) {
                        rutasFiltradas = todasLasRutas.filter(
                            ruta => ruta.includes(`/categorias/${categoria}/`)
                        );
                    } else if (partes.length === 2) {
                        rutasFiltradas = todasLasRutas.filter(
                            ruta => ruta.includes(`/categorias/${categoria}/${sub1}/`)
                        );
                    } else if (partes.length === 3) {
                        rutasFiltradas = todasLasRutas.filter(
                            ruta => ruta.includes(`/categorias/${categoria}/${sub1}/${sub2}/`)
                        );
                    } else if (partes.length === 4) {
                        rutasFiltradas = todasLasRutas.filter(
                            ruta => ruta.endsWith( `/categorias/${categoria}/${sub1}/${sub2}/${sub3}.json` )
                        );
                    }
                } else {
                    if (partes.length === 1) {
                        rutasFiltradas = todasLasRutas.filter(
                            ruta => ruta.includes(`/categorias/${categoria}/`)
                        );
                    } else if (partes.length === 2) {
                        rutasFiltradas = todasLasRutas.filter(
                            ruta => ruta.includes(`/categorias/${categoria}/${sub1}/`)
                        );
                    } else if (partes.length === 3) {
                        rutasFiltradas = todasLasRutas.filter(
                            ruta => ruta.includes(`/categorias/${categoria}/${sub1}/${sub2}/`)
                        );
                    } else if (partes.length === 4) {
                        rutasFiltradas = todasLasRutas.filter(
                            ruta => ruta.endsWith(
                                `/categorias/${categoria}/${sub1}/${sub2}/${sub3}.json`
                            )
                        );
                    }
                }

                if (rutasFiltradas.length === 0) {
                    console.warn("No se encontraron JSONs para esta ruta:", location.pathname);
                    setProductos([]);
                    setProductosFiltrados([]);
                    setIsLoading(false);
                    return;
                }

                const productosPromises = rutasFiltradas.map(async ruta => {
                    const res = await fetch(ruta);
                    if (!res.ok) return [];
                    const data = await res.json();
                    return data.productos || [];
                });

                const productosArrays = await Promise.all(productosPromises);
                const productosCargados = productosArrays.flat();
                
                setProductos(productosCargados);
                setProductosFiltrados(productosCargados); // Inicialmente mostrar todos los productos
            } catch (error) {
                console.error("Error cargando productos:", error);
                setProductos([]);
                setProductosFiltrados([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProductos();
    }, [categoria, sub1, sub2, sub3, sub4, location.pathname]);

    const toggleFilters = () => {
        setFiltersActive(!filtersActive);
    };

    const closeFilters = () => {
        setFiltersActive(false);
    };

    return(
        <>
            <Helmet>
                <title>{categoria} | Homesleep</title>
            </Helmet>

            <main>
                <div className="block-container">
                    <div className="block-content">
                        {/* Botón para mostrar filtros en móvil */}
                        <button 
                            className="mobile-filters-toggle"
                            onClick={toggleFilters}
                        >
                            <span className="material-icons">filter_list</span>
                            Filtros
                        </button>

                        <section className="category-page-container">
                            <div className="category-page-left">
                                <Filtros 
                                    productos={productos}
                                    setProductosFiltrados={setProductosFiltrados}
                                    filtersActive={filtersActive}
                                    onClose={closeFilters}
                                />
                            </div>

                            <div className="category-page-right">
                                {isLoading ? (
                                    <div className="category-loading-container">
                                        <span className="loader"></span>
                                    </div>
                                ) : productosFiltrados.length > 0 ? (
                                    <>
                                        <div className="products-count">
                                            <p>{productosFiltrados.length} producto{productosFiltrados.length !== 1 ? 's' : ''} encontrado{productosFiltrados.length !== 1 ? 's' : ''}</p>
                                        </div>
                                        <ul className="category-page-products">
                                            {productosFiltrados.map((producto) => (
                                                <Producto key={producto.sku} producto={producto} />
                                            ))}
                                        </ul>
                                    </>
                                ) : (
                                    <div className="no-products">
                                        <p>No se encontraron productos en esta categoría.</p>
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>
                </div>
            </main>
        </>
    );
}

export default PaginaDeCategoria;
