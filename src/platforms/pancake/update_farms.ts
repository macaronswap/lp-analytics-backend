// run both
// patch out typescript error: eg by just remove the translation key related imports
const fs = require('fs');

import pools from '../../../remotes/pancake-frontend/src/config/constants/pools'
fs.writeFileSync(__dirname + "/farms/pools.json", JSON.stringify(pools, null, 2));