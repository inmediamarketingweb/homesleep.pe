import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import './Categorias.css';

function Categorias(){
    const [categorias, setCategorias] = useState([]);

    useEffect(() => {
        fetch('/assets/json/categorias/nuevas-categorias.json')
            .then((response) => response.json())
            .then((data) => {
                setCategorias(data.categorias);
            })
            .catch((error) => {
                console.error('Error cargando categorías:', error);
            });
    }, []);

    return(
        <section className='product-page-categories-container'>
            <nav className='product-page-categories'>
                <ul>
                    {categorias.map((categoria) => (
                        <li key={categoria.id}>
                            <Link className="product-page-categories-link" to={categoria.ruta} title={categoria["meta-titulo"]}>
                                <img src={categoria["categoria-miniatura"].src}
                                    alt={
                                        categoria["categoria-miniatura"].alt || categoria["meta-titulo"]
                                    }
                                />
                                <p>{categoria.categoria}</p>
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </section>
    )
}

export default Categorias;
