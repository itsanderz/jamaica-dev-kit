/**
 * Shared output formatting utilities for the CLI.
 */

let jsonMode = false;

export function setJsonMode(enabled: boolean): void {
  jsonMode = enabled;
}

export function isJsonMode(): boolean {
  return jsonMode;
}

export function output(data: unknown): void {
  if (jsonMode) {
    console.log(JSON.stringify(data, null, 2));
  } else if (typeof data === 'string') {
    console.log(data);
  } else {
    console.log(JSON.stringify(data, null, 2));
  }
}

export function success(message: string): void {
  if (!jsonMode) console.log(`\u2713 ${message}`);
}

export function error(message: string): void {
  if (!jsonMode) console.error(`\u2717 ${message}`);
}

export function table(headers: string[], rows: string[][]): void {
  if (jsonMode) {
    const objects = rows.map((row) =>
      Object.fromEntries(headers.map((h, i) => [h, row[i]]))
    );
    console.log(JSON.stringify(objects, null, 2));
    return;
  }

  const widths = headers.map((h, i) =>
    Math.max(h.length, ...rows.map((r) => (r[i] || '').length))
  );

  const sep = widths.map((w) => '-'.repeat(w)).join('---');
  const headerLine = headers.map((h, i) => h.padEnd(widths[i])).join('   ');

  console.log(headerLine);
  console.log(sep);
  for (const row of rows) {
    console.log(row.map((cell, i) => (cell || '').padEnd(widths[i])).join('   '));
  }
}
