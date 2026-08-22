import './Ofertas.css';

function Ofertas(){
    return(
        <>
        <div className='block-container hp-oferrs-block-container'>
            <section className='block-content hp-oferrs-block-content'>
                <div className='hp-offers-tag hp-offers-tag-1'>
                    <div className='block-title-container'>
                        <p className='block-title'>Promo del mes</p>
                    </div>

                    <div className='product-card-li'>
                        <div className='product-card'>
                            <button type="button" className='product-card-button-fav'>
                                <span className="material-symbols-outlined">favorite</span>
                            </button>

                            <div className="product-card-images">
                                <span className="product-card-discount">-40%</span>

                                <a href='/' title=''>
                                    <img src='https://homesleep.pe/assets/imagenes/productos/dormitorios/king/el-cisne/rc-608/americanos/bloques/prestige/1/1.jpg' alt='' className="product-image"/>
                                </a>

                                <div className='product-card-tipo-de-envio'>
                                    <span>Envío gratis</span>
                                </div>
                            </div>

                            <a href='/' className="product-card-content">
                                <span className="product-card-brand">KAMAS - EL CISNE</span>
                                <h4 className="product-card-name">DORMITORIO AMERICANO KING KAMAS / EL CISNE + COLCHÓN EL CISNE RC-608 + CABECERA AÉREA PRESTIGE - CUERO ROJO</h4>
                                <div className="product-card-prices d-flex-center-between">
                                    <div className="d-flex-column">
                                        <span className="product-card-regular-price">s/2999</span>
                                        <span className="product-card-normal-price">s/2599</span>
                                    </div>

                                    <span className="product-card-sale-price">s/1799</span>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>

                <div className='hp-offers-tag hp-offers-tag-2'>
                    <div className='block-title-container'>
                        <p className='block-title'>Ofertas</p>

                        <a href='/' className='block-title-link'>
                            <p className='block-title-link-text'>Ver más</p>
                        </a>
                    </div>

                    <div className='hp-offers-products-container'>
                        <ul>
                            <li></li>
                            <li></li>
                            <li></li>
                            <li></li>
                            <li></li>
                            <li></li>
                            <li></li>
                        </ul>
                    </div>

                    <button className='hp-offers-button hp-offers-button-left'>
                        <span class="material-symbols-outlined">chevron_left</span>
                    </button>
                    <button className='hp-offers-button hp-offers-button-right'>
                        <span class="material-symbols-outlined">chevron_right</span>
                    </button>

                    <div className='hp-offers-slide-buttons'>
                        <span className='hp-offers-slide-button hp-offers-slide-button-1 active'></span>
                        <span className='hp-offers-slide-button hp-offers-slide-button-2'></span>
                        <span className='hp-offers-slide-button hp-offers-slide-button-3'></span>
                        <span className='hp-offers-slide-button hp-offers-slide-button-4'></span>
                    </div>
                </div>
            </section>
        </div>
        </>
    )
}

export default Ofertas;
