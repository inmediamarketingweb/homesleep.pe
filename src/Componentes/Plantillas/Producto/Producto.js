// import PropTypes from 'prop-types';
// import { useEffect, useState } from "react";

// import LazyImage from '../LazyImage';

// import "./Producto.css";

// /**
//  * @param {Object} props
//  * @param {Object} props.producto
// **/

// export function Producto({ producto = { id: null } }){
//     const descuento = Math.round( ((producto.precioNormal - producto.precioVenta) * 100) / producto.precioNormal );
//     const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 600);
//     const [isHotSale, setIsHotSale] = useState(false);

//     useEffect(() => {
//         const handleResize = () => {
//             setIsSmallScreen(window.innerWidth < 600);
//         };

//         window.addEventListener('resize', handleResize);

//         return () => {
//             window.removeEventListener('resize', handleResize);
//         };
//     }, []);

//     useEffect(() => {
//         const checkHotSale = async () => {
//             try {
//                 const response = await fetch('/assets/json/mas-vendidos.json');
//                 const hotSaleSKUs = await response.json();
//                 setIsHotSale(hotSaleSKUs.includes(producto.sku));
//             } catch (error) {
//                 console.error("Error cargando mas-vendidos.json:", error);
//                 setIsHotSale(false);
//             }
//         };
        
//         if (producto.sku) {
//             checkHotSale();
//         }
//     }, [producto.sku]);

//     const tipoEnvioClase = producto["tipo-de-envio"] === "Gratis" ? "envio-gratis" : producto["tipo-de-envio"] === "Envío preferente" ? "envio-preferente" : producto["tipo-de-envio"] === "Envío aplicado" ? "envio-aplicado" : "";

//     const getTextoEnvio = () => {
//         if (producto["tipo-de-envio"] === "Gratis") {
//             return "Envío gratis";
//         }
//         return producto["tipo-de-envio"];
//     };

//     const imageSize = isSmallScreen ? 140 : 200;

//     return(
//         <li className={`product-card-li ${producto.stock === 0 ? "agotado" : ""}`} title={producto.nombre}>
//             <div className='product-card'>
//                 <button type="button" className='product-card-button-fav'>
//                     <span className="material-symbols-outlined">favorite</span>
//                 </button>

//                 <div className="product-card-images">
//                     {descuento > 0 && (
//                         <span className="product-card-discount">-{descuento}%</span>
//                     )}

//                     <a href={producto.ruta} title={producto.nombre}>
//                         <LazyImage width={imageSize} height={imageSize} src={`${producto.fotos}1`} alt={producto.nombre} className="product-image"/>
//                     </a>

//                     <div className={`product-card-tipo-de-envio ${tipoEnvioClase}`}>
//                         {producto["tipo-de-envio"] && (
//                             <span>{getTextoEnvio()}</span>
//                         )}
//                     </div>

//                     {isHotSale && (
//                         <div className='hot-sale'>
//                             <span>HOT SALE</span>
//                             <span className="material-symbols-outlined">local_fire_department</span>
//                         </div>
//                     )}
//                 </div>

//                 <a href={producto.ruta} className="product-card-content">
//                     <span className="product-card-brand">{producto.marca}</span>
//                     <h4 className="product-card-name">{producto.nombre}</h4>
//                     <div className="product-card-prices d-flex-center-between">
//                         <div className="d-flex-column">
//                             <span className="product-card-regular-price">S/.{producto.precioRegular}</span>
//                             <span className="product-card-normal-price">S/.{producto.precioNormal}</span>
//                         </div>

//                         <span className="product-card-sale-price">S/.{producto.precioVenta}</span>
//                     </div>
//                 </a>
//             </div>
//         </li>
//     );
// }

// Producto.propTypes = {
//     producto: PropTypes.shape({
//         id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
//         sku: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
//         nombre: PropTypes.string.isRequired,
//         ruta: PropTypes.string,
//         fotos: PropTypes.string.isRequired,
//         precioNormal: PropTypes.number.isRequired,
//         precioVenta: PropTypes.number.isRequired,
//         "tipo-de-envio": PropTypes.string,
//         "detalles-del-producto": PropTypes.array,
//     }).isRequired,
// };

import PropTypes from 'prop-types';
import { useEffect, useState } from "react";

import LazyImage from '../LazyImage';

import "./Producto.css";

/**
 * @param {Object} props
 * @param {Object} props.producto
**/

export function Producto({ producto = { id: null } }) {
    const descuento = Math.round(((producto.precioNormal - producto.precioVenta) * 100) / producto.precioNormal);
    const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 600);
    const [isHotSale, setIsHotSale] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsSmallScreen(window.innerWidth < 600);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        const checkHotSale = async () => {
            try {
                const response = await fetch('/assets/json/mas-vendidos.json');
                const hotSaleSKUs = await response.json();
                setIsHotSale(hotSaleSKUs.includes(producto.sku));
            } catch (error) {
                console.error("Error cargando mas-vendidos.json:", error);
                setIsHotSale(false);
            }
        };

        if (producto.sku) {
            checkHotSale();
        }
    }, [producto.sku]);

    const tipoEnvioClase = producto["tipo-de-envio"] === "Gratis" ? "envio-gratis" : producto["tipo-de-envio"] === "Envío preferente" ? "envio-preferente" : producto["tipo-de-envio"] === "Envío aplicado" ? "envio-aplicado" : "";

    const getTextoEnvio = () => {
        if (producto["tipo-de-envio"] === "Gratis") {
            return "Envío gratis";
        }
        return producto["tipo-de-envio"];
    };

    const imageSize = isSmallScreen ? 140 : 200;

    return (
        <li className={`product-card-li ${producto.stock === 0 ? "agotado" : ""}`} title={producto.nombre}>
            <div className='product-card'>
                <button type="button" className='product-card-button-fav'>
                    <span className="material-symbols-outlined">favorite</span>
                </button>

                <div className="product-card-images">
                    {descuento > 0 && (
                        <span className="product-card-discount">-{descuento}%</span>
                    )}

                    <a href={producto.ruta} title={producto.nombre}>
                        <LazyImage width={imageSize} height={imageSize} src={`${producto.fotos}1`} alt={producto.nombre} className="product-image" />
                    </a>

                    <div className={`product-card-tipo-de-envio ${tipoEnvioClase}`}>
                        {producto["tipo-de-envio"] && (
                            <span>{getTextoEnvio()}</span>
                        )}
                    </div>

                    {isHotSale && (
                        <div className='hot-sale'>
                            <span>HOT SALE</span>
                            <span className="material-symbols-outlined">local_fire_department</span>
                        </div>
                    )}
                </div>

                <a href={producto.ruta} className="product-card-content">
                    <span className="product-card-brand">{producto.marca}</span>
                    <h4 className="product-card-name">{producto.nombre}</h4>
                    <div className="product-card-prices d-flex-center-between">
                        <div className="d-flex-column">
                            <span className="product-card-regular-price">S/.{producto.precioRegular}</span>
                            <span className="product-card-normal-price">S/.{producto.precioNormal}</span>
                        </div>

                        <span className="product-card-sale-price">S/.{producto.precioVenta}</span>
                    </div>
                </a>
            </div>
        </li>
    );
}

Producto.propTypes = {
    producto: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        sku: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        nombre: PropTypes.string.isRequired,
        ruta: PropTypes.string,
        fotos: PropTypes.string.isRequired,
        precioNormal: PropTypes.number.isRequired,
        precioVenta: PropTypes.number.isRequired,
        "tipo-de-envio": PropTypes.string,
        "detalles-del-producto": PropTypes.array,
    }).isRequired,
};
