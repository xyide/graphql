import DataLoader = require('dataloader');

export interface OrderedDataLoaderOptions<ID, Type> {
  propertyKey?: string;
  query: (keys: readonly ID[]) => Promise<Type[]>;
  typeName?: string;
  dataloaderConfig?: DataLoader.Options<ID, Type>;
}
