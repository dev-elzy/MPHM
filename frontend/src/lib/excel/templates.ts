import { generateProtectedTemplate, TemplateColumn } from './builder';

// Template Definitions for each module
export const SISWI_TEMPLATE_COLUMNS: TemplateColumn[] = [
  { header: 'Nama Lengkap', key: 'name', tooltip: 'Wajib diisi. Teks nama lengkap siswi.', required: true },
  { header: 'NIS', key: 'nis', tooltip: 'Opsional. Nomor Induk Siswa (hanya angka).', required: false },
  { header: 'NISN', key: 'nisn', tooltip: 'Opsional. Nomor Induk Siswa Nasional (hanya angka).', required: false },
  { header: 'Jenis Kelamin', key: 'gender', tooltip: 'Wajib diisi. Pilihan: L (Laki-laki) atau P (Perempuan).', required: true },
  { header: 'Tempat Lahir', key: 'birthPlace', tooltip: 'Opsional. Kota/kabupaten tempat lahir.', required: false },
  { header: 'Tanggal Lahir', key: 'birthDate', tooltip: 'Opsional. Format: YYYY-MM-DD (contoh: 2012-05-15).', required: false },
  { header: 'No HP Siswi', key: 'phone', tooltip: 'Opsional. Nomor HP aktif siswi.', required: false },
  { header: 'Nama Wali', key: 'parentName', tooltip: 'Opsional. Nama orang tua/wali.', required: false },
  { header: 'No HP Wali', key: 'parentPhone', tooltip: 'Opsional. Nomor kontak orang tua/wali.', required: false },
  { header: 'Alamat Lengkap', key: 'address', tooltip: 'Opsional. Alamat tempat tinggal lengkap.', required: false },
  { header: 'Tahun Masuk', key: 'entryYear', tooltip: 'Opsional. Tahun mulai mondok (contoh: 2026).', required: false },
  { header: 'Jenjang Masuk', key: 'entryJenjang', tooltip: 'Opsional. Pilihan: idadiyyah | ibtidaiyyah | tsanawiyyah | aliyyah.', required: false },
  { header: 'Catatan Khusus', key: 'notes', tooltip: 'Opsional. Catatan medis atau riwayat penting.', required: false },
];

export const MAPEL_TEMPLATE_COLUMNS: TemplateColumn[] = [
  { header: 'Kode Pelajaran', key: 'code', tooltip: 'Wajib diisi. Kode unik pelajaran (contoh: ARB-001, KMI-102).', required: true },
  { header: 'Nama Pelajaran', key: 'name', tooltip: 'Wajib diisi. Nama mata pelajaran (contoh: Bahasa Arab, Nahwu).', required: true },
  { header: 'Nama Arab', key: 'arabicName', tooltip: 'Opsional. Nama pelajaran dalam tulisan Arab.', required: false },
  { header: 'Kategori', key: 'category', tooltip: 'Wajib diisi. Pilihan: KMI | Kepesantrenan | Tahfidz | Umum.', required: true },
  { header: 'Deskripsi', key: 'description', tooltip: 'Opsional. Penjelasan singkat mata pelajaran.', required: false },
];

export const KELAS_TEMPLATE_COLUMNS: TemplateColumn[] = [
  { header: 'Nama Kelas', key: 'name', tooltip: 'Wajib diisi. Nama rombel kelas (contoh: Kelas 1-A, Kelas 3-B).', required: true },
  { header: 'Jenjang', key: 'jenjang', tooltip: 'Wajib diisi. Pilihan: idadiyyah | ibtidaiyyah | tsanawiyyah | aliyyah.', required: true },
  { header: 'Tingkat', key: 'tingkat', tooltip: 'Wajib diisi. Pilihan tingkat (contoh: I, II, III, IV, V, VI).', required: true },
  { header: 'Deskripsi', key: 'description', tooltip: 'Opsional. Keterangan singkat kelas.', required: false },
];

export const USER_TEMPLATE_COLUMNS: TemplateColumn[] = [
  { header: 'Nama Lengkap', key: 'name', tooltip: 'Wajib diisi. Nama lengkap pengguna.', required: true },
  { header: 'Email', key: 'email', tooltip: 'Wajib diisi. Alamat email aktif untuk login (contoh: nama@domain.com).', required: true },
  { header: 'Password', key: 'password', tooltip: 'Wajib diisi. Password minimal 6 karakter.', required: true },
  { header: 'Hak Akses (Role)', key: 'role', tooltip: 'Wajib diisi. Pilihan: admin | operator | mustahiq | mudir.', required: true },
  { header: 'No HP', key: 'phone', tooltip: 'Opsional. Nomor telepon/WhatsApp aktif.', required: false },
];

/**
 * Generates and triggers download of a protected Excel template in the browser.
 */
export async function downloadExcelTemplate(
  moduleName: 'siswi' | 'mapel' | 'kelas' | 'user'
): Promise<void> {
  let columns: TemplateColumn[] = [];
  let filename = '';
  let sheetName = '';

  switch (moduleName) {
    case 'siswi':
      columns = SISWI_TEMPLATE_COLUMNS;
      filename = 'template_impor_siswi.xlsx';
      sheetName = 'Siswi';
      break;
    case 'mapel':
      columns = MAPEL_TEMPLATE_COLUMNS;
      filename = 'template_impor_mata_pelajaran.xlsx';
      sheetName = 'Mata Pelajaran';
      break;
    case 'kelas':
      columns = KELAS_TEMPLATE_COLUMNS;
      filename = 'template_impor_kelas.xlsx';
      sheetName = 'Kelas';
      break;
    case 'user':
      columns = USER_TEMPLATE_COLUMNS;
      filename = 'template_impor_pengguna.xlsx';
      sheetName = 'Pengguna';
      break;
    default:
      throw new Error('Modul template tidak didukung');
  }

  const buffer = await generateProtectedTemplate(columns, sheetName);
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
