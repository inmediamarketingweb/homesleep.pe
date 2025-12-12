import './WhatsApp.css';

function WhatsApp({ producto, quantity = 1 }) {
    if (!producto) return null;

    const obtenerNumeroSegunHorario = () => {
        const ahora = new Date();
        const hora = ahora.getHours();
        const minutos = ahora.getMinutes();
        const horaActual = hora + minutos / 60;
        const diaSemana = ahora.getDay();
        const esFinDeSemana = diaSemana === 0 || diaSemana === 6;

        const numero1 = "+51901451579";
        const numero2 = "+51974317647";

        if (esFinDeSemana) {
            return numero2;
        } else {
            if (horaActual >= 7.0 && horaActual < 17.5) {
                return numero1;
            } else {
                return numero2;
            }
        }
    };

    const getWhatsAppLink = () => {
        const numeroWhatsApp = obtenerNumeroSegunHorario();
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
