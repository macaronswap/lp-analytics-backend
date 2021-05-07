"use strict";

const MasterChefAbi = require('./abi/masterchef.json');
const SousChefAbi = require('./abi/souschef.json');

const Farms = require('./farms/farms.json');
const Pools = require('./farms/pools.json');

const PancakePlatformFork = require("../common").PancakePlatformFork;

module.exports = class macaron extends PancakePlatformFork {
  static MASTER_ADDRESS = "0xFcDE390bF7a8B8614EC11fa8bde7565b3E64fe0b"

  getRawFarms() {
    return Farms.filter(i => i.ended !== true);
  }

  getRawPools() {
    return Pools.filter(p => p.isFinished !== true);
  }

  getName() {
    return 'macaron';
  }

  getFarmLink(farm) {
    if (farm.id.startsWith(`${this.getName()}_sous_`)) {
      return 'https://www.macaronswap.finance/falls';
    }

    return 'https://www.macaronswap.finance/magicbox';
  }

  getFarmEarns(farm) {
    return farm.id.startsWith(`${this.getName()}_farm_`)
      ? ['macaron']
      : undefined;
  }

  getPendingRewardContractMethod() {
    return 'pendingMacaron';
  }

  getSousAbi() {
    return SousChefAbi;
  }

  getMasterChefAbi() {
    return MasterChefAbi;
  }

  getMasterChefAddress() {
    return macaron.MASTER_ADDRESS;
  }
};
