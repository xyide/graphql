import { Type } from '@nestjs/common';
import { ContextId, ContextIdFactory } from '@nestjs/core';
import DataLoader = require('dataloader');
import { DataLoaderFactory } from '../interfaces/data-loader-factory.interface';
import { DataLoaderGenerator } from '../interfaces/data-loader-generator.interface';

export const NEST_LOADER_CONTEXT_KEY = 'NEST_LOADER_CONTEXT_KEY';

export class DataLoaderContext {
  private readonly id: ContextId = ContextIdFactory.create();
  private readonly cache: Map<
    Type<DataLoaderGenerator<any, any>>,
    Promise<DataLoader<any, any>>
  > = new Map<
    Type<DataLoaderGenerator<any, any>>,
    Promise<DataLoader<any, any>>
  >();

  constructor(private readonly dataloaderFactory: DataLoaderFactory) {}

  async clearAll() {
    for (const loaderPromise of this.cache.values()) {
      const loader = await loaderPromise;
      loader.clearAll();
    }
  }

  getLoader(
    type: Type<DataLoaderGenerator<any, any>>,
  ): Promise<DataLoader<any, any>> {
    let loader = this.cache.get(type);
    if (!loader) {
      loader = this.dataloaderFactory(this.id, type);
      this.cache.set(type, loader);
    }

    return loader;
  }
}
