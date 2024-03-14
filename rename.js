import {promises as fs} from 'fs';
import {extname, join, basename, dirname} from 'path';
import readline from 'readline';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const question = (query) => new Promise(resolve => rl.question(query, resolve));

const filtrarArchivosPorExtension = (archivos, tipoArchivo) => archivos.filter(archivo => extname(archivo) === '.' + tipoArchivo);

const renombrarArchivos = async (archivos, directorio, texto, reemplazo, cadenaInicio, cadenaFinal) => {
    for (const archivo of archivos) {
        const nuevoNombre = generarNuevoNombre(archivo, texto, reemplazo, cadenaInicio, cadenaFinal);
        await renombrarArchivo(archivo, nuevoNombre, directorio);
    }
};

const generarNuevoNombre = (archivo, texto, reemplazo, cadenaInicio, cadenaFinal) => {
    let nuevoNombre = basename(archivo, extname(archivo));

    if (texto) {
        nuevoNombre = nuevoNombre.replace(texto, reemplazo || '').trim();
    }

    if (cadenaInicio) {
        nuevoNombre = cadenaInicio.trim() + (nuevoNombre ? ' ' : '') + nuevoNombre;
    }

    if (cadenaFinal) {
        nuevoNombre += (nuevoNombre ? ' ' : '') + cadenaFinal.trim();
    }

    nuevoNombre += extname(archivo);

    return nuevoNombre;
};

const renombrarArchivo = async (archivo, nuevoNombre, directorio) => {
    const rutaActual = join(directorio, archivo);
    const nuevaRuta = join(dirname(rutaActual), nuevoNombre);

    try {
        await fs.rename(rutaActual, nuevaRuta);
        console.log(`El archivo ${archivo} ha sido renombrado a ${nuevoNombre}`);
    } catch (err) {
        console.error('Error al renombrar el archivo', archivo, err);
    }
};

export const iniciarRenombrado = async () => {

    const respuesta = await question('¿Deseas cambiar nombres de archivos masivamente? (S/N): ');
    if (respuesta.toLowerCase() !== 's') {
        console.log('Proceso de cambio de nombres cancelado.');
        rl.close();
        return;
    }

    const directorio = await question('Introduce la ruta del directorio donde están los archivos: ');
    const texto = await question('Introduce el texto a reemplazar (deja en blanco si no quieres reemplazar texto): ');
    const reemplazo = await question('Introduce el texto de reemplazo (deja en blanco para eliminar el texto): ');
    const cadenaInicio = await question('Introduce la cadena que quieres agregar al inicio del nombre del archivo (deja en blanco si no quieres agregar texto al inicio): ');
    const cadenaFinal = await question('Introduce la cadena que quieres agregar al final del nombre del archivo (deja en blanco si no quieres agregar texto al final): ');
    let tipoArchivo = await question('Introduce el tipo de archivo que quieres renombrar (ej. mp3, pdf, etc): ');
    
    // Convertir el tipo de archivo a minúsculas
    tipoArchivo = tipoArchivo.toLowerCase();

    // Establecer por defecto "mp3" si no se proporciona ningún tipo de archivo
    if (!tipoArchivo) {
        tipoArchivo = 'mp3';
    }

    try {
        const archivos = await fs.readdir(directorio);
        const archivosFiltrados = filtrarArchivosPorExtension(archivos, tipoArchivo);
        await renombrarArchivos(archivosFiltrados, directorio, texto || '', reemplazo || '', cadenaInicio || '', cadenaFinal || '');
    } catch (err) {
        console.error('Error al leer el directorio', err);
    }

    rl.close();
};
