export function groupLinesByY(items: any[]) {
  const lines: any[] = [];

  items
    .sort((a, b) => b.y - a.y)
    .forEach(item => {
      const line = lines.find(l => Math.abs(l.y - item.y) < 3);
      if (line) {
        line.text += ' ' + item.text;
      } else {
        lines.push({ ...item });
      }
    });

  return lines;
}
