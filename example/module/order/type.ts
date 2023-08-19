import { IQuery, ICommand, IQueryHandler, ICommandHandler } from '../../../index';


type OrderId = number;
export interface IGetByIdQuery extends IQuery<'order.get-by-id', OrderId> {};
export interface IGetByIdHandler extends IQueryHandler<IGetByIdQuery, { id: number; products: Array<{ id: number; name: string; price: number; quantity: number }>, total: number }> {};

export interface ICreateCommand extends ICommand<'order.create', Array<{ product_id: number; quantity: number }>> {};
export interface ICreateHandler extends ICommandHandler<ICreateCommand, { id: number }> {};


