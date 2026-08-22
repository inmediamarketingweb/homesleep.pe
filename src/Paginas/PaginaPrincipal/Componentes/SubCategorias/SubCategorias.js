import './SubCategorias.css';

function SubCategorias(){
    return(
        <div className='block-container hp-sub-cat-container'>
            <section className='block-content d-flex-column gap-20'>
                <div className='d-flex-column gap-5'>
                    <div>
                        <h2 className='block-title'>Complementos</h2>

                        <a href='/' className='block-title-link'>
                            <p className='block-title-link-text'>Ver todos</p>
                            <span className="material-symbols-outlined">arrow_outward</span>
                        </a>
                    </div>

                    <p className='text'>Todo lo que necesitas para complementar y personalizar tu dormitorio en un solo lugar.</p>
                </div>

                <div className='hp-sub-categories'>
                    <ul>
                        <li>
                            <a href='/productos/complementos/veladores/' title='Veladores | Homesleep'>
                                <img src='https://homesleep.pe/assets/imagenes/productos/complementos/1.webp' alt='| Homesleep'/>
                                <div>
                                    <p className='text'>Veladores</p>
                                </div>
                            </a>
                        </li>
                        <li>
                            <a href='/productos/complementos/almohadas/' title='Almohadas | Homesleep'>
                                <img src='https://rimboccare.com/cdn/shop/collections/almohadas-634977.png?v=1741838814' alt='| Homesleep'/>
                                <div>
                                    <p className='text'>Almohadas</p>
                                </div>
                            </a>
                        </li>
                        <li>
                            <a href='/productos/complementos/sabanas-y-cobertores/' title='Sábanas y cobertores | Homesleep'>
                                <img src='https://rimage.ripley.com.pe/home.ripley/Attachment/MKP/4719/PMP20000354098/thumbnail-1.jpeg' alt='| Homesleep'/>
                                <div>
                                    <p className='text'>Sábanas y cobertores</p>
                                </div>
                            </a>
                        </li>
                        <li>
                            <a href='/productos/complementos/puffs/' title='Puff | Homesleep'>
                                <img src='/assets/imagenes/productos/complementos/puffs/sub-cat-puff.png' alt='| Homesleep'/>
                                <div>
                                    <p className='text'>Asientos puff</p>
                                </div>
                            </a>
                        </li>
                        <li>
                            <a href='/productos/sofas/butacas/' title='Butacas | Homesleep'>
                                <img src='/assets/imagenes/productos/sofas/butacas/sub-cat-butacas.png' alt='| Homesleep'/>
                                <div>
                                    <p className='text'>Butacas</p>
                                </div>
                            </a>
                        </li>
                        <li>
                            <a href='/productos/sofas/reclinables/' title='Sofás reclinables| Homesleep'>
                                <img src='/assets/imagenes/productos/sofas/reclinables/sub-cat-reclinables.png' alt='| Homesleep'/>
                                <div>
                                    <p className='text'>Sofás reclinables</p>
                                </div>
                            </a>
                        </li>
                        <li>
                            <a href='/productos/sofas/' title='Sofás | Homesleep'>
                                <img src='/assets/imagenes/productos/sofas/sub-cat-sofas.png' alt='| Homesleep'/>
                                <div>
                                    <p className='text'>Sofás</p>
                                </div>
                            </a>
                        </li>
                        <li>
                            <a href='/productos/complementos/baules/' title='Sofá baúles| Homesleep'>
                                <img src='/assets/imagenes/productos/complementos/baules/sub-cat-sofa-baul.png' alt='| Homesleep'/>
                                <div>
                                    <p className='text'>Sofá baúles</p>
                                </div>
                            </a>
                        </li>
                    </ul>
                </div>
            </section>
        </div>
    )
}

export default SubCategorias;
