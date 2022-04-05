import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { DataLoaderContext } from '../services/data-loader-context';
import { getDataLoaderContext } from '../services/data-loader-context.util';

export const LoaderContext = createParamDecorator(
  // tslint:disable-next-line: ban-types
  (data: any, context: ExecutionContext): DataLoaderContext => {
    return getDataLoaderContext(context, '@LoaderContext');
  },
);
