import { IBus as IOriginBus } from '..';

import * as ProductContract from './modules/product/type';
import * as PriceTagContract from './modules/price_tag/type';

export type TAction = {
  product: {
    create: (payload: ProductContract.ICreateCommand['payload'], bus: IBus) => ProductContract.ICreateCommand,
    getById: (id: number) => ProductContract.IGetByIdQuery,
    getByName: (name: string) => ProductContract.IGetByNameQuery,
  },
  price_tag: {
    createBatch: (payload: PriceTagContract.ICreateBatchCommand['payload']) => PriceTagContract.ICreateBatchCommand,
    getByIds: (payload: PriceTagContract.IGetByIdsQuery['payload']) => PriceTagContract.IGetByIdsQuery,
  }
};

export type TRegisteredHandlers = Array<
  (() => PriceTagContract.ICreateBatchHandler) |
  (() => PriceTagContract.IGetByIdsHandler) |

  (() => ProductContract.IGetByIdHandler) |
  (() => ProductContract.IGetByNameHandler) |
  (() => ProductContract.ICreateHandler)
>;



export interface IBus extends IOriginBus<TRegisteredHandlers, TAction> {};

