import './Filtros.css';

function Filtros(){
    return(
        <>
            <div className='d-flex-column gap-10'>
                <p className='title'>Filtros</p>

                <div>
                    <div>
                        <p className='sub-title'>Cajon</p>

                        <ul>
                            <li>
                                <p>Claros</p>
                            </li>
                            <li>
                                <p>Oscuros</p>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Filtros;
