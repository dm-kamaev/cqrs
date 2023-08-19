import { ICommand, IQuery, ICommandHandler, IQueryHandler } from '../../../index';

export interface ICreateCommand extends ICommand<'user.create', { id: number; name: string }> { };
export interface ICreateHandler extends ICommandHandler<ICreateCommand> { };

export interface IGetByIdQuery extends IQuery<'user.get-by-id', number> { };
export interface IGetByIdHandler extends IQueryHandler<IGetByIdQuery, { id: number, name: string }> { };