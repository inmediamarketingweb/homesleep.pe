import { Helmet } from 'react-helmet';

import Slider from './Componentes/Slider/Slider';
import Categorias from './Componentes/Categorias/Categorias';
import Destacados from './Componentes/Destacados/Destacados';
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

                <Categorias/>

                <Destacados/>

                <SobreNosotros/>

                <Distribuidores/>

                {/* <script src="https://elfsightcdn.com/platform.js" async></script> */}
                {/* <div class="elfsight-app-84445f73-7426-41ed-9666-9440e98ca550" data-elfsight-app-lazy></div> */}
            </main>
        </>
    );
}

export default PaginaPrincipal;
