export function safeJsonParse(data: any): any {
  if (typeof data === 'string') {
    try {
      return JSON.parse(data);
    } catch {
      return data;
    }
  }
  return data;
}

export function calculateSize(data: any): number {
  const str = typeof data === 'string' ? data : JSON.stringify(data);
  return new Blob([str]).size;
}
