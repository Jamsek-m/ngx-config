/**
 * Options for initialization method of Config Service
 */
export interface ConfigInitOptions<E> {
    /**
     * Path to JSON file with configuration.
     */
    path?: string;
    /**
     * Configuration object that matches structure of environment
     */
    configuration?: any;
    /**
     * Angular environment object
     */
    environment: E;
}
