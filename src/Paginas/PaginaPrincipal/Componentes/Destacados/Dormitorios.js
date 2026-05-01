import { useEffect, useState } from 'react';
import { Producto } from '../../../../Componentes/Plantillas/Producto/Producto';
import Spinner from '../../../../Componentes/Spinner/Spinner';
import './Destacados.css';

const truncate = (str, maxLength) => {
    if (!str) return '';
    return str.length > maxLength ? str.substring(0, maxLength) + '...' : str;
};

function Destacados() {
    const [productosOriginales, setProductosOriginales] = useState([]);
    const [productosFiltrados, setProductosFiltrados] = useState([]);
    const [filtroActivo, setFiltroActivo] = useState('todos');
    const [cargando, setCargando] = useState(true);
    const [favorites, setFavorites] = useState({});
    
    const [skusPorMarca, setSkusPorMarca] = useState({
        'El Cisne': [],
        'Kamas': [],
        'Paraiso': [],
        'Komfort': []
    });

    const getRandomItems = (arr, count) => {
        if (!arr || arr.length === 0) return [];
        const shuffled = [...arr];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled.slice(0, Math.min(count, shuffled.length));
    };

    const cargarProductosPorSKUs = async (skus) => {
        if (!skus || skus.length === 0) return [];
        
        try {
            const responseManifest = await fetch('/assets/json/manifest.json');
            const manifest = await responseManifest.json();
            
            const todosLosProductos = await Promise.all(
                manifest.files.map(async (fileUrl) => {
                    try {
                        const response = await fetch(fileUrl);
                        const data = await response.json();
                        return data.productos || (Array.isArray(data) ? data : []);
                    } catch (error) {
                        return [];
                    }
                })
            );
            
            const todosLosProductosFlat = todosLosProductos.flat();
            
            const productosEncontrados = skus.map(sku => 
                todosLosProductosFlat.find(p => p.sku === sku)
            ).filter(Boolean);
            
            return productosEncontrados;
        } catch (error) {
            console.error("Error cargando productos:", error);
            return [];
        }
    };

    useEffect(() => {
        const favStorage = JSON.parse(localStorage.getItem("favoritos")) || {};
        setFavorites(favStorage);
    }, []);

    const handleToggleFavorite = (producto) => {
        setFavorites(prev => {
            const newFavorites = {
                ...prev,
                [producto.sku]: !prev[producto.sku]
            };
            localStorage.setItem("favoritos", JSON.stringify(newFavorites));
            return newFavorites;
        });
    };

    useEffect(() => {
        const cargarProductosIniciales = async () => {
            setCargando(true);
            
            try {
                const responseSKUs = await fetch('/assets/json/paginas/pagina-principal/dormitorios-inicio.json');
                const skusData = await responseSKUs.json();
                
                const elCisneSKUs = skusData.presentacion.find(item => item["el-cisne"])["el-cisne"];
                const kamasSKUs = skusData.presentacion.find(item => item["kamas"])["kamas"];
                const paraisoSKUs = skusData.presentacion.find(item => item["paraiso"])["paraiso"];
                const komfortSKUs = skusData.presentacion.find(item => item["komfort"])["komfort"];
                
                setSkusPorMarca({
                    'El Cisne': elCisneSKUs,
                    'Kamas': kamasSKUs,
                    'Paraiso': paraisoSKUs,
                    'Komfort': komfortSKUs
                });
                
                const skusSeleccionados = [
                    ...getRandomItems(elCisneSKUs, 2),
                    ...getRandomItems(kamasSKUs, 2),
                    ...getRandomItems(paraisoSKUs, 1),
                    ...getRandomItems(komfortSKUs, 1)
                ];
                
                const productosCargados = await cargarProductosPorSKUs(skusSeleccionados);
                
                setProductosOriginales(productosCargados);
                setProductosFiltrados(productosCargados);
                
            } catch (error) {
                console.error("Error cargando productos destacados:", error);
                setProductosOriginales([]);
                setProductosFiltrados([]);
            } finally {
                setCargando(false);
            }
        };
        
        cargarProductosIniciales();
    }, []);
    
    useEffect(() => {
        const cargarProductosPorFiltro = async () => {
            if (filtroActivo === 'todos') {
                setProductosFiltrados(productosOriginales);
            } else {
                setCargando(true);
                const skusMarca = skusPorMarca[filtroActivo];
                
                if (skusMarca && skusMarca.length > 0) {
                    const skusSeleccionados = getRandomItems(skusMarca, 6);
                    const productosCargados = await cargarProductosPorSKUs(skusSeleccionados);
                    setProductosFiltrados(productosCargados);
                } else {
                    setProductosFiltrados([]);
                }
                setCargando(false);
            }
        };
        
        cargarProductosPorFiltro();
    }, [filtroActivo, skusPorMarca]);
    
    const handleFiltroClick = (marca) => {
        setFiltroActivo(marca === 'todos' ? 'todos' : marca);
    };
    
    return (
        <div className='block-container featured-products-block-container'>
            <section className='block-content d-flex-column gap-10'>
                <p className='banner-title'>Dormitorios King - 3 plazas</p>
                
                <div className='d-flex-center-between gap-10'>
                    <ul className='d-flex gap-5'>
                        <li>
                            <button type='button' title='El Cisne' className={`brand-button el-cisne ${filtroActivo === 'El Cisne' ? 'active' : ''}`} onClick={() => handleFiltroClick('El Cisne')}>
                                <p>El Cisne</p>
                            </button>
                        </li>
                        <li>
                            <button type='button' title='Paraiso' className={`brand-button paraiso ${filtroActivo === 'Paraiso' ? 'active' : ''}`} onClick={() => handleFiltroClick('Paraiso')}>
                                <p>Paraiso</p>
                            </button>
                        </li>
                        <li>
                            <button type='button' title='Kamas' className={`brand-button kamas ${filtroActivo === 'Kamas' ? 'active' : ''}`} onClick={() => handleFiltroClick('Kamas')}>
                                <p>Kamas</p>
                            </button>
                        </li>
                        <li>
                            <button type='button' title='Komfort' className={`brand-button komfort ${filtroActivo === 'Komfort' ? 'active' : ''}`} onClick={() => handleFiltroClick('Komfort')}>
                                <p>Komfort</p>
                            </button>
                        </li>
                    </ul>
                    
                    <a href='https://homesleep.pe/productos/dormitorios/' className='button-link button-link-1'>
                        <p className='button-link-text'>Ver más modelos</p>
                        <span className="material-symbols-outlined">arrow_outward</span>
                    </a>
                </div>
                
                <div className='featured-products-container'>
                    <nav className='featured-products'>
                        {cargando ? (
                            <Spinner/>
                        ) : productosFiltrados.length === 0 ? (
                            <div className="no-products">No hay productos disponibles para esta marca</div>
                        ) : (
                            <ul>
                                {productosFiltrados.map((producto, index) => (
                                    <Producto 
                                        key={producto.sku || index}
                                        producto={producto}
                                        truncate={truncate}
                                        onToggleFavorite={handleToggleFavorite}
                                        isFavorite={!!favorites[producto.sku]}
                                    />
                                ))}
                            </ul>
                        )}
                    </nav>
                </div>
            </section>
        </div>
    );
}

export default Destacados;
