import { Helmet } from 'react-helmet';

import Slider from './Componentes/Slider/Slider';
import Categorias from './Componentes/Categorias/Categorias';
import StockUnico from './Componentes/StockUnico/StockUnico';
import Dormitorios from './Componentes/Destacados/Dormitorios';
// import SobreNosotros from './Componentes/SobreNosotros/SobreNosotros';

import './PaginaPrincipal.css';

function PaginaPrincipal(){
    return(
        <>
            <Helmet>
                <title>Dormitorios El Cisne, Paraiso, Kamas y Komfort | Homesleep</title>
                <meta name="description" content="Tienda mayorista en productos para dormitorio, contamos con productos El Cisne, Paraiso, Kamas, Komfort y muchas marcas más." />

                <meta property="og:title" content="Dormitorios El Cisne, Paraiso, Kamas y Komfort | Homesleep"/>
                <meta property="og:description" content="Homesleep encontrarás las mejores marcas para tu descanso, kamas, paraiso y el cisne."/>
                <meta property="og:type" content="website"/>
                <meta property="og:url" content="https://www.homesleep.pe/"/>
                <meta property="og:image" content="/assets/imagenes/paginas/pagina-principal/homepage-video.jpg"/>
                <meta property="og:site_name" content="Homesleep"/>

                <link rel="preload" as="image" href="/assets/imagenes/paginas/pagina-principal/slider/slider-1.webp" />
                <link rel="preload" as="image" href="/assets/imagenes/paginas/pagina-principal/slider/thumb/slider-1.webp" />
            </Helmet>

            <main>
                <Slider/>

                <Dormitorios/>

                <Categorias/>

                <div className='block-container'>
                    <div className='block-content'>
                        <div className='d-grid-2-1fr gap-10'>
                            <div className="visible-on-desktop-no-mobile">
                                <div className='d-flex w-100'>
                                    <a href='https://homesleep.pe/productos/dormitorios/queen/' className='d-flex w-100 banner-link-img-50w'>
                                        <img src="/assets/imagenes/paginas/pagina-principal/queen.webp" alt=""/>
                                    </a>
                                </div>
                            </div>

                            <div className="visible-on-mobile-no-desktop">
                                <div className='d-flex w-100'>
                                    <a href='https://homesleep.pe/productos/dormitorios/queen/' className='d-flex w-100 banner-link-img-50w'>
                                        <img src="/assets/imagenes/paginas/pagina-principal/thumb/queen.webp" alt=""/>
                                    </a>
                                </div>
                            </div>

                            <div className="visible-on-desktop-no-mobile">
                                <div className='d-flex w-100'>
                                    <a href='https://homesleep.pe/productos/dormitorios/2-plazas/' className='d-flex w-100 banner-link-img-50w'>
                                        <img src="/assets/imagenes/paginas/pagina-principal/2-plazas.webp" alt=""/>
                                    </a>
                                </div>
                            </div>

                            <div className="visible-on-mobile-no-desktop">
                                <div className='d-flex w-100'>
                                    <a href='https://homesleep.pe/productos/dormitorios/2-plazas/' className='d-flex w-100 banner-link-img-50w'>
                                        <img src="/assets/imagenes/paginas/pagina-principal/thumb/2-plazas.webp" alt=""/>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* <SobreNosotros/> */}

                <div className="block-container">
                    <section className='block-content'>
                        <a href='https://homesleep.pe/productos/colchones/?marca=paraiso' className='d-flex banner-link-img' title='Línea royal de Paraiso | Homesleep'>
                            <img src="/assets/imagenes/paginas/pagina-principal/hp-banner-2.webp" alt="COLCHONES LINEA ROYAL PARAISO"/>
                        </a>
                    </section>
                </div>

                <StockUnico/>
            </main>
        </>
    );
}

export default PaginaPrincipal;
