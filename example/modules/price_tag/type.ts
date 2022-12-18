import { IQuery, ICommand, IQueryHandler, ICommandHandler } from '../../..';

export interface ICreateBatchCommand extends ICommand<'price_tag__create_batch', { name: string; product_ids: number[] }[]> {};
export interface ICreateBatchHandler extends ICommandHandler<ICreateBatchCommand, { ids: number[]; }> {};


export interface IGetByIdsQuery extends IQuery<'price_tag__get_by_ids', { ids: number[]; }> {};
export interface IGetByIdsHandler extends IQueryHandler<IGetByIdsQuery, { id: number; name: string; product_ids: number[] }[]> {};

