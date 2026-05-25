import { Helmet } from 'react-helmet';

import Categorias from '../Componentes/Categorias/Categorias';
import CategoriasLeft from '../Componentes/CategoriasLeft/CategoriasLeft';

import './Layout.css';

function LayoutP(){
    return(
        <>
            <Helmet>
                <title>-Categoria- | Homesleep</title>
            </Helmet>

            <main className='product-page-main'>
                <Categorias/>

                <div className='block-container'>
                    <section className='block-content block-content-product-page'>
                        <CategoriasLeft/>
                    </section>
                </div>
            </main>
        </>
    )
}

export default LayoutP;
