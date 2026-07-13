/**
 * Formats a given date to the standard pondok calendar format:
 * [Tanggal Hijriyyah] - [Tanggal Masehi]
 * Example: 14 Muharram 1448 H - 28 Juli 2026 M
 */
export function formatHijriMasehi(dateString: string | Date | number | null | undefined): string {
  if (!dateString) return '-';

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return String(dateString);

    // Format Hijriyyah
    const hijriFormatter = new Intl.DateTimeFormat('id-ID', {
      calendar: 'islamic-umalqura',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    const hijriParts = hijriFormatter.formatToParts(date);
    const hDay = hijriParts.find(p => p.type === 'day')?.value || '';
    const hMonth = hijriParts.find(p => p.type === 'month')?.value || '';
    const hYear = hijriParts.find(p => p.type === 'year')?.value || '';
    
    // Sometimes formatting adds "AH" or we just append "H" manually.
    // The islamic-umalqura format might output like "14 Muharam 1448 H"
    const formattedHijri = `${hDay} ${hMonth} ${hYear} H`.replace(/ H H$/, ' H'); // cleanup duplicate H

    // Format Masehi
    const masehiFormatter = new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    const masehiParts = masehiFormatter.formatToParts(date);
    const mDay = masehiParts.find(p => p.type === 'day')?.value || '';
    const mMonth = masehiParts.find(p => p.type === 'month')?.value || '';
    const mYear = masehiParts.find(p => p.type === 'year')?.value || '';
    
    const formattedMasehi = `${mDay} ${mMonth} ${mYear} M`;

    return `${formattedHijri} - ${formattedMasehi}`;
  } catch (error) {
    console.error('Error formatting hijri date:', error);
    // Fallback to basic masehi
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date(dateString)) + ' M';
  }
}
