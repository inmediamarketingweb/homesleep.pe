import Helmet from 'react-helmet';

import './Manual.css';

function Manual(){
    return(
        <>
            <Helmet>
                <title>Manual de instalación | Homesleep</title>
            </Helmet>

            <main>
                <div className='block-container'>
                    <section className='block-content'>
                        <embed src="/assets/manual-de-instalacion.pdf" type="application/pdf" width="100%" height="1000px"/>
                    </section>
                </div>
            </main>
        </>
    )
}

export default Manual;
