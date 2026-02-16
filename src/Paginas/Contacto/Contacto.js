import { Helmet } from "react-helmet-async";
import { useForm } from '@formspree/react';
import { useEffect, useState } from "react";

import './Contacto.css';

function Contacto(){

    const [state, handleSubmit] = useForm("xanoeplr");

    const [formData, setFormData] = useState({
        Nombres: '',
        Telefono: '',
        Correo: '',
        Ciudad: '',
        Mensaje: ''
    });

    const [snackbar, setSnackbar] = useState({
        show: false,
        message: ''
    });

    const regexLetras = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
    const regexTelefono = /^[0-9]{6,9}$/;
    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const handleChange = (e) => {

        let value = e.target.value;

        if (e.target.name === "Telefono") {
            value = value.replace(/\D/g, '').slice(0, 9);
        }

        setFormData({
            ...formData,
            [e.target.name]: value
        });
    };

    const mostrarSnackbar = (mensaje) => {
        setSnackbar({ show: true, message: mensaje });

        setTimeout(() => {
            setSnackbar({ show: false, message: '' });
        }, 3000);
    };

    const validarFormulario = () => {

        if (!formData.Nombres ||
            !formData.Telefono ||
            !formData.Correo ||
            !formData.Ciudad ||
            !formData.Mensaje
        ) {
            mostrarSnackbar("Por favor completa todos los datos");
            return false;
        }

        if (!regexLetras.test(formData.Nombres)) {
            mostrarSnackbar("El nombre solo debe contener letras");
            return false;
        }

        if (!regexTelefono.test(formData.Telefono)) {
            mostrarSnackbar("El teléfono debe tener entre 6 y 9 números");
            return false;
        }

        if (!regexCorreo.test(formData.Correo)) {
            mostrarSnackbar("Ingresa un correo válido");
            return false;
        }

        if (!regexLetras.test(formData.Ciudad)) {
            mostrarSnackbar("La ciudad solo debe contener letras");
            return false;
        }

        return true;
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        if (!validarFormulario()) return;

        await handleSubmit(e);
    };

    useEffect(() => {
        if (state.succeeded) {
            mostrarSnackbar("Gracias, datos enviados ✔");
            setFormData({
                Nombres: '',
                Telefono: '',
                Correo: '',
                Ciudad: '',
                Mensaje: ''
            });
        }
    }, [state.succeeded]);

    return(
        <>
            <Helmet>
                <title>Contacto | Homesleep</title>
            </Helmet>

            <main className="contacto-main">
                <div className='block-container'>
                    <section className='block-content'>
                        <div className='block-title-container'>
                            <h1 className='block-title'>Contáctanos</h1>
                        </div>

                        <div className="d-grid-2-1fr gap-20">
                            <div className="d-flex-column gap-20">
                                <div className="d-flex-column gap-10">
                                    <p className="text">¿Problemas con algún producto?</p>
                                    <p className="text">¿Desear cotizar un dormitorio personalizado?</p>
                                    <p className="text">¿Buscas asesoría para tu compra?</p>
                                </div>

                                <div className="d-flex-column">
                                    <p className="text">En Homesleep estamos listos para ayudarte.</p>
                                    <p className="text">Nuestro equipo de atención al cliente está disponible de lunes a sábado de 8:00 a.m. a 8:00 p.m.</p>
                                </div>

                                <div className="canales-de-atencion d-flex-column gap-10">
                                    <p className="title">Canales de atención</p>
                                    <ul className="d-flex">
                                        <li>
                                            <img src="/assets/imagenes/iconos/telefono-blanco.svg" alt="" />
                                            <a href="tel: +51901451579" title="Teléfono | Homesleep">
                                                <p>901451579</p>
                                            </a>
                                        </li>
                                    </ul>

                                    <ul className="d-flex-column">
                                        <li>
                                            <img src="/assets/imagenes/iconos/telefono-blanco.svg" alt="" />
                                            <a href="/">
                                                <p>consultas@homesleep.pe</p>
                                            </a>
                                        </li>
                                    </ul>
                                </div>

                                <div className="d-flex-column gap-10">
                                    <p className="title">Siguenos</p>

                                    <ul className="social-networks">
                                        <li>
                                            <a href="https://www.facebook.com/homesleep.pe" title="Facebook">
                                                <img src="/assets/imagenes/iconos/facebook-blanco.svg" alt=""/>
                                                <p>Facebook</p>
                                            </a>
                                        </li>
                                        <li>
                                            <a href="https://www.tiktok.com/@homesleep.pe" title="Tik Tok">
                                                <img src="/assets/imagenes/iconos/tiktok-blanco.svg" alt=""/>
                                                <p>Tik Tok</p>
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            <form onSubmit={onSubmit} className="contact-form">

                                <fieldset>
                                    <label>Nombres</label>
                                    <span className="material-symbols-outlined">person</span>
                                    <input
                                        type="text"
                                        name="Nombres"
                                        value={formData.Nombres}
                                        onChange={handleChange}
                                    />
                                </fieldset>

                                <fieldset>
                                    <label>Teléfono</label>
                                    <span className="material-symbols-outlined">call</span>
                                    <input
                                        type="text"
                                        name="Telefono"
                                        value={formData.Telefono}
                                        onChange={handleChange}
                                        maxLength={9}
                                        inputMode="numeric"
                                    />
                                </fieldset>

                                <fieldset>
                                    <label>Correo electrónico</label>
                                    <span className="material-symbols-outlined">mail</span>
                                    <input
                                        type="text"
                                        name="Correo"
                                        value={formData.Correo}
                                        onChange={handleChange}
                                    />
                                </fieldset>

                                <fieldset>
                                    <label>Ciudad</label>
                                    <span className="material-symbols-outlined">location_on</span>
                                    <input
                                        type="text"
                                        name="Ciudad"
                                        value={formData.Ciudad}
                                        onChange={handleChange}
                                    />
                                </fieldset>

                                <fieldset>
                                    <label>Mensaje</label>
                                    <span className="material-symbols-outlined">message</span>
                                    <textarea
                                        name="Mensaje"
                                        value={formData.Mensaje}
                                        onChange={handleChange}
                                    />
                                </fieldset>

                                <div className="d-flex">
                                    <button type="submit" className="form-submit margin-left button-link button-link-2 gap-10">
                                        <p className="button-link-text">Enviar</p>
                                        <span className="material-icons">mail</span>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </section>
                </div>

                {snackbar.show && (
                    <div className="snackbar">
                        {snackbar.message}
                    </div>
                )}
            </main>
        </>
    );
}

export default Contacto;
