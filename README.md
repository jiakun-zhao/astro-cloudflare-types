# astro-cloudflare-types

![npm version](https://img.shields.io/npm/v/astro-cloudflare-types?color=%23954)

Generate Cloudflare bindings types from Wrangler configuration file.

- [Use bindings in your Astro application - Cloudflare Docs](https://developers.cloudflare.com/pages/framework-guides/deploy-an-astro-site/#use-bindings-in-your-astro-application)
- [Typing - Astro Docs](https://docs.astro.build/en/guides/integrations-guide/cloudflare/#typing)

### Install

```base
pnpm i -D astro-cloudflare-types

# pnpm i -D astro-cloudflare-types wrangler @astrojs/cloudflare
# wrangler pages download config [project_name]
```

### Usage

```ts
// astro.config.ts

import cloudflare from '@astrojs/cloudflare'
import cloudflareTypes from 'astro-cloudflare-types'
import { defineConfig } from 'astro/config'

export default defineConfig({
  adapter: cloudflare({
    imageService: 'passthrough',
    platformProxy: {
      enabled: true,
      environment: 'production',
    }
  }),
  integrations: [
    cloudflareTypes(),
  ],
})
```

### LICENSE

MIT - Copyright (c) 2025 Jiakun Zhao
