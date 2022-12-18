import { ICreateCommand } from '../type';

import { IBus } from '../../../typeBus';

export default class CreateCommand implements ICreateCommand {
  readonly __tag = 'command:product__create';
  // payload: ICreateCommand['payload'] = {} as ICreateCommand['payload'];

  constructor(public payload: { name: string; price_tag_ids: number[] }, private bus: IBus) {}

  async build() {
    const payload = this.payload;
    const price_tags = await this.bus.exec(this.bus.action.price_tag.getByIds({ ids: payload.price_tag_ids }));
    const set_price_tags = new Set(price_tags.map(el => el.id));

    payload.price_tag_ids.forEach(id => {
      if (!set_price_tags.has(id)) {
        throw new Error(`Not found price tag with id = ${id}`)
      }
    });
  }
}