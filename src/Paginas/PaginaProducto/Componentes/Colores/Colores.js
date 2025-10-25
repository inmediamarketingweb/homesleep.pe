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
            <div className='product-page-color-select d-flex-column gap-5 margin-right'>
                <p className='color-color-1 title uppercase'>Color</p>

                <button type='button' className='button-1 d-flex-center-center gap-10'>
                    <div className='d-flex'>
                        {imageSrc && <img src={imageSrc} alt=''/>}
                    </div>

                    <div className='d-flex-center-center'>
                        <p className='text'>{colorName}</p>
                        <span className="material-icons">keyboard_arrow_down</span>
                    </div>
                </button>
            </div>

            {/* <div className='product-page-color-layer'></div> */}

            {/* <div className='product-page-color-modal-container'></div> */}
        </>
    )
}

export default Colores;
