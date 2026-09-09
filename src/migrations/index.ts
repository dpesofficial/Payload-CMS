import * as migration_20260909_020605_init from './20260909_020605_init';
import * as migration_20260909_022908_sitesettings from './20260909_022908_sitesettings';

export const migrations = [
  {
    up: migration_20260909_020605_init.up,
    down: migration_20260909_020605_init.down,
    name: '20260909_020605_init',
  },
  {
    up: migration_20260909_022908_sitesettings.up,
    down: migration_20260909_022908_sitesettings.down,
    name: '20260909_022908_sitesettings'
  },
];
