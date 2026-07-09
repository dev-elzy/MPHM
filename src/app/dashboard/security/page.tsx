import React from 'react';
import { SecurityDashboard } from '@/features/dashboard/components/SecurityDashboard';

export const metadata = {
  title: 'Dashboard Keamanan | MPHM Data Center',
  description: 'Pantauan kedisiplinan dan pelaporan insiden santri MPHM',
};

export default function SecurityDashboardPage() {
  return <SecurityDashboard />;
}
