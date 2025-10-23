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
            const imageUrl = `/assets/imagenes/colores/miniatures/${normalizedColorName}.${extension}`;
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
            <button type='button' className='product-page-color-select button-1 d-flex-center-between margin-right'>
                <div className='d-flex-center-center gap-5'>
                    {imageSrc && <img src={imageSrc} alt=''/>}
                    <p className='text'>{colorName}</p>
                </div>

                <span className="material-icons">keyboard_arrow_down</span>
            </button>
        </>
    )
}

export default Colores;
