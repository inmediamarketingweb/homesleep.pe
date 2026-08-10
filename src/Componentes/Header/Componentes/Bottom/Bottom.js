import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from "uuid";

import SearchBar from '../SearchBar/SearchBar';

import './Bottom.css';

function Bottom(){
    const [activeCategory, setActiveCategory] = useState(null);
    const [categories, setCategories] = useState(null);
    const [error, setError] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchActive, setIsSearchActive] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(prev => {
            if (!prev) setIsSearchActive(false);
            return !prev;
        });
    };

    const toggleSearch = () => {
        setIsSearchActive(prev => {
            if (!prev) setIsMenuOpen(false);
            return !prev;
        });
    };

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('/assets/json/componentes/header.json');
                if (!response.ok) {
                    throw new Error('Error al cargar los archivos');
                }
                const data = await response.json();
                setCategories(data);
            } catch (err) {
                setError(err.message);
                console.error('Error fetching categories:', err);
            }
        };

        fetchCategories();
    }, []);

    if (error) {
        return <div className="error-message">Error al cargar el menú: {error}</div>;
    }

    if (!categories) {
        return <div className="loading">Cargando...</div>;
    }

    const handleCategoryClick = (categoryId) => {
        setActiveCategory(prev => prev === categoryId ? null : categoryId);
    };

    return(
        <div className='header-center-container d-flex w-100'>
            <section className='header-center'>
                <a href='/' title='Homesleep | Las mejores marcar al mejor precio' className='header-logo'>
                    <img src="/assets/imagenes/SEO/logo-principal.webp" width={125} height={50} alt="Homesleep"/>
                </a>

                <nav className={`menu-container ${isMenuOpen ? 'active' : ''}`}>
                    <ul className='menu'>
                        {categories.header.map((categoria) => (
                            <li key={uuidv4()} className={`menu-li ${activeCategory === categoria.id ? 'active' : ''}`} onClick={() => categoria['sub-categorias'] && handleCategoryClick(categoria.id)}>
                                <div className='menu-li-div'>
                                    <a href={categoria.link} title={categoria.categoria} className='menu-link'>
                                        <h2>{categoria.categoria}</h2>
                                    </a>

                                    {categoria['sub-categorias'] && (
                                        <button type='button' className='menu-link-button'>
                                            <span className="material-icons">keyboard_arrow_down</span>
                                        </button>
                                    )}
                                </div>

                                {categoria['sub-categorias'] && (
                                    <div className={`submenu-container ${activeCategory === categoria.id ? 'active' : ''}`}>
                                        <div className='submenu'>
                                            {categoria['banner-img'] && (
                                                <div className='submenu-target submenu-target-4'>
                                                    <img width={450} height={160} loading='lazy' src={categoria['banner-img']} alt={categoria['banner-img-alt'] || categoria.categoria}/>
                                                </div>
                                            )}

                                            <nav className='submenu-nav'>
                                                {categoria['sub-categorias'].map((subCategoria) => (
                                                    <div key={uuidv4()} className='submenu-target submenu-target-3'>
                                                        <h3 className='submenu-target-title'>{subCategoria.titulo}</h3>
                                                        <ul>
                                                            {subCategoria.lista.map((item) => (
                                                                <li key={uuidv4()}>
                                                                    <a href={item.link} title={item.text}>
                                                                        <h4>{item.text}</h4>
                                                                    </a>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                ))}
                                            </nav>
                                        </div>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                </nav>

                <SearchBar isSearchActive={isSearchActive} toggleSearch={toggleSearch} setIsSearchActive={setIsSearchActive} />

                <button type='button' className={`menu-button ${isMenuOpen ? 'active' : ''}`} onClick={toggleMenu}>
                    <span className="material-icons menu-button-open">menu</span>
                    <span className="material-icons menu-button-close">close</span>
                </button>
            </section>
        </div>
    )
}

export default Bottom;
