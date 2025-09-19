# Directory Dumper

`directory-dumper` is a Node.js command-line tool that scans a specified directory and outputs the contents of its files. It supports filtering by file extensions, ignoring patterns (including `.gitignore`), skipping large files, and outputting in different formats (plain text, JSON, or Markdown). The tool is designed to be flexible and user-friendly, with a progress spinner and optional skipped file reporting.

## Features

- **Directory Scanning**: Recursively scans a directory and collects file contents.
- **File Filtering**: Supports filtering by file extensions and maximum file size.
- **Ignore Patterns**: Respects `.gitignore` files and allows custom ignore patterns.
- **Hidden Files**: Option to include or exclude hidden files (starting with `.`).
- **Output Formats**: Outputs in plain text, JSON, or Markdown.
- **Output Destination**: Write output to a file or display it in the console.
- **Skipped Files Summary**: Optionally displays a summary of skipped files with reasons.

## Installation

1. Ensure you have Node.js (version 20 or higher) installed.

2. Clone or download the project.

3. Navigate to the project directory and run:

   ```bash
   npm install
   ```

4. The tool can be run globally by linking it:

   ```bash
   npm link
   ```

## Usage

Run the tool using the `directory-dumper` command with various options:

```bash
directory-dumper [options]
```

### Options

- `-d, --dir <path>`: Root directory to scan (default: current directory `.`).
- `-e, --ext <list>`: Comma-separated list of file extensions to include (e.g., `js,md,txt`).
- `-i, --ignore <patterns>`: Comma-separated list of additional ignore patterns.
- `--hidden`: Include hidden files (default: false).
- `-m, --max-size <mb>`: Skip files larger than the specified size in MB (default: 0, no limit).
- `--json`: Output results as JSON.
- `--markdown`: Output results as Markdown with code blocks.
- `-o, --output <file>`: Write output to a specified file instead of stdout.
- `--show-skipped`: Show a summary of skipped files and reasons.

### Examples

- Scan the current directory and output in plain text:

  ```bash
  directory-dumper
  ```

- Scan a specific directory, include only `.js` and `.md` files, and output to a file:

  ```bash
  directory-dumper -d ./src -e js,md -o output.txt
  ```

- Scan with JSON output, including hidden files:

  ```bash
  directory-dumper --json --hidden
  ```

- Scan with custom ignore patterns and show skipped files:

  ```bash
  directory-dumper -i node_modules,dist --show-skipped
  ```

## Output Formats

- **Plain Text**: Files are listed with their relative paths as headers (`--- path ---`) followed by their contents.
- **JSON**: Outputs an array of objects with `file` (relative path) and `content` (file contents).
- **Markdown**: Outputs files with relative paths as headers (`### path`) and contents in code blocks.

## Dependencies

- `chalk`: For colored console output.
- `commander`: For parsing command-line arguments.
- `ignore`: For handling `.gitignore` and custom ignore patterns.
- `ora`: For displaying a progress spinner.

## License

This project is licensed under the MIT License.