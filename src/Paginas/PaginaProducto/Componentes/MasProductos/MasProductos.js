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

                // ✅ Tamaño OPCIONAL (colchones, camas, dormitorios, cabeceras lo usan; sofas y complementos no)
                const tamañoActual = (detallesProducto.tamaño || productoActual.tamaño || '')
                    .toLowerCase()
                    .replace(/\s+/g, '-');

                // ✅ Subcategoría (sofas, complementos, camas-funcionales la usan)
                const subcategoriaActual = (
                    productoActual.subcategoría ||
                    productoActual.subcategoria ||
                    detallesProducto.subcategoría ||
                    detallesProducto.subcategoria ||
                    ''
                ).trim().toLowerCase().replace(/\s+/g, '-');

                const categoriaNormalizada = categoriaActual
                    .trim()
                    .toLowerCase()
                    .replace(/\s+/g, '-');

                console.log('Categoría:', categoriaNormalizada);
                console.log('Subcategoría:', subcategoriaActual || '(sin subcategoría)');
                console.log('Tamaño:', tamañoActual || '(sin tamaño)');

                const basePath = window.location.origin;
                const manifestUrl = `${basePath}/assets/json/manifest.json`;

                const manifestRes = await fetch(manifestUrl, { signal });
                if (!manifestRes.ok) throw new Error(`Error al cargar manifest: ${manifestRes.status}`);

                const manifest = await manifestRes.json();
                console.log('Manifest cargado, archivos:', manifest.files?.length || 0);

                if (!manifest.files || !Array.isArray(manifest.files)) {
                    setProducts([]);
                    setLoading(false);
                    return;
                }

                // ✅ PASO 1: Filtro base por CATEGORÍA (nunca falla)
                const archivosDeCategoria = manifest.files.filter(filePath => {
                    const pathLower = filePath.toLowerCase();
                    return pathLower.includes(`/categorias/${categoriaNormalizada}/`) &&
                        pathLower.endsWith('.json');
                });

                console.log(`Archivos de "${categoriaNormalizada}": ${archivosDeCategoria.length}`);

                if (archivosDeCategoria.length === 0) {
                    setProducts([]);
                    setLoading(false);
                    return;
                }

                // ✅ PASO 2: Intentar acotar por SUBCATEGORÍA (sofas, complementos, camas-funcionales)
                let archivosEncontrados = [];
                if (subcategoriaActual) {
                    archivosEncontrados = archivosDeCategoria.filter(f =>
                        f.toLowerCase().includes(`/${subcategoriaActual}/`)
                    );
                    console.log(`Filtrados por subcategoría "${subcategoriaActual}": ${archivosEncontrados.length}`);
                }

                // ✅ PASO 3: Si no hay por subcategoría, acotar por TAMAÑO (colchones, cabeceras, dormitorios)
                if (archivosEncontrados.length === 0 && tamañoActual) {
                    archivosEncontrados = archivosDeCategoria.filter(f =>
                        f.toLowerCase().includes(`/${tamañoActual}/`)
                    );
                    console.log(`Filtrados por tamaño "${tamañoActual}": ${archivosEncontrados.length}`);
                }

                // ✅ PASO 4: Fallback final: toda la categoría
                if (archivosEncontrados.length === 0) {
                    archivosEncontrados = archivosDeCategoria;
                    console.log(`Fallback: todos los archivos de la categoría (${archivosEncontrados.length})`);
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
                            if (!res.ok) return { productos: [] };
                            return await res.json();
                        } catch {
                            return { productos: [] };
                        }
                    })
                );

                let allProducts = [];
                allData.forEach((data) => {
                    if (Array.isArray(data?.productos)) {
                        allProducts = [...allProducts, ...data.productos];
                    }
                });

                console.log(`Total productos encontrados: ${allProducts.length}`);

                const skuActual = productoActual?.sku;
                let filteredProducts = allProducts.filter(p =>
                    !(skuActual && String(p.sku) === String(skuActual))
                );

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

                // ✅ Los productos de tus JSON ya tienen "ruta", así que se respeta.
                // Solo si faltara, se construye con lo disponible.
                const productsWithRoutes = selectedProducts.map(producto => {
                    if (producto.ruta) return producto;

                    const detalles = producto["detalles-del-producto"]?.[0] || {};
                    const cat = (producto.categoría || producto.categoria || detalles.categoría || categoriaNormalizada)
                        .toLowerCase().replace(/\s+/g, '-');
                    const subcat = (producto.subcategoría || producto.subcategoria ||
                        detalles.subcategoría || detalles.subcategoria || '')
                        .toLowerCase().replace(/\s+/g, '-');
                    const tam = (detalles.tamaño || producto.tamaño || '')
                        .toLowerCase().replace(/\s+/g, '-');
                    const marca = (producto.marca || detalles.marca || '')
                        .toLowerCase().replace(/\s+/g, '-');
                    const linea = (detalles.línea || detalles.linea || '')
                        .toLowerCase().replace(/\s+/g, '-');
                    const sku = producto.sku || producto.id || '';

                    const segmentos = ['/productos', cat];
                    if (subcat) segmentos.push(subcat);
                    if (tam) segmentos.push(tam);
                    if (marca) segmentos.push(marca);
                    if (linea) segmentos.push(linea);
                    if (sku) segmentos.push(String(sku));

                    return { ...producto, ruta: segmentos.join('/') + '/' };
                });

                setProducts(productsWithRoutes);
            } catch (err) {
                if (err.name !== 'AbortError') {
                    setError(`Error cargando productos: ${err.message}`);
                }
            } finally {
                if (!signal.aborted) setLoading(false);
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
                    <h2 className='text font-bold uppercase color-color-1'>Productos relacionados</h2>
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
