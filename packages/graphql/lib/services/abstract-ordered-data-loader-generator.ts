import DataLoader = require('dataloader');
import { DataLoaderGenerator } from '../interfaces/data-loader-generator.interface';
import { OrderedDataLoaderOptions } from '../interfaces/ordered-data-loader-options.interface';

export abstract class OrderedDataLoaderGenerator<ID, Type>
  implements DataLoaderGenerator<ID, Type>
{
  protected abstract getOptions: () => OrderedDataLoaderOptions<ID, Type>;

  public generateDataLoader() {
    return this.createLoader(this.getOptions());
  }

  protected createLoader(
    options: OrderedDataLoaderOptions<ID, Type>,
  ): DataLoader<ID, Type> {
    const defaultTypeName = this.constructor.name.replace('Loader', '');
    return new DataLoader<ID, Type>(async (keys) => {
      return this.ensureOrder({
        docs: await options.query(keys),
        keys,
        prop: options.propertyKey || 'id',
        error: (keyValue) =>
          `${options.typeName || defaultTypeName} does not exist (${keyValue})`,
      });
    }, options.dataloaderConfig);
  }

  // https://github.com/graphql/dataloader/issues/66#issuecomment-386252044
  private ensureOrder = (options) => {
    const {
      docs,
      keys,
      prop,
      error = (key) => `Document does not exist (${key})`,
    } = options;
    // Put documents (docs) into a map where key is a document's ID or some
    // property (prop) of a document and value is a document.
    const docsMap = new Map();
    docs.forEach((doc) => docsMap.set(doc[prop], doc));
    // Loop through the keys and for each one retrieve proper document. For not
    // existing documents generate an error.
    return keys.map((key) => {
      return (
        docsMap.get(key) ||
        new Error(typeof error === 'function' ? error(key) : error)
      );
    });
  };
}
