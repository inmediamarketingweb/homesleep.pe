import { Link } from 'react-router-dom';

import './Categorias.css';

function Categorias(){
    return(
        <section className='product-page-categories-container'>
            <nav className='product-page-categories'>
                <ul>
                    <li>
                        <Link to='/productos/colchones/' title=''>
                            <img src='https://www.kamas.pe/assets/imagenes/paginas/pagina-principal/categorias/colchones.webp' alt=''/>
                        </Link>
                    </li>
                    <li>
                        <Link to='/productos/camas-box-tarimas/' title=''>
                            <img src='https://www.kamas.pe/assets/imagenes/paginas/pagina-principal/categorias/camas-box-tarimas.webp' alt=''/>
                        </Link>
                    </li>
                    <li>
                        <Link to='/productos/dormitorios/' title=''>
                            <img src='https://www.kamas.pe/assets/imagenes/paginas/pagina-principal/categorias/dormitorios.webp' alt=''/>
                        </Link>
                    </li>
                    <li>
                        <Link to='/productos/camas-funcionales/' title=''>
                            <img src='https://www.kamas.pe/assets/imagenes/paginas/pagina-principal/categorias/camas-funcionales.webp' alt=''/>
                        </Link>
                    </li>
                    <li>
                        <Link to='/productos/cabeceras/' title=''>
                            <img src='https://www.kamas.pe/assets/imagenes/paginas/pagina-principal/categorias/cabeceras.webp' alt=''/>
                        </Link>
                    </li>
                    <li>
                        <Link to='/productos/sofas/' title=''>
                            <img src='https://www.kamas.pe/assets/imagenes/paginas/pagina-principal/categorias/sofas.webp' alt=''/>
                        </Link>
                    </li>
                    <li>
                        <Link to='/productos/complementos/' title=''>
                            <img src='https://www.kamas.pe/assets/imagenes/paginas/pagina-principal/categorias/complementos.webp' alt=''/>
                        </Link>
                    </li>
                </ul>
            </nav>
        </section>
    )
}

export default Categorias;
