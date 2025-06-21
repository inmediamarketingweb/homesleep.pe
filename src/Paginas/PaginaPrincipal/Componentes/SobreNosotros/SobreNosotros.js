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
                <div className='block-title-container'>
                    <h2 className='block-title'>Homesleep</h2>
                </div>

                <div className='d-grid-2-1fr gap-10'>
                    <video width="100%" height="auto" controls>
                        <source src="/assets/videos/video-kamas-yt.mp4" type="video/mp4" />
                    </video>

                    <div className='d-flex-column gap-20'>
                        <div className='d-flex-column gap-5'>
                            <p className='title'>Homesleep</p>
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
                            <img width={isSmallScreen ? 219 : 392} height={isSmallScreen ? 100 : 200} loading="lazy" src={`/assets/imagenes/paginas/nosotros/${isSmallScreen ? 'thumb/' : ''}1.jpg`} alt=''/>
                        </li>
                        <li>
                            <img width={isSmallScreen ? 219 : 392} height={isSmallScreen ? 100 : 200} loading="lazy" src={`/assets/imagenes/paginas/nosotros/${isSmallScreen ? 'thumb/' : ''}2.jpg`} alt=''/>
                        </li>
                        <li>
                            <img width={isSmallScreen ? 219 : 392} height={isSmallScreen ? 100 : 200} loading="lazy" src={`/assets/imagenes/paginas/nosotros/${isSmallScreen ? 'thumb/' : ''}3.jpg`} alt=''/>
                        </li>
                        <li>
                            <img width={isSmallScreen ? 219 : 392} height={isSmallScreen ? 100 : 200} loading="lazy" src={`/assets/imagenes/paginas/nosotros/${isSmallScreen ? 'thumb/' : ''}4.jpg`} alt=''/>
                        </li>
                    </ul>
                </div>
            </section>
        </div>
    );
}

export default SobreNosotros;
