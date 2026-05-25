// // import { useLocation, useNavigate } from 'react-router-dom';
// // import { useState, useEffect, useRef } from 'react';
// // import './FiltrosTop.css';

// // const normalizarTexto = (texto) => {
// //     if (!texto || typeof texto !== 'string') return '';
// //     return texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "-");
// // };

// // function FiltrosTop({ 
// //     setOrden, orden, productosCount, 
// //     totalProductos, currentPage,
// //     itemsPerPage, startIndex, endIndex 
// // }){
// //     const location = useLocation();
// //     const navigate = useNavigate();
// //     const [marcas, setMarcas] = useState([]);
// //     const [cargando, setCargando] = useState(true);
// //     const [error, setError] = useState(null);
// //     const [marcasAbierto, setMarcasAbierto] = useState(false);
// //     const [ordenAbierto, setOrdenAbierto] = useState(false);
// //     const marcasRef = useRef(null);
// //     const ordenRef = useRef(null);

// //     useEffect(() => {
// //         const cargarMarcas = async () => {
// //             try {
// //                 setCargando(true);
// //                 const response = await fetch('/assets/json/marcas.json');

// //                 if (!response.ok) {
// //                     throw new Error(`Error al cargar marcas: ${response.status}`);
// //                 }

// //                 const data = await response.json();
// //                 setMarcas(data.marcas);
// //                 setError(null);
// //             } catch (err) {
// //                 console.error('Error al cargar marcas:', err);
// //                 setError(err.message);
// //             } finally {
// //                 setCargando(false);
// //             }
// //         };

// //         cargarMarcas();
// //     }, []);

// //     useEffect(() => {
// //         const handleClickOutside = (event) => {
// //             if (marcasRef.current && !marcasRef.current.contains(event.target)) {
// //                 setMarcasAbierto(false);
// //             }
// //             if (ordenRef.current && !ordenRef.current.contains(event.target)) {
// //                 setOrdenAbierto(false);
// //             }
// //         };

// //         document.addEventListener('mousedown', handleClickOutside);
// //         return () => {
// //             document.removeEventListener('mousedown', handleClickOutside);
// //         };
// //     }, []);

// //     const isMarcaActiva = (marca) => {
// //         const params = new URLSearchParams(location.search);
// //         const marcaFiltro = params.get("marca");
// //         if (!marcaFiltro) return false;
        
// //         const marcaNormalizada = normalizarTexto(marca);
// //         return marcaFiltro === marcaNormalizada;
// //     };

// //     const manejarFiltroMarca = (marca) => {
// //         const params = new URLSearchParams(location.search);
// //         const marcaActual = params.get("marca");
// //         const marcaNormalizada = normalizarTexto(marca);
        
// //         if (marcaActual === marcaNormalizada) {
// //             params.delete("marca");
// //         } else {
// //             params.set("marca", marcaNormalizada);
// //         }
        
// //         navigate(`${location.pathname}?${params.toString()}`);
// //         setMarcasAbierto(false);
// //     };

// //     const manejarOrden = (tipo) => {
// //         if (setOrden && typeof setOrden === 'function') {
// //             setOrden(tipo);
// //         } else {
// //             console.error('setOrden no es una función válida', setOrden);
// //         }
// //         setOrdenAbierto(false);
// //     };

// //     const getOrdenTexto = () => {
// //         if (orden === "menor-mayor") return "Precio más bajo";
// //         if (orden === "mayor-menor") return "Precio más alto";
// //         return "";
// //     };

// //     if (cargando) {
// //         return (
// //             <div className='filtros-top'>
// //                 <div className='filtros-top-left'>
// //                     <p>Cargando marcas...</p>
// //                 </div>
// //             </div>
// //         );
// //     }

// //     if (error) {
// //         return (
// //             <div className='filtros-top'>
// //                 <div className='filtros-top-left'>
// //                     <p>Error al cargar marcas</p>
// //                 </div>
// //             </div>
// //         );
// //     }

// //     return(
// //         <div className='filtros-top'>
// //             <div className='filtros-top-brands-container' ref={marcasRef}>
// //                 <button type='button' className='filters-button'>
// //                     <span className="material-symbols-outlined">tune</span>
// //                 </button>

// //                 <button type='button' className={`${marcasAbierto ? 'active' : ''}`}
// //                     onClick={(e) => {
// //                         e.stopPropagation();
// //                         setMarcasAbierto(!marcasAbierto);
// //                         setOrdenAbierto(false);
// //                     }}
// //                 >
// //                     <div className='d-flex-center-center gap-5'>
// //                         <span className="material-symbols-outlined color-color-1">list</span>
// //                         <p className='text'>Marcas</p>
// //                     </div>
// //                     <span className="material-symbols-outlined text">keyboard_arrow_down</span>
// //                 </button>

// //                 {marcasAbierto && (
// //                     <div className='filtros-top-brands-dropdown'>
// //                         <div className='filtros-top-brands'>
// //                             {marcas.map((marcaItem) => {
// //                                 const activa = isMarcaActiva(marcaItem.marca);

// //                                 return(
// //                                     <button key={marcaItem.id} type='button' className={`marca-filter-btn ${activa ? 'active' : ''}`} onClick={() => manejarFiltroMarca(marcaItem.marca)}>
// //                                         <img src={marcaItem["image-png"]} 
// //                                             alt={marcaItem["image-alt"] || marcaItem.marca}
// //                                         />
// //                                     </button>
// //                                 );
// //                             })}
// //                         </div>
// //                     </div>
// //                 )}
// //             </div>

// //             <div className='filtros-top-price' ref={ordenRef}>
// //                 <button type='button' className={`orden-select-button ${ordenAbierto ? 'active' : ''}`}
// //                     onClick={(e) => {
// //                         e.stopPropagation();
// //                         setOrdenAbierto(!ordenAbierto);
// //                         setMarcasAbierto(false);
// //                     }}
// //                 >
// //                     <span className="material-symbols-outlined">sync_alt</span>
// //                     <p className='text'>{getOrdenTexto()}</p>
// //                 </button>

// //                 {ordenAbierto && (
// //                     <div className='filtros-top-price-list'>
// //                         <ul className='d-flex-column'>
// //                             <li>
// //                                 <button type='button' className={orden === 'menor-mayor' ? 'active' : ''} onClick={() => manejarOrden('menor-mayor')}>
// //                                     <span className="material-symbols-outlined">arrow_downward_alt</span>
// //                                     <p>Precio más bajo</p>
// //                                     {orden === 'menor-mayor' && (
// //                                         <span className="material-symbols-outlined check-icon">check</span>
// //                                     )}
// //                                 </button>
// //                             </li>
// //                             <li>
// //                                 <button type='button' className={orden === 'mayor-menor' ? 'active' : ''} onClick={() => manejarOrden('mayor-menor')}>
// //                                     <span className="material-symbols-outlined">arrow_upward_alt</span>
// //                                     <p>Precio más alto</p>
// //                                     {orden === 'mayor-menor' && (
// //                                         <span className="material-symbols-outlined check-icon">check</span>
// //                                     )}
// //                                 </button>
// //                             </li>
// //                         </ul>
// //                     </div>
// //                 )}
// //             </div>
// //         </div>
// //     );
// // }

// // export default FiltrosTop;

// import './FiltrosTop.css';

// function FiltrosTop(){
//     return(
//         <div className='filtros-top-container'>
//             <button type='button' className='filters-left-button'>
//                 <span className="material-symbols-outlined">tune</span>
//             </button>

//             <div className='filtros-top-brands'>
//                 <button type='button' className='filtros-top-brands-button'>
//                     <span className="material-symbols-outlined">list</span>
//                     <p>Marcas</p>
//                 </button>

//                 <ul>
//                     <li>
//                         <button type='button'>
//                             <img src='https://redmin.pe/wp-content/uploads/2021/08/industriasElCisne-LogoDirectorioMINDER.jpg' alt=''/>
//                         </button>
//                     </li>
//                     <li>
//                         <button type='button'>
//                             <img src='https://www.kamas.pe/assets/imagenes/kamas/logo-principal-kamas.jpg' alt=''/>
//                         </button>
//                     </li>
//                     <li>
//                         <button type='button'>
//                             <img src='https://paraisoperu.vtexassets.com/arquivos/Symbols.png' alt=""></img>
//                         </button>
//                     </li>
//                     <li>
//                         <button type='button'>
//                             <img src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSjxXL1nNtEYIcMb71oymiENTPCTbuSVwM5BA&s' alt=''/>
//                         </button>
//                     </li>
//                 </ul>
//             </div>

//             <div className='filtros-top-order'>
//                 <button type='button'>
//                     <p>Menor precio</p>
//                 </button>

//                 |

//                 <button type='button'>
//                     <p>Mayor precio</p>
//                 </button>
//             </div>
//         </div>
//     )
// }

// export default FiltrosTop;

import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import './FiltrosTop.css';

const normalizarTexto = (texto) => {
    if (!texto || typeof texto !== 'string') return '';
    return texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "-");
};

function FiltrosTop({setOrden, orden, setIsFiltersOpen, isFiltersOpen}){
    const location = useLocation();
    const navigate = useNavigate();
    const [marcas, setMarcas] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);
    const [marcasAbierto, setMarcasAbierto] = useState(false);
    const marcasRef = useRef(null);

    useEffect(() => {
        const cargarMarcas = async () => {
            try {
                setCargando(true);
                const response = await fetch('/assets/json/marcas.json');

                if (!response.ok) {
                    throw new Error(`Error al cargar marcas: ${response.status}`);
                }

                const data = await response.json();
                setMarcas(data.marcas || []);
                setError(null);
            } catch (err) {
                console.error('Error al cargar marcas:', err);
                setError(err.message);
            } finally {
                setCargando(false);
            }
        };

        cargarMarcas();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (marcasRef.current && !marcasRef.current.contains(event.target)) {
                setMarcasAbierto(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const isMarcaActiva = (marca) => {
        const params = new URLSearchParams(location.search);
        const marcaFiltro = params.get("marca");
        if (!marcaFiltro) return false;
        
        const marcaNormalizada = normalizarTexto(marca);
        return marcaFiltro === marcaNormalizada;
    };

    const manejarFiltroMarca = (marca) => {
        const params = new URLSearchParams(location.search);
        const marcaActual = params.get("marca");
        const marcaNormalizada = normalizarTexto(marca);
        
        if (marcaActual === marcaNormalizada) {
            params.delete("marca");
        } else {
            params.set("marca", marcaNormalizada);
        }
        
        navigate(`${location.pathname}?${params.toString()}`);
        setMarcasAbierto(false);
    };

    const manejarOrden = (tipo) => {
        if (setOrden && typeof setOrden === 'function') {
            setOrden(tipo);
        }
    };

    const toggleFiltersPanel = () => {
        if (setIsFiltersOpen) {
            setIsFiltersOpen(!isFiltersOpen);
        }
    };

    const getOrdenTexto = () => {
        if (orden === "menor-mayor") return "Menor precio";
        if (orden === "mayor-menor") return "Mayor precio";
        return "Ordenar por";
    };

    if (cargando) {
        return (
            <div className='filtros-top-container'>
                <div className='filtros-top-loading'>
                    <p>Cargando marcas...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className='filtros-top-container'>
                <div className='filtros-top-error'>
                    <p>Error al cargar marcas</p>
                </div>
            </div>
        );
    }

    return(
        <div className='filtros-top-container'>
            {/* Botón para abrir filtros en mobile */}
            <button 
                type='button' 
                className={`filters-left-button ${isFiltersOpen ? 'active' : ''}`}
                onClick={toggleFiltersPanel}
            >
                <span className="material-symbols-outlined">tune</span>
            </button>

            {/* Sección de marcas con dropdown */}
            <div className='filtros-top-brands-container' ref={marcasRef}>
                <button 
                    type='button' 
                    className={`filtros-top-brands-button ${marcasAbierto ? 'active' : ''}`}
                    onClick={(e) => {
                        e.stopPropagation();
                        setMarcasAbierto(!marcasAbierto);
                    }}
                >
                    <span className="material-symbols-outlined">list</span>
                    <p>Marcas</p>
                    <span className="material-symbols-outlined dropdown-arrow">keyboard_arrow_down</span>
                </button>

                {marcasAbierto && (
                    <div className='filtros-top-brands-dropdown'>
                        <div className='filtros-top-brands'>
                            {marcas.map((marcaItem) => {
                                const activa = isMarcaActiva(marcaItem.marca);
                                const imagenUrl = marcaItem["image-png"] || marcaItem.imagen || marcaItem.logo;
                                
                                return(
                                    <button 
                                        key={marcaItem.id} 
                                        type='button' 
                                        className={`marca-filter-btn ${activa ? 'active' : ''}`} 
                                        onClick={() => manejarFiltroMarca(marcaItem.marca)}
                                        title={marcaItem.marca}
                                    >
                                        {imagenUrl ? (
                                            <img 
                                                src={imagenUrl} 
                                                alt={marcaItem["image-alt"] || marcaItem.marca}
                                            />
                                        ) : (
                                            <span className="marca-placeholder">{marcaItem.marca}</span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            {/* Lista de marcas para desktop (visible solo en pantallas grandes) */}
            <div className='filtros-top-brands-desktop'>
                <ul>
                    {marcas.map((marcaItem) => {
                        const activa = isMarcaActiva(marcaItem.marca);
                        const imagenUrl = marcaItem["image-png"] || marcaItem.imagen || marcaItem.logo;
                        
                        return(
                            <li key={marcaItem.id}>
                                <button 
                                    type='button'
                                    className={activa ? 'active' : ''}
                                    onClick={() => manejarFiltroMarca(marcaItem.marca)}
                                    title={marcaItem.marca}
                                >
                                    {imagenUrl ? (
                                        <img 
                                            src={imagenUrl} 
                                            alt={marcaItem["image-alt"] || marcaItem.marca}
                                        />
                                    ) : (
                                        <span className="marca-placeholder">{marcaItem.marca}</span>
                                    )}
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </div>

            {/* Sección de ordenamiento */}
            <div className='filtros-top-order'>
                <button 
                    type='button'
                    className={orden === "menor-mayor" ? 'active' : ''}
                    onClick={() => manejarOrden("menor-mayor")}
                >
                    <p>Menor precio</p>
                </button>

                <span className='separator'>|</span>

                <button 
                    type='button'
                    className={orden === "mayor-menor" ? 'active' : ''}
                    onClick={() => manejarOrden("mayor-menor")}
                >
                    <p>Mayor precio</p>
                </button>
            </div>
        </div>
    );
}

export default FiltrosTop;
