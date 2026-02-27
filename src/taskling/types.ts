import * as vscode from 'vscode'

export type ViewMode = 'list' | 'grouped'

export type TaskNode = TaskEntry | TaskGroupEntry

export class TaskEntry extends vscode.TreeItem {
  readonly kind = 'task' as const
  readonly source: string
  private running = false

  constructor(
    public readonly task: vscode.Task,
    public readonly group?: TaskGroupEntry,
  ) {
    super(task.name, vscode.TreeItemCollapsibleState.None)
    this.source = task.source
    this.description = task.source
    this.tooltip = task.detail ?? task.name
    this.contextValue = 'task'
    this.updateIcon()
    this.command = {
      command: 'taskling.runTask',
      title: 'Run',
      arguments: [this],
    }
  }

  get isRunning() {
    return this.running
  }

  setRunning(value: boolean) {
    this.running = value
    this.updateIcon()
  }

  matches(other: vscode.Task): boolean {
    return (
      this.task.name === other.name &&
      this.task.definition.type === other.definition.type
    )
  }

  private updateIcon() {
    this.iconPath = new vscode.ThemeIcon(this.running ? 'debug-stop' : 'play')
  }
}

export class TaskGroupEntry extends vscode.TreeItem {
  readonly kind = 'group' as const
  readonly entries: TaskEntry[] = []

  constructor(label: string) {
    super(label, vscode.TreeItemCollapsibleState.Expanded)
    this.iconPath = new vscode.ThemeIcon('folder')
    this.contextValue = 'group'
  }

  add(entry: TaskEntry) {
    this.entries.push(entry)
  }
}
