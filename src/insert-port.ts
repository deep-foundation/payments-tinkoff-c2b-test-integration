import { DeepClient } from '@deep-foundation/deeplinks/imports/client';
import { createSerialOperation } from '@deep-foundation/deeplinks/imports/gql';
import { PACKAGE_NAME } from './package-name';

export interface InsertPortArg {
  deep: DeepClient;
  port: number;
  containerLinkId?: number;
}

export async function insertPort(arg: InsertPortArg) {
  const { deep } = arg;
  const containTypeLinkId = await deep.id('@deep-foundation/core', 'Contain');
  const containerLinkId = arg.containerLinkId ?? deep.linkId;

  const reservedLinkIds = await deep.reserve(1);

  const portLinkId = reservedLinkIds.pop();

  return await deep.serial({
    operations: [
      createSerialOperation({
        table: 'links',
        type: 'insert',
        objects: {
          id: portLinkId,
          type_id: await deep.id(PACKAGE_NAME, 'Port'),
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
          link_id: portLinkId,
          value: arg.port,
        },
      }),
    ],
  });
}
