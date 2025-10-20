import './Colores.css';

function Colores({ colorName = "Seleccionar color" }){
    return(
        <>
            <button type='button' className='product-page-color-select button-1'>
                <div className='d-flex-center-center gap-5'>
                    <img src='/assets/imagenes/colores/plus/iker/originales/gris-raton.png' alt=''/>
                    <p className='text'>{colorName}</p>
                </div>

                <span className="material-icons">keyboard_arrow_down</span>
            </button>
        </>
    )
}

export default Colores;
