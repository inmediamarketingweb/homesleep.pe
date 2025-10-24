import './Descripcion.css';

function Descripcion({ producto, descripciones, mensajes }){
    const formatKey = (key) => key.replace(/-/g, ' ');

    if(descripciones && descripciones.length > 0){
        return(
            <div className='d-flex-column gap-20'>
                {mensajes && mensajes.length > 0 && (
                    <div className='mensajes-section'>
                        <ul>
                            {mensajes.map((grupo, index) => (
                                <div key={index} className='d-flex-column'>
                                    <p className='block-title uppercase color-gray-4 margin-right w-auto'>{grupo.titulo}</p>
                                    <ul>
                                        {grupo.mensajes.map((mensaje, idx) => (
                                            <li key={`${index}-${idx}`}>
                                                <p className='text'>{mensaje}</p>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </ul>
                    </div>
                )}

                <div className='d-flex w-100'>
                    <div className='product-details'>
                        <p className='title uppercase color-color-1'>Detalles</p>
                        <ul>
                            <li>
                                <div>
                                    <strong>SKU:</strong>
                                </div>
                                <div>
                                    <p className='text'>{producto.sku}</p>
                                </div>
                            </li>
                            {producto['detalles-del-producto'] && producto['detalles-del-producto'].map((detalle, index) =>
                                Object.entries(detalle).map(([key, value]) => (
                                    <li key={`${index}-${key}`}>
                                        <div>
                                            <strong>{formatKey(key)}:</strong>
                                        </div>
                                        <div>
                                            <p className='text'>{value}</p>
                                        </div>
                                    </li>
                                ))
                            )}
                        </ul>
                    </div>
                </div>

                <div className='product-descripcion'>
                    <div className='d-flex-column gap-20'>
                        <div className='d-flex d-flex-wrap gap-10'>
                            {descripciones.map((grupo, index) => (
                                <div className='product-details' key={index}>
                                    <p className='title uppercase color-color-1'>{grupo.titulo}</p>
                                    <ul>
                                        {grupo.descripcion.map(
                                            (item, idx) => Object.entries(item).map(([key, value]) => (
                                                <li key={`${idx}-${key}`}>
                                                    <div>
                                                        <strong>{formatKey(key)}:</strong>
                                                    </div>
                                                    <div>
                                                        <p className='text'>{value}</p>
                                                    </div>
                                                </li>
                                            ))
                                        )}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    else if (producto?.descripcion) {
        return(
            <div className='d-grid-2-1fr gap-20'>
                {mensajes && mensajes.length > 0 && (
                    <div className='mensajes-section'>
                        <h4 className='title'>Mensajes:</h4>
                        <ul>
                            {mensajes.map((grupo, index) => (
                                <div key={index}>
                                    <h5>{grupo.titulo}</h5>
                                    <ul>
                                        {grupo.mensajes.map((mensaje, idx) => (
                                            <li key={`${index}-${idx}`}>
                                                <p className='text'>{mensaje}</p>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </ul>
                    </div>
                )}

                <div className='d-flex-column w-100'>
                    <div className='w-100 product-details d-flex-column gap-20 margin-bottom'>
                        <h4 className='title'>Detalles del producto:</h4>
                        <ul>
                            <li>
                                <div>
                                    <strong>SKU:</strong>
                                </div>
                                <div>
                                    <p className='text'>{producto.sku}</p>
                                </div>
                            </li>
                            {producto['detalles-del-producto'] && producto['detalles-del-producto'].map(
                                (detalle, index) => Object.entries(detalle).map(([key, value]) => (
                                    <li key={`${index}-${key}`}>
                                        <div>
                                            <strong>{formatKey(key)}:</strong>
                                        </div>
                                        <div>
                                            <p className='text'>{value}</p>
                                        </div>
                                    </li>
                                ))
                            )}
                        </ul>
                    </div>
                </div>

                <div className='d-flex-column gap-20'>
                    <h4 className='title'>Descripción del producto:</h4>
                    <ul className='descripcion-list descripcion-list-1'>
                        {producto.descripcion.map(
                            (item, index) => Object.entries(item).map(([key, value]) => (
                                <li key={`${index}-${key}`}>
                                    <div>
                                        <strong>{formatKey(key)}:</strong>
                                    </div>
                                    <div>
                                        <p className='text'>{value}</p>
                                    </div>
                                </li>
                            ))
                        )}
                    </ul>
                </div>
            </div>
        );
    }

    return null;
}

export default Descripcion;
