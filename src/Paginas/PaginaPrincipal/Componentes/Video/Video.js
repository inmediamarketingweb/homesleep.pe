import './Video.css';

function Video(){
    return(
        <div className='block-container hp-video-block-container'>
            <section className='block-content hp-video-block-content'>
                <div className='hp-video-tag hp-video-tag-1'>
                    <img src='/assets/imagenes/SEO/logo-principal.png' className='hp-video-logo' alt=''/>

                    <div className='d-flex-column'>
                        <p className='color-white uppercase font-bold margin-bottom-10'>- Colchones - El Cisne</p>
                        <p className='color-white'>- Descubre la comodidad de descansar en un colchón king de resortes pocket de gama alta.</p>
                        <p className='color-white'>- Llevatelo con obsequios y a un súper precio llevandolo en combo.</p>
                    </div>

                    <a href='/' className='button-link button-link-2'>
                        <p className='button-link-text'>Ver pocket plus</p>
                        <span class="material-symbols-outlined">arrow_outward</span>
                    </a>
                </div>

                <div className='hp-video-tag hp-video-tag-2'>
                    <video src="/assets/imagenes/paginas/pagina-principal/categorias/videos/video-1.mp4" poster='/assets/imagenes/componentes/video/pocket-plus.jpg' controls muted/>
                </div>
            </section>
        </div>
    )
}

export default Video;
