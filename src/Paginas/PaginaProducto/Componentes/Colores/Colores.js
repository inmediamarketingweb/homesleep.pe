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
            <div className='product-page-color-select d-flex-column gap-5 margin-right'>
                <p className='color-color-1 title uppercase'>Color</p>

                <p className='text lowercase first-uppercase'>{colorName}</p>

                <button type='button' className='button-1 d-flex-center-center gap-10 margin-right'>
                    {imageSrc && <img src={imageSrc} alt=''/>}

                    <span class="material-symbols-outlined">add_circle</span>
                </button>
            </div>
        </>
    )
}

export default Colores;
