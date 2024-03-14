import { readdir, rename } from 'fs';
import { extname, join } from 'path';

// Directorio donde están los archivos MP3
// C:\\Users\\jhose\\Downloads\\maroyu
const directorio = 'E:\\America Pop';

// Leer archivos del directorio
readdir(directorio, (err, archivos) => {
  if (err) {
    console.error('Error al leer el directorio', err);
    return;
  }

  archivos.forEach(archivo => {
    // Verificar si el archivo es un MP3
    if (extname(archivo) === '.mp3') {
      // Nuevo nombre del archivo sin el texto específico
      const nuevoNombre = archivo.replace(/\[SPOTIFY-DOWNLOADER\.COM\] /g, '');

      // Renombrar el archivo
      rename(join(directorio, archivo), join(directorio, nuevoNombre), (err) => {
        if (err) {
          console.error(`Error al renombrar el archivo ${archivo}`, err);
        } else {
          console.log(`El archivo ${archivo} ha sido renombrado a ${nuevoNombre}`);
        }
      });
    }
  });
});
