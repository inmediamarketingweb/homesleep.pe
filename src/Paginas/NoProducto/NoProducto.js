import './NoProducto.css';

import Header from '../../Componentes/Header/Header';
import Footer from '../../Componentes/Footer/Footer';

function NoProducto(){
    return(
        <>
            <Header/>

            <main>
                <div className='block-container margin-auto'>
                    <section className='block-content d-flex-center-center d-flex-column'>
                        <p className='block-title'>Producto no encontrado, revisa bien la dirección URL</p>
                        <img src="/assets/imagenes/componentes/404/404.svg" alt="Producto no encontrado | Homesleep" className='no-product-image' width={320} height={320} />
                    </section>
                </div>
            </main>

            <Footer/>
        </>
    )
}

export default NoProducto;
