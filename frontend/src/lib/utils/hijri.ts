export function getCurrentHijriDate(date = new Date()) {
  const formatter = new Intl.DateTimeFormat('en-US-u-ca-islamic-umalqura', {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric'
  });
  const parts = formatter.format(date).split('/'); // returns "Month/Day/Year"
  return {
    month: parseInt(parts[0], 10),
    day: parseInt(parts[1], 10),
    year: parseInt(parts[2], 10)
  };
}

export const HIJRI_MONTH_NAMES = [
  'Muharram',
  'Shafar',
  'Rabi\'ul Awwal',
  'Rabi\'ul Akhir',
  'Jumadil Ula',
  'Jumadil Akhirah',
  'Rajab',
  'Sya\'ban',
  'Ramadhan',
  'Syawwal',
  'Dzulqa\'dah',
  'Dzulhijjah'
];
