import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';

import Footer from '../../../../../Componentes/Footer/Footer';
import Header from '../../../../../Componentes/Header/Header';

import '../EnviosALimaYCallao/EnviosALimaYCallao.css';

function EnviosAProvincia(){
    const [destinos, setDestinos] = useState([]);

    useEffect(() => {
        fetch('/assets/json/paginas/envios/envios-a-lima-y-callao.json')
        .then((response) => {
            if (!response.ok) {
                throw new Error('Error al obtener la información');
            }
            return response.json();
        })
        .then((data) => setDestinos(data))
        .catch((error) => console.error('Error fetching destinos JSON:', error));
    }, []);

    useEffect(() => {
        let script;
        if (!document.getElementById('tiktok-embed-script')){
            script = document.createElement('script');
            script.id = 'tiktok-embed-script';
            script.src = 'https://www.tiktok.com/embed.js';
            script.async = true;
            document.body.appendChild(script);
        }
        return () => {
            if (script && document.getElementById('tiktok-embed-script')) {
            document.body.removeChild(script);
        }
        };
    }, []);

    return(
        <>
            <Helmet>
                <title>Envíos a provincia | Kamas</title>
            </Helmet>

            <Header />

            <main>
                <div className="block-container">
                    <section className="block-content d-flex-column gap-20">
                        <img className="page-banner-img" src="/assets/imagenes/paginas/envios/envios-a-provincia.jpg" alt="Envíos para Lima y Callao | Kamas"/>

                        <div className="envios-page">
                            <div className="d-flex-column gap-10">
                                <blockquote class="tiktok-embed" cite="https://www.tiktok.com/@homesleep.pe/video/7375670311783501061" data-video-id="7375670311783501061">
                                    <section>
                                        <a target="_blank" title="@homesleep.pe" href="https://www.tiktok.com/@homesleep.pe?refer=embed">@homesleep.pe</a>
                                        <a title="dormitorio" target="_blank" href="https://www.tiktok.com/tag/dormitorio?refer=embed">#DORMITORIO</a>
                                        <a title="cisne" target="_blank" href="https://www.tiktok.com/tag/cisne?refer=embed">#CISNE</a>
                                        <a title="kamas" target="_blank" href="https://www.tiktok.com/tag/kamas?refer=embed">#KAMAS</a>
                                        KING &#47; 3 PLAZAS A TAN SÓLO 1649 SOLES 💙
                                        <a title="homesleep" target="_blank" href="https://www.tiktok.com/tag/homesleep?refer=embed">#Homesleep</a>
                                    </section>
                                </blockquote>
                                <script async src="https://www.tiktok.com/embed.js"></script>
                            </div>

                            <div className="envios-page-destinos">
                                {destinos.map((destino, idx) => (
                                    <div key={idx} className="d-flex-column d-flex-center-center gap-10">
                                        <div>
                                            <img src={destino.imgOne} alt={`Imagen de ${destino.provincia} - 1`}/>
                                            <img src={destino.imgTwo} alt={`Imagen de ${destino.provincia} - 2`}/>
                                        </div>
                                        <p className="text">{destino.provincia}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                </div>
            </main>

            <Footer />
        </>
    );
}

export default EnviosAProvincia;
