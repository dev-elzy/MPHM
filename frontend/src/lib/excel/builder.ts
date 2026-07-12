export interface TemplateColumn {
  header: string;
  key: string;
  width?: number;
  tooltip?: string;
  required?: boolean;
}

/**
 * Generates an Excel template (.xlsx) with locked headers and tooltips.
 */
export async function generateProtectedTemplate(
  columns: TemplateColumn[],
  sheetName: string = 'Template'
): Promise<ArrayBuffer> {
  const ExcelJSLib = await import('exceljs');
  const ExcelJS = ExcelJSLib.default || ExcelJSLib;
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(sheetName);

  // Set columns configuration
  worksheet.columns = columns.map((col) => ({
    header: col.header,
    key: col.key,
    width: col.width || 22,
  }));

  // Style headers
  const headerRow = worksheet.getRow(1);
  headerRow.height = 28;
  headerRow.eachCell((cell, colNumber) => {
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE9ECEF' }, // Light gray background
    };
    cell.font = {
      bold: true,
      color: { argb: 'FF212529' },
      size: 11,
    };
    cell.alignment = { vertical: 'middle', horizontal: 'left' };
    
    // Add tooltip comment
    const colDef = columns[colNumber - 1];
    if (colDef && colDef.tooltip) {
      cell.note = {
        texts: [
          { font: { bold: true, size: 9 }, text: 'Petunjuk:\n' },
          { font: { size: 9 }, text: colDef.tooltip }
        ],
        margins: {
          insetmode: 'custom',
          inset: [0.1, 0.1, 0.1, 0.1]
        }
      };
    }

    // Keep header cell locked
    cell.protection = {
      locked: true,
    };
  });

  // Explicitly unlock data entry rows (up to 2000 rows)
  for (let rowIdx = 2; rowIdx <= 2000; rowIdx++) {
    const row = worksheet.getRow(rowIdx);
    for (let colIdx = 1; colIdx <= columns.length; colIdx++) {
      const cell = row.getCell(colIdx);
      cell.protection = {
        locked: false,
      };
    }
  }

  // Protect the sheet (prevents header modifications while allowing data entry in unlocked cells)
  await worksheet.protect('', {
    selectLockedCells: true,
    selectUnlockedCells: true,
    formatCells: true,
    formatColumns: true,
    formatRows: true,
  });

  const buffer = await workbook.xlsx.writeBuffer() as ArrayBuffer;
  return buffer;
}

/**
 * Parses uploaded Excel files into JSON objects based on column keys.
 */
export async function parseExcelFile(
  file: File,
  columnKeys: string[]
): Promise<Record<string, string | null>[]> {
  const ExcelJSLib = await import('exceljs');
  const ExcelJS = ExcelJSLib.default || ExcelJSLib;
  const workbook = new ExcelJS.Workbook();
  const arrayBuffer = await file.arrayBuffer();
  await workbook.xlsx.load(arrayBuffer);
  
  const worksheet = workbook.getWorksheet(1);
  if (!worksheet) throw new Error('Worksheet tidak ditemukan');

  const rows: Record<string, string | null>[] = [];

  worksheet.eachRow((row, rowNumber) => {
    // Skip header row
    if (rowNumber === 1) return;

    const rowData: Record<string, string | null> = {};
    let hasData = false;

    columnKeys.forEach((key, colIndex) => {
      const cell = row.getCell(colIndex + 1);
      const cellValue = cell.value;
      let textValue: string | null = null;

      if (cellValue !== null && cellValue !== undefined) {
        if (typeof cellValue === 'object') {
          if ('richText' in cellValue && cellValue.richText) {
            textValue = cellValue.richText.map((t) => t.text).join('');
          } else if ('text' in cellValue) {
            textValue = String(cellValue.text);
          } else if ('result' in cellValue) {
            // Handle formula result
            textValue = String(cellValue.result);
          } else {
            textValue = String(cellValue);
          }
        } else {
          textValue = String(cellValue).trim();
        }
        
        if (textValue !== '') {
          hasData = true;
        }
      }
      rowData[key] = textValue === '' ? null : textValue;
    });

    if (hasData) {
      rows.push(rowData);
    }
  });

  return rows;
}
