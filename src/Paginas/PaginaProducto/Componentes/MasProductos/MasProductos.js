import { useState, useEffect } from 'react';

import './MasProductos.css';

import { Producto } from '../../../../Componentes/Plantillas/Producto/Producto';

export default function MasProductos({ categoriaActual, productoActual }) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    useEffect(() => {
        const controller = new AbortController();
        const { signal } = controller;

        async function fetchRelatedProducts() {
            try {
                setLoading(true);
                setError(null);

                console.log('=== MASPRODUCTOS INICIADO ===');
                console.log('categoriaActual:', categoriaActual);
                console.log('productoActual:', productoActual?.nombre);

                if (!categoriaActual || !productoActual || typeof productoActual !== 'object') {
                    console.warn('Faltan datos para cargar productos relacionados');
                    setProducts([]);
                    setLoading(false);
                    return;
                }

                const detallesProducto = productoActual["detalles-del-producto"]?.[0] || {};
                console.log('Detalles del producto:', detallesProducto);

                const tamañoActual = detallesProducto.tamaño?.toLowerCase().replace(/\s+/g, '-') || '';
                console.log('Tamaño actual:', tamañoActual);

                if (!tamañoActual) {
                    console.warn('No se pudo determinar el tamaño del producto');
                    setProducts([]);
                    setLoading(false);
                    return;
                }

                const categoriaNormalizada = categoriaActual
                    .trim()
                    .toLowerCase()
                    .replace(/\s+/g, '-');

                console.log('Categoría normalizada:', categoriaNormalizada);

                const basePath = window.location.origin;
                const manifestUrl = `${basePath}/assets/json/manifest.json`;

                console.log('Cargando manifest desde:', manifestUrl);
                const manifestRes = await fetch(manifestUrl, { signal });

                if (!manifestRes.ok) {
                    throw new Error(`Error al cargar manifest: ${manifestRes.status}`);
                }

                const manifest = await manifestRes.json();
                console.log('Manifest cargado, archivos totales:', manifest.files?.length || 0);

                let archivosEncontrados = [];

                if (manifest.files && Array.isArray(manifest.files)) {
                    console.log('Buscando archivos que contengan la carpeta:', `/categorias/${categoriaNormalizada}/${tamañoActual}/`);
                    
                    archivosEncontrados = manifest.files.filter(filePath => {
                        const pathLower = filePath.toLowerCase();
                        const contieneCarpeta = pathLower.includes(`/categorias/${categoriaNormalizada}/${tamañoActual}/`);
                        const esJson = pathLower.endsWith('.json');
                        return contieneCarpeta && esJson;
                    });
                }

                console.log(`Archivos encontrados que contienen la carpeta: ${archivosEncontrados.length}`);

                if (archivosEncontrados.length > 0) {
                    console.log('Ejemplos de archivos encontrados:');
                    archivosEncontrados.slice(0, 10).forEach(f => console.log('  -', f));
                } else {
                    console.warn(`No se encontraron archivos que contengan la carpeta.`);
                    
                    console.log('Intentando búsqueda más flexible...');
                    archivosEncontrados = manifest.files.filter(filePath => {
                        const pathLower = filePath.toLowerCase();
                        return pathLower.includes(`/${tamañoActual}/`) &&
                            pathLower.includes(`/categorias/${categoriaNormalizada}/`) &&
                            pathLower.endsWith('.json');
                    });
                    console.log(`Archivos encontrados con búsqueda flexible: ${archivosEncontrados.length}`);
                }

                if (archivosEncontrados.length === 0) {
                    console.error('No se encontraron archivos para mostrar productos relacionados');
                    setProducts([]);
                    setLoading(false);
                    return;
                }

                let archivosACargar = [...archivosEncontrados];
                if (archivosACargar.length > 30) {
                    for (let i = archivosACargar.length - 1; i > 0; i--) {
                        const j = Math.floor(Math.random() * (i + 1));
                        [archivosACargar[i], archivosACargar[j]] = [archivosACargar[j], archivosACargar[i]];
                    }
                    archivosACargar = archivosACargar.slice(0, 30);
                }

                const allData = await Promise.all(
                    archivosACargar.map(async (filePath) => {
                        const fullUrl = filePath.startsWith('http')
                            ? filePath
                            : `${basePath}${filePath.startsWith('/') ? '' : '/'}${filePath}`;

                        try {
                            const res = await fetch(fullUrl, { signal });

                            if (!res.ok) {
                                return { productos: [] };
                            }

                            const data = await res.json();
                            return data;
                        } catch (error) {
                            return { productos: [] };
                        }
                    })
                );

                let allProducts = [];
                let totalProductos = 0;
                allData.forEach((data, index) => {
                    if (Array.isArray(data?.productos)) {
                        const count = data.productos.length;
                        totalProductos += count;
                        allProducts = [...allProducts, ...data.productos];
                    }
                });

                console.log(`Total de productos encontrados: ${totalProductos}`);

                const skuActual = productoActual?.sku;
                let filteredProducts = allProducts;
                if (skuActual) {
                    filteredProducts = allProducts.filter(p => String(p.sku) !== String(skuActual));
                }

                if (filteredProducts.length === 0) {
                    setProducts([]);
                    setLoading(false);
                    return;
                }

                for (let i = filteredProducts.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [filteredProducts[i], filteredProducts[j]] = [filteredProducts[j], filteredProducts[i]];
                }

                const selectedProducts = filteredProducts.slice(0, 15);

                const productsWithRoutes = selectedProducts.map(producto => {
                    if (producto.ruta) return producto;

                    const detalles = producto["detalles-del-producto"]?.[0] || {};
                    let tamaño = detalles.tamaño?.toLowerCase() || '';
                    tamaño = tamaño.replace(/\s+/g, '-');
                    const marca = detalles.marca?.toLowerCase() || '';
                    let linea = detalles.línea?.toLowerCase() || '';
                    linea = linea.replace(/\s+/g, '-');
                    const sku = producto.sku || '';

                    return {
                        ...producto,
                        ruta: `/productos/camas-box-tarimas/${tamaño}/${marca}/${linea}/${sku}/`
                    };
                });

                setProducts(productsWithRoutes);
            } catch (err) {
                if (err.name !== 'AbortError') {
                    setError(`Error cargando productos: ${err.message}`);
                }
            } finally {
                if (!signal.aborted) {
                    setLoading(false);
                }
            }
        }

        fetchRelatedProducts();

        return () => controller.abort();
    }, [categoriaActual, productoActual, refreshTrigger]);

    const handleRefresh = () => setRefreshTrigger(prev => prev + 1);
    const truncate = (str, maxLength) => str?.length <= maxLength ? str : str?.slice(0, maxLength) + '...';

    if (loading) {
        return (
            <div className='d-flex'>
                <p className='text'>Cargando más productos...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className='d-flex-column align-items-center gap-10'>
                <p className='text-error'>{error}</p>
                <button onClick={handleRefresh} className='button-link button-link-2'>
                    <p className='button-link-text'>Reintentar</p>
                    <span className="material-icons">cached</span>
                </button>
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <div className='d-flex-column align-items-center gap-10'>
                <p className='text'>No se encontraron productos relacionados</p>
                <button onClick={handleRefresh} className='button-link button-link-2'>
                    <p className='button-link-text'>Reintentar</p>
                    <span className="material-icons">cached</span>
                </button>
            </div>
        );
    }

    return (
        <div className='block-container'>
            <div className='block-content'>
                <div className='d-flex-column gap-20'>
                    <h2 className='section-title'>Productos relacionados</h2>
                    <div className="product-page-more-products-container">
                        <nav className="product-page-more-products-content">
                            <ul className='d-grid-5-3-2fr gap-10'>
                                {products.map((producto) => (
                                    <Producto key={producto.sku || producto.id} producto={producto} truncate={truncate} />
                                ))}
                            </ul>
                        </nav>
                    </div>

                    <button onClick={handleRefresh} className='button-link button-link-2 margin-left'>
                        <p className='button-link-text'>Ver más</p>
                        <span className="material-icons">cached</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
