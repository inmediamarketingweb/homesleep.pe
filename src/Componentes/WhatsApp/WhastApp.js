// import './WhatsApp.css';

// function WhatsApp(){
//     return(
//         <>
//             <div className='wsp-contanier'>
//                 <div className='wsp-content'>
//                     <p>Contactar con un asesor</p>
//                 </div>
//             </div>

//             <a href='/' title='Contactar con un asaesor' className='wsp-button'>
//                 <i class="fa-brands fa-whatsapp"></i>
//             </a>
//         </>
//     )
// }

// export default WhatsApp;

import './WhatsApp.css';

function WhatsApp(){
    return(
        <>
            {/* Opción A: Si no funciona el selector ~, invierte el orden */}
            <a href='/' title='Contactar con un asesor' className='wsp-button'>
                <i className="fa-brands fa-whatsapp"></i>
            </a>

            <div className='wsp-contanier'>
                <div className='wsp-content'>
                    <p>Contactar con un asesor</p>
                </div>
            </div>
        </>
    )
}

export default WhatsApp;
