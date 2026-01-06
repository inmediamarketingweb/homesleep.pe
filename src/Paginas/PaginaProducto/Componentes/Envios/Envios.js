import './Envios.css';

function Envios(){
    return(
        <div className='product-page-envios d-flex-column gap-5'>
            <p className='title uppercase color-color-1'>Datos de envío</p>

            <div className='d-flex-column gap-10'>
                <input type='text' placeholder='Ingresa tus nombres' className='input-name'/>

                <div className='product-page-envios-list-container'>
                    <input type='text' placeholder='Ingresa tu distrito'/>

                    <div className=''>
                        <ul>
                            <li>
                                <button type='button'>
                                    <div className='d-flex-column'>
                                        <p className='item-departament'>Departamento, provincia</p>
                                        <p className='text'>Distrito</p>
                                    </div>

                                    <span className="material-symbols-outlined">chevron_right</span>
                                </button>
                            </li>
                            <li>
                                <button type='button'>
                                    <div className='d-flex-column'>
                                        <p className='item-departament'>Departamento, provincia</p>
                                        <p className='text'>Distrito</p>
                                    </div>

                                    <span className="material-symbols-outlined">chevron_right</span>
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className='product-page-envios-list-container'>
                    <input type='text' placeholder='Seleccione agencia'/>

                    <div className=''>
                        <ul>
                            {/* <li>
                                <button type='button'>
                                    <p className='text'>Ingrese su distrito</p>
                                </button>
                            </li> */}
                            <li>
                                <button type='button'>
                                    <div className='d-flex-column'>
                                        <p className='item-departament'>Departamento, provincia</p>
                                        <p className='text'>Distrito</p>
                                    </div>

                                    <span className="material-symbols-outlined">chevron_right</span>
                                </button>
                            </li>
                            <li>
                                <button type='button'>
                                    <div className='d-flex-column'>
                                        <p className='item-departament'>Departamento, provincia</p>
                                        <p className='text'>Distrito</p>
                                    </div>

                                    <span className="material-symbols-outlined">chevron_right</span>
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Envios;
