// import { useEffect, useState, useMemo } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import Helmet from 'react-helmet';
// import './Busqueda.css';
// import { Producto } from '../../Componentes/Plantillas/Producto/Producto';

// function Busqueda() {
//   const [productos, setProductos] = useState([]);
//   const location = useLocation();
//   const navigate = useNavigate();

//   // 1. Obtener parámetros de la URL (Mantenemos 'tamano' en la URL para evitar caracteres raros)
//   const queryParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
//   const queryParam = queryParams.get('query') || '';
//   const selectedTamano = queryParams.get('tamano') || ''; // Solo 1 tamaño a la vez
//   const selectedMarca = queryParams.get('marca') || '';   // Solo 1 marca a la vez
//   const sortParam = queryParams.get('orden') || 'relevancia';

//   const normalizeStr = (str = '') =>
//     str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

//   const slugify = (text) => normalizeStr(text).replace(/\s+/g, '-');

//   // 2. Cargar productos desde manifest
//   useEffect(() => {
//     const fetchProductos = async () => {
//       try {
//         const manifestResponse = await fetch('/assets/json/manifest.json');
//         if (!manifestResponse.ok) return;
//         const manifestData = await manifestResponse.json();
//         const archivos = manifestData.files || [];

//         const productosArrays = await Promise.all(
//           archivos.map(async (archivo) => {
//             try {
//               const res = await fetch(archivo);
//               if (!res.ok) return [];
//               const data = await res.json();
//               return data.productos || [];
//             } catch {
//               return [];
//             }
//           })
//         );
//         setProductos(productosArrays.flat());
//       } catch (error) {
//         console.error('Error al cargar productos:', error);
//       }
//     };
//     fetchProductos();
//   }, []);

//   // 3. Búsqueda por texto base
//   const searchBaseProducts = useMemo(() => {
//     if (!queryParam.trim()) return productos;
//     const tokens = normalizeStr(queryParam).split(' ').filter(Boolean);
//     return productos.filter((p) => {
//       const nom = normalizeStr(p.nombre);
//       const sku = normalizeStr(p.sku);
//       const cat = normalizeStr(p.categoria);
//       const sub = normalizeStr(p.subCategoria);
//       return tokens.every(
//         (t) => nom.includes(t) || sku.includes(t) || cat.includes(t) || sub.includes(t)
//       );
//     });
//   }, [productos, queryParam]);

//   // 4. Opciones de filtros dinámicos (Tamaños y Marcas)
//   const availableFilters = useMemo(() => {
//     const tamanosSet = new Map();
//     const marcasSet = new Map();

//     searchBaseProducts.forEach((p) => {
//       // AQUÍ ESTÁ EL CAMBIO: p.tamaño con "ñ"
//       if (p.tamaño) tamanosSet.set(slugify(p.tamaño), p.tamaño);
//       if (p.marca) marcasSet.set(slugify(p.marca), p.marca);
//     });

//     return {
//       tamanos: Array.from(tamanosSet.entries()).map(([slug, label]) => ({ slug, label })),
//       marcas: Array.from(marcasSet.entries()).map(([slug, label]) => ({ slug, label })),
//     };
//   }, [searchBaseProducts]);

//   // 5. Aplicar Filtros Seleccionados + Ordenamiento
//   const finalProducts = useMemo(() => {
//     let result = searchBaseProducts.filter((p) => {
//       // AQUÍ ESTÁ EL CAMBIO: p.tamaño con "ñ"
//       const matchTamano = !selectedTamano || slugify(p.tamaño || '') === selectedTamano;
//       const matchMarca = !selectedMarca || slugify(p.marca || '') === selectedMarca;
//       return matchTamano && matchMarca;
//     });

//     if (sortParam === 'asc') {
//       result.sort((a, b) => (Number(a.precio) || 0) - (Number(b.precio) || 0));
//     } else if (sortParam === 'desc') {
//       result.sort((a, b) => (Number(b.precio) || 0) - (Number(a.precio) || 0));
//     }

//     return result;
//   }, [searchBaseProducts, selectedTamano, selectedMarca, sortParam]);

//   // 6. Selección Exclusiva: si se activa 1, se desactiva el otro del mismo grupo
//   const handleFilterToggle = (key, slugValue) => {
//     const newParams = new URLSearchParams(location.search);
//     const currentValue = newParams.get(key);

//     if (currentValue === slugValue) {
//       newParams.delete(key); // Desactivar si vuelve a hacer clic
//     } else {
//       newParams.set(key, slugValue); // Reemplazar valor anterior por el nuevo
//     }

//     navigate(`?${newParams.toString()}`);
//   };

//   const handleSortChange = (e) => {
//     const newParams = new URLSearchParams(location.search);
//     newParams.set('orden', e.target.value);
//     navigate(`?${newParams.toString()}`);
//   };

//   const truncate = (str = '', maxLength) =>
//     str.length <= maxLength ? str : str.slice(0, maxLength) + '...';

//   return (
//     <>
//       <Helmet>
//         <title>{queryParam ? `${queryParam} | Homesleep` : 'Catálogo | Homesleep'}</title>
//         <meta name="description" content="Resultados de búsqueda" />
//       </Helmet>

//       <main className="main">
//         <div className="block-container">
//           <section className="block-content d-flex-column gap-10">
//             <div className="banner-link-img-100w">
//               <img src="/assets/imagenes/paginas/pagina-principal/slider/slider-2.webp" alt="Banner" />
//             </div>

//             <div className="page-search-container">
//               {/* PANEL DE FILTROS LATERAL */}
//               <div className="page-search-left">
//                 <div className="pg-search-filters">
                  
//                   {/* Filtro Tamaño */}
//                   {availableFilters.tamanos.length > 0 && (
//                     <div className="pg-search-fl-tag">
//                       <p className="title text">Tamaño</p>
//                       <ul>
//                         {availableFilters.tamanos.map(({ slug, label }) => {
//                           const isChecked = selectedTamano === slug;
//                           return (
//                             <li key={slug}>
//                               <button
//                                 type="button"
//                                 onClick={() => handleFilterToggle('tamano', slug)}
//                               >
//                                 <input
//                                   type="checkbox"
//                                   checked={isChecked}
//                                   readOnly
//                                 />
//                                 <p className="text">{label}</p>
//                               </button>
//                             </li>
//                           );
//                         })}
//                       </ul>
//                     </div>
//                   )}

//                   {/* Filtro Marcas */}
//                   {availableFilters.marcas.length > 0 && (
//                     <div className="pg-search-fl-tag">
//                       <p className="title text">Marcas</p>
//                       <ul>
//                         {availableFilters.marcas.map(({ slug, label }) => {
//                           const isChecked = selectedMarca === slug;
//                           return (
//                             <li key={slug}>
//                               <button
//                                 type="button"
//                                 onClick={() => handleFilterToggle('marca', slug)}
//                               >
//                                 <input
//                                   type="checkbox"
//                                   checked={isChecked}
//                                   readOnly
//                                 />
//                                 <p className="text">{label}</p>
//                               </button>
//                             </li>
//                           );
//                         })}
//                       </ul>
//                     </div>
//                   )}

//                 </div>
//               </div>

//               {/* LISTA DE RESULTADOS DE PRODUCTOS */}
//               <div className="page-search-right">
//                 <div className="pg-search-results">
//                   {finalProducts.length > 0 ? (
//                     <ul>
//                       {finalProducts.map((producto) => (
//                         <Producto
//                           key={producto.sku}
//                           producto={producto}
//                           truncate={truncate}
//                         />
//                       ))}
//                     </ul>
//                   ) : (
//                     <p className="text p-20">No se encontraron productos con los filtros seleccionados.</p>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </section>
//         </div>
//       </main>
//     </>
//   );
// }

// export default Busqueda;

import { useEffect, useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Helmet from 'react-helmet';
import './Busqueda.css';
import { Producto } from '../../Componentes/Plantillas/Producto/Producto';

function Busqueda() {
  const [productos, setProductos] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  // 1. Obtener parámetros de la URL
  const queryParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const queryParam = queryParams.get('query') || '';
  const selectedTamano = queryParams.get('tamano') || ''; 
  const selectedMarca = queryParams.get('marca') || '';   
  const sortParam = queryParams.get('orden') || 'relevancia';

  // BLINDAJE 1: Convertir a String y usar trim() para evitar errores si recibe números o espacios extra
  const normalizeStr = (str) => {
    if (!str) return '';
    return String(str)
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
  };

  const slugify = (text) => normalizeStr(text).replace(/\s+/g, '-');

  // BLINDAJE 2: Función segura para obtener el tamaño/marca (cubre posibles variaciones de mayúsculas en el JSON)
  const getTamano = (p) => p.tamaño || p.Tamaño || p.tamano || p.Tamano || '';
  const getMarca = (p) => p.marca || p.Marca || '';

  // 2. Cargar productos desde manifest
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const manifestResponse = await fetch('/assets/json/manifest.json');
        if (!manifestResponse.ok) return;
        const manifestData = await manifestResponse.json();
        const archivos = manifestData.files || [];

        const productosArrays = await Promise.all(
          archivos.map(async (archivo) => {
            try {
              const res = await fetch(archivo);
              if (!res.ok) return [];
              const data = await res.json();
              return data.productos || [];
            } catch {
              return [];
            }
          })
        );
        setProductos(productosArrays.flat());
      } catch (error) {
        console.error('Error al cargar productos:', error);
      }
    };
    fetchProductos();
  }, []);

  // 3. Búsqueda por texto base
  const searchBaseProducts = useMemo(() => {
    if (!queryParam.trim()) return productos;
    const tokens = normalizeStr(queryParam).split(' ').filter(Boolean);
    return productos.filter((p) => {
      const nom = normalizeStr(p.nombre);
      const sku = normalizeStr(p.sku);
      const cat = normalizeStr(p.categoria);
      const sub = normalizeStr(p.subCategoria);
      return tokens.every(
        (t) => nom.includes(t) || sku.includes(t) || cat.includes(t) || sub.includes(t)
      );
    });
  }, [productos, queryParam]);

  // 4. Opciones de filtros dinámicos
  const availableFilters = useMemo(() => {
    const tamanosSet = new Map();
    const marcasSet = new Map();

    searchBaseProducts.forEach((p) => {
      const t = getTamano(p);
      const m = getMarca(p);
      
      if (t) tamanosSet.set(slugify(t), t);
      if (m) marcasSet.set(slugify(m), m);
    });

    return {
      tamanos: Array.from(tamanosSet.entries()).map(([slug, label]) => ({ slug, label })),
      marcas: Array.from(marcasSet.entries()).map(([slug, label]) => ({ slug, label })),
    };
  }, [searchBaseProducts]);

  // 5. Aplicar Filtros Seleccionados + Ordenamiento
  const finalProducts = useMemo(() => {
    let result = searchBaseProducts.filter((p) => {
      const t = getTamano(p);
      const m = getMarca(p);

      const matchTamano = !selectedTamano || slugify(t) === selectedTamano;
      const matchMarca = !selectedMarca || slugify(m) === selectedMarca;
      
      return matchTamano && matchMarca;
    });

    if (sortParam === 'asc') {
      result.sort((a, b) => (Number(a.precio) || 0) - (Number(b.precio) || 0));
    } else if (sortParam === 'desc') {
      result.sort((a, b) => (Number(b.precio) || 0) - (Number(a.precio) || 0));
    }

    return result;
  }, [searchBaseProducts, selectedTamano, selectedMarca, sortParam]);

  // 6. Selección Exclusiva y Actualización segura de URL
  const handleFilterToggle = (key, slugValue) => {
    const newParams = new URLSearchParams(location.search);
    const currentValue = newParams.get(key);

    if (currentValue === slugValue) {
      newParams.delete(key); 
    } else {
      newParams.set(key, slugValue); 
    }

    // Usar sintaxis segura de React Router v6
    navigate({ search: newParams.toString() });
  };

  const handleSortChange = (e) => {
    const newParams = new URLSearchParams(location.search);
    newParams.set('orden', e.target.value);
    navigate({ search: newParams.toString() });
  };

  const truncate = (str = '', maxLength) =>
    str.length <= maxLength ? str : str.slice(0, maxLength) + '...';

  return (
    <>
      <Helmet>
        <title>{queryParam ? `${queryParam} | Homesleep` : 'Catálogo | Homesleep'}</title>
        <meta name="description" content="Resultados de búsqueda" />
      </Helmet>

      <main className="main">
        <div className="block-container">
          <section className="block-content d-flex-column gap-10">
            <div className="banner-link-img-100w">
              <img src="/assets/imagenes/paginas/pagina-principal/slider/slider-2.webp" alt="Banner" />
            </div>

            <div className="page-search-container">
              {/* PANEL DE FILTROS LATERAL */}
              <div className="page-search-left">
                <div className="pg-search-filters">
                  
                  {/* Filtro Tamaño */}
                  {availableFilters.tamanos.length > 0 && (
                    <div className="pg-search-fl-tag">
                      <p className="title text">Tamaño</p>
                      <ul>
                        {availableFilters.tamanos.map(({ slug, label }) => {
                          const isChecked = selectedTamano === slug;
                          return (
                            <li key={slug}>
                              <button
                                type="button"
                                onClick={() => handleFilterToggle('tamano', slug)}
                              >
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  readOnly
                                />
                                <p className="text">{label}</p>
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}

                  {/* Filtro Marcas */}
                  {availableFilters.marcas.length > 0 && (
                    <div className="pg-search-fl-tag">
                      <p className="title text">Marcas</p>
                      <ul>
                        {availableFilters.marcas.map(({ slug, label }) => {
                          const isChecked = selectedMarca === slug;
                          return (
                            <li key={slug}>
                              <button
                                type="button"
                                onClick={() => handleFilterToggle('marca', slug)}
                              >
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  readOnly
                                />
                                <p className="text">{label}</p>
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}

                </div>
              </div>

              {/* LISTA DE RESULTADOS DE PRODUCTOS */}
              <div className="page-search-right">
                <div className="pg-search-results">
                  {finalProducts.length > 0 ? (
                    <ul>
                      {finalProducts.map((producto, index) => (
                        <Producto
                          // BLINDAJE 4: Combinar SKU e Index fuerza a React a eliminar componentes viejos al filtrar
                          key={`${producto.sku}-${index}`}
                          producto={producto}
                          truncate={truncate}
                        />
                      ))}
                    </ul>
                  ) : (
                    <p className="text p-20">No se encontraron productos con los filtros seleccionados.</p>
                  )}
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}

export default Busqueda;
