import { useEffect, useState } from 'react';
import { Producto } from '../../../../Componentes/Plantillas/Producto/Producto';

import './StockUnico.css';

const truncate = (str, maxLength) => {
    if (!str) return '';
    return str.length > maxLength ? str.substring(0, maxLength) + '...' : str;
};

function StockUnico() {
    const [productos, setProductos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [favorites, setFavorites] = useState({});

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
        const cargarProductos = async () => {
            setCargando(true);
            
            try {
                const responseSKUs = await fetch('/assets/json/stock-unico.json');
                const skus = await responseSKUs.json();
                const productosCargados = await cargarProductosPorSKUs(skus);
                setProductos(productosCargados);
                
            } catch (error) {
                console.error("Error cargando productos:", error);
                setProductos([]);
            } finally {
                setCargando(false);
            }
        };
        
        cargarProductos();
    }, []);
    
    if (cargando) {
        return <div>Cargando...</div>;
    }

    return (
        <div className='block-container stock-unico-block-container'>
            <section className='block-content d-flex-column gap-10'>
                <div className='block-title-container margin-bottom-0'>
                    <h2 className='block-title margin-auto color-white'>Últimas unidades</h2>
                </div>

                <div className='featured-products-container'>
                    <nav className='featured-products'>
                        <ul>
                            {productos.map((producto, index) => (
                                <Producto 
                                    key={producto.sku || index}
                                    producto={producto}
                                    truncate={truncate}
                                    onToggleFavorite={handleToggleFavorite}
                                    isFavorite={!!favorites[producto.sku]}
                                />
                            ))}
                        </ul>
                    </nav>
                </div>
            </section>
        </div>
    );
}

export default StockUnico;
