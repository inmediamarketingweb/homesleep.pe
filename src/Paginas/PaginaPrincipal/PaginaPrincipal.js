import { Helmet } from 'react-helmet';

import Slider from './Componentes/Slider/Slider';
// import Categorias from './Componentes/Categorias/Categorias';
// import Destacados from './Componentes/Destacados/Destacados';
import Dormitorios from './Componentes/Destacados/Dormitorios';
import SobreNosotros from './Componentes/SobreNosotros/SobreNosotros';
import Distribuidores from '../../Componentes/Distribuidores/Distribuidores';

import './PaginaPrincipal.css';

function PaginaPrincipal(){
    return(
        <>
            <Helmet>
                <title>Homesleep | Las mejores marcas en dormitorios</title>
                <meta name="description" content="Fabricantes de colchones, camas, box tarimas y juegos de dormitorios con más de 15 años en el mercado peruano ofreciendo calidad y confort para tu descanso." />

                <meta property="og:title" content="Homesleep | Las mejores marcas en dormitorios"/>
                <meta property="og:description" content="Homesleep encintrarás las mejores marcas para tu descanso, kamas, paraiso y el cisne."/>
                <meta property="og:type" content="website"/>
                <meta property="og:url" content="https://www.homesleep.pe/"/>
                <meta property="og:image" content="/assets/imagenes/paginas/pagina-principal/homepage-video.jpg"/>
                <meta property="og:site_name" content="Homesleep"/>

                <link rel="preload" as="image" href="/assets/imagenes/paginas/pagina-principal/slider/slider-1.webp" />
                <link rel="preload" as="image" href="/assets/imagenes/paginas/pagina-principal/slider/thumb/slider-1.webp" />
            </Helmet>

            <main>
                <Slider/>

                <div className='block-container'>
                    <div className='block-content'>
                        <a href='/  ' className='d-flex banner-link-img'>
                            <img src="https://img.freepik.com/foto-gratis/desenfoque-lujo-abstracto-gradiente-color-gris-utilizado-como-pared-estudio-fondo-exhibir-sus-productos_1258-54649.jpg?semt=ais_hybrid&w=740&q=80" alt=""/>
                        </a>
                    </div>
                </div>

                <Dormitorios/>

                <div className='block-container'>
                    <div className='block-content'>
                        <div className='d-grid-2-1fr gap-10'>
                            <div className='d-flex w-100'>
                                <a href='/' className='d-flex w-100 banner-link-img-50w'>
                                    <img src="https://img.freepik.com/foto-gratis/desenfoque-lujo-abstracto-gradiente-color-gris-utilizado-como-pared-estudio-fondo-exhibir-sus-productos_1258-54649.jpg?semt=ais_hybrid&w=740&q=80" alt=""/>
                                </a>
                            </div>
                        
                            <div className='d-flex w-100'>
                                <a href='/' className='d-flex w-100 banner-link-img-50w'>
                                    <img src="https://img.freepik.com/foto-gratis/desenfoque-lujo-abstracto-gradiente-color-gris-utilizado-como-pared-estudio-fondo-exhibir-sus-productos_1258-54649.jpg?semt=ais_hybrid&w=740&q=80" alt=""/>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* <Categorias/> */}

                {/* <Destacados/> */}

                <SobreNosotros/>

                <Distribuidores/>
            </main>
        </>
    );
}

export default PaginaPrincipal;
