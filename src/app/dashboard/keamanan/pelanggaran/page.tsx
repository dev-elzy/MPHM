import React from 'react';
import { ViolationManagementPage } from '@/features/violations/components/ViolationManagementPage';

export const metadata = {
  title: 'Modul Pelanggaran & Kedisiplinan | MPHM',
  description: 'Kelola laporan kejadian dan master kategori pelanggaran dinamis MPHM',
};

export default function ViolationsPageRoute() {
  return <ViolationManagementPage />;
}
