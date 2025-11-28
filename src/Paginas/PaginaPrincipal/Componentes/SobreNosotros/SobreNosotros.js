import { useEffect, useState } from 'react';

import './SobreNosotros.css';

function SobreNosotros(){
    const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 600);

    useEffect(() => {
        const handleResize = () => {
            setIsSmallScreen(window.innerWidth < 600);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return(
        <div className='block-container block-container-homepage-about-us'>
            <section className='block-content'>
                <div className='d-grid-2-1fr gap-10'>
                    <img src="/assets/imagenes/paginas/nosotros/banner-1.jpg" alt="Nosotros | Homesleep" className='page-banner-img' />

                    <div className='d-flex-column gap-20'>
                        <div className='d-flex-column gap-5'>
                            <p className='block-title w-100 text-left color-color-1 uppercase'>Homesleep</p>
                            <p className='title'>¡Dormir bien empieza en Homesleep!</p>
                            <p className='text'>En Homesleep llevamos más de 13 años transformando el descanso de miles de familias peruanas.</p>
                            <p className='text'>Somos especialistas en productos de dormitorio y trabajamos con las mejores marcas del mercado, garantizando la mejor calidad al mejor precio.</p>
                            <p className='text'>Sabemos que un buen descanso cambia tu día a día, por eso en Homesleep no solo vendemos camas, colchones y cabeceras: te ofrecemos asesoría personalizada, atención rápida y un servicio postventa que marca la diferencia.</p>
                            <p className='text'>Ya sea que busques renovar tu dormitorio o equiparlo desde cero, aquí encuentras lo que necesitas: marcas confiables, variedad de modelos y un equipo que se preocupa porque elijas lo mejor para ti y tu familia.</p>
                            <p className='text'>🏷️ Ofertas reales, calidad garantizada y servicio excepcional.</p>
                            <p className='text'>🏠 Vive la experiencia Homesleep y redescubre el placer de dormir bien.</p>
                        </div>

                        <a href='/nosotros/' className='button-link button-link-1 margin-left'>
                            <p className='button-link-text'>Más sobre nosotros</p>
                            <span className="material-icons">arrow_forward</span>
                        </a>
                    </div>
                </div>

                <div className='homepage-about-us-images-container w-100'>
                    <ul className='homepage-about-us-images'>
                        <li>
                            <img src="/assets/imagenes/paginas/nosotros/1.jpg"/>
                        </li>
                        <li>
                            <img src="/assets/imagenes/paginas/nosotros/2.jpg"/>
                        </li>
                        <li>
                            <img src="/assets/imagenes/paginas/nosotros/3.jpg"/>
                        </li>
                        <li>
                            <img src="/assets/imagenes/paginas/nosotros/4.jpg"/>
                        </li>
                    </ul>
                </div>
            </section>
        </div>
    );
}

export default SobreNosotros;
