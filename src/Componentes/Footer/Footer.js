import './Footer.css';

function Footer(){
    return(
    <footer className='w-100 d-flex-column gap-20'>
        <div className='footer-block-container'>
            <section className='footer-block-content'>
                <div className='block-title-container margin-bottom-40'>
                    <p className='block-title'>Homesleep</p>
                </div>

                <nav className='footer-targets'>
                    <div className='footer-target footer-target-1'>
                        <p className='title'>Contáctanos</p>

                        <ul className='footer-list gap-10'>
                            <li>
                                <span className="material-icons">location_on</span>
                                <div>
                                    <b>Dirección:</b>
                                    <p>Carabayllo, Lima - Perú</p>
                                </div>
                            </li>
                            <li>
                                <span className="material-icons">call</span>
                                <div>
                                    <b>Teléfono:</b>
                                    <p>974317647</p>
                                    <p>901451579</p>
                                </div>
                            </li>
                            <li>
                                <span className="material-icons">mail</span>
                                <div>
                                    <b>Correo:</b>
                                    <p>contacto@homesleep.pe</p>
                                </div>
                            </li>
                        </ul>
                    </div>

                    <div className='footer-target footer-target-2'>
                        <p className='title'>Servicio al cliente</p>
                        <ul className='footer-list'>
                            <li>
                                <a href='/manual-de-instalacion/' title='Manual de instalación | Homesleep'>
                                    <p>Manual de instalación</p>
                                </a>
                            </li>
                            <li>
                                <a href='/paleta-de-colores/' title='Paleta de colores | Homesleep'>
                                    <p>Paleta de colores</p>
                                </a>
                            </li>
                            <li>
                                <a href='/servicio-al-cliente/medios-de-pago/' title='Medios de pago | Homesleep'>
                                    <p>Medios de pago</p>
                                </a>
                            </li>
                            <li>
                                <a href='/servicio-al-cliente/garantia-de-productos/' title='Garantía de productos | Homesleep'>
                                    <p>Garantía de productos</p>
                                </a>
                            </li>
                            <li>
                                <a href='/servicio-al-cliente/recomendaciones-de-uso/' title='Recomendaciones de uso | Homesleep'>
                                    <p>Recomendaciones de uso</p>
                                </a>
                            </li>
                            <li>
                                <a href='/servicio-al-cliente/politica-de-cambios-y-devoluciones/' title='Política de cambios y devoluciones | Homesleep'>
                                    <p>Política de cambios y devoluciones</p>
                                </a>
                            </li>
                            <li>
                                <a href='/novedades/programa-de-influencers/' title='Programa de influencers | Homesleep'>
                                    <p>Programa influencers</p>
                                </a>
                            </li>
                            <li>
                                <a href='/novedades/programa-de-referencias/' title='Progama de referencias | Homesleep'>
                                    <p>Programa de referencias</p>
                                </a>
                            </li>
                            <li>
                                <a href='/servicio-al-cliente/terminos-y-condiciones/' title='Términos y condiciones | Homesleep'>
                                    <p>Términos y condiciones</p>
                                </a>
                            </li>
                            <li>
                                <a href='/servicio-al-cliente/costos-de-envio-por-zona/' title='Costos de envio por zona | Homesleep'>
                                    <p>Costos de envío por zona</p>
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div className='footer-target footer-target-3'>
                        <div className='d-flex-column gap-10'>
                            <p className='title'>Acerca de Homesleep</p>
                            <ul className='footer-list'>
                                <li>
                                    <a href='/servicio-al-cliente/horarios-de-entrega-y-envios/' title='Horarios de entrega y envíos | Homesleep'>
                                        <p>Tiempo y costos de envíos</p>
                                    </a>
                                </li>
                                <li>
                                    <a href='/nosotros/' title='Manual de instalación | Homesleep'>
                                        <p>Homesleep</p>
                                    </a>
                                </li>
                                <li>
                                    <a href='/servicio-al-cliente/privacidad-y-seguridad/' title='Privacidad y seguridad | Homesleep'>
                                        <p>Privacidad y seguridad</p>
                                    </a>
                                </li>
                                <li>
                                    <a href='/nosotros/razones-para-comprar/' title='Razones para comprar | Homesleep'>
                                        <p>Razones para comprar</p>
                                    </a>
                                </li>
                                <li>
                                    <a href='/nosotros/propiedad-intelectual/' title='Propiedad intelectual | Homesleep'>
                                        <p>Propiedad intelectual</p>
                                    </a>
                                </li>
                                <li>
                                    <a href='/contacto/' title='Contacto | Homesleep'>
                                        <p>Contacto</p>
                                    </a>
                                </li>
                                <li>
                                    <a href='/envios/envios-a-provincia/' title='Envios a provincia | Homesleep'>
                                        <p>Envios a provincia</p>
                                    </a>
                                </li>
                                <li>
                                    <a href='/envios/envios-a-lima-y-callao/' title='Envios a Lima y Callao | Homesleep'>
                                        <p>Envios a Lima y Callao</p>
                                    </a>
                                </li>
                                <li>
                                    <a href='/agencias-recomendadas/' title='Agencias recomendadas | Homesleep'>
                                        <p>Agencias recomendadas</p>
                                    </a>
                                </li>
                            </ul>
                        </div>

                        <div className='d-flex-column gap-10'>
                            <p className='title'>Siguenos:</p>

                            <ul className='d-flex-center-left gap-5 social-networks'>
                                <li>
                                    <a href='https://www.facebook.com/homesleep.pe' target='_blank' rel="noopener noreferrer" title='Facebook | Homesleep'>
                                        <img src="/assets/imagenes/iconos/facebook-blanco.svg" width={20} height={20} alt="Visita nuestro perfil en Facebook"/>
                                    </a>
                                </li>
                                <li>
                                    <a href='https://www.tiktok.com/@homesleep.pe' target='_blank' rel="noopener noreferrer" title='Tik Tok | Homesleep'>
                                        <img src="/assets/imagenes/iconos/tiktok-blanco.svg" width={20} height={20} alt="Visita nuestro perfil en TikTok"/>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className='footer-target footer-target-4'>
                        <div className='d-flex-column gap-10'>
                            <div className='face-tag-container'>
                                <div className='face-tag-content'>
                                    <div className='face-tag-content-top'>
                                        <div className='d-flex-center-left gap-10'>
                                            <img src="/assets/imagenes/componentes/footer/profile.png" alt=''/>
                                            <div className='d-flex-column'>
                                                <p className='uppercase color-white font-bold'>Homesleep</p>
                                                <p className='color-white'>19 de agosto</p>
                                            </div>
                                        </div>

                                        <a href='https://www.facebook.com/share/v/1DBojW61T9/' target='_blank' rel="noopener noreferrer" className='face-tag-icon' title=''>
                                            <i className="fa-brands fa-facebook"></i>
                                        </a>
                                    </div>

                                    <a href='https://www.facebook.com/share/v/1DBojW61T9/' target='_blank' rel="noopener noreferrer" title='' className=''>
                                        <img src='/assets/imagenes/componentes/footer/facebook.jpeg' alt=''/>
                                    </a>

                                    <a href='https://www.facebook.com/share/v/1DBojW61T9/' target='_blank' rel="noopener noreferrer" className='d-flex-column'>
                                        <p>👑 Lujo y comodidad en tu descanso 👑</p>
                                        <p>Dormitorio KAMAS / CISNE Pocket King 3 Plazas por S/1699</p>
                                        <p>✨ Cabeceras exclusivas</p>
                                        <p>✨ +30 modelos</p>
                                        <p>✨ +60 colores</p>
                                        <p>🎁 Incluye: 3 almohadas + 3 cojines + 1 puff</p>
                                        <p>🚚 Envío GRATIS en Lima y Callao</p>
                                        <p>🌎 Despachos inmediatos a todo el Perú</p>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>
            </section>
        </div>

        <div className='footer-bottom-container'>
            <section className='footer-bottom'>
                <ul className='d-flex-center-center gap-10'>
                    <li>
                        <img src="/assets/imagenes/componentes/footer/visa.svg" width={20} height={20} alt="Visa | Homesleep" />
                    </li>
                    <li>
                        <img src="/assets/imagenes/componentes/footer/mastercard.svg" width={20} height={20} alt="Mastercard | Homesleep" />
                    </li>
                    <li>
                        <img src="/assets/imagenes/componentes/footer/bcp.svg" width={58} height={20} alt="BCP | Homesleep" />
                    </li>
                    <li>
                        <img src="/assets/imagenes/componentes/footer/interbank.svg" width={110} height={20} alt="Interbank | Homesleep" />
                    </li>
                    <li>
                        <img src="/assets/imagenes/componentes/footer/bbva.svg" width={66} height={20} alt="BBVA | Homesleep" />
                    </li>
                    <li>
                        <img src="/assets/imagenes/componentes/footer/scotiabank.svg" width={80} height={20} alt="Scotiabank | Homesleep" />
                    </li>
                    <li>
                        <img src="/assets/imagenes/componentes/footer/banco-de-la-nacion.svg" width={97} height={20} alt="Banco de la nación | Homesleep" />
                    </li>
                </ul>

                <p className='text color-white'>&copy; Todos los derechos reservados para <a href='https://homesleep.pe/' title='Homesleep | Fabricantes de colchones, camas y dormitorios' className='color-white'>homesleep.pe</a></p>
            </section>
        </div>
    </footer>
    );
}

export default Footer;
