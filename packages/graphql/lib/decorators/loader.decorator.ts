import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
  Type,
} from '@nestjs/common';
import DataLoader = require('dataloader');
import { DataLoaderGenerator } from '../interfaces/data-loader-generator.interface';
import { getDataLoaderContext } from '../services/data-loader-context.util';

export const Loader = createParamDecorator(
  // tslint:disable-next-line: ban-types
  (
    data: Type<DataLoaderGenerator<any, any>>,
    context: ExecutionContext,
  ): Promise<DataLoader<any, any>> => {
    if (!data) {
      throw new InternalServerErrorException(
        `No loader provided to @Loader ('${data}')`,
      );
    }

    return getDataLoaderContext(context, '@Loader').getLoader(data);
  },
);
