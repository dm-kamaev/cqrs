import CreateCommand from './cq/Create.command';
import CreateHandler from './cq/Create.handler';

import GetByIdQuery from './cq/GetById.query';
import GetByIdHandler from './cq/GetById.handler';

export default {
  create: {
    action: CreateCommand,
    handler: CreateHandler,
  },
  getById: {
    action: GetByIdQuery,
    handler: GetByIdHandler,
  },
};