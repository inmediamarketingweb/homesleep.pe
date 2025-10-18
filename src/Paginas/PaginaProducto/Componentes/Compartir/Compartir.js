import './Compartir.css';
import { useState } from 'react';

function Compartir() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const currentUrl = window.location.href;
    const message = "¡Mira esto!";

    const handleCopy = () => {
        navigator.clipboard.writeText(currentUrl)
        .then(() => {
            console.log('URL copiada!');
        })
        .catch(err => {
            console.error("Error al copiar: ", err);
        });
    };

    const shareOnWhatsApp = () => {
        const url = `https://wa.me/?text=${encodeURIComponent(message + ' ' + currentUrl)}`;
        window.open(url, '_blank', 'width=600,height=400');
    };

    return (
        <div className="share-widget">
            <button type='button' className='share-button' onClick={toggleMenu}>
                <span className="material-symbols-outlined">share</span>
                <p>Compartir</p>
            </button>

            {isOpen && (
                <div className="share-menu">
                    <button onClick={shareOnWhatsApp} className="share-option whatsapp">
                        <span className="icon">WhatsApp</span>
                    </button>
                    <button onClick={handleCopy} className="share-option copy">
                        <span className="material-icons">content_copy</span>
                        <p>Copiar enlace</p>
                    </button>
                </div>
            )}
        </div>
    );
}

export default Compartir;
