import { useState } from 'react';
import './Slider.css';

function Slider() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const totalSlides = 3;

    const slides = [
        { id: 1, img: '/assets/imagenes/paginas/pagina-principal/slider/slider-1.webp', title: 'DORMITORIOS KAMAS KING', link: 'https://homesleep.pe/productos/dormitorios/king/?modelo=sarki' },
        { id: 2, img: '/assets/imagenes/paginas/pagina-principal/slider/slider-2.webp', title: 'Slide 2', link: '/' },
        { id: 3, img: '/assets/imagenes/paginas/pagina-principal/slider/slider-3.webp', title: 'Slide 3', link: '/' },
    ];

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % totalSlides);
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + totalSlides) % totalSlides);
    };

    const goToSlide = (index) => {
        setCurrentIndex(index);
    };

    const slideWidth = 100 / totalSlides;
    const transformValue = -currentIndex * slideWidth;

    return (
        <div className='hp-slider-container d-flex-column gap-10'>
            <section className='hp-slider-content'>
                <div>
                    <ul style={{
                        transform: `translateX(${transformValue}%)`,
                        transition: 'transform 500ms linear'
                    }}>
                        {slides.map((slide) => (
                            <li key={slide.id}>
                                <a href={slide.link} title={slide.title}>
                                    <img src={slide.img} alt={slide.title} />
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>

                <button type='button' className='hp-slider-button hp-slider-button-1' onClick={prevSlide}>
                    <span className="material-symbols-outlined">keyboard_arrow_left</span>
                </button>

                <button type='button' className='hp-slider-button hp-slider-button-2' onClick={nextSlide}>
                    <span className="material-symbols-outlined">keyboard_arrow_right</span>
                </button>

                <section className='hp-slider-buttons'>
                    {slides.map((_, index) => (
                        <button key={index} className={currentIndex === index ? 'active' : ''} onClick={() => goToSlide(index)}/>
                    ))}
                </section>
            </section>
        </div>
    );
}

export default Slider;
