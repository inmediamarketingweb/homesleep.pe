import { useState, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import './EnviosAProvincia.css';

function EnviosAProvincia() {
    const [envios, setEnvios] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedEnvio, setSelectedEnvio] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [selectedYear, setSelectedYear] = useState('todos');
    const [availableYears, setAvailableYears] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const loadEnvios = async () => {
            try {
                const response = await fetch('/assets/json/paginas/envios/envios-a-provincia.json');
                
                if (!response.ok) {
                    throw new Error('Error al cargar los datos');
                }

                const data = await response.json();
                const enviosPlano = [];
                const years = [];

                data.forEach(anioData => {
                    const anio = Object.keys(anioData)[0];
                    const enviosDelAnio = anioData[anio];

                    if (!years.includes(anio)) {
                        years.push(anio);
                    }

                    enviosDelAnio.forEach(envio => {
                        enviosPlano.push({
                            ...envio,
                            año: parseInt(anio)
                        });
                    });
                });

                const sortedData = enviosPlano.sort((a, b) => {
                    if (b.año !== a.año) {
                        return b.año - a.año;
                    }
                    return b.id - a.id;
                });

                setEnvios(sortedData);

                const sortedYears = years.sort((a, b) => parseInt(b) - parseInt(a));
                setAvailableYears(sortedYears);

                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
                console.error('Error cargando los envíos:', err);
            }
        };

        loadEnvios();
    }, []);

    useEffect(() => {
        if (!loading) {
            const yearParam = searchParams.get('año');
            const searchParam = searchParams.get('busqueda');

            if (yearParam) {
                setSelectedYear(yearParam);
            }

            if (searchParam) {
                setSearchTerm(searchParam);
            }
        }
    }, [loading, searchParams]);

    const updateUrlParams = (year, search) => {
        const params = new URLSearchParams();

        if (year && year !== 'todos') {
            params.set('año', year);
        }

        if (search) {
            params.set('busqueda', search);
        }

        navigate(`${location.pathname}?${params.toString()}`, { replace: true });
    };

    const handleSearchChange = (e) => {
        const newSearchTerm = e.target.value;
        setSearchTerm(newSearchTerm);
        updateUrlParams(selectedYear, newSearchTerm);
    };

    const handleYearFilter = (year) => {
        const newYear = year === selectedYear ? 'todos' : year;
        setSelectedYear(newYear);
        updateUrlParams(newYear, searchTerm);
    };

    const clearAllFilters = () => {
        setSearchTerm('');
        setSelectedYear('todos');
        navigate(location.pathname, { replace: true });
    };

    const hasActiveFilters = searchTerm || selectedYear !== 'todos';

    const openPopup = (envio) => {
        setSelectedEnvio(envio);
        setShowPopup(true);
        document.body.style.overflow = 'hidden';
    };

    const closePopup = () => {
        setShowPopup(false);
        setSelectedEnvio(null);
        document.body.style.overflow = 'auto';
    };

    const getPhotoUrls = (fotosPath) => {
        return {
            imgOne: `${fotosPath}1.jpg`,
            imgTwo: `${fotosPath}2.jpg`
        };
    };

    const filteredEnvios = envios.filter(envio => {
        const matchesSearch = envio.destino.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesYear = selectedYear === 'todos' || envio.año.toString() === selectedYear;
        return matchesSearch && matchesYear;
    });

    if (loading) {
        return (
            <main className='padding-20-to-0'>
                <div className='block-container'>
                    <div className='block-content d-flex-column gap-20'>
                        <div className='loading-message'>
                            Cargando información de envíos...
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className='padding-20-to-0'>
                <div className='block-container'>
                    <div className='block-content d-flex-column gap-20'>
                        <div className='error-message'>
                            Error: {error}
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    return(
        <>
            <main className='padding-20-to-0'>
                <div className='block-container'>
                    <div className='block-content d-flex-column gap-20'>
                        <div className='province-top-container'>
                            <div className='search-container'>
                                <input placeholder='Busca tu provincia o distrito' value={searchTerm} onChange={handleSearchChange} className='province-search-input'/>
                            </div>

                            <div className='d-flex-center-center gap-10'>
                                <div className='year-filters'>
                                    {availableYears.map(year => (
                                        <button 
                                            key={year} 
                                            type='button' 
                                            className={`year-filter-btn ${selectedYear === year.toString() ? 'active' : ''}`}
                                            onClick={() => handleYearFilter(year.toString())}
                                        >
                                            <p>{year}</p>
                                        </button>
                                    ))}
                                </div>

                                {hasActiveFilters && (
                                    <button 
                                        className='clear-filters-btn' 
                                        onClick={clearAllFilters} 
                                        title="Limpiar todos los filtros"
                                    >
                                        <span className="material-symbols-outlined">delete</span>
                                        <p>Limpiar filtros</p>
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className='province-content'>
                            {filteredEnvios.length === 0 ? (
                                <div className='no-results'>
                                    <p>
                                        {searchTerm 
                                            ? selectedYear === 'todos' 
                                                ? `No hay envíos para "${searchTerm}"`
                                                : `No hay envíos para "${searchTerm}" en el año ${selectedYear}`
                                            : selectedYear === 'todos'
                                                ? 'No hay envíos disponibles'
                                                : `No hay envíos en el año ${selectedYear}`
                                        }
                                    </p>
                                    <div className='no-results-actions'>
                                        <button className='clear-filters-btn-secondary' onClick={clearAllFilters}>
                                            <span className="material-symbols-outlined">refresh</span>
                                            Limpiar filtros y ver todos
                                        </button>
                                    </div>
                                    <img src="/assets/imagenes/otros/ser-el-primero.jpg" alt="Sé el primero de tu zona en tener un dormitorio King" />
                                </div>
                            ) : (
                                filteredEnvios.map((envio, index) => {
                                    const photos = getPhotoUrls(envio.fotos);
                                    return (
                                        <div 
                                            key={`${envio.año}-${envio.id}-${index}`} // Key única para evitar duplicados
                                            className={`province-tag province-tag-${(index % 3) + 1}`}
                                        >
                                            <div 
                                                className='province-tag-info'
                                                onClick={() => openPopup(envio)}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <div>
                                                    <span className="material-symbols-outlined">location_on</span>
                                                    <div>{envio.destino}</div>
                                                </div>
                                                <div>{envio.año}</div>
                                            </div>

                                            <img 
                                                src={photos.imgOne} 
                                                alt={`Envío a ${envio.destino} - Imagen 1`} 
                                                className='image-1'
                                                onClick={() => openPopup(envio)}
                                                style={{ cursor: 'pointer' }}
                                            />
                                            <img 
                                                src={photos.imgTwo} 
                                                alt={`Envío a ${envio.destino} - Imagen 2`} 
                                                className='image-2'
                                                onClick={() => openPopup(envio)}
                                                style={{ cursor: 'pointer' }}
                                            />
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>
            </main>

            {/* Popup */}
            <div className={`envios-layer ${showPopup ? 'active' : ''}`}
                onClick={(e) => {
                    if (e.target.classList.contains('envios-layer')) {
                        closePopup();
                    }
                }}
            ></div>

            <div className={`envios-pop-up ${showPopup ? 'active' : ''}`}>
                {selectedEnvio && (() => {
                    const photos = getPhotoUrls(selectedEnvio.fotos);
                    return (
                        <>
                            <button type="button" className='envios-pop-up-close' onClick={closePopup}>
                                <span className="material-symbols-outlined">close</span>
                            </button>

                            <div className='envios-pop-up-content'>
                                <div className='d-flex-column gap-10'>
                                    <div className='envios-pop-up-imagenes'>
                                        <ul>
                                            <li>
                                                <img src={photos.imgTwo} alt={`Envío a ${selectedEnvio.destino} - Imagen 2`} />
                                            </li>
                                            <li>
                                                <img src={photos.imgOne} alt={`Envío a ${selectedEnvio.destino} - Imagen 1`}/>
                                            </li>
                                        </ul>

                                        <button type='button' className='envios-pop-up-button envios-pop-up-button-1'>
                                            <span className="material-symbols-outlined">chevron_left</span>
                                        </button>

                                        <button type='button' className='envios-pop-up-button envios-pop-up-button-2'>
                                            <span className="material-symbols-outlined">chevron_right</span>
                                        </button>
                                    </div>
                                </div>

                                <div className='envios-pop-up-info'>
                                    <div className='info-item'>
                                        <span className="material-symbols-outlined rotate-270deg">line_end_circle</span>
                                        <div>
                                            <p className='info-label'>Destino</p>
                                            <p className='info-value'>{selectedEnvio.destino}</p>
                                        </div>
                                    </div>
                                    <div className='info-item'>
                                        <span className="material-symbols-outlined">local_shipping</span>
                                        <div>
                                            <p className='info-label'>Agencia</p>
                                            <p className='info-value'>{selectedEnvio.agencia}</p>
                                        </div>
                                    </div>
                                    <div className='info-item'>
                                        <span className="material-symbols-outlined">calendar_month</span>
                                        <div>
                                            <p className='info-label'>Año</p>
                                            <p className='info-value'>{selectedEnvio.año}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    );
                })()}
            </div>
        </>
    );
}

export default EnviosAProvincia;
