// import { useState } from 'react';

import Top from './Componentes/Top/Top';
import Center from './Componentes/Center/Center';
// import Bottom from './Componentes/Bottom/Bottom';

import './Header.css';

function Header(){
    // const [isMenuOpen, setIsMenuOpen] = useState(false);

    // const toggleMenu = () => {
    //     setIsMenuOpen(prev => !prev);
    // };

    return(
        <header>
            <Top/>
            <Center/>
            {/* <Center onMenuClick={toggleMenu} isMenuOpen={isMenuOpen} /> */}
            {/* <Bottom isMenuOpen={isMenuOpen}/> */}
        </header>
    );
}

export default Header;
