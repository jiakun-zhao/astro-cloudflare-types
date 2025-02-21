import cloudflareTypes from 'astro-cloudflare-types'
import { defineConfig } from 'astro/config'

export default defineConfig({
  integrations: [
    cloudflareTypes(),
  ],
})
