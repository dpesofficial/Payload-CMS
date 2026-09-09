import * as migration_20260909_020605_init from './20260909_020605_init';
import * as migration_20260909_022908_sitesettings from './20260909_022908_sitesettings';
import * as migration_20260909_043304_mcp from './20260909_043304_mcp';
import * as migration_20260909_043517_mcptools from './20260909_043517_mcptools';

export const migrations = [
  {
    up: migration_20260909_020605_init.up,
    down: migration_20260909_020605_init.down,
    name: '20260909_020605_init',
  },
  {
    up: migration_20260909_022908_sitesettings.up,
    down: migration_20260909_022908_sitesettings.down,
    name: '20260909_022908_sitesettings',
  },
  {
    up: migration_20260909_043304_mcp.up,
    down: migration_20260909_043304_mcp.down,
    name: '20260909_043304_mcp',
  },
  {
    up: migration_20260909_043517_mcptools.up,
    down: migration_20260909_043517_mcptools.down,
    name: '20260909_043517_mcptools'
  },
];
