// Re-export js-yaml's named exports through a local shim.
//
// Note: Turbopack's static analyzer may emit a false "Export default doesn't
// exist in target module" warning for `js-yaml` (which only ships named
// exports, no default). This is a known turbopack limitation and is harmless —
// the named imports (`dump`, `load`) resolve correctly at runtime and the
// tool works. Importing through this shim centralises the dependency so only
// one file triggers the warning.
import { dump, load, YAMLException } from 'js-yaml'

export { dump, load, YAMLException }
export type { ParseOptions, DumpOptions } from 'js-yaml'
