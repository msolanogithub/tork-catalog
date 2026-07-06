export function parseCSV(csvText: string): Record<string, string>[] {
  const lines: string[] = [];
  let currentLine = '';
  let inQuotes = false;
  
  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];
    const nextChar = csvText[i + 1];
    
    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        currentLine += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === '\r' || char === '\n') {
      if (inQuotes) {
        currentLine += char;
      } else {
        if (char === '\r' && nextChar === '\n') {
          i++;
        }
        lines.push(currentLine);
        currentLine = '';
      }
    } else {
      currentLine += char;
    }
  }
  if (currentLine) {
    lines.push(currentLine);
  }
  
  if (lines.length < 2) return [];
  
  const headers = parseCSVLine(lines[0]);
  const results: Record<string, string>[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    const values = parseCSVLine(lines[i]);
    const row: Record<string, string> = {};
    headers.forEach((header, index) => {
      row[header.trim()] = (values[index] || '').trim();
    });
    results.push(row);
  }
  
  return results;
}

function parseCSVLine(line: string): string[] {
  const values: string[] = [];
  let currentValue = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];
    
    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        currentValue += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',') {
      if (inQuotes) {
        currentValue += char;
      } else {
        values.push(currentValue);
        currentValue = '';
      }
    } else {
      currentValue += char;
    }
  }
  values.push(currentValue);
  return values;
}

export function formatPrice(value: number): string {
  // Returns format like $350.000
  const formatted = new Intl.NumberFormat('es-CO', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
  return `$${formatted}`;
}
