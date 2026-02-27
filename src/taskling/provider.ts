import * as vscode from 'vscode'
import { config } from './config'
import { TaskEntry, TaskGroupEntry, TaskNode, ViewMode } from './types'

export class TaskTreeProvider implements vscode.TreeDataProvider<TaskNode> {
  private mode: ViewMode
  private entries: TaskEntry[] = []

  private emitter = new vscode.EventEmitter<TaskNode | undefined>()
  readonly onDidChangeTreeData = this.emitter.event

  constructor() {
    this.mode = config.grouped ? 'grouped' : 'list'
    void this.reload()
  }

  async reload() {
    const allTasks = await vscode.tasks.fetchTasks()
    this.entries = this.filterTasks(allTasks).map((t) => new TaskEntry(t))
    this.entries.sort((a, b) => a.task.name.localeCompare(b.task.name))
    this.emitter.fire(undefined)
  }

  setMode(mode: ViewMode) {
    this.mode = mode
    this.emitter.fire(undefined)
  }

  toggle(entry: TaskEntry) {
    if (entry.isRunning) {
      const execution = vscode.tasks.taskExecutions.find((e) =>
        entry.matches(e.task),
      )
      execution?.terminate()
      return
    }
    void vscode.tasks.executeTask(entry.task)
  }

  findEntry(task: vscode.Task): TaskEntry | undefined {
    return this.entries.find((e) => e.matches(task))
  }

  notify() {
    this.emitter.fire(undefined)
  }

  // --- TreeDataProvider ---

  getTreeItem(node: TaskNode): vscode.TreeItem {
    return node
  }

  getChildren(node?: TaskNode): TaskNode[] {
    if (!node) {
      return this.mode === 'grouped' ? this.buildGroups() : this.entries
    }
    return node.kind === 'group' ? node.entries : []
  }

  getParent(node: TaskNode): TaskNode | undefined {
    return node.kind === 'task' ? node.group : undefined
  }

  // --- internals ---

  private filterTasks(tasks: vscode.Task[]): vscode.Task[] {
    const include = config.includeSources.map((s) => s.toLowerCase())
    const exclude = config.excludeSources.map((s) => s.toLowerCase())

    return tasks.filter((t) => {
      const src = t.source.toLowerCase()
      if (include.length > 0) {
        return include.includes(src)
      }
      if (exclude.length > 0) {
        return !exclude.includes(src)
      }
      return true
    })
  }

  private buildGroups(): TaskGroupEntry[] {
    const map = new Map<string, TaskGroupEntry>()
    for (const entry of this.entries) {
      let group = map.get(entry.source)
      if (!group) {
        group = new TaskGroupEntry(entry.source)
        map.set(entry.source, group)
      }
      group.add(entry)
    }
    return [...map.values()].sort((a, b) =>
      (a.label as string).localeCompare(b.label as string),
    )
  }
}
