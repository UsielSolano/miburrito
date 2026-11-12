import { ZONAS_ENVIO } from '../data/zonasEnvio';

const normalizar = (str = '') =>
  str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // quita acentos
    .trim();

/**
 * Devuelve el registro de zona si hay match por CP + Colonia.
 * @returns {{ cp, colonia, zona, distancia, costo } | null}
 */
export const buscarZona = (cp, colonia) => {
  if (!cp || !colonia) return null;

  const cpLimpio = String(cp).trim();
  const coloniaLimpia = normalizar(colonia);

  // 1) match exacto (cp + colonia normalizada)
  const exacto = ZONAS_ENVIO.find(
    (z) => z.cp === cpLimpio && normalizar(z.colonia) === coloniaLimpia
  );
  if (exacto) return exacto;

  // 2) match por CP solo (si en ese CP todas las colonias cuestan lo mismo)
  const delCp = ZONAS_ENVIO.filter((z) => z.cp === cpLimpio);
  if (delCp.length > 0) {
    const costos = [...new Set(delCp.map((z) => z.costo))];
    if (costos.length === 1) {
      return { ...delCp[0], colonia: colonia };
    }
  }

  return null;
};

/**
 * Devuelve el costo de envío o null si no se encontró la zona.
 */
export const calcularCostoEnvio = (cp, colonia) => {
  const zona = buscarZona(cp, colonia);
  return zona ? zona.costo : null;
};
