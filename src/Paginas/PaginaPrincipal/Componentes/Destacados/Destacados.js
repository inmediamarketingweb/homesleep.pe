import { useEffect, useState } from 'react';
import { Producto } from '../../../../Componentes/Plantillas/Producto/Producto';

import './Destacados.css';

const truncate = (str, maxLength) => {
    if (!str) return '';
    return str.length > maxLength ? str.substring(0, maxLength) + '...' : str;
};

function Destacados(){
    const [productos, setProductos] = useState([]);
    const [skusOfertas, setSkusOfertas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const cargarOfertas = async () => {
            try {
                const response = await fetch('/assets/json/ofertas.json');
                const data = await response.json();
                setSkusOfertas(data);
            } catch (error) {
                console.error("Error cargando ofertas:", error);
                setSkusOfertas([]);
            }
        };

        cargarOfertas();
    }, []);

    useEffect(() => {
        const cargarProductosDestacados = async () => {
            try {
                setLoading(true);

                const responseSkus = await fetch('/assets/json/destacados.json');
                const skusDestacados = await responseSkus.json();
                const responseManifest = await fetch('/assets/json/manifest.json');
                const manifest = await responseManifest.json();

                const listaProductosPromises = manifest.files.map(fileUrl => 
                    fetch(fileUrl)
                        .then(res => res.json())
                        .then(json => json.productos || [])
                        .catch(() => [])
                );
                
                const listaProductos = await Promise.all(listaProductosPromises);
                const todosLosProductos = listaProductos.flat();

                const productosDestacados = todosLosProductos.filter(producto => 
                    skusDestacados.includes(producto.sku)
                );
                
                setProductos(productosDestacados);
                setError(null);
            } catch (err) {
                console.error('Error cargando productos destacados:', err);
                setError('Error al cargar productos destacados');
            } finally {
                setLoading(false);
            }
        };

        cargarProductosDestacados();
    }, []);

    if (loading){
        return(
            <section className="block-container block-container-destacados">
                <div className="block-content block-content-destacados d-flex-column">
                    <div className='block-title-container'>
                        <h4 className="block-title color-color-1 d-flex tex-left">Destacados</h4>
                    </div>
                    <div className="loading">Cargando productos destacados...</div>
                </div>
            </section>
        );
    }

    if(error){
        return(
            <section className="block-container block-container-destacados">
                <div className="block-content block-content-destacados d-flex-column">
                    <div className='block-title-container'>
                        <h4 className="block-title color-color-1 d-flex">Destacados</h4>
                    </div>
                    <div className="error">{error}</div>
                </div>
            </section>
        );
    }

    return(
        <section className="block-container block-container-destacados">
            <div className="block-content block-content-destacados d-flex-column">
                <div className='block-title-container'>
                    <h4 className="block-title color-white d-flex text-center uppercase">Destacados</h4>
                </div>

                {productos.length > 0 ? (
                    <ul className='destacados-productos'>
                        {productos.map((producto, index) => (
                            <Producto key={`destacado-${index}-${producto.sku}`}producto={producto} truncate={truncate} skusOfertas={skusOfertas}/>
                        ))}
                    </ul>
                ) : (
                    <div className="no-products">
                        No se encontraron productos destacados
                    </div>
                )}
            </div>
        </section>
    );
}

export default Destacados;
