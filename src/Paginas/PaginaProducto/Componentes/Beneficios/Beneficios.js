// import './Beneficios.css';

// function Beneficios(){
//     return(
//         <div className='product-page-beneficts'>
//             <div>
//                 <div className='d-flex-column'>
//                     <p>Compras</p>
//                     <p>seguras</p>
//                 </div>
//                 <span className="material-icons">verified_user</span>
//             </div>
//             <div>
//                 <div className='d-flex-column'>
//                     <p>Envios</p>
//                     <p>inmediatos</p>
//                 </div>
//                 <span className="material-icons">local_shipping</span>
//             </div>
//             <div>
//                 <div className='d-flex-column'>
//                     <p>Entregas</p>
//                     <p>seguras</p>
//                 </div>
//                 <span className="material-icons">inventory_2</span>
//             </div>
//             <div>
//                 <div className='d-flex-column'>
//                     <p>Con</p>
//                     <p>garantía</p>
//                 </div>
//                 <span className="material-icons">verified</span>
//             </div>
//         </div>
//     )
// }

// export default Beneficios;

import './Beneficios.css';

function Beneficios(){
    return(
        <ul className='benefist-container'>
            <li>
                <span class="material-symbols-outlined fill-1">shield</span>
                <p className='text'>Compra segura</p>
            </li>
            <li>
                <span class="material-symbols-outlined fill-1">delivery_truck_speed</span>
                <p className='text'>Envíos inmediatos</p>
            </li>
            <li>
                <span class="material-symbols-outlined fill-1">package_2</span>
                <p className='text'>Entrega segura</p>
            </li>
            <li>
                <span class="material-symbols-outlined fill-1">verified</span>
                <p className='text'>Incluye garantía</p>
            </li>
        </ul>
    )
}

export default Beneficios;
