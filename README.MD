# Goal

Provide integration for [`@deep-foundation/payments-tinkoff-c2b-test`](https://www.npmjs.com/package/@deep-foundation/payments-tinkoff-c2b-test) package

# How to use?

## Minimal example
```ts
import {doTest} from '@deep-foundation/payments-tinkoff-c2b-test'

await doTest({
   deep,
   port,
   route,
   sum,
   terminalKey,
   terminalPassword,
   containerLinkId,
   lookingForHandlerResultAttemptsCount,
   lookingForHandlerResultDelayInMs
})
```

## Full example
```ts
import {doTest} from '@deep-foundation/payments-tinkoff-c2b-test'
import { DeepClient } from "@deep-foundation/deeplinks/imports/client";
import { generateApolloClient } from "@deep-foundation/hasura/client";

main();

async function main() {

   const graphQlPath: string = ;
   const ssl: boolean = ;
   const apolloClient = generateApolloClient({
     path: graphQlPath,
     ssl: ssl,
   });
   const unloginedDeep = new DeepClient({ apolloClient });
   const guest = await unloginedDeep.guest();
   const guestDeep = new DeepClient({ deep: unloginedDeep, ...guest });
   const admin = await guestDeep.login({
     linkId: await guestDeep.id('deep', 'admin'),
   });
   const deep = new DeepClient({ deep: guestDeep, ...admin });

   const port: number = ;
   const route: string;
   const sum: number = ;
   const terminalKey: string = ;
   const terminalPassword: string = ;
   const containerLinkId: number = ;
   const lookingForHandlerResultAttemptsCount: number|undefined = ;
   const lookingForHandlerResultDelayInMs: number|undefined = ;

   await doTest({
      deep,
      port,
      route,
      sum,
      terminalKey,
      terminalPassword,
      containerLinkId,
      lookingForHandlerResultAttemptsCount,
      lookingForHandlerResultDelayInMs
   })
}
```

## Full and ready to use (almost) example
```ts
import {doTest} from '@deep-foundation/payments-tinkoff-c2b-test'
import { DeepClient } from "@deep-foundation/deeplinks/imports/client";
import { generateApolloClient } from "@deep-foundation/hasura/client";

main();

async function main() {

   const graphQlPath: string = ;
   const ssl: boolean = true;
   const apolloClient = generateApolloClient({
     path: graphQlPath,
     ssl: ssl,
   });
   const unloginedDeep = new DeepClient({ apolloClient });
   const guest = await unloginedDeep.guest();
   const guestDeep = new DeepClient({ deep: unloginedDeep, ...guest });
   const admin = await guestDeep.login({
     linkId: await guestDeep.id('deep', 'admin'),
   });
   const deep = new DeepClient({ deep: guestDeep, ...admin });

   const port: number = 5237;
   const route: string = '/payments/tinkoff/c2b';
   const sum: number = 5500;
   const terminalKey: string = ;
   const terminalPassword: string = ;
   const containerLinkId: number = deep.linkId;
   const lookingForHandlerResultAttemptsCount: number|undefined = 10;
   const lookingForHandlerResultDelayInMs: number|undefined = 1000;

   await doTest({
      deep,
      port,
      route,
      sum,
      terminalKey,
      terminalPassword,
      containerLinkId,
      lookingForHandlerResultAttemptsCount,
      lookingForHandlerResultDelayInMs
   })
}
```