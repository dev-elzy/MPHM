import { Student } from '../types';

export function parseStudentsCSV(csvText: string): Omit<Student, 'id' | 'status'>[] {
  const lines = csvText.split(/\r?\n/);
  if (lines.length <= 1) return [];

  const result: Omit<Student, 'id' | 'status'>[] = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Handle quoted commas correctly (e.g. "Siti, Aminah", 12345)
    const cells: string[] = [];
    let currentCell = '';
    let insideQuotes = false;

    for (let c = 0; c < line.length; c++) {
      const char = line[c];
      if (char === '"') {
        insideQuotes = !insideQuotes;
      } else if (char === ',' && !insideQuotes) {
        cells.push(currentCell.trim().replace(/^"|"$/g, ''));
        currentCell = '';
      } else {
        currentCell += char;
      }
    }
    cells.push(currentCell.trim().replace(/^"|"$/g, ''));

    // Row needs at least a name
    if (cells.length === 0 || !cells[0]) continue;

    const rawGender = cells[3]?.toLowerCase();
    const gender: 'male' | 'female' = (rawGender === 'laki-laki' || rawGender === 'male' || rawGender === 'l') 
      ? 'male' 
      : 'female';

    result.push({
      name: cells[0] || '',
      nis: cells[1] || null,
      nisn: cells[2] || null,
      gender,
      birthPlace: cells[4] || null,
      birthDate: cells[5] || null,
      phone: cells[6] || null,
      parentName: cells[7] || null,
      parentPhone: cells[8] || null,
      address: cells[9] || null,
      entryYear: cells[10] || null,
      entryJenjang: cells[11] || null,
      notes: cells[12] || null,
    });
  }

  return result;
}

export function downloadStudentCSVTemplate(): void {
  const headers = [
    'Nama Lengkap',
    'NIS',
    'NISN',
    'Jenis Kelamin (Laki-laki / Perempuan)',
    'Tempat Lahir',
    'Tanggal Lahir (YYYY-MM-DD)',
    'No HP Siswi',
    'Nama Wali / Orang Tua',
    'No HP Wali',
    'Alamat Lengkap',
    'Tahun Masuk',
    'Jenjang Masuk',
    'Catatan Khusus',
  ];
  
  const sampleRow = [
    'Fatimah Azzahra',
    '26001',
    '0123456789',
    'Perempuan',
    'Surabaya',
    '2012-05-15',
    '081234567890',
    'Ahmad Zainudin',
    '081234567891',
    'Jl. Pesantren No. 12 RT 01/RW 02',
    '2026',
    'Tsanawiyyah',
    'Penerima Beasiswa Prestasi',
  ];

  const csvContent = [headers.join(','), sampleRow.join(',')].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', 'template_impor_siswi.csv');
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
