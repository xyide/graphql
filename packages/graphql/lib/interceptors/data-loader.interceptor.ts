import {
  CallHandler,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  NestInterceptor,
  Type,
} from '@nestjs/common';
import { ContextId, ModuleRef } from '@nestjs/core';
import DataLoader = require('dataloader');
import { Observable } from 'rxjs';
import { DataLoaderGenerator } from '../interfaces/data-loader-generator.interface';
import { GqlContextType, GqlExecutionContext } from '../services';
import {
  DataLoaderContext,
  NEST_LOADER_CONTEXT_KEY,
} from '../services/data-loader-context';

@Injectable()
export class DataLoaderInterceptor implements NestInterceptor {
  constructor(private readonly moduleRef: ModuleRef) {}

  public intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> {
    if (context.getType<GqlContextType>() !== 'graphql') {
      return next.handle();
    }

    const ctx = GqlExecutionContext.create(context).getContext();

    if (ctx[NEST_LOADER_CONTEXT_KEY] === undefined) {
      ctx[NEST_LOADER_CONTEXT_KEY] = new DataLoaderContext(
        this.createDataLoader.bind(this),
      );
    }

    return next.handle();
  }

  private async createDataLoader(
    contextId: ContextId,
    type: Type<DataLoaderGenerator<any, any>>,
  ): Promise<DataLoader<any, any>> {
    try {
      const provider = await this.moduleRef.resolve<
        DataLoaderGenerator<any, any>
      >(type, contextId, { strict: false });

      return provider.generateDataLoader();
    } catch (e) {
      throw new InternalServerErrorException(
        `The loader ${type} is not provided` + e,
      );
    }
  }
}
