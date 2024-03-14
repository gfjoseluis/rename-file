import { readdir, rename } from 'fs';
import { join } from 'path';

// Directorio donde se encuentran los archivos
// E:\\America Pop
const directorio = '-directorio';

// Leer los archivos del directorio
readdir(directorio, (err, archivos) => {
  if (err) {
    return console.error(err);
  }

  archivos.forEach(archivo => {
    // Construir la ruta completa del archivo actual
    const rutaActual = join(directorio, archivo);
    // Construir la nueva ruta con la extensión .mp3
    const nuevaRuta = rutaActual + '.mp3';

    // Renombrar el archivo para agregar la extensión .mp3
    rename(rutaActual, nuevaRuta, (err) => {
      if (err) {
        return console.error(err);
      }
      console.log(`El archivo ${archivo} ha sido renombrado a ${nuevaRuta}`);
    });
  });
});
