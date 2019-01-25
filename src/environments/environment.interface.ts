/** The runtime settings that are used across all components. */
export interface Environment {
  /** The runtime mode for the app */
  production: boolean;
  /** The API server address. */
  API_URL: string;
  /**
   * The key of the JWT that should be used to store the information about
   * JWT in Storage.
   */
  JWT_KEY: string;
  /**
   * The CAS server URL that verify the user and return a CAS ticket
   * to be verified.
   */
  CAS_LOGIN_URL: string;
  /** The URL that should be used to receive the CAS ticket. */
  SERVICE_URL: string;
  /** The authorization header will be set for requests to these domains. */
  WHITE_LIST_DOMAINS: string[];
  /** How many items in one page. */
  PAGINATION_SIZE: number;
}

