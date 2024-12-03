// utils/formatIpAddress.js

/**
 * Formate une adresse IP pour convertir "::1" (IPv6 localhost) en "127.0.0.1" (IPv4 localhost).
 * @param {string} ip - L'adresse IP à formater
 * @returns {string} - L'adresse IP formatée
 */
const formatIpAddress = (ip) => {
    return ip === "::1" ? "127.0.0.1" : ip || "IP inconnue";
  };
  
  export default formatIpAddress;
  