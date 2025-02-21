import type { AstroIntegration } from 'astro'
import type { Options } from './types'
import { resolve } from 'node:path'
import { name } from '../package.json'
import { generateTypes, parseConfig, parseVars } from './utils'

export type * from '@cloudflare/workers-types'

export default function (options: Partial<Options> = {}): AstroIntegration {
  const {
    configPath = 'wrangler.toml',
    environment = 'production',
    types: _types = {},
  } = options

  const types: Record<string, string> = {
    ai: `import("${name}").Ai`,
    analytics_engine_datasets: `import("${name}").AnalyticsEngineDataset`,
    d1_databases: `import("${name}").D1Database`,
    durable_objects: `import("${name}").DurableObjectNamespace`,
    hyperdrive: `import("${name}").Hyperdrive`,
    kv_namespaces: `import("${name}").KVNamespace`,
    queues: `import("${name}").Queue<any>`,
    r2_buckets: `import("${name}").R2Bucket`,
    services: `import("${name}").Fetcher`,
    vectorize: `import("${name}").VectorizeIndex`,
    ..._types,
  }

  return {
    name,
    hooks: {
      'astro:config:setup': ({ config, addWatchFile }) => {
        addWatchFile(resolve(config.root.pathname, '.dev.vars'))
        addWatchFile(resolve(config.root.pathname, configPath))
      },
      'astro:config:done': async ({ config, injectTypes }) => {
        const devVars = await parseVars(resolve(config.root.pathname, '.dev.vars'))
        const wranglerConfig = await parseConfig(resolve(config.root.pathname, configPath))
        const { vars = {}, ...bindings } = wranglerConfig.env?.[environment] ?? {}
        const entries = [
          ...Object.keys(vars).map(it => [it, 'string']),
          ...devVars.map(it => [it, 'string']),
          ...Object.entries(bindings)
            .filter(([type]) => Boolean(types[type]))
            .map(([type, bindings]) => bindings.filter(it => Boolean(it.binding)).map(it => [it.binding, types[type]]))
            .flat(),
        ] as [string, string][]
        injectTypes({ filename: `${name}.d.ts`, content: generateTypes(entries) })
      },
    },
  }
}
