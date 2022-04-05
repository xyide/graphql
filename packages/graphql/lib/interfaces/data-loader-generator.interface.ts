import DataLoader = require('dataloader');

/**
 * This interface will be used to generate the initial data loader.
 * The concrete implementation should be added as a provider to your module.
 */
export interface DataLoaderGenerator<ID, Type> {
  /**
   * Should return a new instance of dataloader each time
   */
  generateDataLoader(): DataLoader<ID, Type>;
}
