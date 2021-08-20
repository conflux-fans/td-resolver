const namehash = require('eth-ens-namehash');
const { abi: registryAbi } = require('../td-abi/Registry.json');
const { abi: resolverAbi } = require('../td-abi/Resolver.json');

const TESTNET_REGISTRY = 'cfxtest:acdzztjdv0vcx2z2znt296y6sd4hujsweab6r5up18';
const MAINNET_REGISTRY = 'cfx:acdzztjdv0vcx2z2znt296y6sd4hujswean18n0gxy';
const CFX_ADDRESS_KEY = 'wallet.CFX.address';

class Resolver {
  // Only support mainnet and testnet
  static async getResolver(cfx, name) {
    const address = cfx.networkId === 1 ? TESTNET_REGISTRY : MAINNET_REGISTRY;
    const contract = cfx.Contract({
      abi: registryAbi,
      address
    });
    const tokenId = namehash.hash(name);
    const resolverAddress = await contract.resolverOf(tokenId);
    return new Resolver({cfx, address: resolverAddress, name});
  }

  static async resolveName(cfx, name) {
    const resolver = await Resolver.getResolver(cfx, name);
    return await resolver.resolveKey(CFX_ADDRESS_KEY);
  }

  constructor({
    cfx, 
    address,
    name
  }) {
    if (!cfx) {
      throw new Error('A js-conflux-sdk Conflux instance is required');
    }
    this.cfx = cfx;
    this.name = name;
    this.address = address;

    if (!address) throw new Error('Please provide resolver address');
    this.resolver = cfx.Contract({
      address: address,
      abi: resolverAbi
    });
    
    if (!name) throw new Error('Please input your CNS name');
    this.tokenId = namehash.hash(name);
  }

  async resolveKey(key) {
    try {
      return await this.resolver.get(this.tokenId, key);
    } catch(e) {
      return null;
    }
  }

  async lookupAddress(address) {
    try {
      await this.resolver.getName(address);
    } catch(e) {
      return null;
    }
  }
}

module.exports = Resolver;