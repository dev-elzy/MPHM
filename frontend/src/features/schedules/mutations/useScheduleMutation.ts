import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { SchedulesService } from '../services/schedules.service';
import { ScheduleFormValues } from '../schemas';

export function useCreateSchedule() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: ScheduleFormValues) => SchedulesService.createSchedule(data),
    onSuccess: () => {
      toast.success('Jadwal berhasil ditambahkan');
      qc.invalidateQueries({ queryKey: ['schedules'] });
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Gagal menambahkan jadwal');
    },
  });
}

export function useUpdateSchedule() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ScheduleFormValues> }) => 
      SchedulesService.updateSchedule(id, data),
    onSuccess: () => {
      toast.success('Jadwal berhasil diperbarui');
      qc.invalidateQueries({ queryKey: ['schedules'] });
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Gagal memperbarui jadwal');
    },
  });
}

export function useDeleteSchedule() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => SchedulesService.deleteSchedule(id),
    onSuccess: () => {
      toast.success('Jadwal berhasil dihapus');
      qc.invalidateQueries({ queryKey: ['schedules'] });
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Gagal menghapus jadwal');
    },
  });
}
