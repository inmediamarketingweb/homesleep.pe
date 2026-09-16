import './Top.css';

function Top(){
    return(
        <div className='header-top-container'>
            <section className='header-top d-flex-center-between'>
                <ul className='header-top-left d-flex-center-left gap-10'>
                    <li>
                        <p>Atención de lunes a sábados de 08:00 am a 08:00 pm</p>
                    </li>
                    <li>
                        <p>|</p>
                    </li>
                    <li className='d-flex-center-center gap-5'>
                        <ul className='d-flex-center-left gap-5'>
                            <li>
                                <a href='tel: +51901451579' title="Llamar" className='d-flex-center-center gap-5'>
                                    <img src="/assets/imagenes/iconos/telefono-gris.svg" alt="Teléfono | Homesleep" />
                                    <h2>901451579</h2>
                                </a>
                            </li>
                            <li>
                                <a href='tel: +51974317647' title="Llamar" className='d-flex-center-center gap-5'>
                                    <img src="/assets/imagenes/iconos/telefono-gris.svg" alt="Teléfono | Homesleep" />
                                    <h2>974317647</h2>
                                </a>
                            </li>
                        </ul>
                    </li>
                    <li>
                        <p>|</p>
                    </li>
                    <li>
                        <a href='https://wa.link/97p523' target='_blank' rel="noopener noreferrer" title="WhatsApp | Homesleep" className='d-flex-center-center gap-5'>
                            <img src="/assets/imagenes/iconos/whatsapp-gris.svg" alt="WhatsApp | Homesleep" />
                            <h2>WhatsApp</h2>
                        </a>
                    </li>
                    {/* <li>
                        <a href='https://wa.link/97p523' target='_blank' rel="noopener noreferrer" title="WhatsApp | Homesleep" className='d-flex-center-center gap-5'>
                            <img src="/assets/imagenes/iconos/whatsapp-gris.svg" alt="WhatsApp | Homesleep" />
                            <h2>WhatsApp</h2>
                        </a>
                    </li> */}
                </ul>

                <div className='margin-left location d-flex-center-center gap-10'>
                    <p>Líderes en productos de dormitorio</p>
                    <span></span>
                </div>
            </section>
        </div>
    )
}

export default Top;
