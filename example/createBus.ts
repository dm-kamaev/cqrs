import Bus, { IBus as _ } from '..';

import product from './modules/product';
import price_tag from './modules/price_tag';
import { TRegisteredHandlers, IBus, TAction } from './typeBus';

let bus: IBus;

const action: TAction = {
  product: {
    create: (payload) => new product.create.action(payload, bus),
    getById: (id) => new product.getById.action(id),
    getByName: (name) => new product.getByName.action(name),
  },
  price_tag: {
    createBatch: (payload) => new price_tag.createBatch.action(payload),
    getByIds: (payload) => new price_tag.getByIds.action(payload),
  }
}


bus = new Bus<TRegisteredHandlers, TAction>([
  () => new product.create.handler(),
  () => new product.getById.handler(bus),
  () => new product.getByName.handler(bus),

  () => new price_tag.createBatch.handler(),
  () => new price_tag.getByIds.handler(),
], action);


// bus.exec(new product.getById.action(123)).then(result => console.log(result));
// bus.exec(new product.getByName.action('John')).then(result => console.log(result));

export default bus;



// type Debug = ResultOf<Array<
//   (() => ProductContract.IGetByIdHandler) |
//   (() => ProductContract.IGetByNameHandler)
// >, ProductContract.IGetByIdQuery>;

// function call() {
//   const local_bus: IBus = bus;
//   local_bus.exec(new product.getById.action(123)).then(result => console.log(result));
//   local_bus.exec(new product.getByName.action('John')).then(result => console.log(result));
// }

