const fs = require('fs');
const path = require('path');

function parsePrismaSchema() {
  const schemaPath = path.join(__dirname, '..', 'prisma', 'schema.prisma');
  const buffer = fs.readFileSync(schemaPath);
  let content = '';

  // Detect UTF-16 LE BOM (0xFF 0xFE)
  if (buffer[0] === 0xFF && buffer[1] === 0xFE) {
    content = buffer.toString('utf16le');
  } else {
    content = buffer.toString('utf8');
  }

  const lines = content.split(/\r?\n/);
  const models = {};
  let currentModel = null;
  const prismaTypes = ['String', 'Int', 'Float', 'Decimal', 'DateTime', 'Boolean', 'Bytes', 'BigInt', 'Unsupported', 'Json'];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith('//')) {
      continue;
    }

    if (trimmed.startsWith('model ')) {
      const parts = trimmed.split(/\s+/);
      const modelName = parts[1];
      if (modelName) {
        currentModel = {
          name: modelName,
          dbMap: null,
          fields: [],
          ignored: false,
          primaryKey: null,
        };
        models[modelName] = currentModel;
      }
      continue;
    }

    if (currentModel) {
      if (trimmed === '}') {
        currentModel = null;
        continue;
      }

      if (trimmed.startsWith('@@ignore')) {
        currentModel.ignored = true;
        continue;
      }

      if (trimmed.startsWith('@@map(')) {
        const match = trimmed.match(/@@map\("([^"]+)"\)/);
        if (match) {
          currentModel.dbMap = match[1];
        }
        continue;
      }

      if (trimmed.startsWith('@@')) {
        // Other model-level attributes like indexes or compound keys
        if (trimmed.startsWith('@@id(')) {
          const match = trimmed.match(/@@id\(\[([^\]]+)\]/);
          if (match) {
            currentModel.primaryKey = {
              fields: match[1].split(',').map(f => f.trim().replace(/"/g, '')),
              isCompound: true,
            };
          }
        }
        continue;
      }

      // It is a field line
      const parts = trimmed.split(/\s+/);
      const fieldName = parts[0];
      let fieldType = parts[1];

      if (!fieldName || !fieldType) continue;

      // Check if it's a relation or ignored type
      const isNullable = fieldType.endsWith('?');
      const isList = fieldType.endsWith('[]');
      const cleanType = fieldType.replace('?', '').replace('[]', '');

      // If it's a relation field, or not a standard Prisma primitive type, skip it or mark it as relation
      const isPrimitive = prismaTypes.includes(cleanType);

      // Check for attributes
      const attributes = parts.slice(2).join(' ');
      const isId = attributes.includes('@id');
      const isAutoincrement = attributes.includes('autoincrement()');

      // We only store fields that are primitive (i.e. actual DB columns)
      if (isPrimitive) {
        currentModel.fields.push({
          name: fieldName,
          type: cleanType,
          isNullable,
          isList,
          isId,
          isAutoincrement,
        });

        if (isId) {
          currentModel.primaryKey = {
            field: fieldName,
            type: cleanType,
            isCompound: false,
          };
        }
      }
    }
  }

  // Filter out ignored models or models without primary keys
  const validModels = {};
  for (const [name, model] of Object.entries(models)) {
    if (model.ignored) continue;
    if (!model.primaryKey) continue; // Cannot perform simple CRUD without PK
    validModels[name] = {
      name: model.name,
      dbMap: model.dbMap || model.name,
      primaryKey: model.primaryKey,
      fields: model.fields,
    };
  }

  const outputPath = path.join(__dirname, '..', 'src', 'lib', 'models-metadata.json');
  fs.writeFileSync(outputPath, JSON.stringify(validModels, null, 2), 'utf8');
  console.log(`Successfully parsed ${Object.keys(validModels).length} valid models out of ${Object.keys(models).length} total models.`);
}

parsePrismaSchema();
