import { useState, useEffect } from 'react';

import './Colores.css';

function Colores({ colorName = "Seleccionar color" }){
    const [imageSrc, setImageSrc] = useState(null);

    useEffect(() => {
        if (!colorName || colorName === "Seleccionar color") {
            setImageSrc(null);
            return;
        }

        const normalizedColorName = colorName.toLowerCase().replace(/\s+/g, '-');
        const extensions = ['webp', 'png', 'jpg'];
        let currentIndex = 0;

        const tryNextExtension = () => {
            if (currentIndex >= extensions.length) {
                setImageSrc(null);
                return;
            }

            const extension = extensions[currentIndex];
            const imageUrl = `/assets/imagenes/colores/${normalizedColorName}.${extension}`;
            const img = new Image();
            img.onload = () => {
                setImageSrc(imageUrl);
            };
            img.onerror = () => {
                currentIndex++;
                tryNextExtension();
            };
            img.src = imageUrl;
        };

        tryNextExtension();

    }, [colorName]);

    return(
        <>
            <div className='product-page-color-select d-flex-column gap-10 margin-right'>
                <div className='d-flex-center-center gap-5'>
                    {imageSrc && (
                        <a href={imageSrc} title="Ver detalles" target='_blank' rel='noopener noreferrer'>
                            <img src={imageSrc} alt={`Imagen del color ${colorName}`}/>
                        </a>
                    )}
                    <p className='text lowercase first-uppercase margin-right'>{colorName}</p>
                </div>

                <button type='button' className='button-small-style-gray'>
                    <p>Más colores</p>
                </button>
            </div>

            <div className='all-colors-miniatures'>
                <div className='all-colors-miniatures-list-container'>
                    <p className='title color-color-1 uppercase'>Colores</p>
                    <ul className='all-colors-miniatures-list'>
                        <li>
                            <button type='button'>
                                <img src="/assets/imagenes/colores/thumb/acero.png" alt=""/>
                            </button>
                        </li>
                    </ul>
                </div>
                <div>
                    <img src="/assets/imagenes/colores/amarillo.png" alt=""/>
                </div>
            </div>

            <div className='colors-layer'></div>
        </>
    )
}

export default Colores;
