import './Descripcion.css';

function Descripcion({
    descripcionColchon = null,
    descripcionTipoDormitorio = null,
    descripcionCabecera = null,
    cargandoColchon = false,
    cargandoTipoDormitorio = false,
    cargandoCabecera = false 
    }) {

    const renderSeccionTipoDormitorio = () => {
        if (!descripcionTipoDormitorio && !cargandoTipoDormitorio) return null;
        
        return (
            <div className="seccion-tipo-dormitorio">
                {cargandoTipoDormitorio ? (
                    <div className="cargando-tipo-dormitorio">
                        <p>Cargando especificaciones del dormitorio...</p>
                    </div>
                ) : (
                    <>
                        {descripcionTipoDormitorio?.ficha && Array.isArray(descripcionTipoDormitorio.ficha) && (
                            <div className="d-flex-column gap-5">
                                <p className="sub-title color-color-1 uppercase">Box tarima</p>

                                <ul className="product-details">
                                    {descripcionTipoDormitorio.ficha.map((item, index) => {
                                        if (typeof item === 'object' && item !== null) {
                                            return Object.entries(item).map(([key, value], subIndex) => (
                                                <li key={`${index}-${subIndex}`}>
                                                    <div>
                                                        <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong>
                                                    </div>
                                                    <span className="valor-ficha">{value}</span>
                                                </li>
                                            ));
                                        }
                                        return null;
                                    })}
                                </ul>
                            </div>
                        )}
                    </>
                )}
            </div>
        );
    };

    const renderSeccionCabecera = () => {
        if (!descripcionCabecera && !cargandoCabecera) return null;

        return (
            <div className="seccion-cabecera">
                {cargandoCabecera ? (
                    <div className="cargando-cabecera">
                        <p>Cargando especificaciones de la cabecera...</p>
                    </div>
                ) : (
                    <>
                        {descripcionCabecera?.ficha && Array.isArray(descripcionCabecera.ficha) && (
                            <div className="d-flex-column gap-5">
                                <p className="title color-color-1 uppercase">Cabecera</p>

                                <div className="product-details">
                                    {descripcionCabecera.ficha.map((item, index) => {
                                        if (typeof item === 'object' && item !== null) {
                                            return Object.entries(item).map(([key, value], subIndex) => (
                                                <ul>
                                                    <li key={`${index}-${subIndex}`}>
                                                        <div>
                                                            <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong>
                                                        </div>
                                                        <div>
                                                            <p>{value}</p>
                                                        </div>
                                                    </li>
                                                </ul>
                                            ));
                                        }
                                        return null;
                                    })}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        );
    };

    const renderSeccionColchon = () => {
        if (!descripcionColchon && !cargandoColchon) return null;
        
        return(
            <div className="seccion-colchon-detalle">                
                {cargandoColchon ? (
                    <div className="cargando-colchon">
                        <p>Cargando detalles del colchón...</p>
                    </div>
                ) : (
                    <>
                        {descripcionColchon?.ficha?.length > 0 && (
                            <div className="d-flex-column gap-5">
                                <p className='title uppercase color-color-1'>Colchón</p>

                                <div className="product-details">
                                    {descripcionColchon.ficha.map((item, index) => (
                                        <ul key={index}>
                                            {Object.entries(item).map(([key, value]) => (
                                                <li key={key}>
                                                    <div>
                                                        <strong>{key.replace(/-/g, ' ')}:</strong>
                                                    </div>
                                                    <div>
                                                        <p>{value}</p>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        );
    };

    const renderMensajesColchon = () => {
        if (!descripcionColchon?.mensajes || !Array.isArray(descripcionColchon.mensajes) || descripcionColchon.mensajes.length === 0) {
            return null;
        }

        return (
            <div className="mensajes-colchon-container d-flex-column gap-10">
                <div className="contenido-mensajes">
                    {descripcionColchon.mensajes.map((mensaje, index) => (
                        <div key={index} className="mensaje-colchon">
                            <p>{mensaje}</p>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const tieneDescripcion = descripcionTipoDormitorio || descripcionCabecera || descripcionColchon;

    if (!tieneDescripcion) return null;

    return(
        <div className="product-page-description w-100 d-flex-column gap-20">
            <div className="d-flex-column">
                <p className="block-title uppercase color-color-1 margin-right">Descripción del producto</p>

                {renderMensajesColchon()}
            </div>

            <div className='d-flex-column gap-20'>
                {renderSeccionTipoDormitorio()}
                {renderSeccionColchon()}
                {renderSeccionCabecera()}
            </div>
        </div>
    );
}

export default Descripcion;
