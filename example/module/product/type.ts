import { IQuery, ICommand, IQueryHandler, ICommandHandler } from '../../../index';


type ProductIds = number[];
export interface IGetByIdsQuery extends IQuery<'product.get-by-ids', ProductIds> {};
export interface IGetByIdsHandler extends IQueryHandler<IGetByIdsQuery, Array<{ id: number; name: string; price: number; quantity: number }>> {};

export interface IToBookCommand extends ICommand<'product.to-book', { id: number; quantity: number }> {};
export interface IToBookHandler extends ICommandHandler<IToBookCommand, { quantityBooked: number }> {};


