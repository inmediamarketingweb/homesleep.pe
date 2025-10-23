import './Cantidad.css';

function Cantidad(){
    return(
        <div className='product-page-quantity d-grid-auto-1fr'>
            <input type='number' placeholder='1'/>
            <div className='d-flex-column'>
                <button type='button'>+</button>
                <button type='button'>-</button>
            </div>
        </div>
    )
}

export default Cantidad;
