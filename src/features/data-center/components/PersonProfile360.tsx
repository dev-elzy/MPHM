'use client';

import React, { useState, useEffect } from 'react';
import {
  User,
  GraduationCap,
  Briefcase,
  CheckCircle2,
  FileText,
  History,
  AlertTriangle,
  Calendar,
  Award,
} from 'lucide-react';

interface AlumniRecord {
  id: string;
  khidmahStatus?: string;
  khidmahLocation?: string;
  khidmahNotes?: string;
}

interface StudentProfile {
  id: string;
  nis?: string;
  status?: string;
  alumniRecord?: AlumniRecord | null;
}

interface TeacherProfile {
  id: string;
  teacherType: string;
}

interface OrgMembership {
  id: string;
  organization: string;
  position: string;
}

interface ViolationItem {
  id: string;
  violationType?: string;
  severityName?: string;
  description?: string;
  incidentDate?: string;
  incidentTime?: string;
  location?: string;
  status?: string;
}

interface AuditItem {
  date: string;
  title: string;
  description: string;
}

interface Person360Data {
  person: {
    id: string;
    nik?: string;
    fullName: string;
    gender: string;
    birthPlace?: string;
    birthDate?: string;
    phone?: string;
    address?: string;
    email?: string;
  };
  studentProfiles: StudentProfile[];
  teacherProfiles: TeacherProfile[];
  organizationMemberships: OrgMembership[];
  guardianProfiles: Record<string, unknown>[];
  violations: ViolationItem[];
  auditTimeline: AuditItem[];
}

export function PersonProfile360({ personId }: { personId: string }) {
  const [data, setData] = useState<Person360Data | null>(null);
  const [activeTab, setActiveTab] = useState('identitas');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      setLoading(true);
      try {
        const res = await fetch(`/api/v1/data-center/profile/${personId}`);
        const json = (await res.json()) as { success: boolean; data: Person360Data };
        if (json.success) {
          setData(json.data);
        }
      } catch (err) {
        console.error('Failed to load person 360 profile:', err);
      } finally {
        setLoading(false);
      }
    }
    if (personId) loadProfile();
  }, [personId]);

  if (loading) {
    return (
      <div className="p-8 text-center text-slate-500 animate-pulse">
        Memuat Profil Terpadu 360° dari Pusat Data...
      </div>
    );
  }

  if (!data || !data.person) {
    return (
      <div className="p-8 text-center text-red-500">
        Profil individu tidak ditemukan di Pusat Data MPHM.
      </div>
    );
  }

  const { person, studentProfiles, teacherProfiles, organizationMemberships, violations, auditTimeline } = data;

  const tabs = [
    { id: 'identitas', label: 'Identitas Dasar', icon: User },
    { id: 'akademik', label: 'Riwayat Akademik', icon: GraduationCap },
    { id: 'absensi', label: 'Absensi', icon: Calendar },
    { id: 'nilai', label: 'Nilai & Raport', icon: FileText },
    { id: 'akhlaq', label: 'Akhlaq', icon: Award },
    { id: 'pelanggaran', label: `Pelanggaran (${violations.length})`, icon: AlertTriangle },
    { id: 'khidmah', label: 'Khidmah Alumni', icon: CheckCircle2 },
    { id: 'ijazah', label: 'Ijazah', icon: FileText },
    { id: 'organisasi', label: 'Riwayat Organisasi', icon: Briefcase },
    { id: 'timeline', label: 'Audit Timeline', icon: History },
  ];

  return (
    <div className="space-y-6">
      {/* Top Identity Header Card */}
      <div className="bg-linear-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-6 sm:p-8 rounded-2xl shadow-lg border border-slate-800">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-2xl font-bold">
              {person.fullName.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">{person.fullName}</h1>
              <p className="text-sm text-slate-300 mt-1">
                {person.birthPlace || 'Pusat Data'}, {person.birthDate || ''} | {person.phone || 'Nomor HP -'}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">{person.address || 'Alamat pondok/rumah'}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {studentProfiles.map((sp, idx) => (
              <span key={idx} className="px-3 py-1 text-xs font-semibold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {sp.status === 'alumni' ? 'Alumni' : 'Santri Aktif'} (NIS: {sp.nis || '-'})
              </span>
            ))}
            {teacherProfiles.map((tp, idx) => (
              <span key={idx} className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                Pengajar {tp.teacherType}
              </span>
            ))}
            {organizationMemberships.map((om, idx) => (
              <span key={idx} className="px-3 py-1 text-xs font-semibold rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Pengurus {om.organization} ({om.position})
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex overflow-x-auto border-b border-slate-200 dark:border-slate-800 gap-1 pb-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-t-xl transition-colors shrink-0 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
        {activeTab === 'identitas' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Informasi Pribadi</h3>
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                  <dt className="text-slate-500">Nama Lengkap</dt>
                  <dd className="font-semibold text-slate-800 dark:text-slate-200">{person.fullName}</dd>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                  <dt className="text-slate-500">NIK (Kependudukan)</dt>
                  <dd className="font-semibold text-slate-800 dark:text-slate-200">{person.nik || '-'}</dd>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                  <dt className="text-slate-500">Tempat, Tanggal Lahir</dt>
                  <dd className="font-semibold text-slate-800 dark:text-slate-200">
                    {person.birthPlace || '-'}, {person.birthDate || '-'}
                  </dd>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                  <dt className="text-slate-500">Nomor Telepon / WhatsApp</dt>
                  <dd className="font-semibold text-slate-800 dark:text-slate-200">{person.phone || '-'}</dd>
                </div>
              </dl>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Alamat & Kontak</h3>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {person.address || 'Alamat lengkap belum dicatat.'}
              </p>
            </div>
          </div>
        )}

        {activeTab === 'pelanggaran' && (
          <div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">
              Riwayat Kedisiplinan & Pelanggaran Santri
            </h3>
            {violations.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-sm">
                Alhamdulillah, tidak ada catatan pelanggaran atas nama ini.
              </div>
            ) : (
              <div className="space-y-3">
                {violations.map((v) => (
                  <div
                    key={v.id}
                    className="flex items-start justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-800 dark:text-slate-100">{v.violationType}</span>
                        <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-400">
                          {v.severityName}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{v.description}</p>
                      <div className="flex items-center gap-4 text-xs text-slate-400">
                        <span>Tanggal: {v.incidentDate} {v.incidentTime}</span>
                        <span>Lokasi: {v.location || 'Area Madrasah'}</span>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                      {v.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'khidmah' && (
          <div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">Informasi Khidmah Alumni</h3>
            {studentProfiles.map((sp) => {
              const alumni = sp.alumniRecord;
              if (!alumni) return null;
              return (
                <div key={alumni.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">Status Pengabdian</span>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      {alumni.khidmahStatus === 'selesai_khidmah' ? 'Selesai Khidmah' : alumni.khidmahStatus}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Penempatan: <strong className="text-slate-800 dark:text-slate-200">{alumni.khidmahLocation || 'Madrasah Pusat'}</strong>
                  </p>
                  {alumni.khidmahNotes && (
                    <p className="text-xs text-slate-500">Catatan: {alumni.khidmahNotes}</p>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'timeline' && (
          <div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">Audit Timeline & Histori Perjalanan</h3>
            <div className="relative border-l-2 border-slate-200 dark:border-slate-800 ml-4 pl-6 space-y-6">
              {auditTimeline.map((item, idx) => (
                <div key={idx} className="relative">
                  <div className="absolute left-[-31px] top-1 w-4 h-4 rounded-full bg-blue-600 border-4 border-white dark:border-slate-900" />
                  <div className="text-xs font-semibold text-blue-600 dark:text-blue-400">{item.date}</div>
                  <div className="font-semibold text-slate-800 dark:text-slate-100 mt-0.5">{item.title}</div>
                  <div className="text-sm text-slate-500 mt-0.5">{item.description}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Placeholder for other tabs that render universal cards */}
        {['akademik', 'absensi', 'nilai', 'akhlaq', 'ijazah', 'organisasi'].includes(activeTab) && (
          <div className="py-6 text-center text-sm text-slate-500">
            Riwayat {activeTab.toUpperCase()} tersimpan secara abadi di Pusat Data MPHM.
          </div>
        )}
      </div>
    </div>
  );
}
