
import Bus from '../index';

import CreateCommand from './modules/CreateCommand';
import CreateHandler from './modules/CreateHandler';

import GetByIdQuery from './modules/GetByIdQuery';
import GetByIdHandler from './modules/GetByIdHandler';

import GreetCommand from './modules/GreetCommand';
import GreetHandler from './modules/GreetHandler';


const greetCommand = new GreetCommand();
const createCommand = new CreateCommand();
const getByIdQuery = new GetByIdQuery();

// Bus<(GreetHandler | CreateHandler | GetByIdHandler)[]>
const bus = new Bus([ new GreetHandler(), new CreateHandler(), new GetByIdHandler() ]);


void async function () {
  const result = await bus.exec(greetCommand);
  // const result43535 = await bus.execute({});
  const result3 = await bus.exec(createCommand);
  const result4 = await bus.exec(getByIdQuery);
  // const result2 = await bus.execute({ type: 'test-type', payload: {id:25} });

  console.log(result, result3, result4);
}();
