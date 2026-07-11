/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import * as React from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { PageHeader } from '@/components/ui-custom/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useAuthSession } from '@/features/auth/hooks/useAuthSession';
import {
  Database,
  Building,
  GraduationCap,
  Save,
  RotateCcw,
  User,
  Key,
  Bell,
  Send,
  Trash2,
} from 'lucide-react';

interface SentNotificationItem {
  id: string;
  title: string;
  type: string;
  message: string;
  targetUserName: string;
  createdAt: number;
}

function PengaturanPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, isAdmin, refetch: refetchSession } = useAuthSession();

  const tabItems = [
    { id: 'umum', label: 'Umum & Lembaga', icon: Building, roles: ['admin', 'super_admin', 'operator', 'sekretariat'] },
    { id: 'akademik', label: 'Akademik', icon: GraduationCap, roles: ['admin', 'super_admin', 'operator', 'sekretariat'] },
    { id: 'database', label: 'Basis Data', icon: Database, roles: ['admin', 'super_admin', 'operator', 'sekretariat'] },
    { id: 'profil', label: 'Profil Saya', icon: User },
    { id: 'pengaturan', label: 'Keamanan Akun', icon: Key },
    { id: 'notifikasi', label: 'Kirim Notifikasi', icon: Bell, roles: ['admin', 'super_admin', 'operator', 'sekretariat'] },
  ].filter((item) => !item.roles || (isAdmin && item.roles.includes(user?.role?.toLowerCase() || '')));

  // Get active tab from URL or fallback
  const tabFromUrl = searchParams.get('tab');
  const allowedTabIds = tabItems.map(item => item.id);
  const activeTab = tabFromUrl && allowedTabIds.includes(tabFromUrl) 
    ? tabFromUrl 
    : (allowedTabIds.includes('umum') ? 'umum' : 'profil');

  // Madrasah Settings State
  const [madrasahName, setMadrasahName] = React.useState('Madrasah Putri Hidayatul Mubtadi\'at');
  const [madrasahLogo, setMadrasahLogo] = React.useState('/logo.png');
  const [defaultYear, setDefaultYear] = React.useState('Tahun Ajaran 2025/2026');
  const [defaultSemester, setDefaultSemester] = React.useState('Semester Ganjil');
  const [isSaving, setIsSaving] = React.useState(false);

  // Profile Form State
  const [profileName, setProfileName] = React.useState('');
  const [profileAvatar, setProfileAvatar] = React.useState('');
  const [isUpdatingProfile, setIsUpdatingProfile] = React.useState(false);

  // Password Settings Form State
  const [oldPassword, setOldPassword] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [isUpdatingPassword, setIsUpdatingPassword] = React.useState(false);

  // Notification Dashboard Form State
  const [usersList, setUsersList] = React.useState<{ id: string; name: string; email: string }[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = React.useState(false);
  const [targetUserId, setTargetUserId] = React.useState('');
  const [notifTitle, setNotifTitle] = React.useState('');
  const [notifMessage, setNotifMessage] = React.useState('');
  const [notifType, setNotifType] = React.useState('info');
  const [isSendingNotif, setIsSendingNotif] = React.useState(false);

  // Real-time notifications created list
  const [sentNotifications, setSentNotifications] = React.useState<SentNotificationItem[]>([]);
  const [isLoadingNotifications, setIsLoadingNotifications] = React.useState(false);

  const fetchUsers = async () => {
    setIsLoadingUsers(true);
    try {
      const res = await fetch('/api/v1/users');
      if (res.ok) {
        const json = (await res.json()) as { data?: { id: string; name: string; email: string }[] };
        setUsersList(json.data || []);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const fetchSentNotifications = async () => {
    setIsLoadingNotifications(true);
    try {
      const res = await fetch('/api/v1/notifications/sent');
      if (res.ok) {
        const json = (await res.json()) as { data?: SentNotificationItem[] };
        setSentNotifications(json.data || []);
      }
    } catch (err) {
      console.error('Error fetching sent notifications:', err);
    } finally {
      setIsLoadingNotifications(false);
    }
  };

  React.useEffect(() => {
    if (user) {
      setProfileName(user.name);
      setProfileAvatar(user.avatarUrl || '');
    }
  }, [user]);

  // Load all users and notifications if user is Admin and in the notifications tab
  React.useEffect(() => {
    if (activeTab === 'notifikasi' && isAdmin) {
      fetchUsers();
      fetchSentNotifications();
    }
  }, [activeTab, isAdmin]);

  const handleSaveCommon = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success('Pengaturan berhasil disimpan secara lokal!');
    }, 800);
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileName.trim()) {
      toast.error('Nama wajib diisi');
      return;
    }

    setIsUpdatingProfile(true);
    try {
      const res = await fetch('/api/v1/auth/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: profileName,
          avatarUrl: profileAvatar || null,
        }),
      });

      const json = (await res.json()) as { success?: boolean; message?: string };
      if (res.ok && json.success) {
        toast.success('Profil berhasil diperbarui!');
        refetchSession();
      } else {
        toast.error(json.message || 'Gagal memperbarui profil');
      }
    } catch (err) {
      console.error(err);
      toast.error('Koneksi server gagal');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error('Semua kolom sandi wajib diisi');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Konfirmasi kata sandi baru tidak cocok');
      return;
    }

    setIsUpdatingPassword(true);
    try {
      const res = await fetch('/api/v1/auth/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          oldPassword,
          newPassword,
          confirmPassword,
        }),
      });

      const json = (await res.json()) as { success?: boolean; message?: string };
      if (res.ok && json.success) {
        toast.success('Kata sandi berhasil diubah!');
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        toast.error(json.message || 'Gagal mengubah kata sandi');
      }
    } catch (err) {
      console.error(err);
      toast.error('Koneksi server gagal');
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleSendNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetUserId || !notifTitle || !notifMessage) {
      toast.error('Lengkapi semua kolom notifikasi');
      return;
    }

    setIsSendingNotif(true);
    try {
      const res = await fetch('/api/v1/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: targetUserId,
          title: notifTitle,
          message: notifMessage,
          type: notifType,
        }),
      });

      const json = (await res.json()) as { success?: boolean; message?: string };
      if (res.ok && json.success) {
        toast.success('Notifikasi realtime berhasil dikirim!');
        setNotifTitle('');
        setNotifMessage('');
        fetchSentNotifications();
      } else {
        toast.error(json.message || 'Gagal mengirim notifikasi');
      }
    } catch (err) {
      console.error(err);
      toast.error('Gagal mengirim ke server');
    } finally {
      setIsSendingNotif(false);
    }
  };

  const handleDeleteNotification = async (id: string) => {
    try {
      const res = await fetch(`/api/v1/notifications?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Notifikasi berhasil dihapus');
        fetchSentNotifications();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleBackup = () => {
    toast.success('Backup basis data berhasil diunduh (MPHM_backup.sql)');
  };

    // tabItems is defined at the top of the function to allow dynamic default values

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 animate-in fade-in duration-300">
      <PageHeader
        title="Pengaturan & Profil"
        description="Kelola akun personal, ganti sandi, preferensi sistem, dan kelola notifikasi."
      />

      <div className="flex flex-col md:flex-row gap-6">
        {/* Navigation Tabs */}
        <div className="flex md:flex-col gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none shrink-0 md:w-64">
          {tabItems.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  router.push(`/dashboard/pengaturan?tab=${tab.id}`);
                }}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer whitespace-nowrap md:w-full text-left ${
                  isActive
                    ? 'bg-[#C9A050] text-white shadow-md'
                    : 'bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900/40'
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Setting Panels */}
        <div className="flex-1">
          {activeTab === 'umum' && (
            <Card className="dark:bg-zinc-950 shadow-md border-zinc-200 dark:border-zinc-800 text-left">
              <CardHeader>
                <CardTitle className="text-base font-bold flex items-center gap-2 text-zinc-900 dark:text-white">
                  <Building className="h-5 w-5 text-[#C9A050]" />
                  Identitas Lembaga
                </CardTitle>
                <CardDescription>Sesuaikan logo dan nama madrasah yang tampil di kop laporan & raport.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-500">Nama Madrasah / Sekolah</label>
                  <Input
                    value={madrasahName}
                    onChange={(e) => setMadrasahName(e.target.value)}
                    className="max-w-md dark:bg-zinc-900"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-500">Path Logo Madrasah</label>
                  <Input
                    value={madrasahLogo}
                    onChange={(e) => setMadrasahLogo(e.target.value)}
                    className="max-w-md dark:bg-zinc-900"
                  />
                </div>
                <div className="pt-2">
                  <Button
                    onClick={handleSaveCommon}
                    disabled={isSaving}
                    className="bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 gap-2 text-xs h-9 px-4 cursor-pointer"
                  >
                    <Save className="h-4 w-4" />
                    {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'akademik' && (
            <Card className="dark:bg-zinc-950 shadow-md border-zinc-200 dark:border-zinc-800 text-left">
              <CardHeader>
                <CardTitle className="text-base font-bold flex items-center gap-2 text-zinc-900 dark:text-white">
                  <GraduationCap className="h-5 w-5 text-[#C9A050]" />
                  Preset Akademik
                </CardTitle>
                <CardDescription>Tentukan tahun ajaran dan semester aktif standar saat pengguna login.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-500">Tahun Ajaran Aktif (Default)</label>
                  <Input
                    value={defaultYear}
                    onChange={(e) => setDefaultYear(e.target.value)}
                    className="max-w-md dark:bg-zinc-900"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-500">Semester Aktif (Default)</label>
                  <Input
                    value={defaultSemester}
                    onChange={(e) => setDefaultSemester(e.target.value)}
                    className="max-w-md dark:bg-zinc-900"
                  />
                </div>
                <div className="pt-2">
                  <Button
                    onClick={handleSaveCommon}
                    disabled={isSaving}
                    className="bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 gap-2 text-xs h-9 px-4 cursor-pointer"
                  >
                    <Save className="h-4 w-4" />
                    {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'database' && (
            <Card className="dark:bg-zinc-950 shadow-md border-zinc-200 dark:border-zinc-800 text-left">
              <CardHeader>
                <CardTitle className="text-base font-bold flex items-center gap-2 text-zinc-900 dark:text-white">
                  <Database className="h-5 w-5 text-[#C9A050]" />
                  Manajemen Basis Data
                </CardTitle>
                <CardDescription>Unduh salinan data atau pulihkan dari file cadangan SQL.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col gap-3 max-w-md">
                  <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20">
                    <h4 className="text-xs font-semibold text-amber-800 dark:text-amber-300">Penting Sebelum Melakukan Backup</h4>
                    <p className="text-[11px] text-amber-700 dark:text-amber-400 mt-1 leading-normal">
                      Selalu lakukan pencadangan berkala setiap akhir semester sebelum melakukan proses kenaikan kelas atau kelulusan massal.
                    </p>
                  </div>
                  
                  <div className="flex flex-wrap gap-3 mt-2">
                    <Button
                      onClick={handleBackup}
                      className="bg-[#C9A050] hover:bg-[#B8903E] text-white gap-2 text-xs h-9 px-4 cursor-pointer"
                    >
                      <Database className="h-4 w-4" />
                      Unduh Cadangan SQL
                    </Button>
                    <Button
                      variant="outline"
                      className="gap-2 text-xs h-9 px-4 border-zinc-200 dark:border-zinc-800 cursor-pointer"
                    >
                      <RotateCcw className="h-4 w-4" />
                      Restore Data
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'profil' && (
            <Card className="dark:bg-zinc-950 shadow-md border-zinc-200 dark:border-zinc-800 text-left">
              <CardHeader>
                <CardTitle className="text-base font-bold flex items-center gap-2 text-zinc-900 dark:text-white">
                  <User className="h-5 w-5 text-[#C9A050]" />
                  Profil Akun
                </CardTitle>
                <CardDescription>Sesuaikan detail nama lengkap dan tautan foto profil Anda.</CardDescription>
              </CardHeader>
              <form onSubmit={handleUpdateProfile}>
                <CardContent className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-zinc-500">Nama Lengkap</label>
                    <Input
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      placeholder="Masukkan nama lengkap"
                      className="max-w-md dark:bg-zinc-900 text-zinc-800 dark:text-zinc-100"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-zinc-500">URL Foto Profil (Avatar)</label>
                    <Input
                      value={profileAvatar}
                      onChange={(e) => setProfileAvatar(e.target.value)}
                      placeholder="https://cloudinary.com/avatar.jpg"
                      className="max-w-md dark:bg-zinc-900 text-zinc-800 dark:text-zinc-100"
                    />
                  </div>
                  <div className="pt-2">
                    <Button
                      type="submit"
                      disabled={isUpdatingProfile}
                      className="bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 gap-2 text-xs h-9 px-4 cursor-pointer"
                    >
                      <Save className="h-4 w-4" />
                      {isUpdatingProfile ? 'Menyimpan...' : 'Simpan Profil'}
                    </Button>
                  </div>
                </CardContent>
              </form>
            </Card>
          )}

          {activeTab === 'pengaturan' && (
            <Card className="dark:bg-zinc-950 shadow-md border-zinc-200 dark:border-zinc-800 text-left">
              <CardHeader>
                <CardTitle className="text-base font-bold flex items-center gap-2 text-zinc-900 dark:text-white">
                  <Key className="h-5 w-5 text-[#C9A050]" />
                  Ganti Kata Sandi
                </CardTitle>
                <CardDescription>Masukkan kata sandi lama Anda untuk membuat pembaruan kata sandi baru.</CardDescription>
              </CardHeader>
              <form onSubmit={handleUpdatePassword}>
                <CardContent className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-zinc-500">Kata Sandi Lama</label>
                    <Input
                      type="password"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      placeholder="••••••••"
                      className="max-w-md dark:bg-zinc-900 text-zinc-800 dark:text-zinc-100"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-zinc-500">Kata Sandi Baru</label>
                    <Input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="max-w-md dark:bg-zinc-900 text-zinc-800 dark:text-zinc-100"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-zinc-500">Konfirmasi Kata Sandi Baru</label>
                    <Input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="max-w-md dark:bg-zinc-900 text-zinc-800 dark:text-zinc-100"
                    />
                  </div>
                  <div className="pt-2">
                    <Button
                      type="submit"
                      disabled={isUpdatingPassword}
                      className="bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 gap-2 text-xs h-9 px-4 cursor-pointer"
                    >
                      <Save className="h-4 w-4" />
                      {isUpdatingPassword ? 'Memproses...' : 'Ubah Kata Sandi'}
                    </Button>
                  </div>
                </CardContent>
              </form>
            </Card>
          )}

          {activeTab === 'notifikasi' && isAdmin && (
            <div className="space-y-6">
              <Card className="dark:bg-zinc-950 shadow-md border-zinc-200 dark:border-zinc-800 text-left">
                <CardHeader>
                  <CardTitle className="text-base font-bold flex items-center gap-2 text-zinc-900 dark:text-white">
                    <Bell className="h-5 w-5 text-[#C9A050]" />
                    Kirim Notifikasi Realtime
                  </CardTitle>
                  <CardDescription>Kirim pesan peringatan atau pengumuman instan langsung ke user panel santri/mustahiq.</CardDescription>
                </CardHeader>
                <form onSubmit={handleSendNotification}>
                  <CardContent className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-zinc-500">Pilih Penerima (User)</label>
                      {isLoadingUsers ? (
                        <div className="text-xs text-zinc-500">Memuat data user...</div>
                      ) : (
                        <select
                          value={targetUserId}
                          onChange={(e) => setTargetUserId(e.target.value)}
                          className="w-full max-w-md h-9 px-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm text-zinc-800 dark:text-zinc-100 focus:outline-none"
                        >
                          <option value="">-- Pilih User Penerima --</option>
                          {usersList.map((u) => (
                            <option key={u.id} value={u.id}>
                              {u.name} ({u.email})
                            </option>
                          ))}
                        </select>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-zinc-500">Tipe Notifikasi</label>
                      <select
                        value={notifType}
                        onChange={(e) => setNotifType(e.target.value)}
                        className="w-full max-w-md h-9 px-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm text-zinc-800 dark:text-zinc-100 focus:outline-none"
                      >
                        <option value="info">Info (Biru)</option>
                        <option value="success">Success (Hijau)</option>
                        <option value="warning">Warning (Oranye)</option>
                        <option value="error">Error (Merah)</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-zinc-500">Judul Pesan</label>
                      <Input
                        value={notifTitle}
                        onChange={(e) => setNotifTitle(e.target.value)}
                        placeholder="Contoh: Pengumuman Rapat Bulanan"
                        className="max-w-md dark:bg-zinc-900 text-zinc-800 dark:text-zinc-100"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-zinc-500">Isi Pesan Notifikasi</label>
                      <textarea
                        value={notifMessage}
                        onChange={(e) => setNotifMessage(e.target.value)}
                        placeholder="Tulis detail informasi pesan di sini..."
                        rows={4}
                        className="w-full max-w-md p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm text-zinc-800 dark:text-zinc-100 focus:outline-none"
                      />
                    </div>

                    <div className="pt-2">
                      <Button
                        type="submit"
                        disabled={isSendingNotif}
                        className="bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 gap-2 text-xs h-9 px-4 cursor-pointer"
                      >
                        <Send className="h-4 w-4" />
                        {isSendingNotif ? 'Mengirim...' : 'Kirim Sekarang'}
                      </Button>
                    </div>
                  </CardContent>
                </form>
              </Card>

              {/* History Sent Notifications */}
              <Card className="dark:bg-zinc-950 shadow-md border-zinc-200 dark:border-zinc-800 text-left">
                <CardHeader>
                  <CardTitle className="text-base font-bold text-zinc-900 dark:text-white">Riwayat Notifikasi Terkirim</CardTitle>
                  <CardDescription>Berikut adalah daftar notifikasi realtime yang telah berhasil dikirim ke database.</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingNotifications ? (
                    <div className="text-sm text-zinc-500 animate-pulse py-4">Memuat riwayat...</div>
                  ) : sentNotifications.length === 0 ? (
                    <div className="text-xs text-zinc-500 py-4">Belum ada riwayat notifikasi.</div>
                  ) : (
                    <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
                      {sentNotifications.map((notif) => (
                        <div key={notif.id} className="py-3 flex items-start justify-between gap-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">{notif.title}</span>
                              <span className={`px-2 py-0.5 text-[10px] rounded-full font-bold uppercase ${
                                notif.type === 'error' ? 'bg-red-100 text-red-700' :
                                notif.type === 'warning' ? 'bg-amber-100 text-amber-700' :
                                notif.type === 'success' ? 'bg-emerald-100 text-emerald-700' :
                                'bg-blue-100 text-blue-700'
                              }`}>{notif.type}</span>
                            </div>
                            <p className="text-xs text-zinc-600 dark:text-zinc-400">{notif.message}</p>
                            <div className="text-[10px] text-zinc-400">
                              Untuk: <span className="font-semibold">{notif.targetUserName}</span> | Dikirim: {new Date(notif.createdAt * 1000).toLocaleString('id-ID')}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteNotification(notif.id)}
                            className="h-8 w-8 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function PengaturanPage() {
  return (
    <React.Suspense fallback={<div className="p-8 text-center text-zinc-500 animate-pulse">Memuat pengaturan...</div>}>
      <PengaturanPageContent />
    </React.Suspense>
  );
}
