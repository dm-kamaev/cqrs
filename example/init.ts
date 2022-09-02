
import Bus from '../index';

import CreateCommand from './modules/CreateCommand';
import CreateHandler from './modules/CreateHandler';

import GetByIdQuery from './modules/GetByIdQuery';
import GetByIdHandler from './modules/GetByIdHandler';

import GetByNameQuery from './modules/GetByNameQuery';
import GetByNameHandler from './modules/GetByNameHandler';


import GreetCommand from './modules/GreetCommand';
import GreetHandler from './modules/GreetHandler';


const greetCommand = new GreetCommand();
const createCommand = new CreateCommand();
const getByIdQuery = new GetByIdQuery();
const getByNameQuery = new GetByNameQuery();

const bus = new Bus([new GetByNameHandler(), new GetByIdHandler(), new GreetHandler(), new CreateHandler() ]);


void async function () {
  const result = await bus.exec(greetCommand);
  // const result43535 = await bus.execute({});
  const result3 = await bus.exec(createCommand);
  const result4 = await bus.exec(getByIdQuery);
  const result5 = await bus.exec(getByNameQuery);
  // const result2 = await bus.execute({ type: 'test-type', payload: {id:25} });

  console.log(result, result3, result4, result5);
}();
