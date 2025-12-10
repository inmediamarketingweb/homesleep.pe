import './WhatsApp.css';

function WhatsApp({ producto, quantity = 1 }) {
    if (!producto) return null;

    const getWhatsAppLink = () => {
        const numeroWhatsApp = "+51901451579";
        const regalos = producto.regalos || [];
        let regalosTexto = '';

        if (regalos.length > 0) {
            regalos.forEach(regalo => {
                regalosTexto += `* ${regalo.nombre || regalo}\n`;
            });
        } else {
            regalosTexto = '* Sin regalos disponibles\n';
        }

        const mensaje = `*${producto.nombre}*\n\n` +
                       `_*S/.${producto.precioVenta}*_\n\n` +
                       `Cantidad: ${quantity}\n\n` +
                       `🎁 REGALOS:\n` +
                       `${regalosTexto}\n\n` +
                       `SKU: ${producto.sku}\n` +
                       `https://homesleep.pe${producto.ruta}`;
    
        return `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;
    };

    const hasStock = producto.stock > 0;
    const buttonClasses = [ 'product-page-whatsapp', hasStock ? 'active' : 'sin-stock' ].filter(Boolean).join(' ');
    const buttonText = hasStock ? 'Continuar' : 'Sin stock';

    return(
        <a href={hasStock ? getWhatsAppLink() : "#"} className={buttonClasses} target="_blank" rel="noopener noreferrer" onClick={(e) => !hasStock && e.preventDefault()}>
            <img src="/assets/imagenes/iconos/whatsapp-blanco.svg" alt="WhatsApp | homesleep"/>
            <p>{buttonText}</p>
        </a>
    );
}

export default WhatsApp;
