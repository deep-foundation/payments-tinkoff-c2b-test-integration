import { DeepClient } from '@deep-foundation/deeplinks/imports/client';
import { createSerialOperation } from '@deep-foundation/deeplinks/imports/gql';
import { PACKAGE_NAME } from './package-name';

export interface InsertSumArg {
  deep: DeepClient;
  sum: number;
  containerLinkId?: number;
}

export async function insertSum(arg: InsertSumArg) {
  const { deep } = arg;
  const containTypeLinkId = await deep.id('@deep-foundation/core', 'Contain');
  const containerLinkId = arg.containerLinkId ?? deep.linkId;

  const reservedLinkIds = await deep.reserve(1);

  const sumLinkId = reservedLinkIds.pop();

  return await deep.serial({
    operations: [
      createSerialOperation({
        table: 'links',
        type: 'insert',
        objects: {
          id: sumLinkId,
          type_id: await deep.id(PACKAGE_NAME, 'Sum'),
          in: {
            data: {
              type_id: containTypeLinkId,
              from_id: containerLinkId,
            },
          },
        },
      }),
      createSerialOperation({
        table: 'numbers',
        type: 'insert',
        objects: {
          link_id: sumLinkId,
          value: arg.sum,
        },
      }),
    ],
  });
}
