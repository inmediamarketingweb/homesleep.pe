// // // import './Categorias.css';

// // // function Categorias(){
// // //     return(
// // //         <div className='block-container'>
// // //             <section className='block-content'>
// // //                 <div className='homepage-categories'>
// // //                     <div className='homepage-categories-target homepage-categories-target-1'>
// // //                         <div className='homepage-categories-target-banner'>
// // //                             {/* Imagen "categoria banner" */}
// // //                             <img src='https://www.kamas.pe/assets/imagenes/paginas/pagina-principal/categorias/dormitorios.webp' alt=''/>
// // //                         </div>

// // //                         <div className='homepage-categories-target-bottom'>
// // //                             <ul className='homepage-categories-target-list'>
// // //                                 {/* Lista de categorías + sus "categoria-miniatura"*/}
// // //                                 <li>
// // //                                     <div title='Colchones | Homesleep'>
// // //                                         <img src='https://www.kamas.pe/assets/imagenes/paginas/pagina-principal/categorias/dormitorios.webp' alt=''/>
// // //                                         <p>Colchones</p>
// // //                                     </div>
// // //                                 </li>
// // //                                 <li>
// // //                                     <div title='Camas box tarimas | Homesleep'>
// // //                                         <img src='https://www.kamas.pe/assets/imagenes/paginas/pagina-principal/categorias/dormitorios.webp' alt=''/>
// // //                                         <p>Camas box tarimas</p>
// // //                                     </div>
// // //                                 </li>
// // //                                 <li>
// // //                                     <div title='Camas funcionales | Homesleep'>
// // //                                         <img src='https://www.kamas.pe/assets/imagenes/paginas/pagina-principal/categorias/dormitorios.webp' alt=''/>
// // //                                         <p>Camas funcionales</p>
// // //                                     </div>
// // //                                 </li>
// // //                                 <li>
// // //                                     <div title='Cabeceras | Homesleep'>
// // //                                         <img src='https://www.kamas.pe/assets/imagenes/paginas/pagina-principal/categorias/dormitorios.webp' alt=''/>
// // //                                         <p>Cabeceras</p>
// // //                                     </div>
// // //                                 </li>
// // //                                 <li>
// // //                                     <div title='Sofás | Homesleep'>
// // //                                         <img src='https://www.kamas.pe/assets/imagenes/paginas/pagina-principal/categorias/dormitorios.webp' alt=''/>
// // //                                         <p>Sofás</p>
// // //                                     </div>
// // //                                 </li>
// // //                                 <li>
// // //                                     <div title='Complementos | Homesleep'>
// // //                                         <img src='https://www.kamas.pe/assets/imagenes/paginas/pagina-principal/categorias/dormitorios.webp' alt=''/>
// // //                                         <p>Complementos</p>
// // //                                     </div>
// // //                                 </li>
// // //                             </ul>
// // //                         </div>

// // //                         <button type='button' className='homepage-categories-target-button homepage-categories-target-button-1'>
// // //                             <span class="material-icons">chevron_left</span>
// // //                         </button>

// // //                         <button type='button' className='homepage-categories-target-button homepage-categories-target-button-2'>
// // //                             <span class="material-icons">chevron_right</span>
// // //                         </button>
// // //                     </div>

// // //                     <div className='homepage-categories-target homepage-categories-target-2 d-flex-column gap-10'>
// // //                         {/* Nombre de categoría */}
// // //                         <p className='block-title color-color-1 text-left'>Dormitorios</p>

// // //                         {/* Categoria mensaje */}
// // //                         <p className='text'>Lorem Ipsum is simply. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries.</p>

// // //                         <div className='d-flex-column gap-5'>
// // //                             <p className='title text'>Marcas disponibles:</p>

// // //                             <ul className='d-flex gap-5'>
// // //                                 {/* Marcas de la categoria */}
// // //                                 <li>
// // //                                     <a href='' className='brand-link el-cisne-button-link' title='Dormitorios | El cisne'>
// // //                                         <p>El cisne</p>
// // //                                     </a>
// // //                                 </li>
// // //                                 <li>
// // //                                     <a href='' className='brand-link kamas-button-link' title='Dormitorios | Kamas'>
// // //                                         <p>Kamas</p>
// // //                                     </a>
// // //                                 </li>
// // //                                 <li>
// // //                                     <a href='' className='brand-link paraiso-button-link' title='Dormitorios | Paraiso'>
// // //                                         <p>Paraiso</p>
// // //                                     </a>
// // //                                 </li>
// // //                                 <li>
// // //                                     <a href='' className='brand-link komfort-button-link' title='Dormitorios | Komfort'>
// // //                                         <p>Komfort</p>
// // //                                     </a>
// // //                                 </li>
// // //                             </ul>
// // //                         </div>
                        
// // //                         {/* ruta de la categoria */}
// // //                         <a href='' className='button-link button-link-2 margin-left' title='Dormitorios | Homesleep'>
// // //                             <p className='button-link-text'>Ver todos</p>
// // //                         </a>
// // //                     </div>
// // //                 </div>
// // //             </section>
// // //         </div>
// // //     )
// // // }

// // // export default Categorias;

// // import './Categorias.css';
// // import { useState, useEffect, useRef } from 'react';

// // function Categorias(){
// //     const [categorias, setCategorias] = useState([]);
// //     const [loading, setLoading] = useState(true);
// //     const [error, setError] = useState(null);
// //     const [scrollPosition, setScrollPosition] = useState(0);
// //     const [maxScroll, setMaxScroll] = useState(0);
// //     const listRef = useRef(null);

// //     useEffect(() => {
// //         const fetchCategorias = async () => {
// //             try {
// //                 const response = await fetch('/assets/json/categorias/nuevas-categorias.json');
                
// //                 if (!response.ok) {
// //                     throw new Error(`Error ${response.status}: ${response.statusText}`);
// //                 }
                
// //                 const data = await response.json();
// //                 setCategorias(data.categorias);
// //             } catch (err) {
// //                 setError(err.message);
// //                 console.error('Error cargando categorías:', err);
// //             } finally {
// //                 setLoading(false);
// //             }
// //         };

// //         fetchCategorias();
// //     }, []);

// //     // Calcular máximo scroll permitido (2 movimientos = 400px)
// //     useEffect(() => {
// //         if (listRef.current && categorias.length > 0) {
// //             const list = listRef.current;
// //             const containerWidth = list.parentElement.offsetWidth;
// //             const listWidth = list.scrollWidth;
// //             const maxPossibleScroll = Math.max(0, listWidth - containerWidth);
// //             setMaxScroll(Math.min(400, maxPossibleScroll)); // Máximo 400px (2 movimientos)
// //         }
// //     }, [categorias]);

// //     const scrollLeft = () => {
// //         if (scrollPosition < 0) {
// //             const newPosition = Math.min(scrollPosition + 200, 0);
// //             setScrollPosition(newPosition);
// //         }
// //     };

// //     const scrollRight = () => {
// //         if (scrollPosition > -maxScroll) {
// //             const newPosition = Math.max(scrollPosition - 200, -maxScroll);
// //             setScrollPosition(newPosition);
// //         }
// //     };

// //     if (loading) {
// //         return (
// //             <div className='block-container'>
// //                 <section className='block-content'>
// //                     <div className='loading'>Cargando categorías...</div>
// //                 </section>
// //             </div>
// //         );
// //     }

// //     if (error) {
// //         return (
// //             <div className='block-container'>
// //                 <section className='block-content'>
// //                     <div className='error'>Error: {error}</div>
// //                 </section>
// //             </div>
// //         );
// //     }

// //     // Tomamos la primera categoría como ejemplo
// //     const categoria = categorias[0];

// //     if (!categoria) {
// //         return (
// //             <div className='block-container'>
// //                 <section className='block-content'>
// //                     <div className='error'>No se encontraron categorías</div>
// //                 </section>
// //             </div>
// //         );
// //     }

// //     return(
// //         <div className='block-container'>
// //             <section className='block-content'>
// //                 <div className='homepage-categories'>
// //                     <div className='homepage-categories-target homepage-categories-target-1'>
// //                         <div className='homepage-categories-target-banner'>
// //                             <img 
// //                                 src={categoria['categoria-banner'].src} 
// //                                 alt={categoria['categoria-banner'].alt}
// //                                 onError={(e) => {
// //                                     e.target.src = 'https://www.kamas.pe/assets/imagenes/paginas/pagina-principal/categorias/dormitorios.webp';
// //                                 }}
// //                             />
// //                         </div>

// //                         <div className='homepage-categories-target-bottom'>
// //                             <ul 
// //                                 ref={listRef}
// //                                 className='homepage-categories-target-list'
// //                                 style={{ transform: `translateX(${scrollPosition}px)` }}
// //                             >
// //                                 {categoria['lista-uno'].lista.map((item, index) => (
// //                                     <li key={index}>
// //                                         <a 
// //                                             href={item.ruta} 
// //                                             title={`${item.titulo} | Homesleep`}
// //                                         >
// //                                             <img 
// //                                                 src={categoria['categoria-miniatura'].src} 
// //                                                 alt={categoria['categoria-miniatura'].alt}
// //                                                 onError={(e) => {
// //                                                     e.target.src = 'https://www.kamas.pe/assets/imagenes/paginas/pagina-principal/categorias/dormitorios.webp';
// //                                                 }}
// //                                             />
// //                                             <p>{item.titulo}</p>
// //                                         </a>
// //                                     </li>
// //                                 ))}
// //                             </ul>
// //                         </div>

// //                         <button 
// //                             type='button' 
// //                             className='homepage-categories-target-button homepage-categories-target-button-1'
// //                             onClick={scrollLeft}
// //                             disabled={scrollPosition >= 0}
// //                         >
// //                             <span className="material-icons">chevron_left</span>
// //                         </button>

// //                         <button 
// //                             type='button' 
// //                             className='homepage-categories-target-button homepage-categories-target-button-2'
// //                             onClick={scrollRight}
// //                             disabled={scrollPosition <= -maxScroll}
// //                         >
// //                             <span className="material-icons">chevron_right</span>
// //                         </button>
// //                     </div>

// //                     <div className='homepage-categories-target homepage-categories-target-2 d-flex-column gap-10'>
// //                         <p className='block-title color-color-1 text-left'>{categoria.categoria}</p>

// //                         <div className='text'>
// //                             {categoria['categoria-mensaje']?.map((mensaje, index) => (
// //                                 <p key={index}>{mensaje}</p>
// //                             ))}
// //                         </div>

// //                         <div className='d-flex-column gap-5'>
// //                             <p className='title text'>Marcas disponibles:</p>

// //                             <ul className='d-flex gap-5'>
// //                                 {categoria['lista-dos'].lista.map((marca, index) => (
// //                                     <li key={index}>
// //                                         <a 
// //                                             href={marca.ruta} 
// //                                             className={`brand-link ${marca.titulo.toLowerCase().replace(/\s+/g, '-')}-button-link`} 
// //                                             title={`${categoria.categoria} | ${marca.titulo}`}
// //                                         >
// //                                             <p>{marca.titulo}</p>
// //                                         </a>
// //                                     </li>
// //                                 ))}
// //                             </ul>
// //                         </div>
                        
// //                         <a 
// //                             href={categoria.ruta} 
// //                             className='button-link button-link-2 margin-left' 
// //                             title={`${categoria.categoria} | Homesleep`}
// //                         >
// //                             <p className='button-link-text'>Ver todos</p>
// //                         </a>
// //                     </div>
// //                 </div>
// //             </section>
// //         </div>
// //     )
// // }

// // export default Categorias;

// import './Categorias.css';
// import { useState, useEffect, useRef } from 'react';

// function Categorias(){
//     const [categorias, setCategorias] = useState([]);
//     const [categoriaActiva, setCategoriaActiva] = useState(0); // Índice de la categoría activa
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [scrollPosition, setScrollPosition] = useState(0);
//     const [maxScroll, setMaxScroll] = useState(0);
//     const listRef = useRef(null);

//     useEffect(() => {
//         const fetchCategorias = async () => {
//             try {
//                 const response = await fetch('/assets/json/categorias/nuevas-categorias.json');
                
//                 if (!response.ok) {
//                     throw new Error(`Error ${response.status}: ${response.statusText}`);
//                 }
                
//                 const data = await response.json();
//                 setCategorias(data.categorias);
//             } catch (err) {
//                 setError(err.message);
//                 console.error('Error cargando categorías:', err);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchCategorias();
//     }, []);

//     // Calcular máximo scroll permitido (2 movimientos = 400px)
//     useEffect(() => {
//         if (listRef.current && categorias.length > 0) {
//             const list = listRef.current;
//             const containerWidth = list.parentElement.offsetWidth;
//             const listWidth = list.scrollWidth;
//             const maxPossibleScroll = Math.max(0, listWidth - containerWidth);
//             setMaxScroll(Math.min(400, maxPossibleScroll)); // Máximo 400px (2 movimientos)
//         }
//     }, [categorias]);

//     const scrollLeft = () => {
//         if (scrollPosition < 0) {
//             const newPosition = Math.min(scrollPosition + 200, 0);
//             setScrollPosition(newPosition);
//         }
//     };

//     const scrollRight = () => {
//         if (scrollPosition > -maxScroll) {
//             const newPosition = Math.max(scrollPosition - 200, -maxScroll);
//             setScrollPosition(newPosition);
//         }
//     };

//     const handleCategoriaClick = (index) => {
//         setCategoriaActiva(index);
//     };

//     if (loading) {
//         return (
//             <div className='block-container'>
//                 <section className='block-content'>
//                     <div className='loading'>Cargando categorías...</div>
//                 </section>
//             </div>
//         );
//     }

//     if (error) {
//         return (
//             <div className='block-container'>
//                 <section className='block-content'>
//                     <div className='error'>Error: {error}</div>
//                 </section>
//             </div>
//         );
//     }

//     if (categorias.length === 0) {
//         return (
//             <div className='block-container'>
//                 <section className='block-content'>
//                     <div className='error'>No se encontraron categorías</div>
//                 </section>
//             </div>
//         );
//     }

//     const categoria = categorias[categoriaActiva];

//     return(
//         <div className='block-container'>
//             <section className='block-content'>
//                 <div className='homepage-categories'>
//                     <div className='homepage-categories-target homepage-categories-target-1'>
//                         <div className='homepage-categories-target-banner'>
//                             <img 
//                                 src={categoria['categoria-banner'].src} 
//                                 alt={categoria['categoria-banner'].alt}
//                                 onError={(e) => {
//                                     e.target.src = 'https://www.kamas.pe/assets/imagenes/paginas/pagina-principal/categorias/dormitorios.webp';
//                                 }}
//                             />
//                         </div>

//                         <div className='homepage-categories-target-bottom'>
//                             <ul 
//                                 ref={listRef}
//                                 className='homepage-categories-target-list'
//                                 style={{ transform: `translateX(${scrollPosition}px)` }}
//                             >
//                                 {categorias.map((cat, index) => (
//                                     <li key={cat.id}>
//                                         <div 
//                                             title={`${cat.categoria} | Homesleep`}
//                                             onClick={() => handleCategoriaClick(index)}
//                                             className={index === categoriaActiva ? 'active' : ''}
//                                         >
//                                             <img 
//                                                 src={cat['categoria-miniatura'].src} 
//                                                 alt={cat['categoria-miniatura'].alt}
//                                                 onError={(e) => {
//                                                     e.target.src = 'https://www.kamas.pe/assets/imagenes/paginas/pagina-principal/categorias/dormitorios.webp';
//                                                 }}
//                                             />
//                                             <p>{cat.categoria}</p>
//                                         </div>
//                                     </li>
//                                 ))}
//                             </ul>
//                         </div>

//                         <button 
//                             type='button' 
//                             className='homepage-categories-target-button homepage-categories-target-button-1'
//                             onClick={scrollLeft}
//                             disabled={scrollPosition >= 0}
//                         >
//                             <span className="material-icons">chevron_left</span>
//                         </button>

//                         <button 
//                             type='button' 
//                             className='homepage-categories-target-button homepage-categories-target-button-2'
//                             onClick={scrollRight}
//                             disabled={scrollPosition <= -maxScroll}
//                         >
//                             <span className="material-icons">chevron_right</span>
//                         </button>
//                     </div>

//                     <div className='homepage-categories-target homepage-categories-target-2 d-flex-column gap-10'>
//                         <p className='block-title color-color-1 text-left'>{categoria.categoria}</p>

//                         <div className='text'>
//                             {categoria['categoria-mensaje']?.map((mensaje, index) => (
//                                 <p key={index}>{mensaje}</p>
//                             ))}
//                         </div>

//                         <div className='homepage-categories-target-categorie-list d-flex-column gap-5'>
//                             <p className='title text'>Marcas disponibles:</p>

//                             <ul className='d-flex gap-5'>
//                                 {categoria['marcas'].lista.map((marca, index) => (
//                                     <li key={index}>
//                                         <a 
//                                             href={marca.ruta} 
//                                             className={`brand-link ${marca.titulo.toLowerCase().replace(/\s+/g, '-')}-button-link`} 
//                                             title={`${categoria.categoria} | ${marca.titulo}`}
//                                         >
//                                             <p>{marca.titulo}</p>
//                                         </a>
//                                     </li>
//                                 ))}
//                             </ul>
//                         </div>
                        
//                         <a 
//                             href={categoria.ruta} 
//                             className='button-link button-link-2 margin-left' 
//                             title={`${categoria.categoria} | Homesleep`}
//                         >
//                             <p className='button-link-text'>Ver todos</p>
//                         </a>
//                     </div>
//                 </div>
//             </section>
//         </div>
//     )
// }

// export default Categorias;

import './Categorias.css';
import { useState, useEffect, useRef } from 'react';

function Categorias(){
    const [categorias, setCategorias] = useState([]);
    const [categoriaActiva, setCategoriaActiva] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [scrollPosition, setScrollPosition] = useState(0);
    const [maxScroll, setMaxScroll] = useState(0);
    const listRef = useRef(null);

    useEffect(() => {
        const fetchCategorias = async () => {
            try {
                const response = await fetch('/assets/json/categorias/nuevas-categorias.json');
                
                if (!response.ok) {
                    throw new Error(`Error ${response.status}: ${response.statusText}`);
                }
                
                const data = await response.json();
                setCategorias(data.categorias);
                
                // Buscar el índice de "Dormitorios" por defecto
                const indexDormitorios = data.categorias.findIndex(cat => 
                    cat.categoria.toLowerCase() === "dormitorios"
                );
                
                if (indexDormitorios !== -1) {
                    setCategoriaActiva(indexDormitorios);
                }
            } catch (err) {
                setError(err.message);
                console.error('Error cargando categorías:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchCategorias();
    }, []);

    // Calcular máximo scroll permitido (2 movimientos = 400px)
    useEffect(() => {
        if (listRef.current && categorias.length > 0) {
            const list = listRef.current;
            const containerWidth = list.parentElement.offsetWidth;
            const listWidth = list.scrollWidth;
            const maxPossibleScroll = Math.max(0, listWidth - containerWidth);
            setMaxScroll(Math.min(600, maxPossibleScroll));
        }
    }, [categorias]);

    const scrollLeft = () => {
        if (scrollPosition < 0) {
            const newPosition = Math.min(scrollPosition + 200, 0);
            setScrollPosition(newPosition);
        }
    };

    const scrollRight = () => {
        if (scrollPosition > -maxScroll) {
            const newPosition = Math.max(scrollPosition - 200, -maxScroll);
            setScrollPosition(newPosition);
        }
    };

    const handleCategoriaClick = (index) => {
        setCategoriaActiva(index);
    };

    if (loading) {
        return (
            <div className='block-container'>
                <section className='block-content'>
                    <div className='loading'>Cargando categorías...</div>
                </section>
            </div>
        );
    }

    if (error) {
        return (
            <div className='block-container'>
                <section className='block-content'>
                    <div className='error'>Error: {error}</div>
                </section>
            </div>
        );
    }

    if (categorias.length === 0) {
        return (
            <div className='block-container'>
                <section className='block-content'>
                    <div className='error'>No se encontraron categorías</div>
                </section>
            </div>
        );
    }

    const categoria = categorias[categoriaActiva];

    return(
        <div className='block-container'>
            <section className='block-content'>
                <div className='homepage-categories'>
                    <div className='homepage-categories-target homepage-categories-target-1'>
                        <div className='homepage-categories-target-banner'>
                            <img 
                                src={categoria['categoria-banner'].src} 
                                alt={categoria['categoria-banner'].alt}
                                onError={(e) => {
                                    e.target.src = 'https://www.kamas.pe/assets/imagenes/paginas/pagina-principal/categorias/dormitorios.webp';
                                }}
                            />
                        </div>

                        <div className='homepage-categories-target-bottom'>
                            <ul 
                                ref={listRef}
                                className='homepage-categories-target-list'
                                style={{ transform: `translateX(${scrollPosition}px)` }}
                            >
                                {categorias.map((cat, index) => (
                                    <li key={cat.id}>
                                        <div 
                                            title={`${cat.categoria} | Homesleep`}
                                            onClick={() => handleCategoriaClick(index)}
                                            className={index === categoriaActiva ? 'active' : ''}
                                        >
                                            <img 
                                                src={cat['categoria-miniatura'].src} 
                                                alt={cat['categoria-miniatura'].alt}
                                                onError={(e) => {
                                                    e.target.src = 'https://www.kamas.pe/assets/imagenes/paginas/pagina-principal/categorias/dormitorios.webp';
                                                }}
                                            />
                                            <p>{cat.categoria}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <button 
                            type='button' 
                            className='homepage-categories-target-button homepage-categories-target-button-1'
                            onClick={scrollLeft}
                            disabled={scrollPosition >= 0}
                        >
                            <span className="material-icons">chevron_left</span>
                        </button>

                        <button 
                            type='button' 
                            className='homepage-categories-target-button homepage-categories-target-button-2'
                            onClick={scrollRight}
                            disabled={scrollPosition <= -maxScroll}
                        >
                            <span className="material-icons">chevron_right</span>
                        </button>
                    </div>

                    <div className='homepage-categories-target homepage-categories-target-2 d-flex-column gap-10'>
                        <div className='bg-component padding-10 border-r-6 d-flex-column gap-10'>
                            <p className='block-title color-color-1 text-left'>{categoria.categoria}</p>

                            <div className='text'>
                                {categoria['categoria-mensaje']?.map((mensaje, index) => (
                                    <p key={index}>{mensaje}</p>
                                ))}
                            </div>

                            <div className='homepage-categories-target-categorie-list d-flex-column gap-5'>
                                <p className='title text'>Marcas disponibles:</p>

                                <ul className='d-flex gap-5'>
                                    {categoria['marcas'].lista.map((marca, index) => (
                                        <li key={index}>
                                            <a 
                                                href={marca.ruta} 
                                                className={`brand-link ${marca.titulo.toLowerCase().replace(/\s+/g, '-')}-button-link`} 
                                                title={`${categoria.categoria} | ${marca.titulo}`}
                                            >
                                                <p>{marca.titulo}</p>
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        
                        <a href={categoria.ruta} className='button-link button-link-2 margin-left' title={`${categoria.categoria} | Homesleep`}>
                            <p className='button-link-text'>Ver todos</p>
                        </a>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Categorias;
