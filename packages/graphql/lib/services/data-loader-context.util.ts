import { ExecutionContext, InternalServerErrorException } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { DataLoaderInterceptor } from '../interceptors/data-loader.interceptor';
import {
  DataLoaderContext,
  NEST_LOADER_CONTEXT_KEY,
} from './data-loader-context';
import { GqlContextType, GqlExecutionContext } from './gql-execution-context';

export const getDataLoaderContext = (
  context: ExecutionContext,
  decorator: string,
): DataLoaderContext => {
  if (context.getType<GqlContextType>() !== 'graphql') {
    throw new InternalServerErrorException(
      `${decorator} should only be used within the GraphQL context`,
    );
  }

  const graphqlContext = GqlExecutionContext.create(context).getContext();

  const nestDataLoaderContext = graphqlContext[NEST_LOADER_CONTEXT_KEY];
  if (!nestDataLoaderContext) {
    throw new InternalServerErrorException(
      `You should provide interceptor ${DataLoaderInterceptor.name} globally with ${APP_INTERCEPTOR}`,
    );
  }

  return nestDataLoaderContext;
};
