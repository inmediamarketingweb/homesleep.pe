import { useEffect, useState } from 'react';

import Top from './Componentes/Top/Top';
import Bottom from './Componentes/Bottom/Bottom';

import './Header.css';

function Header(){
    const [active, setActive] = useState(false);
    useEffect(() => {
        const handleScroll = () => {
            setActive(window.scrollY > 0);
        };
        window.addEventListener('scroll', handleScroll);
        handleScroll();
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return(
        <header className={active ? 'active' : ''}>
            <Top/>
            <Bottom/>
        </header>
    );
}

export default Header;
