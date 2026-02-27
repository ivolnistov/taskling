# Taskling

<a href="http://opensource.org/licenses/MIT" target="_blank" rel="noreferrer noopener"><img src="https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square" alt="MIT License"></a>

Discover and run all VS Code tasks from a convenient sidebar panel.

Taskling automatically finds every task recognized by VS Code — from `.vscode/tasks.json`, `package.json` scripts, and any other task provider — and puts them one click away in the activity bar.

## Features

- **Auto-discovery** — automatically detects all tasks recognized by VS Code
- **One-click run/stop** — click a task to run it; click again to stop
- **Grouped or flat view** — toggle between a flat list and tasks grouped by source
- **Source filtering** — include or exclude tasks by source (npm, gulp, tsc, etc.)
- **Auto-refresh** — sidebar updates automatically when settings change
- **Lightweight** — zero runtime dependencies, instant activation

## Usage

Open the Taskling panel from the activity bar. The extension scans for tasks automatically.

Click any task to run it. A running task shows a terminal icon — click it again to stop.

Use the toolbar buttons to switch between grouped/flat view or manually refresh the task list.

## Settings

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `taskling.defaultGrouped` | `boolean` | `false` | Initially show tasks grouped by source |
| `taskling.excludeSources` | `string[]` | `[]` | Hide tasks from specific sources (e.g. `["npm", "gulp"]`) |
| `taskling.includeSources` | `string[]` | `[]` | Only show tasks from these sources. Takes priority over `excludeSources`. |

Filtering is case-insensitive.

## License

[MIT](LICENSE)
