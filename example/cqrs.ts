import Bus from '../index';

import product from './module/product';
import order from './module/order';
import { TModule, IBus, IProvider } from './type';

export let bus: IBus;

export const provider: IProvider = {
  product: {
    toBook: async (payload) => await bus.exec(bus.action.product.toBook(payload)),
    getByIds: async (payload) => await bus.exec(bus.action.product.getByIds(payload)),
  },
  order: {
    create: async (payload) => await bus.exec(bus.action.order.create(payload)),
    getById: async (payload) => await bus.exec(bus.action.order.getById(payload)),
  },
};

// const bus = new Bus<TRegisteredHandlers>({
bus = new Bus<TModule>({
  product: {
    toBook: {
      action: (payload) => new product.toBook.action(payload),
      handler: () => new product.toBook.handler()
    },
    getByIds: {
      action: (id) => new product.getByIds.action(id),
      handler: () => new product.getByIds.handler()
    },
  },
  order: {
    create: {
      action: (payload) => new order.create.action(payload, { getByIds: provider.product.getByIds, }),
      handler: () => new order.create.handler({ getByIds: provider.product.getByIds, toBook: provider.product.toBook })
    },
    getById: {
      action: (payload) => new order.getById.action(payload),
      handler: () => new order.getById.handler({ getByIds: provider.product.getByIds })
    },
  }
});
