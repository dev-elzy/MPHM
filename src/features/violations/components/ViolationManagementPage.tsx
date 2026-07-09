'use client';

import React, { useState, useEffect } from 'react';
import { ShieldAlert, Layers, AlertCircle, FileText } from 'lucide-react';

interface CategoryItem {
  id: string;
  name: string;
  color: string;
}

interface SeverityItem {
  id: string;
  name: string;
  levelWeight: number;
  badgeColor: string;
}

interface TypeItem {
  id: string;
  name: string;
  defaultPoints: number;
  description?: string;
  categoryName?: string;
  severityName?: string;
}

interface IncidentItem {
  id: string;
  studentName?: string;
  studentNis?: string;
  severityName?: string;
  violationTypeName?: string;
  description?: string;
  incidentDate?: string;
  location?: string;
  status?: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export function ViolationManagementPage() {
  const [activeTab, setActiveTab] = useState('incidents');
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [severities, setSeverities] = useState<SeverityItem[]>([]);
  const [types, setTypes] = useState<TypeItem[]>([]);
  const [incidents, setIncidents] = useState<IncidentItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAllData() {
      setLoading(true);
      try {
        const [catRes, sevRes, typeRes, incRes] = await Promise.all([
          fetch('/api/v1/violations/categories').then((r) => r.json() as Promise<ApiResponse<CategoryItem[]>>),
          fetch('/api/v1/violations/severities').then((r) => r.json() as Promise<ApiResponse<SeverityItem[]>>),
          fetch('/api/v1/violations/types').then((r) => r.json() as Promise<ApiResponse<TypeItem[]>>),
          fetch('/api/v1/violations/incidents').then((r) => r.json() as Promise<ApiResponse<IncidentItem[]>>),
        ]);

        if (catRes.success) setCategories(catRes.data);
        if (sevRes.success) setSeverities(sevRes.data);
        if (typeRes.success) setTypes(typeRes.data);
        if (incRes.success) setIncidents(incRes.data);
      } catch (err) {
        console.error('Failed to load violation management data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadAllData();
  }, []);

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {loading && (
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
          <span>Memuat data pelanggaran...</span>
        </div>
      )}
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Modul Pelanggaran & Kedisiplinan Santri
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Pencatatan insiden dan kelola Master Kategori, Severity, serta Jenis Pelanggaran dinamis.
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex overflow-x-auto border-b border-slate-200 dark:border-slate-800 gap-2 pb-1">
        <button
          onClick={() => setActiveTab('incidents')}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-t-xl transition-colors ${
            activeTab === 'incidents'
              ? 'bg-blue-600 text-white'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Laporan Kejadian ({incidents.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('types')}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-t-xl transition-colors ${
            activeTab === 'types'
              ? 'bg-blue-600 text-white'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <AlertCircle className="w-4 h-4" />
          <span>Master Jenis Pelanggaran ({types.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('categories')}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-t-xl transition-colors ${
            activeTab === 'categories'
              ? 'bg-blue-600 text-white'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Master Kategori ({categories.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('severities')}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-t-xl transition-colors ${
            activeTab === 'severities'
              ? 'bg-blue-600 text-white'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>Master Severity ({severities.length})</span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
        {activeTab === 'incidents' && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Daftar Laporan Pelanggaran Santri</h3>
            {incidents.length === 0 ? (
              <p className="text-sm text-slate-500 py-6 text-center">Belum ada laporan pelanggaran tercatat.</p>
            ) : (
              incidents.map((inc) => (
                <div
                  key={inc.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-800 dark:text-slate-100">{inc.studentName}</span>
                      <span className="text-xs text-slate-400">(NIS: {inc.studentNis})</span>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400">
                        {inc.severityName}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mt-1">
                      {inc.violationTypeName}: {inc.description}
                    </p>
                    <div className="text-xs text-slate-400 mt-1">
                      Tanggal: {inc.incidentDate} | Lokasi: {inc.location || 'Madrasah'}
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-lg text-xs font-bold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 self-start sm:self-center">
                    {inc.status}
                  </span>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'types' && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Master Jenis Pelanggaran</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {types.map((vt) => (
                <div
                  key={vt.id}
                  className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 dark:text-slate-100">{vt.name}</span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                      {vt.defaultPoints} Poin
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">{vt.description}</p>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                      {vt.categoryName}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400">
                      {vt.severityName}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'categories' && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Master Kategori Pelanggaran Dinamis</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 flex items-center justify-between"
                >
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{cat.name}</span>
                  <span className="w-4 h-4 rounded-full" style={{ backgroundColor: cat.color }} />
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'severities' && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Master Tingkat Keparahan (Severity)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {severities.map((sev) => (
                <div
                  key={sev.id}
                  className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 flex items-center justify-between"
                >
                  <div>
                    <div className="font-semibold text-slate-800 dark:text-slate-200">{sev.name}</div>
                    <div className="text-xs text-slate-400">Level Weight: {sev.levelWeight}</div>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg text-xs font-bold uppercase bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                    {sev.badgeColor}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
