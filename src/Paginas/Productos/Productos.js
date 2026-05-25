import { useEffect, useState, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { useLocation, useNavigate } from 'react-router-dom';

import './Productos.css';

import Categorias from './Componentes/Categorias/Categorias';
import FiltrosTop from './Componentes/FiltrosTop/FiltrosTop';
import CategoriasLeft from './Componentes/CategoriasLeft/CategoriasLeft';
import { Producto } from '../../Componentes/Plantillas/Producto/Producto';

const normalizarTexto = (texto) => {
    if (!texto || typeof texto !== 'string') return '';
    return texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "-");
};

const mapaEquivalenciasMarcas = {
    "el-cisne": ["el-cisne", "kamas---el-cisne"],
    "kamas---el-cisne": ["el-cisne", "kamas---el-cisne"],
    "kamas": ["kamas"],
    "paraiso": ["paraiso", "kamas---paraiso"],
    "kamas---paraiso": ["paraiso", "kamas---paraiso"],
    "komfort": ["komfort", "kamas---komfort", "komfort---kamas"],
    "kamas---komfort": ["komfort", "kamas---komfort", "komfort---kamas"],
    "komfort---kamas": ["komfort", "kamas---komfort", "komfort---kamas"]
};

// Función para verificar si dos marcas son equivalentes
const sonMarcasEquivalentes = (marca1, marca2) => {
    const normalizada1 = normalizarTexto(marca1);
    const normalizada2 = normalizarTexto(marca2);
    
    if (normalizada1 === normalizada2) return true;
    
    const equivalencias = mapaEquivalenciasMarcas[normalizada1];
    return equivalencias ? equivalencias.includes(normalizada2) : false;
};

const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};

function Productos() {
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [orden, setOrden] = useState("aleatorio");
    const [currentPage, setCurrentPage] = useState(1);
    const [isHotSaleActive, setIsHotSaleActive] = useState(false);
    const [hotSaleSKUs, setHotSaleSKUs] = useState([]);
    const itemsPerPage = 20;
    
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = useMemo(() => new URLSearchParams(location.search), [location.search]);

    // Cargar productos
    useEffect(() => {
        const cargarProductos = async () => {
            try {
                setLoading(true);
                const manifestResponse = await fetch('/assets/json/manifest.json');
                const manifestData = await manifestResponse.json();
                const archivos = manifestData.files || [];

                const productosPromesas = archivos.map(async (url) => {
                    try {
                        const response = await fetch(url);
                        const data = await response.json();
                        return data.productos || [];
                    } catch (error) {
                        console.error(`Error cargando ${url}:`, error);
                        return [];
                    }
                });

                const productosPorArchivo = await Promise.all(productosPromesas);
                const todosProductos = productosPorArchivo.flat();

                setProductos(todosProductos);
                setCurrentPage(1);
                setLoading(false);
            } catch (error) {
                console.error("Error cargando productos:", error);
                setLoading(false);
            }
        };

        cargarProductos();
    }, []);

    // Cargar SKUs de Hot Sale (más vendidos)
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

    // Función para verificar si un producto cumple con el filtro de marca
    const cumpleFiltroMarca = (producto) => {
        const marcaFiltro = queryParams.get('marca');
        if (!marcaFiltro) return true;
        
        const marcaProducto = producto.marca || producto["marca"];
        if (!marcaProducto) return false;
        
        const marcaFiltroNormalizada = normalizarTexto(marcaFiltro);
        const marcaProductoNormalizada = normalizarTexto(marcaProducto);
        
        return sonMarcasEquivalentes(marcaFiltroNormalizada, marcaProductoNormalizada);
    };

    // Aplicar todos los filtros (marca y hot sale)
    const productosFiltrados = useMemo(() => {
        if (productos.length === 0) return [];
        
        let productosFiltradosTemp = [...productos];
        
        // Filtrar por marca si existe en URL
        const marcaFiltro = queryParams.get('marca');
        if (marcaFiltro) {
            productosFiltradosTemp = productosFiltradosTemp.filter(producto => cumpleFiltroMarca(producto));
        }
        
        // Filtrar por Hot Sale si está activo
        if (isHotSaleActive && hotSaleSKUs.length > 0) {
            productosFiltradosTemp = productosFiltradosTemp.filter(producto => hotSaleSKUs.includes(producto.sku));
        }
        
        return productosFiltradosTemp;
    }, [productos, queryParams, isHotSaleActive, hotSaleSKUs]);

    // Aplicar ordenamiento a los productos filtrados
    const productosOrdenados = useMemo(() => {
        if (orden === "aleatorio") {
            return shuffleArray(productosFiltrados);
        } else if (orden === "menor-mayor") {
            return [...productosFiltrados].sort((a, b) => (a.precioVenta || 0) - (b.precioVenta || 0));
        } else if (orden === "mayor-menor") {
            return [...productosFiltrados].sort((a, b) => (b.precioVenta || 0) - (a.precioVenta || 0));
        }
        return productosFiltrados;
    }, [productosFiltrados, orden]);

    const totalItems = productosOrdenados.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
    const productosPagina = productosOrdenados.slice(startIndex, endIndex);

    useEffect(() => {
        setCurrentPage(1);
    }, [queryParams, orden, isHotSaleActive]);

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

    const handleOrdenChange = (nuevoOrden) => {
        setOrden(nuevoOrden);
        setCurrentPage(1);
    };
    
    const handleHotSaleChange = (active) => {
        setIsHotSaleActive(active);
        setCurrentPage(1);
    };
    
    const limpiarFiltros = () => {
        navigate(location.pathname, { replace: true });
        setIsHotSaleActive(false);
        localStorage.setItem('hotSaleActive', 'false');
        setCurrentPage(1);
    };

    const hayFiltrosActivos = queryParams.get('marca') !== null || isHotSaleActive;

    return(
        <>
            <Helmet>
                <title>Productos | Homesleep</title>
                <meta name="description" content="Encuentra productos de las marcas, PARAISO, El Cisne, Kamas, Komfort y muchas más." />
                <meta property="og:title" content="Dormitorios El Cisne, Paraiso, Kamas y Komfort | Homesleep"/>
                <meta property="og:description" content="Homesleep encontrarás las mejores marcas para tu descanso, kamas, paraiso y el cisne."/>
                <meta property="og:type" content="website"/>
                <meta property="og:url" content="https://www.homesleep.pe/productos/"/>
                <meta property="og:image" content="/assets/imagenes/paginas/pagina-principal/homepage-video.jpg"/>
                <meta property="og:site_name" content="Homesleep"/>
                <link rel="preload" as="image" href="/assets/imagenes/paginas/pagina-principal/slider/slider-1.webp" />
                <link rel="preload" as="image" href="/assets/imagenes/paginas/pagina-principal/slider/thumb/slider-1.webp" />
            </Helmet>

            <main className='products-page-main d-flex-column gap-20'>
                <Categorias/>

                <div className='products-page-blocks'>
                    <div className='products-page-left'>
                        <CategoriasLeft onHotSaleChange={handleHotSaleChange} />
                    </div>
                    
                    <div className='products-page-right'>
                        <FiltrosTop 
                            setOrden={handleOrdenChange} 
                            orden={orden} 
                            productosCount={productosOrdenados.length}
                            totalProductos={productos.length} 
                            currentPage={currentPage}
                            itemsPerPage={itemsPerPage} 
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
                                                <div className="w-100 d-flex-column d-flex-center-center gap-10">
                                                    <img src="/assets/imagenes/paginas/not-found.svg" alt="" width={320} />
                                                    <p className='text'>No se encontraron productos con los filtros seleccionados.</p>
                                                </div>
                                            </div>
                                        ) : (
                                            productosPagina.map(producto => (
                                                <Producto key={producto.sku} producto={producto}/>
                                            ))
                                        )}
                                    </ul>
                                    
                                    {productosPagina.length > 0 && totalPages > 1 && (
                                        <div className="pagination-controls d-grid-column-2-3 margin-top-20">
                                            <button className="pagination-arrow" onClick={handlePreviousPage} disabled={currentPage === 1}>
                                                <span className="material-icons">chevron_left</span>
                                            </button>

                                            <div className="d-flex-center-center gap-5">
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
        </>
    );
}

export default Productos;
