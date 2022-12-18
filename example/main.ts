
// import product from './modules3/product';
import globalBus from './createBus'
import { IBus } from './typeBus';

void async function () {
  const bus: IBus = globalBus;

  const { ids: price_tag_ids } = await bus.exec(bus.action.price_tag.createBatch( [{ name: 'First', product_ids: [] }, { name: 'Second', product_ids: [], }]));

  const { id: product_id } = await bus.exec(bus.action.product.create({ name: 'Blue cheese', price_tag_ids }, bus));
  console.log({ product_id });
  const product = await bus.exec(bus.action.product.getById(product_id));
  console.log('product => ', product);
  const product_by_name = await bus.exec(bus.action.product.getByName('Blue cheese'));
  console.log('product_by_name => ', product_by_name);
}();