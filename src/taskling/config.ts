import * as vscode from 'vscode'

const SECTION = 'taskling'

const read = <T>(key: string, fallback: T): T =>
  vscode.workspace.getConfiguration(SECTION).get<T>(key, fallback) ?? fallback

export const config = {
  get grouped(): boolean {
    return read('defaultGrouped', false)
  },

  get excludeSources(): string[] {
    return read<string[]>('excludeSources', [])
  },

  get includeSources(): string[] {
    return read<string[]>('includeSources', [])
  },
}
