import './Categorias.css';

function Categorias(){
    return(
        <div className='block-container'>
            <section className='block-content'>
                <div className='block-title-container'>
                    <h2 className='block-title margin-auto color-color-1'>Categorías</h2>
                </div>

                <div className='homepage-categories'>
                    <div className='homepage-categories-target-1 d-flex'>
                        <video src="/assets/imagenes/paginas/pagina-principal/categorias/videos/video-1.mp4" controls autoPlay muted/>
                    </div>

                    <div className='homepage-categories-target-2'>
                        <nav>
                            <ul>
                                <li>
                                    <a href='/' title='' className='hp-cat-link hp-cat-link-1'>
                                        <img src='https://www.kamas.pe/assets/imagenes/paginas/pagina-principal/categorias/colchones.webp' alt=''/>
                                        <p>Colchones</p>
                                    </a>
                                </li>
                                <li>
                                    <a href='/' title='' className='hp-cat-link hp-cat-link-1'>
                                        <img src='https://www.kamas.pe/assets/imagenes/paginas/pagina-principal/categorias/camas-box-tarimas.webp' alt=''/>
                                        <p>Camas box tarimas</p>
                                    </a>
                                </li>
                                <li>
                                    <a href='/' title='' className='hp-cat-link hp-cat-link-1'>
                                        <img src='https://www.kamas.pe/assets/imagenes/paginas/pagina-principal/categorias/dormitorios.webp' alt=''/>
                                        <p>Dormitorios</p>
                                    </a>
                                </li>
                                <li>
                                    <a href='/' title='' className='hp-cat-link hp-cat-link-1'>
                                        <img src='https://www.kamas.pe/assets/imagenes/paginas/pagina-principal/categorias/camas-funcionales.webp' alt=''/>
                                        <p>Camas funcionales</p>
                                    </a>
                                </li>
                                <li>
                                    <a href='/' title='' className='hp-cat-link hp-cat-link-1'>
                                        <img src='https://www.kamas.pe/assets/imagenes/paginas/pagina-principal/categorias/cabeceras.webp' alt=''/>
                                        <p>Cabeceras</p>
                                    </a>
                                </li>
                                <li>
                                    <a href='/' title='' className='hp-cat-link hp-cat-link-1'>
                                        <img src='https://www.kamas.pe/assets/imagenes/paginas/pagina-principal/categorias/sofas.webp' alt=''/>
                                        <p>Sofás</p>
                                    </a>
                                </li>
                                <li>
                                    <a href='/' title='' className='hp-cat-link hp-cat-link-1'>
                                        <img src='https://www.kamas.pe/assets/imagenes/paginas/pagina-principal/categorias/complementos.webp' alt=''/>
                                        <p>Complementos</p>
                                    </a>
                                </li>
                                <li>
                                    <a href='/' title='' className='hp-cat-link hp-cat-link-1'>
                                        <img src='https://www.kamas.pe/assets/imagenes/paginas/pagina-principal/categorias/complementos.webp' alt=''/>
                                        <p>Ver todos</p>
                                    </a>
                                </li>
                            </ul>
                        </nav>
                        
                        <p className='text'>Lorem Ipsum is simply dummy text of the standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries.</p>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Categorias;
