# td-resolver

Resolver for trust domain

## Quick Start

### Install

```sh
$ npm install @confluxfans/td-resolver
```

### Use

```js
const Resolver = require('@confluxfans/resolver');
const { Conflux } = require('js-conflux-sdk');
const cfx = new Conflux({
  url: 'https://test.confluxrpc.com',
  networkId: 1
});

async function main() {
  const cnsName = 'name.cfx';
  // if can not get resolver will throw error
  const resolver = await Resolver.getResolver(cfx, cnsName);

  // if can not resolve will return null
  const key = await resolver.resolveKey('some-key');
  // cfxtest:aak2rra2njvd77ezwjvx04kkds9fzagfe6d5r8e957
}

main().catch(console.log);
```

## Links

* [TrustDomain documentation](https://docs.trustdomains.org/)
