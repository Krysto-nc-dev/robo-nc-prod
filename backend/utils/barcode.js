import { createCanvas } from 'canvas';
import JsBarcode from 'jsbarcode';

/**
 * Génère un code-barre EAN-13 valide sous forme de buffer d'image.
 * @returns {Buffer} - Une image en buffer représentant le code-barre.
 */
const generateBarcodeImage = (code) => {
  const canvas = createCanvas();
  JsBarcode(canvas, code, {
    format: 'EAN13',
    displayValue: true,
    fontSize: 14,
    textMargin: 4,
  });

  // Retourne l'image en buffer
  return canvas.toBuffer('image/png');
};

/**
 * Génère un code-barre EAN-13 valide.
 * @returns {string} - Code-barre EAN-13.
 */
const generateBarcode = () => {
  // Génère une base de 12 chiffres aléatoires
  const base = Math.floor(Math.random() * 1000000000000).toString().padStart(12, '0');
  // Calcule le checksum pour produire un EAN-13 valide
  const checksum = calculateEAN13Checksum(base);
  return `${base}${checksum}`;
};

/**
 * Calcule la somme de contrôle d'un code-barre EAN-13.
 * @param {string} base - Les 12 premiers chiffres du code.
 * @returns {number} - Dernier chiffre du code EAN-13.
 */
const calculateEAN13Checksum = (base) => {
  const digits = base.split('').map(Number);
  const sum = digits.reduce(
    (acc, digit, index) => acc + digit * (index % 2 === 0 ? 1 : 3),
    0
  );
  const remainder = sum % 10;
  return remainder === 0 ? 0 : 10 - remainder;
};

export { generateBarcode, generateBarcodeImage };
