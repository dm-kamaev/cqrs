import GetByIdsQuery from './cq/GetByIds.query';
import GetByIdsHandler from './cq/GetByIds.handler'

// import GetByNameQuery from './cq/GetByName.query';
// import GetByNameHandler from './cq/GetByName.handler'

import CreateBatchCommand from './cq/CreateBatch.command';
import CreateBatchHandler from './cq/CreateBatch.handler'


export default {
  createBatch: {
    action: CreateBatchCommand,
    handler: CreateBatchHandler,
  },
  getByIds: {
    action: GetByIdsQuery,
    handler: GetByIdsHandler,
  },
}
