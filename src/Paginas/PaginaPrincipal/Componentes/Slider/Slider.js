import { useState, useEffect, useRef } from 'react';
import './Slider.css';

function Slider() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(1);
    const autoPlayRef = useRef(null);
    const totalSlides = 4;

    const slides = [
        { id: 1, img: '/assets/imagenes/paginas/pagina-principal/hp-banner-1.webp', title: 'Slide 1', link: '/' },
        { id: 2, img: '/assets/imagenes/paginas/pagina-principal/hp-banner-1.webp', title: 'Slide 2', link: '/' },
        { id: 3, img: '/assets/imagenes/paginas/pagina-principal/hp-banner-1.webp', title: 'Slide 3', link: '/' },
        { id: 4, img: '/assets/imagenes/paginas/pagina-principal/hp-banner-1.webp', title: 'Slide 4', link: '/' }
    ];

    const nextSlide = () => {
        if (currentIndex === totalSlides - 1) {
            setDirection(-1);
            setCurrentIndex(currentIndex - 1);
        } else if (currentIndex === 0 && direction === -1) {
            setDirection(1);
            setCurrentIndex(currentIndex + 1);
        } else {
            setCurrentIndex(currentIndex + direction);
        }
        resetAutoPlay();
    };

    const prevSlide = () => {
        if (currentIndex === 0) {
            setDirection(1);
            setCurrentIndex(currentIndex + 1);
        } else if (currentIndex === totalSlides - 1 && direction === 1) {
            setDirection(-1);
            setCurrentIndex(currentIndex - 1);
        } else {
            setCurrentIndex(currentIndex - direction);
        }
        resetAutoPlay();
    };

    const goToSlide = (index) => {
        setCurrentIndex(index);
        if (index > currentIndex) {
            setDirection(1);
        } else if (index < currentIndex) {
            setDirection(-1);
        }
        resetAutoPlay();
    };

    const resetAutoPlay = () => {
        if (autoPlayRef.current) {
            clearInterval(autoPlayRef.current);
        }
        startAutoPlay();
    };

    const startAutoPlay = () => {
        autoPlayRef.current = setInterval(() => {
            setCurrentIndex((prevIndex) => {
                let newIndex;
                
                if (prevIndex === totalSlides - 1) {
                    setDirection(-1);
                    newIndex = prevIndex - 1;
                } else if (prevIndex === 0 && direction === -1) {
                    setDirection(1);
                    newIndex = prevIndex + 1;
                } else {
                    newIndex = prevIndex + direction;
                }
                
                return newIndex;
            });
        }, 5000);
    };

    const handleMouseEnter = () => {
        if (autoPlayRef.current) {
            clearInterval(autoPlayRef.current);
            autoPlayRef.current = null;
        }
    };

    const handleMouseLeave = () => {
        startAutoPlay();
    };

    useEffect(() => {
        startAutoPlay();

        return () => {
            if (autoPlayRef.current) {
                clearInterval(autoPlayRef.current);
            }
        };
    }, []);

    const slideWidth = 100 / totalSlides;
    const transformValue = -currentIndex * slideWidth;

    return (
        <div className='block-container hp-slider-container d-flex-column gap-10'>
            <section className='block-content hp-slider-content' onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
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

                <button type='button' className='hp-slider-button-1' onClick={prevSlide}>
                    <span className="material-symbols-outlined">keyboard_arrow_left</span>
                </button>

                <button type='button' className='hp-slider-button-2' onClick={nextSlide}>
                    <span className="material-symbols-outlined">keyboard_arrow_right</span>
                </button>
            </section>

            <div className='hp-slider-buttons'>
                {slides.map((_, index) => (
                    <button key={index} className={currentIndex === index ? 'active' : ''} onClick={() => goToSlide(index)}/>
                ))}
            </div>
        </div>
    );
}

export default Slider;
