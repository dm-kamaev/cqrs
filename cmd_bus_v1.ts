
type ActionName = `${'query' | 'command'}:${string}`;

export interface Action<T> {
  __tag: ActionName;
  payload: T;
}

export interface ActionHandler<T extends Action<any> = Action<any>, Output = void> {
  __tag: ActionName;
  exec: (command: T) => Promise<Output>;
}

export interface IBus<TRegisteredCommandHandlers extends ActionHandler<any, any>[] = ActionHandler<any, any>[]> {
  exec<TCommand extends Action<any> = any>(action: TCommand): ResultOf<TRegisteredCommandHandlers, TCommand>
}

type ResultOf<TRegisteredCommandHandlers extends ActionHandler[], TCommand extends Action<any>> = Promise<
  ReturnType<Extract<TRegisteredCommandHandlers[number], { exec: (cmd: TCommand) => any }>['exec']>
>;

export default class Bus<TRegisteredCommandHandlers extends ActionHandler<any, any>[] = ActionHandler<any, any>[]> implements IBus<TRegisteredCommandHandlers> {
  private readonly availableHandlers: Record<string, TRegisteredCommandHandlers[number]>;

  constructor(commandHandlers: TRegisteredCommandHandlers) {
    this.availableHandlers = {};

    commandHandlers.forEach((commandHandler) => {
      this.availableHandlers[commandHandler.__tag] = commandHandler;
    }, this);
  }

  public exec<TAction extends Action<any> = any>(
    action: TAction,
  ): ResultOf<TRegisteredCommandHandlers, TAction> {
    if (!this.availableHandlers[action.__tag]) {
      return Promise.reject(new Error(`Command: ${action.__tag} is not supported.`));
    }

    const result = this.availableHandlers[action.__tag].exec(action);
    return result;
  }
}
