import { useState } from "react";

import './Categorias.css';

function Categorias(){
  const videos = [
        "/assets/imagenes/paginas/pagina-principal/categorias/videos/video-1.mp4",
        "/assets/imagenes/paginas/pagina-principal/categorias/videos/video-2.mp4",
        "/assets/imagenes/paginas/pagina-principal/categorias/videos/video-3.mp4"
    ];

    const [index, setIndex] = useState(0);
    const max = videos.length - 1;

    const next = () => {
        setIndex((prev) => (prev < max ? prev + 1 : prev));
    };

    const prev = () => {
        setIndex((prev) => (prev > 0 ? prev - 1 : prev));
    };

    return(
        <div className='block-container'>
            <section className='block-content'>
                <div className='block-title-container'>
                    <h2 className='block-title'>Categorías</h2>
                </div>

                <div className='homepage-categories'>
                <div className='homepage-categories-target-1'>
                    <div className='videos-tiktok'>
                        <video key={index} src={videos[index]} controls autoPlay loop muted playsInline width="300"/>
                    </div>

                    <button onClick={prev} className='hp-cat-vid-tk-button hp-cat-vid-tk-button-left'>
                        <span className="material-symbols-outlined">chevron_left</span>
                    </button>

                    <button onClick={next} className='hp-cat-vid-tk-button hp-cat-vid-tk-button-right'>
                        <span className="material-symbols-outlined">chevron_right</span>
                    </button>
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
