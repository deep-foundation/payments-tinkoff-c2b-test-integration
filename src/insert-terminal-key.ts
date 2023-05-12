import { DeepClient } from '@deep-foundation/deeplinks/imports/client';
import { createSerialOperation } from '@deep-foundation/deeplinks/imports/gql';
import { PACKAGE_NAME } from './package-name';

export interface InsertTerminalKeyArg {
  deep: DeepClient;
  terminalKey: string;
  containerLinkId?: number;
}

export async function insertTerminalKey(arg: InsertTerminalKeyArg) {
  const { deep } = arg;
  const containTypeLinkId = await deep.id('@deep-foundation/core', 'Contain');
  const containerLinkId = arg.containerLinkId ?? deep.linkId;

  const reservedLinkIds = await deep.reserve(1);

  const terminalKeyLinkId = reservedLinkIds.pop();

  return await deep.serial({
    operations: [
      createSerialOperation({
        table: 'links',
        type: 'insert',
        objects: {
          id: terminalKeyLinkId,
          type_id: await deep.id(PACKAGE_NAME, 'TerminalKey'),
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
          link_id: terminalKeyLinkId,
          value: arg.terminalKey,
        },
      }),
    ],
  });
}
