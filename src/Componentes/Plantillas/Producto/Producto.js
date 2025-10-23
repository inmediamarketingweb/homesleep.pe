import PropTypes from 'prop-types';
import { useEffect, useState } from "react";

import LazyImage from '../LazyImage';

import "./Producto.css";

/**
 * @param {Object} props
 * @param {Object} props.producto
**/

export function Producto({ producto = { id: null } }){
    // const [secondImageError, setSecondImageError] = useState(false);
    // const [favorites, setFavorites] = useState([]);
    const descuento = Math.round( ((producto.precioNormal - producto.precioVenta) * 100) / producto.precioNormal );

    // useEffect(() => {
    //     const favStorage = JSON.parse(localStorage.getItem("favoritos")) || [];
    //     setFavorites(favStorage);
    // }, []);

    const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 600);

    useEffect(() => {
        const handleResize = () => {
            setIsSmallScreen(window.innerWidth < 600);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const tipoEnvioClase = producto["tipo-de-envio"] === "Gratis" ? "envio-gratis"
    : producto["tipo-de-envio"] === "Envío preferente" ? "envio-preferente"
    : producto["tipo-de-envio"] === "Envío aplicado" ? "envio-aplicado"
    : "";

    const imageSize = isSmallScreen ? 140 : 200;

    return(
        <li>
            <div className={`product-card ${producto.stock === 0 ? "agotado" : ""}`} title={producto.nombre}>
                <div className="product-card-images">
                    {descuento > 0 && (
                        <span className="product-card-discount">-{descuento}%</span>
                    )}

                    <a href={producto.ruta} title={producto.nombre}>
                        <LazyImage width={imageSize} height={imageSize} src={`${producto.fotos}1`} alt={producto.nombre} className="product-image"/>
                    </a>
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
        nombre: PropTypes.string.isRequired,
        ruta: PropTypes.string.isRequired,
        fotos: PropTypes.string.isRequired,
        precioNormal: PropTypes.number.isRequired,
        precioVenta: PropTypes.number.isRequired,
    }).isRequired,
    truncate: PropTypes.func.isRequired,
};
