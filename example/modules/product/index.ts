import GetByIdQuery from './cq/GetById.query';
import GetByIdHandler from './cq/GetById.handler'

import GetByNameQuery from './cq/GetByName.query';
import GetByNameHandler from './cq/GetByName.handler'

import CreateCommand from './cq/Create.command';
import CreateHandler from './cq/Create.handler'


export default {
  create: {
    action: CreateCommand,
    handler: CreateHandler,
  },
  getById: {
    action: GetByIdQuery,
    handler: GetByIdHandler,
  },
  getByName: {
    action: GetByNameQuery,
    handler: GetByNameHandler,
  },
}
