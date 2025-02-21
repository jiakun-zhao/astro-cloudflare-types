import type { WranglerConfig } from './types'
import { readFile } from 'node:fs/promises'
import { parse as parseJsonc } from 'jsonc-parser'
import { parse as parseToml } from 'toml'

export function generateTypes(entries: [string, string][]) {
  return [
    'type CloudflareEnv = {',
    ...entries.map(([name, type]) => `  ${name}: ${type}`),
    '}',
    '',
    'type Runtime = import("@astrojs/cloudflare").Runtime<CloudflareEnv>;',
    '',
    'declare namespace App {',
    '  interface Locals extends Runtime { }',
    '}',
  ].join('\n')
}

async function readText(path: string) {
  try {
    return await readFile(path, 'utf-8')
  } catch {
    return null
  }
}

export async function parseVars(path: string) {
  const content = await readText(path)
  return (content ?? '').split('\n').map(line => line.split('=')[0]).filter(it => Boolean(it))
}

export async function parseConfig(path: string): Promise<WranglerConfig> {
  const content = await readText(path)
  try {
    if (path.endsWith('.json')) {
      return JSON.parse(content?.trim() || '{}')
    } else if (path.endsWith('.toml')) {
      return parseToml(content?.trim() || '')
    } else if (path.endsWith('.jsonc')) {
      return parseJsonc(content?.trim() || '{}')
    }
  } catch {
    return {}
  }
  throw new Error('Unsupported file types (json, jsonc or toml)')
}
