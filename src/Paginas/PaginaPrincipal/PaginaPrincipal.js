import { Helmet } from 'react-helmet';

import Slider from './Componentes/Slider/Slider';
import Video from './Componentes/Video/Video';
import Categorias from './Componentes/Categorias/Categorias';
import StockUnico from './Componentes/StockUnico/StockUnico';
import Dormitorios from './Componentes/Destacados/Dormitorios';
import SubCategorias from './Componentes/SubCategorias/SubCategorias';

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

                <StockUnico/>

                <Video/>

                <SubCategorias/>
            </main>
        </>
    );
}

export default PaginaPrincipal;
