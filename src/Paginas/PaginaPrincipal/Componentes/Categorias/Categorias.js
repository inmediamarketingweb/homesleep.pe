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
                                    <a href='https://homesleep.pe/colchones/' title='Colchones | Homesleep' className='hp-cat-link hp-cat-link-1'>
                                        <img src='https://www.kamas.pe/assets/imagenes/paginas/pagina-principal/categorias/colchones.webp' alt=''/>
                                        <p>Colchones</p>
                                    </a>
                                </li>
                                <li>
                                    <a href='https://homesleep.pe/camas-box-tarimas/' title='Camas box tarima | Homesleep' className='hp-cat-link hp-cat-link-1'>
                                        <img src='https://www.kamas.pe/assets/imagenes/paginas/pagina-principal/categorias/camas-box-tarimas.webp' alt=''/>
                                        <p>Camas box tarimas</p>
                                    </a>
                                </li>
                                <li>
                                    <a href='https://homesleep.pe/dormitorios/' title='Dormitorios | Homesleep' className='hp-cat-link hp-cat-link-1'>
                                        <img src='https://www.kamas.pe/assets/imagenes/paginas/pagina-principal/categorias/dormitorios-1.webp' alt=''/>
                                        <p>Dormitorios</p>
                                    </a>
                                </li>
                                <li>
                                    <a href='https://homesleep.pe/camas-funcionales/' title='Camas funcionales | Homesleep' className='hp-cat-link hp-cat-link-1'>
                                        <img src='https://www.kamas.pe/assets/imagenes/paginas/pagina-principal/categorias/camas-funcionales.webp' alt=''/>
                                        <p>Camas funcionales</p>
                                    </a>
                                </li>
                                <li>
                                    <a href='https://homesleep.pe/cabeceras/' title='Cabeceras | Homesleep' className='hp-cat-link hp-cat-link-1'>
                                        <img src='https://www.kamas.pe/assets/imagenes/paginas/pagina-principal/categorias/cabeceras.webp' alt=''/>
                                        <p>Cabeceras</p>
                                    </a>
                                </li>
                                <li>
                                    <a href='https://homesleep.pe/sofas/' title='Sofas | Homesleep' className='hp-cat-link hp-cat-link-1'>
                                        <img src='https://www.kamas.pe/assets/imagenes/paginas/pagina-principal/categorias/sofas.webp' alt=''/>
                                        <p>Sofás</p>
                                    </a>
                                </li>
                                <li>
                                    <a href='https://homesleep.pe/complementos/' title='Complementos | Homesleep' className='hp-cat-link hp-cat-link-1'>
                                        <img src='https://www.kamas.pe/assets/imagenes/paginas/pagina-principal/categorias/complementos.webp' alt=''/>
                                        <p>Complementos</p>
                                    </a>
                                </li>
                                <li>
                                    <a href='https://homesleep.pe/productos/' title='Productos | Homesleep' className='hp-cat-link hp-cat-link-1'>
                                        <img src='https://www.kamas.pe/assets/imagenes/paginas/pagina-principal/categorias/dormitorios-2.webp' alt=''/>
                                        <p>Ver todos</p>
                                    </a>
                                </li>
                            </ul>
                        </nav>
                        
                        <p className='text'>En homesleep.pe contamos con variedad de productos en las mejores marcas del mercado como El Cisne, Paraiso, Kamas, Komfort y entres muchas más. Encuentra colchones, camas box tarimas, juegos de dormitorios, veladores, juegos de sábanas y muchos más productos para el descanso.</p>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Categorias;
