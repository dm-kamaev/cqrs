
import { IProvider } from '../../../type';
import dbOrder from '../db/dbOrder';
import { ICreateCommand, ICreateHandler } from '../type';

export default class CreateHandler implements ICreateHandler {
  readonly __tag = 'command:order.create';

  constructor(
    private readonly productModule: {
      toBook: IProvider['product']['toBook'],
      getByIds: IProvider['product']['getByIds']
    } ,
  ) {}

  async exec({ payload: listToBooked }: ICreateCommand) {
    const products: Array<{ id: number; quantity: number, price: number }> = [];
    const hashPrice = await this.getHashPrice(listToBooked.map(el => el.product_id));
    for await (const toBooked of listToBooked) {
      const { quantityBooked } = await this.productModule.toBook({ id: toBooked.product_id, quantity: toBooked.quantity });
      if (quantityBooked !== 0) {
        products.push({
          id: toBooked.product_id,
          quantity: quantityBooked,
          price: hashPrice[toBooked.product_id],
        });
      }
    }

    const order = {
      products,
      total: products.reduce((sum, el) => sum + (el.price * el.quantity), 0)
    };

    const { insertId: id } = dbOrder.create(order);

    return { id };
  }

  private async getHashPrice(ids: number[]) {
    const products = await this.productModule.getByIds(ids);
    const hashProducts: Record<number, number> = {};
    products.forEach(el => {
      hashProducts[el.id] = el.price;
    });
    return hashProducts;
  }

}