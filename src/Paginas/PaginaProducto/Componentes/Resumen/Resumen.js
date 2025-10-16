function Resumen({ producto }) {
    const propiedadesRequeridas = [
        "marca", 
        "tamaño", 
        "modelo-de-colchón", 
        "resortes",
        "modelo-de-cabecera"
    ];

    return (
        <div className='d-flex-column gap-10'>
            <p className='text title'>Resumen:</p>

            <ul className='product-page-resume'>
                {producto["detalles-del-producto"] && producto["detalles-del-producto"].map((detalle, index) => (
                    Object.entries(detalle).filter(
                        ([key, value]) => propiedadesRequeridas.includes(key) && value
                    )
                    .map(([key, value]) => (
                        <li key={key + index}>
                            <span className="material-icons">check</span>
                            <div>
                                <b>
                                    {
                                        key.replace(/-/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
                                    }:
                                </b>
                                <p className='text first-uppercase'>{value}</p>
                            </div>
                        </li>
                    ))
                ))}
            </ul>
        </div>
    );
}

export default Resumen;
