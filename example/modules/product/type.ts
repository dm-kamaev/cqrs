import { IQuery, ICommand, IQueryHandler, ICommandHandler } from '../../..';

export interface ICreateCommand extends ICommand<'product__create', { name: string; price_tag_ids: number[] }> { };
export interface ICreateHandler extends ICommandHandler<ICreateCommand, { id: number; }> {};


interface IPriceTag { id: number, name: string, product_ids: number[] };

export interface IGetByIdQuery extends IQuery<'product__get_by_id', { id: number; }> {};
export interface IGetByIdHandler extends IQueryHandler<IGetByIdQuery, { id: number; name: string; price_tags: Array<IPriceTag> }> {};

export interface IGetByNameQuery extends IQuery<'product__get_by_name', { name: string; }> {};
export interface IGetByNameHandler extends IQueryHandler<IGetByNameQuery, { id: number; name: string; price_tags: Array<IPriceTag> }> {};

