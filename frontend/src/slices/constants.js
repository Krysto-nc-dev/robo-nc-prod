export const BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://api.robot-nc.com'
  : 'http://localhost:4000';

export const USERS_URL = `${BASE_URL}/users`;
export const ZONES_URL = `${BASE_URL}/zones`;
export const AGENTS_URL = `${BASE_URL}/agents`;
export const INVENTORIES_URL = `${BASE_URL}/inventories`;
export const FILLIALES_URL = `${BASE_URL}/filiales`;
export const LOGS_URL = `${BASE_URL}/logs`;
export const REPPORTGENERATORS_URL = `${BASE_URL}/repports-generator`;
export const TICKETS_URL = `${BASE_URL}/tickets`;
export const DOCUMENTS_URL = `${BASE_URL}/documents`;
export const REPPORTS_URL = `${BASE_URL}/reports`;
export const FOURNISSEURS_URL = `${BASE_URL}/qc-fournisseurs`;
export const ARTICLES_URL = `${BASE_URL}/qc-articles`;



export const DOLIBAR_URL = 'https://krystotest-erp.square.nc/api/index.php';
export const DOLIBARR_API_KEY = 'eqhTZrONIar69OQ16r3I0861z3BtOsRe';
