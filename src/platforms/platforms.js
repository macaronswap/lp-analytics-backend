"use strict";

const fs = require("fs");

const path = require("path");

let platformInstances;

module.exports = class Platforms {
  constructor(platforms, cache, priceOracle, tokenCollector) {
    this.myPlatforms = platforms;
    this.cache = cache;
    this.priceOracle = priceOracle;
    this.tokenCollector = tokenCollector;
  }

  requirePlatforms() {
    const me = this;
    const folder = path.resolve(__dirname, ".");

    const alreadyInjected = this.myPlatforms.map(p => p.constructor.name);

    const platforms = fs
      .readdirSync(folder, { withFileTypes: true })
      .filter(f => f.isDirectory() && !alreadyInjected.includes(f.name))
      .map(f => f.name);

    const newInstances = platforms
      .map(x => `${folder}/${x}/${x}.js`)
      .filter(x => fs.existsSync(x))
      .map(p => [
        path.basename(p).substr(0, path.basename(p).length - 3),
        new (require(p))(me.cache, me.priceOracle, me.tokenCollector) // TODO: init should be done from services.js
      ]);

    newInstances.push(...this.myPlatforms.map(p => [p.constructor.name, p]));

    return newInstances;
  }

  platforms() {
    if (!platformInstances) {
      platformInstances = this.requirePlatforms();
    }

    return platformInstances;
  }

  getPlatformByName(name) {
    const find = this.platforms().find(item => item[0] === name);

    if (!find) {
      throw Error(`Invalid platform: ${name}`);
    }

    return find[1];
  }

  getFunctionAwaits(func, parameters) {
    return this.platforms()
      .filter(p => p[1][func])
      .map(p => {
        return parameters ? p[1][func](...parameters) : p[1][func]();
      });
  }

  getFunctionAwaitsForPlatforms(platforms, func, parameters) {
    return this.platforms()
      .filter(p => platforms.includes(p[0]) && p[1][func])
      .map(p => {
        return parameters ? p[1][func](...parameters) : p[1][func]();
      });
  }
};
