export const BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://api.robot-nc.com'
  : 'http://localhost:4000';

export const USERS_URL = `${BASE_URL}/users`;
export const ZONES_URL = `${BASE_URL}/zones`;
export const AGENTS_URL = `${BASE_URL}/agents`;
export const INVENTORIES_URL = `${BASE_URL}/inventories`;
export const RECORDS_URL = `${BASE_URL}/records`;

export const DOLIBAR_URL = 'https://krystotest-erp.square.nc/api/index.php';
export const DOLIBARR_API_KEY = 'eqhTZrONIar69OQ16r3I0861z3BtOsRe';
