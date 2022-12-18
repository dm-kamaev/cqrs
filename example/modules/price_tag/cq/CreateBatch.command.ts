import { ICreateBatchCommand } from '../type';

export default class CreateBatchCommand implements ICreateBatchCommand {
  readonly __tag = 'command:price_tag__create_batch';


  constructor(public payload: ICreateBatchCommand['payload']) {}
}