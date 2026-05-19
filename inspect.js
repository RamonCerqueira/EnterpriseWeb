const fs = require('fs');
const path = require('path');

try {
  const schemaPath = path.join(__dirname, 'prisma', 'schema.prisma');
  const buffer = fs.readFileSync(schemaPath);
  let content = '';
  
  // Detect UTF-16 LE BOM (0xFF 0xFE)
  if (buffer[0] === 0xFF && buffer[1] === 0xFE) {
    content = buffer.toString('utf16le');
  } else {
    content = buffer.toString('utf8');
  }

  const lines = content.split(/\r?\n/);
  let output = '';
  let currentModel = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    
    if (trimmed.startsWith('model ')) {
      const parts = trimmed.split(/\s+/);
      const modelName = parts[1];
      if (modelName) {
        currentModel = modelName;
        output += `=== MODEL: ${modelName} (Line ${i + 1}) ===\n`;
      }
    }
    
    if (currentModel) {
      output += line + '\n';
      if (trimmed === '}') {
        currentModel = null;
        output += '\n';
      }
    }
  }

  fs.writeFileSync(path.join(__dirname, 'model-fields.txt'), output, 'utf8');
  console.log('Successfully written schema definitions to model-fields.txt');
} catch (err) {
  fs.writeFileSync(path.join(__dirname, 'model-fields.txt'), 'Error: ' + err.message, 'utf8');
}
