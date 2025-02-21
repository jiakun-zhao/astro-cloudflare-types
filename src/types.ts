export interface Options {
  /**
   * Config file path, must follow adapter settings.
   * @default wrangler.toml
   * @see https://docs.astro.build/en/guides/integrations-guide/cloudflare/#platformproxyconfigpath
   */
  configPath: string
  /**
   * @default production
   * @see https://developers.cloudflare.com/pages/functions/wrangler-configuration/#environment-specific-overrides
   */
  environment: string
  types: Record<string, string>
}

export type Vars = string[]

export interface WranglerConfig {
  env?: Partial<Record<string, { vars?: Record<string, string> } & Record<string, { binding?: string }[]>>>
}
