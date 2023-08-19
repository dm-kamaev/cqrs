import { IBus as IOriginBus, ResultOfAction } from '../index';

import * as Product from './module/product/type';
import * as Order from './module/order/type';

export type TModule = {
  product: {
    toBook: {
      action: (payload: Product.IToBookCommand['payload']) => Product.IToBookCommand,
      handler: () => Product.IToBookHandler,
    },
    getByIds: {
      action: (payload: Product.IGetByIdsQuery['payload']) => Product.IGetByIdsQuery,
      handler: () => Product.IGetByIdsHandler,
    },
  },
  order: {
    create: {
      action: (payload: Order.ICreateCommand['payload']) => Order.ICreateCommand,
      handler: () => Order.ICreateHandler,
    }
    getById: {
      action: (payload: Order.IGetByIdQuery['payload']) => Order.IGetByIdQuery,
      handler: () => Order.IGetByIdHandler,
    }
  },
};

type TProvider = {
  product: {
    toBook: (payload: Product.IToBookCommand['payload']) => ResultOfAction<TModule, Product.IToBookCommand>,
    getByIds: (payload: Product.IGetByIdsQuery['payload']) => ResultOfAction<TModule, Product.IGetByIdsQuery>,
  },
  order: {
    create: (payload: Order.ICreateCommand['payload']) => ResultOfAction<TModule, Order.ICreateCommand>,
    getById: (payload: Order.IGetByIdQuery['payload']) => ResultOfAction<TModule, Order.IGetByIdQuery>
  }
};

export interface IBus extends IOriginBus<TModule> {};
export interface IProvider extends TProvider {};
