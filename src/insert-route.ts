import { DeepClient } from '@deep-foundation/deeplinks/imports/client';
import { createSerialOperation } from '@deep-foundation/deeplinks/imports/gql';
import { PACKAGE_NAME } from './package-name';

export interface InsertRouteArg {
  deep: DeepClient;
  route: string;
  containerLinkId?: number;
}

export async function insertRoute(arg: InsertRouteArg) {
  const { deep } = arg;
  const containTypeLinkId = await deep.id('@deep-foundation/core', 'Contain');
  const containerLinkId = arg.containerLinkId ?? deep.linkId;

  const reservedLinkIds = await deep.reserve(1);

  const routeLinkId = reservedLinkIds.pop();

  return await deep.serial({
    operations: [
      createSerialOperation({
        table: 'links',
        type: 'insert',
        objects: {
          id: routeLinkId,
          type_id: await deep.id(PACKAGE_NAME, 'Route'),
          in: {
            data: {
              type_id: containTypeLinkId,
              from_id: containerLinkId,
            },
          },
        },
      }),
      createSerialOperation({
        table: 'strings',
        type: 'insert',
        objects: {
          link_id: routeLinkId,
          value: arg.route,
        },
      }),
    ],
  });
}
