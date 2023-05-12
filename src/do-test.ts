import { insertPort,InsertPortArg } from '@deep-foundation/payments-tinkoff-c2b-test/src/insert-port';
import { insertRoute,InsertRouteArg } from '@deep-foundation/payments-tinkoff-c2b-test/src/insert-route';
import { insertSum, InsertSumArg} from '@deep-foundation/payments-tinkoff-c2b-test/src/insert-sum';
import { insertTerminalKey, InsertTerminalKeyArg } from '@deep-foundation/payments-tinkoff-c2b-test/src/insert-terminal-key';
import { insertTerminalPassword,InsertTerminalPasswordArg  } from '@deep-foundation/payments-tinkoff-c2b-test/src/insert-terminal-password';
import { DeepClient } from '@deep-foundation/deeplinks/imports/client';
import { insertDoTest, InsertDoTestArg} from '@deep-foundation/payments-tinkoff-c2b-test/src/insert-do-test';
import assert from 'assert';
import delay from 'delay';

export type DoTestArg = InsertPortArg & InsertRouteArg & InsertSumArg & InsertTerminalKeyArg & InsertTerminalPasswordArg & InsertDoTestArg & {
  lookingForHandlerResultAttemptsCount?: number,
  lookingForHandlerResultDelayInMs?: number
}

// export async function doTest(arg: {
//   deep: DeepClient;
//   containerLinkId?: number;
//   terminalKey: string;
//   terminalPassword: string;
//   sum: number;
//   port: string;
//   route: string;
//   lookingForHandlerResultAttemptsCount?: number,
//   lookingForHandlerResultDelayInMs?: number
// }) {
  export async function doTest(arg: DoTestArg) {
  const { deep, port, route, sum, terminalKey, terminalPassword, containerLinkId = deep.linkId, lookingForHandlerResultAttemptsCount = 10, lookingForHandlerResultDelayInMs = 1000 } = arg;
  await insertTerminalKey({
    deep,
    containerLinkId,
    terminalKey,
  });

  await insertTerminalPassword({
    deep,
    containerLinkId,
    terminalPassword,
  });

  await insertSum({
    deep,
    containerLinkId,
    sum,
  });

  await insertPort({
    deep,
    containerLinkId,
    port,
  });

  await insertRoute({
    deep,
    containerLinkId,
    route,
  });

  const {
    data: [{ id: doTestLinkId }],
  } = await insertDoTest({
    deep,
    containerLinkId,
  });

  const resolvedTypeLinkId = await deep.id('@deep-foundation/core', 'Resolved');
  const rejectedTypeLinkId = await deep.id('@deep-foundation/core', 'Rejected');

  for (let i = 0; i < lookingForHandlerResultAttemptsCount; i++) {
    const { data: promiseTreeLinksDownToDoTestLink } = await deep.select({
      up: {
        parent_id: { _eq: doTestLinkId },
        tree_id: { _eq: await deep.id('@deep-foundation/core', 'promiseTree') },
      },
    });

    const rejectedLinkId = promiseTreeLinksDownToDoTestLink.find(
      (link) => link.type_id === rejectedTypeLinkId
    );

    assert.strictEqual(rejectedLinkId, undefined)

    const resolvedLinkId = promiseTreeLinksDownToDoTestLink.find(
      (link) => link.type_id === resolvedTypeLinkId
    );

    await delay(lookingForHandlerResultDelayInMs)
  }

  assert.notStrictEqual(resolvedTypeLinkId, undefined)
}
