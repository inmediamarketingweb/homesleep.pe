import './SobreNosotros.css';

function SobreNosotros(){
    return(
        <div className='block-container about-us-container'>
            <section className='block-content about-us-content'>
                <div className='block-title-container'>
                    <h2 className='block-title'>Las mejores marcas del mercado</h2>
                </div>

                <div className='d-grid-2-1fr gap-20'>
                    <div className='d-flex-column gap-10'>
                        <p className='title uppercase color-white'>Titulo</p>
                        <p className='text color-white'>Como tienda mayorista llevamos más de 13 años contando con el respaldo de las mejores marcas en productos de dormitorio del mercado.</p>
                        <nav className='about-us-brands'>
                            <ul>
                                <li>
                                    <a href='/' title=''>
                                        <img src="https://www.dormihogar.pe/assets/imagenes/componentes/distribuidores/kamas.png" alt=''/>
                                    </a>
                                </li>
                                <li>
                                    <a href='/' title=''>
                                        <img src="https://www.dormihogar.pe/assets/imagenes/componentes/distribuidores/paraiso.png" alt=''/>
                                    </a>
                                </li>
                                <li>
                                    <a href='/' title=''>
                                        <img src="https://www.dormihogar.pe/assets/imagenes/componentes/distribuidores/bett.png" alt=''/>
                                    </a>
                                </li>
                                <li>
                                    <a href='/' title=''>
                                        <img src="https://www.dormihogar.pe/assets/imagenes/componentes/distribuidores/el-cisne.png" alt=''/>
                                    </a>
                                </li>
                                <li>
                                    <a href='/' title=''>
                                        <img src="https://www.dormihogar.pe/assets/imagenes/componentes/distribuidores/komfort.png" alt=''/>
                                    </a>
                                </li>
                                <li>
                                    <a href='/' title=''>
                                        <img src="https://www.dormihogar.pe/assets/imagenes/componentes/distribuidores/zebra.png" alt=''/>
                                    </a>
                                </li>
                            </ul>
                        </nav>
                    </div>

                    <div className='d-grid-4-1fr gap-5'>
                        <img src="/assets/imagenes/paginas/pagina-principal/sobre-nosotros/paraiso.webp" alt="" className='w-100'/>
                        <img src="/assets/imagenes/paginas/pagina-principal/sobre-nosotros/el-cisne.webp" alt="" className='w-100'/>
                        <img src="/assets/imagenes/paginas/pagina-principal/sobre-nosotros/kamas.webp" alt="" className='w-100'/>
                        <img src="/assets/imagenes/paginas/pagina-principal/sobre-nosotros/komfort.webp" alt="" className='w-100'/>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default SobreNosotros;
