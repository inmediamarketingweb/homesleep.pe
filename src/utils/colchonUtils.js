// utils/colchonUtils.js
export async function obtenerDescripcionColchonDesdeNombre(nombreProductoCompleto) {
  // Extraer la parte del colchón del nombre completo
  const extraerNombreColchon = (nombreCompleto) => {
    // Buscar patrones como "COLCHÓN EL CISNE POCKET PLUS"
    const regex = /COLCHÓN\s+([A-Z\s]+?(?=\s*\+|\s*-|$))/i;
    const match = nombreCompleto.match(regex);
    
    if (match && match[1]) {
      return match[1].trim(); // Ej: "EL CISNE POCKET PLUS"
    }
    
    return null;
  };

  // Convertir nombre a ruta de archivo
  const convertirNombreARuta = (nombreColchon) => {
    if (!nombreColchon) return null;
    
    // Ejemplo: "EL CISNE POCKET PLUS KING" → "/assets/json/categorias/colchones/king/el-cisne/pocket-plus.json"
    const partes = nombreColchon.toLowerCase().split(' ');
    
    // Extraer tamaño (king, queen, etc.)
    const tamanos = ['king', 'queen', 'twin', 'full'];
    const tamaño = partes.find(p => tamanos.includes(p));
    
    // Extraer marca
    const marcas = ['el-cisne', 'otra-marca'];
    let marca = 'el-cisne'; // default
    
    // Buscar "el cisne" en el nombre
    if (partes.includes('el') && partes.includes('cisne')) {
      marca = 'el-cisne';
    }
    
    // Extraer modelo
    let modelo = '';
    if (partes.includes('pocket') && partes.includes('plus')) {
      modelo = 'pocket-plus';
    } else if (partes.includes('pocket')) {
      modelo = 'pocket';
    }
    // Agregar más modelos según necesites
    
    if (tamaño && marca && modelo) {
      return `/assets/json/categorias/colchones/${tamaño}/${marca}/${modelo}.json`;
    }
    
    return null;
  };

  try {
    // 1. Extraer nombre del colchón
    const nombreColchon = extraerNombreColchon(nombreProductoCompleto);
    
    if (!nombreColchon) {
      console.warn('No se encontró nombre de colchón en:', nombreProductoCompleto);
      return null;
    }

    // 2. Convertir a ruta
    const rutaColchon = convertirNombreARuta(nombreColchon);
    
    if (!rutaColchon) {
      console.warn('No se pudo convertir a ruta:', nombreColchon);
      return null;
    }

    // 3. Cargar el archivo JSON del colchón
    const respuesta = await fetch(rutaColchon);
    
    if (!respuesta.ok) {
      throw new Error(`Error al cargar ${rutaColchon}: ${respuesta.status}`);
    }
    
    const datosColchon = await respuesta.json();
    
    // 4. Retornar solo lo que necesitas (ficha y mensajes)
    return {
      ficha: datosColchon.ficha || [],
      mensajes: datosColchon.mensajes || []
    };
    
  } catch (error) {
    console.error('Error al obtener descripción del colchón:', error);
    return null;
  }
}