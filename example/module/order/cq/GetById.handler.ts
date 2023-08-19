import { IProvider } from '../../../type';
import dbOrder from '../db/dbOrder';
import { IGetByIdQuery, IGetByIdHandler } from '../type';

export default class GetByIdHandler implements IGetByIdHandler {
  readonly __tag = 'query:order.get-by-id';

  constructor(private readonly productModule: { getByIds: IProvider['product']['getByIds'] }) {}

  async exec({ payload: id }: IGetByIdQuery) {
    const order = dbOrder.getById(id);
    if (!order) {
      throw new Error(`Not found order with id = ${id}`);
    }
    const hashName = await this.getHashName(order.products.map(el => el.id));

    return {
      ...order,
      products: order.products.map(el => {
        return {
          ...el,
          name: hashName[el.id],
        }
      })
    };
  }

  private async getHashName(ids: number[]) {
    const products = await this.productModule.getByIds(ids);
    const hashProducts: Record<number, string> = {};
    products.forEach(el => {
      hashProducts[el.id] = el.name;
    });
    return hashProducts;
  }

}