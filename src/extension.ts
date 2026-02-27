import * as vscode from 'vscode'
import { TaskTreeProvider } from './taskling/provider'
import { TaskEntry } from './taskling/types'

export const activate = (ctx: vscode.ExtensionContext) => {
  const provider = new TaskTreeProvider()

  ctx.subscriptions.push(
    vscode.window.registerTreeDataProvider('taskling', provider),

    vscode.commands.registerCommand('taskling.runTask', (entry: TaskEntry) => {
      provider.toggle(entry)
    }),

    vscode.commands.registerCommand('taskling.refresh', () =>
      provider.reload(),
    ),

    vscode.commands.registerCommand('taskling.viewAsGroups', () => {
      void vscode.commands.executeCommand('setContext', 'isGrouped', true)
      provider.setMode('grouped')
    }),

    vscode.commands.registerCommand('taskling.viewAsList', () => {
      void vscode.commands.executeCommand('setContext', 'isGrouped', false)
      provider.setMode('list')
    }),

    vscode.workspace.onDidChangeConfiguration((e) => {
      if (e.affectsConfiguration('taskling')) {
        void provider.reload()
      }
    }),

    vscode.tasks.onDidStartTask((e) => {
      const entry = provider.findEntry(e.execution.task)
      if (entry) {
        entry.setRunning(true)
        provider.notify()
      }
    }),

    vscode.tasks.onDidEndTask((e) => {
      const entry = provider.findEntry(e.execution.task)
      if (entry) {
        entry.setRunning(false)
        provider.notify()
      }
    }),
  )
}

export const deactivate = () => {}
