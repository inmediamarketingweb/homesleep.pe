import { useRef, useEffect, useState } from 'react';

import './Categorias.css';

function Categorias(){
    const containerRef = useRef(null);
    const thumbRef = useRef(null);
    const controllerRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const updateThumb = () => {
            const thumb = thumbRef.current;
            const controller = controllerRef.current;
            if (!thumb || !controller) return;
            const scrollWidth = container.scrollWidth - container.clientWidth;
            const scrollPosition = container.scrollLeft;
            const visibleRatio = container.clientWidth / container.scrollWidth;
            const thumbWidth = Math.max(visibleRatio * 100, 10);
            const thumbMaxMove = 100 - thumbWidth;
            const scrollPercent = scrollWidth > 0 ? (scrollPosition / scrollWidth) * thumbMaxMove : 0;
            thumb.style.width = `${thumbWidth}%`;
            thumb.style.marginLeft = `${scrollPercent}%`;
        };

        container.addEventListener('scroll', updateThumb);
        updateThumb();

        return () => container.removeEventListener('scroll', updateThumb);
    }, []);

    const handleMouseDown = (e) => {
        e.preventDefault();
        setIsDragging(true);
        const controller = controllerRef.current;
        const thumb = thumbRef.current;
        if (!controller || !thumb) return;
        
        const rect = controller.getBoundingClientRect();
        setStartX(e.clientX - rect.left);
        setScrollLeft(containerRef.current.scrollLeft);
    };

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!isDragging) return;
            e.preventDefault();

            const container = containerRef.current;
            const controller = controllerRef.current;
            const thumb = thumbRef.current;
            if (!container || !controller || !thumb) return;
            const rect = controller.getBoundingClientRect();
            const thumbWidth = thumb.offsetWidth;
            const controllerWidth = controller.offsetWidth;
            let x = (e.clientX - rect.left) / controllerWidth * 100;
            x = Math.max(0, Math.min(100 - (thumbWidth / controllerWidth * 100), x));
            const scrollWidth = container.scrollWidth - container.clientWidth;
            const scrollPercent = x / (100 - (thumbWidth / controllerWidth * 100));
            container.scrollLeft = scrollWidth * scrollPercent;
        };

        const handleMouseUp = () => {
            setIsDragging(false);
        };

        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging]);

    const handleTouchStart = (e) => {
        const touch = e.touches[0];
        setIsDragging(true);
        const controller = controllerRef.current;
        if (!controller) return;
        
        const rect = controller.getBoundingClientRect();
        setStartX(touch.clientX - rect.left);
        setScrollLeft(containerRef.current.scrollLeft);
    };

    useEffect(() => {
        const handleTouchMove = (e) => {
            if (!isDragging) return;
            e.preventDefault();

            const container = containerRef.current;
            const controller = controllerRef.current;
            const thumb = thumbRef.current;
            if (!container || !controller || !thumb) return;

            const rect = controller.getBoundingClientRect();
            const touch = e.touches[0];
            const thumbWidth = thumb.offsetWidth;
            const controllerWidth = controller.offsetWidth;
            let x = (touch.clientX - rect.left) / controllerWidth * 100;
            x = Math.max(0, Math.min(100 - (thumbWidth / controllerWidth * 100), x));
            const scrollWidth = container.scrollWidth - container.clientWidth;
            const scrollPercent = x / (100 - (thumbWidth / controllerWidth * 100));

            container.scrollLeft = scrollWidth * scrollPercent;
        };

        const handleTouchEnd = () => {
            setIsDragging(false);
        };

        if (isDragging) {
            document.addEventListener('touchmove', handleTouchMove, { passive: false });
            document.addEventListener('touchend', handleTouchEnd);
        }

        return () => {
            document.removeEventListener('touchmove', handleTouchMove);
            document.removeEventListener('touchend', handleTouchEnd);
        };
    }, [isDragging]);

    return(
        <div className='block-container'>
            <section className='block-content'>
                <div className='block-title-container'>
                    <h2 className='block-title'>Categorías</h2>

                    <a className='block-title-link' href='/'>
                        <p className='block-title-link-text'>Ver todos los productos</p>
                        <span className="material-symbols-outlined">arrow_outward</span>
                    </a>
                </div>

                <div className='hp-categories-container' ref={containerRef}>
                    <ul className='hp-categories'>
                        <li className='hp-category hp-category-1'>
                            <a href='https://homesleep.pe/productos/colchones/' title='Colchones | Homesleep'>
                                <div>
                                    <img src='https://www.kamas.pe/assets/imagenes/paginas/pagina-principal/categorias/colchones.webp' alt=''/>
                                    <p>Confort y descanso para cada noche</p>
                                </div>
                                <h3>Colchones</h3>
                            </a>
                        </li>
                        <li className='hp-category hp-category-2'>
                            <a href='https://homesleep.pe/productos/camas-box-tarimas/' title='Camas box tarimas | Homesleep'>
                                <div>
                                    <img src='https://www.kamas.pe/assets/imagenes/paginas/pagina-principal/categorias/camas-box-tarimas.webp' alt=''/>
                                    <p>La base ideal para tu descanso</p>
                                </div>
                                <h3>Camas box tarimas</h3>
                            </a>
                        </li>
                        <li className='hp-category hp-category-3'>
                            <a href='https://homesleep.pe/productos/dormitorios/' title='Dormitorios | Homesleep'>
                                <div>
                                    <img src='https://www.kamas.pe/assets/imagenes/paginas/pagina-principal/categorias/dormitorios-1.webp' alt=''/>
                                    <p>Todo lo que necesitas para tu habitación</p>
                                </div>
                                <h3>Dormitorios</h3>
                            </a>
                        </li>
                        <li className='hp-category hp-category-4'>
                            <a href='https://homesleep.pe/productos/camas-funcionales/' title='Camas funcionales | Homesleep'>
                                <div>
                                    <img src='https://www.kamas.pe/assets/imagenes/paginas/pagina-principal/categorias/camas-funcionales.webp' alt=''/>
                                    <p>Más espacio y funcionalidad para tu hogar</p>
                                </div>
                                <h3>Camas funcionales</h3>
                            </a>
                        </li>
                        <li className='hp-category hp-category-5'>
                            <a href='https://homesleep.pe/productos/cabeceras/' title='Colchones | Homesleep'>
                                <div>
                                    <img src='https://www.kamas.pe/assets/imagenes/paginas/pagina-principal/categorias/cabeceras.webp' alt=''/>
                                    <p>El detalle que transforma tu dormitorio</p>
                                </div>
                                <h3>Cabeceras</h3>
                            </a>
                        </li>
                        <li className='hp-category hp-category-6'>
                            <a href='/'>
                                <div>
                                    <img src='https://www.kamas.pe/assets/imagenes/paginas/pagina-principal/categorias/sofas.webp' alt=''/>
                                    <p>Comodidad y estilo para compartir en casa</p>
                                </div>
                                <h3>Sofás</h3>
                            </a>
                        </li>
                        <li className='hp-category hp-category-7'>
                            <a href='/'>
                                <div>
                                    <img src='https://www.kamas.pe/assets/imagenes/paginas/pagina-principal/categorias/complementos.webp' alt=''/>
                                    <p>Los detalles que hacen especial tu dormitorio</p>
                                </div>
                                <h3>Complementos</h3>
                            </a>
                        </li>
                    </ul>
                </div>

                <div className='hp-cat-scroll-controler' ref={controllerRef}>
                    <span className='hp-cat-scroll-thumb' ref={thumbRef} onMouseDown={handleMouseDown} onTouchStart={handleTouchStart}></span>
                </div>
            </section>
        </div>
    )
}

export default Categorias;
