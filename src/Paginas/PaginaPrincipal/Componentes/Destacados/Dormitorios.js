import './Destacados.css';

function Destacados(){
    return(
        <div className='block-container featured-products-block-container'>
            <section className='block-content d-flex-column gap-10'>
                <p className='banner-title'>Dormitorios King - 3 plazas</p>

                <div className='d-flex-center-between gap-10'>
                    <ul className='d-flex gap-5'>
                        <li>
                            <button type='button' title='El Cisne' className='brand-button el-cisne'>
                                <p>El Cisne</p>
                            </button>
                        </li>
                        <li>
                            <button type='button' title='Paraiso' className='brand-button paraiso'>
                                <p>Paraiso</p>
                            </button>
                        </li>
                        <li>
                            <button type='button' title='Kamas' className='brand-button kamas'>
                                <p>Kamas</p>
                            </button>
                        </li>
                        <li>
                            <button type='button' title='Komfort' className='brand-button komfort'>
                                <p>Komfort</p>
                            </button>
                        </li>
                    </ul>

                    <a href='' className='button-link button-link-1'>
                        <p className='button-link-text'>Ver más modelos</p>
                        <span class="material-symbols-outlined">arrow_outward</span>
                    </a>
                </div>

                <div className='featured-products-container'>
                    <nav className='featured-products'>
                        <ul>
                            <li></li>
                            <li></li>
                            <li></li>
                            <li></li>
                            <li></li>
                            <li></li>
                        </ul>
                    </nav>
                </div>
            </section>
        </div>
    )
}

export default Destacados;
