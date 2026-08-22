import { useEffect, useState, useMemo, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';

import '../Productos.css';
import './Layout.css';

import Categorias from '../Componentes/Categorias/Categorias';
import FiltrosTop from '../Componentes/FiltrosTop/FiltrosTop';
import { Producto } from '../../../Componentes/Plantillas/Producto/Producto';
import RangoPrecios from '../Componentes/RangoPrecios/RangoPrecios';

const normalizarTexto = (texto) => {
    if (!texto || typeof texto !== 'string') {
        return '';
    }
    return texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
};

const filtroKeyMap = {
    "tamaño": "tamaño",
    "marca": "marca",
    "nivel-de-confort": "nivel-de-confort",
    "modelo": "modelo-de-colchón",
    "línea": "línea-de-colchón",
    "resortes": "tipo-de-resorte"
};

function Colchones() {
    const { sub1, sub2, sub3 } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filtros, setFiltros] = useState([]);
    const [envioGratisActivo, setEnvioGratisActivo] = useState(false);
    const [isHotSaleActive, setIsHotSaleActive] = useState(() => {
        const saved = localStorage.getItem('hotSaleActive');
        return saved === 'true';
    });
    const [hotSaleSKUs, setHotSaleSKUs] = useState([]);
    const queryParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
    const marcaSeleccionada = queryParams.get('marca');
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);
    const filtersPanelRef = useRef(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 32;
    const [hasActiveFilters, setHasActiveFilters] = useState(false);

    // Leer el orden desde la URL
    const [orden, setOrden] = useState(() => {
        const params = new URLSearchParams(location.search);
        return params.get('orden') || 'ultimo';
    });

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

    // Función para manejar el cambio de orden con actualización de URL
    const handleOrdenChange = (nuevoOrden) => {
        const params = new URLSearchParams(location.search);
        
        if (nuevoOrden === 'ultimo') {
            params.delete('orden');
        } else {
            params.set('orden', nuevoOrden);
        }
        
        setOrden(nuevoOrden);
        setCurrentPage(1);
        navigate(`${location.pathname}?${params.toString()}`, { replace: true });
    };

    // Detectar si hay filtros activos (incluyendo precio)
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const hasPriceFilter = params.has('min') || params.has('max');
        const hasOtherFilters = queryParams.toString() || envioGratisActivo || isHotSaleActive;
        
        setHasActiveFilters(hasPriceFilter || hasOtherFilters);
    }, [queryParams, envioGratisActivo, isHotSaleActive, location.search]);

    // Sincronizar orden con la URL cuando cambia
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const ordenFromUrl = params.get('orden');
        if (ordenFromUrl && ordenFromUrl !== orden) {
            setOrden(ordenFromUrl);
        }
    }, [location.search]);

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

    useEffect(() => {
        const cargarProductosColchones = async () => {
            try {
                setLoading(true);

                const manifestResponse = await fetch('/assets/json/manifest.json');
                const manifestData = await manifestResponse.json();
                const archivos = manifestData.files || [];

                let archivosColchones = archivos.filter(url =>
                    url.startsWith('/assets/json/categorias/colchones/')
                );

                if (sub1) {
                    archivosColchones = archivosColchones.filter(
                        url => url.includes(`/colchones/${sub1}/`)
                    );
                }

                if (sub2) {
                    archivosColchones = archivosColchones.filter(
                        url => url.includes(`/colchones/${sub1}/${sub2}/`)
                    );
                }

                if (sub3) {
                    archivosColchones = archivosColchones.filter(
                        url => url.includes(`/colchones/${sub1}/${sub2}/${sub3}.json`)
                    );
                }

                const productosPromesas = archivosColchones.map(async (url) => {
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
                setCurrentPage(1);
                setLoading(false);
            } catch (error) {
                console.error("Error cargando productos de colchones:", error);
                setLoading(false);
            }
        };

        cargarProductosColchones();
    }, [sub1, sub2, sub3]);

    useEffect(() => {
        const cargarFiltros = async () => {
            try {
                const response = await fetch('/assets/json/categorias/colchones/filtros.json');
                const data = await response.json();
                setFiltros(data.filtros || []);
            } catch (error) {
                console.error("Error cargando filtros:", error);
            }
        };

        cargarFiltros();
    }, []);

    const filtrosFiltrados = useMemo(() => {
        if (!filtros.length) return filtros;

        return filtros.map(filtro => {
            const nombreFiltro = Object.keys(filtro)[0];
            const valoresFiltro = filtro[nombreFiltro];

            if (nombreFiltro === "modelos" && marcaSeleccionada) {
                const modelosFiltrados = valoresFiltro.filter(grupo => {
                    const nombreGrupo = Object.keys(grupo)[0];
                    const grupoNormalizado = normalizarTexto(nombreGrupo);
                    const marcaNormalizada = normalizarTexto(marcaSeleccionada);
                    
                    return grupoNormalizado === marcaNormalizada;
                });

                return { [nombreFiltro]: modelosFiltrados };
            }

            return filtro;
        });
    }, [filtros, marcaSeleccionada]);

    // PRIMERO: Aplicar filtros de URL, envío gratis y Hot Sale
    const productosBaseFiltrados = useMemo(() => {
        if (productos.length === 0) return [];

        let filtrados = productos.filter(producto => {
            if (envioGratisActivo) {
                if (producto["tipo-de-envio"] !== "Gratis") {
                    return false;
                }
            }

            if (queryParams.entries().length === 0) return true;

            for (let [paramUrl, valorFiltro] of queryParams.entries()) {
                // Saltar parámetros de precio (se aplican después)
                if (paramUrl === 'min' || paramUrl === 'max') continue;
                // Saltar parámetro de orden
                if (paramUrl === 'orden') continue;

                const claveJson = filtroKeyMap[paramUrl];
                if (!claveJson) continue;

                const normalizadoFiltro = normalizarTexto(valorFiltro);
                let cumpleFiltro = false;

                const valorProductoDirecto = producto[claveJson];
                if (valorProductoDirecto) {
                    const normalizadoProducto = normalizarTexto(valorProductoDirecto.toString());
                    if (normalizadoProducto === normalizadoFiltro) {
                        cumpleFiltro = true;
                    }
                }

                if (!cumpleFiltro && producto.fichaTecnica) {
                    const valorEnFicha = producto.fichaTecnica[claveJson];
                    if (valorEnFicha) {
                        const normalizadoFicha = normalizarTexto(valorEnFicha.toString());
                        if (normalizadoFicha === normalizadoFiltro) {
                            cumpleFiltro = true;
                        }
                    }
                }

                if (!cumpleFiltro && claveJson === "modelo-de-colchón") {
                    const valorModelo = producto["modelo"];
                    if (valorModelo) {
                        const normalizadoModelo = normalizarTexto(valorModelo.toString());
                        if (normalizadoModelo === normalizadoFiltro) {
                            cumpleFiltro = true;
                        }
                    }
                }

                if (!cumpleFiltro && claveJson === "tamaño") {
                    const tamañosDisponibles = producto["tamaños-disponibles"] || [];
                    const cumpleEnTamaños = tamañosDisponibles.some(tamaño => {
                        const normalizadoTamaño = normalizarTexto(tamaño.nombre.toString());
                        return normalizadoTamaño === normalizadoFiltro;
                    });
                    
                    if (cumpleEnTamaños) {
                        cumpleFiltro = true;
                    }
                }

                if (!cumpleFiltro) {
                    return false;
                }
            }

            return true;
        });

        // Aplicar filtro de Hot Sale si está activo
        if (isHotSaleActive && hotSaleSKUs.length > 0) {
            filtrados = filtrados.filter(producto => hotSaleSKUs.includes(producto.sku));
        }

        return filtrados;
    }, [productos, queryParams, envioGratisActivo, isHotSaleActive, hotSaleSKUs]);

    // SEGUNDO: Aplicar filtro de precio
    const productosFiltrados = useMemo(() => {
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
            const precio = producto.precioVenta;
            return precio >= min && precio <= max;
        });
    }, [productosBaseFiltrados, location.search]);

    // TERCERO: Ordenar productos
    const productosOrdenados = useMemo(() => {
        const productosParaOrdenar = [...productosFiltrados];
        
        if (orden === "ultimo") {
            return productosParaOrdenar;
        }
        
        if (orden === "menor-mayor") {
            return productosParaOrdenar.sort((a, b) => {
                const precioA = a.precioVenta || 0;
                const precioB = b.precioVenta || 0;
                return precioA - precioB;
            });
        }
        
        if (orden === "mayor-menor") {
            return productosParaOrdenar.sort((a, b) => {
                const precioA = a.precioVenta || 0;
                const precioB = b.precioVenta || 0;
                return precioB - precioA;
            });
        }

        return productosParaOrdenar;
    }, [productosFiltrados, orden]);

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

    const toggleFiltro = (nombreFiltro, valor) => {
        const normalizadoValor = normalizarTexto(valor);
        const paramUrl = nombreFiltro === "modelos" ? "modelo" : nombreFiltro;
        const newParams = new URLSearchParams(location.search);
        const valorActual = newParams.get(paramUrl);

        if (valorActual === normalizadoValor) {
            newParams.delete(paramUrl);
        } else {
            newParams.set(paramUrl, normalizadoValor);
        }

        setCurrentPage(1);
        navigate(`${location.pathname}?${newParams.toString()}`);
    };

    const isFiltroActivo = (nombreFiltro, valor) => {
        const normalizadoValor = normalizarTexto(valor);
        const paramUrl = nombreFiltro === "modelos" ? "modelo" : nombreFiltro;
        return queryParams.get(paramUrl) === normalizadoValor;
    };

    const limpiarFiltros = () => {
        setCurrentPage(1);
        setIsHotSaleActive(false);
        localStorage.setItem('hotSaleActive', 'false');
        setEnvioGratisActivo(false);
        
        // Limpiar también los filtros de precio y orden de la URL
        const params = new URLSearchParams(location.search);
        params.delete('min');
        params.delete('max');
        params.delete('orden');
        const newSearch = params.toString();
        const newPath = location.pathname + (newSearch ? `?${newSearch}` : '');
        navigate(newPath, { replace: true });
    };

    return(
        <>
            <Helmet>
                <title>Colchones | Homesleep</title>
                <meta name="description" content="Encuentra el colchón ideal para ti, compara marcas, precios, modelos, confort y encuentra tu colchón ideal." />
                <meta property="og:title" content="Colchones | Homesleep"/>
            </Helmet>

            <main className='products-page-main d-flex-column gap-10'>
                <Categorias/>

                <div className='products-page-blocks'>
                    <div className={`products-page-left ${isFiltersOpen ? 'active' : ''}`} ref={filtersPanelRef}>
                        <div className='products-page-filters-container-global d-flex-column gap-10'>
                            <div className='d-flex-column gap-20'>
                                <div className='d-flex-column padding-bottom-20 border-bottom-2-solid-component'>
                                    <p className='block-title color-color-1 uppercase w-100 d-flex'>Homesleep</p>
                                    <button type='button' className='filters-button-close margin-left' onClick={closeFilters}>
                                        <span className="material-icons color-color-1">close</span>
                                    </button>
                                    <p className='uppercase w-100 d-flex'>Las mejores marcas en productos para el descanso</p>
                                </div>

                                <div className='envio-gratis-button-container'>
                                    <div className='d-flex-center-center'>
                                        <p className='weight-bold uppercase color-color-1 font-bold'>Envío gratis</p>
                                    </div>
                                    <div type='button' className={`envio-gratis-button ${envioGratisActivo ? 'active' : ''}`} onClick={toggleEnvioGratis}>
                                        <span></span>
                                    </div>
                                </div>

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

                                <div className='products-page-filters-container d-flex-column gap-20'>
                                    {filtrosFiltrados.map((filtro, index) => {
                                        const nombreFiltro = Object.keys(filtro)[0];
                                        const valoresFiltro = filtro[nombreFiltro];

                                        if (nombreFiltro === "modelos" && valoresFiltro.length === 0){
                                            return null;
                                        }

                                        if (nombreFiltro === "tamaño") {
                                            return(
                                                <div className='products-page-filter' key={index}>
                                                    <p className='filter-title uppercase'>Tamaño</p>
                                                    <ul className='products-page-filter-list'>
                                                        {valoresFiltro.map((item, i) => (
                                                            <li key={i}>
                                                                <Link to={item.ruta} className={location.pathname === item.ruta ? "products-page-filter-list-link active" : "products-page-filter-list-link"}>
                                                                    <p>{item.tamaño}</p>
                                                                </Link>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            );
                                        }

                                        if (nombreFiltro === "modelos") {
                                            return(
                                                <div className='products-page-filter' key={index}>
                                                    <p className='filter-title uppercase'>Modelos de colchón</p>
                                                    <div className='filter-subgroups d-flex-column gap-20'>
                                                        {valoresFiltro.map((grupo, idx) => {
                                                            const nombreGrupo = Object.keys(grupo)[0];
                                                            const modelos = grupo[nombreGrupo];

                                                            return(
                                                                <div key={idx} className='filter-subgroup d-flex-column gap-10'>
                                                                    <p className='sub-title uppercase'>{nombreGrupo}</p>

                                                                    <ul className='products-page-filter-list'>
                                                                        {modelos.map((modelo, mIdx) => (
                                                                            <li key={mIdx}>
                                                                                <button type='button' className={isFiltroActivo("modelos", modelo) ? "active" : ""} onClick={() => toggleFiltro("modelos", modelo)}>
                                                                                    <p>{modelo}</p>
                                                                                </button>
                                                                            </li>
                                                                        ))}
                                                                    </ul>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            );
                                        }

                                        return(
                                            <div className='products-page-filter' key={index}>
                                                <p className='filter-title uppercase'>{nombreFiltro}</p>
                                                <ul className='products-page-filter-list'>
                                                    {valoresFiltro.map((valor, i) => (
                                                        <li key={i}>
                                                            <button type='button' className={isFiltroActivo(nombreFiltro, valor) ? "active" : ""} onClick={() => toggleFiltro(nombreFiltro, valor)}>
                                                                <p>{valor}</p>
                                                            </button>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        );
                                    })}
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
                            setOrden={handleOrdenChange}
                            orden={orden}
                            setIsFiltersOpen={setIsFiltersOpen} 
                            isFiltersOpen={isFiltersOpen}
                            productosCount={productosOrdenados.length}
                            totalProductos={productos.length}
                            startIndex={startIndex}
                            endIndex={endIndex}
                        />

                        <div className='products-page-products-container'>
                            {loading ? (
                                <div className="loading-products d-flex-center-center d-flex-column gap-10">
                                    <div className="spinner"></div>
                                    <p>Cargando productos...</p>
                                </div>
                            ) : (
                                <>
                                    <ul className="products-page-products">
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
                                                        <button key={index} className={`pagination-page ${currentPage === page ? 'active' : ''}`} onClick={() => handlePageChange(page)}>{page}</button>
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

export default Colchones;
