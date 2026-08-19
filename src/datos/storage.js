const CLAVE_VERSION = 'workhoy_seed_version';

export function leerStorage(clave, valorInicial) {
  try {
    const guardado = localStorage.getItem(clave);
    return guardado ? JSON.parse(guardado) : valorInicial;
  } catch {
    return valorInicial;
  }
}

export function guardarStorage(clave, valor) {
  localStorage.setItem(clave, JSON.stringify(valor));
}

export function tieneVersion(version) {
  try {
    return localStorage.getItem(CLAVE_VERSION) === String(version);
  } catch {
    return false;
  }
}

export function guardarVersion(version) {
  try {
    localStorage.setItem(CLAVE_VERSION, String(version));
  } catch {

  }
}