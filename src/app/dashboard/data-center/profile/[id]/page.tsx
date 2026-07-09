import React from 'react';
import { PersonProfile360 } from '@/features/data-center/components/PersonProfile360';

export const metadata = {
  title: 'Profil Terpadu 360° | Pusat Data MPHM',
  description: 'Riwayat lengkap perjalanan santri, alumni, pengajar, dan pengurus di MPHM',
};

export default async function Person360PageRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <PersonProfile360 personId={id} />
    </div>
  );
}
