import { Type } from '@nestjs/common';
import { ContextId } from '@nestjs/core';
import { DataLoaderGenerator } from './data-loader-generator.interface';
import DataLoader = require('dataloader');

export interface DataLoaderFactory {
  (contextId: ContextId, type: Type<DataLoaderGenerator<any, any>>): Promise<
    DataLoader<any, any>
  >;
}
