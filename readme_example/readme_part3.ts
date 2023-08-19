
import Bus, { IBus as ICQBus, ICommand, IQuery, ICommandHandler, IQueryHandler, ResultOfAction } from '../index';

// first argument is unique indeteficator of command, second is payload data
interface ICreateCommand extends ICommand<'user.create', { id: number; name: string }> {};
interface ICreateHandler extends ICommandHandler<ICreateCommand> {};

// first argument is unique indeteficator of query, second is payload data
interface IGetByIdQuery extends IQuery<'user.get-by-id', number> {};
// second argument is return data from query
interface IGetByIdHandler extends IQueryHandler<IGetByIdQuery, { id: number, name: string }> {};

type TProvider = {
  user: {
    create: (payload: ICreateCommand['payload']) => ResultOfAction<TModule, ICreateCommand>,
    getById: (payload: IGetByIdQuery['payload']) => ResultOfAction<TModule, IGetByIdQuery>,
  },
};

type TModule = {
  user: {
    create: {
      action: (payload: ICreateCommand['payload']) => ICreateCommand,
      handler: () => ICreateHandler,
    },
    getById: {
      action: (payload: IGetByIdQuery['payload']) => IGetByIdQuery,
      handler: () => IGetByIdHandler,
    },
  }
};
interface IBus extends ICQBus<TModule> {};
interface IProvider extends TProvider {};

class CreateCommand implements ICreateCommand {
  readonly __tag = 'command:user.create';

  constructor(public readonly payload: { id: number; name: string }) {}

  async validate() {
    if (this.payload.name.length < 2) {
      throw new Error('Incorrect name');
    }
  }

}


class CreateHandler implements ICreateHandler {
  public readonly __tag = 'command:user.create';

  constructor(private readonly providerUserModule: { getById: IProvider['user']['getById'] }) {}


  async exec({ payload: user }: ICreateCommand) {

    if (await this.providerUserModule.getById(user.id)) {
      throw new Error(`User with id = ${user.id} already exist`);
    }

    console.log('create user =>', {
      id: user.id,
      name: user.name,
    });
  }

}

class GetByIdQuery implements IGetByIdQuery {
  readonly __tag = 'query:user.get-by-id';

  constructor(public payload: number) { }
}


class GetByIdHandler implements IGetByIdHandler {
  readonly __tag = 'query:user.get-by-id';

  async exec({ payload: id }: IGetByIdQuery) {
    return {
      id: id,
      name: 'John',
    };
  }
}

const provider: IProvider = {
  user: {
    create: async (payload) => await bus.exec(bus.action.user.create(payload)),
    getById: async (payload) => await bus.exec(bus.action.user.getById(payload)),
  },
};

const bus: IBus = new Bus<TModule>({
  user: {
    create: {
      action: (payload) => new CreateCommand(payload),
      handler: () => new CreateHandler({ getById: provider.user.getById }),
    },
    getById: {
      action: (id) => new GetByIdQuery(id),
      handler: () => new GetByIdHandler()
    },
  }
});


void async function () {
  const userId = 123;
  await provider.user.create({ id: userId, name: 'John' });
  // { id: 123 }
  const user = await provider.user.getById(userId);
  // { id: 123, name: 'John' }
}();


