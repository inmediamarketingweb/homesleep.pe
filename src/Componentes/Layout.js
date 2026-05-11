import { Outlet } from 'react-router-dom';

import Layer from './Layer/Layer';
import Header from './Header/Header';
import CursorAnimation from './CursorAnimation/CursorAnimation';
import WhatsApp from './WhatsApp/WhastApp';
import Footer from './Footer/Footer';

function Layout(){
    return(
        <>
            <CursorAnimation/>

            <Layer/>

            <Header/>

            <Outlet/>

            <WhatsApp/>

            <Footer/>
        </>
    )
}

export default Layout;

// Esta es la plantilla general del proyecto, cada una de las páginas del proyecto consume esta plantilla
