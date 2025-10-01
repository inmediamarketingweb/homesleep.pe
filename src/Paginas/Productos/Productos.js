import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';

import './Productos.css';

import Categorias from './Componentes/Categorias/Categorias';
import FiltrosTop from './Componentes/FiltrosTop/FiltrosTop';
import { Producto } from '../../Componentes/Plantillas/Producto/Producto';

function Productos(){
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const cargarProductos = async () => {
            try {
                setLoading(true);
                const manifestResponse = await fetch('/assets/json/manifest.json');
                const manifestData = await manifestResponse.json();
                const archivos = manifestData.files || [];

                const productosPromesas = archivos.map(async (url) => {
                    const response = await fetch(url);
                    const data = await response.json();
                    return data.productos;
                });

                const productosPorArchivo = await Promise.all(productosPromesas);
                const todosProductos = productosPorArchivo.flat();

                setProductos(todosProductos);
                setLoading(false);
            } catch (error) {
                console.error("Error cargando productos:", error);
                setLoading(false);
            }
        };

        cargarProductos();
    }, []);

    return(
        <>
            <Helmet>
                <title>Productos | Homesleep</title>
            </Helmet>

            <main className='products-page-main d-flex-column gap-20'>
                <Categorias/>

                <div className='products-page-blocks'>
                    <div className='products-page-left'>
                        <div className='products-page-filters-container'>
                            <div className='products-page-filters d-flex-column gap-20'>
                                <div className='d-flex-column padding-bottom-20 border-bottom-2-solid-component'>
                                    <p className='block-title color-color-1 uppercase w-100 d-flex'>homesleep</p>
                                    <p className='uppercase w-100 d-flex'>Las mejores marcas en productos para el descanso</p>
                                </div>

                                <div className='products-page-categories-container'>
                                    <ul className='products-page-categories-list'>
                                        <li>
                                            <a href='' title='' className=''>
                                                <p>Colchones</p>
                                            </a>
                                        </li>
                                        <li>
                                            <a href='' title='' className=''>
                                                <p>Camas box tarimas</p>
                                            </a>
                                        </li>
                                        <li>
                                            <a href='' title='' className=''>
                                                <p>Dormitorios</p>
                                            </a>
                                        </li>
                                        <li>
                                            <a href='' title='' className=''>
                                                <p>Camas funcionales</p>
                                            </a>
                                        </li>
                                        <li>
                                            <a href='' title='' className=''>
                                                <p>Cabeceras</p>
                                            </a>
                                        </li>
                                        <li>
                                            <a href='' title='' className=''>
                                                <p>Sofás</p>
                                            </a>
                                        </li>
                                        <li>
                                            <a href='' title='' className=''>
                                                <p>Complementos</p>
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='products-page-right'>
                        <FiltrosTop/>

                        <div className='products-page-products-container'>
                            {loading ? (
                                <div className="loading-products d-flex-center-center d-flex-column gap-10">
                                    <div className="spinner"></div>
                                    <p>Cargando productos...</p>
                                </div>
                            ) : (
                                <ul className="products-page-products">
                                    {productos.map(producto => (
                                        <Producto key={producto.sku} producto={producto}/>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}

export default Productos;
