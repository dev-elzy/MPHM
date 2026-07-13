import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FormControl, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const API_BASE = 'https://www.emsifa.com/api-wilayah-indonesia/api';

interface Region {
  id: string;
  name: string;
}

interface AddressSelectorProps {
  provinceVal: string | null;
  cityVal: string | null;
  districtVal: string | null;
  subDistrictVal: string | null;
  onProvinceChange: (val: string, name: string) => void;
  onCityChange: (val: string, name: string) => void;
  onDistrictChange: (val: string, name: string) => void;
  onSubDistrictChange: (val: string, name: string) => void;
}

export function AddressSelector({
  provinceVal,
  cityVal,
  districtVal,
  subDistrictVal,
  onProvinceChange,
  onCityChange,
  onDistrictChange,
  onSubDistrictChange,
}: AddressSelectorProps) {
  // Fetch Provinces
  const { data: provinces, isLoading: loadProv } = useQuery<Region[]>({
    queryKey: ['provinces'],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/provinces.json`);
      if (!res.ok) throw new Error('Failed to fetch provinces');
      return res.json();
    },
  });

  // Fetch Cities
  const { data: cities, isLoading: loadCity } = useQuery<Region[]>({
    queryKey: ['cities', provinceVal],
    queryFn: async () => {
      if (!provinceVal) return [];
      const res = await fetch(`${API_BASE}/regencies/${provinceVal as string}.json`);
      if (!res.ok) throw new Error('Failed to fetch cities');
      return res.json();
    },
    enabled: !!provinceVal,
  });

  // Fetch Districts
  const { data: districts, isLoading: loadDist } = useQuery<Region[]>({
    queryKey: ['districts', cityVal],
    queryFn: async () => {
      if (!cityVal) return [];
      const res = await fetch(`${API_BASE}/districts/${cityVal as string}.json`);
      if (!res.ok) throw new Error('Failed to fetch districts');
      return res.json();
    },
    enabled: !!cityVal,
  });

  // Fetch SubDistricts (Villages)
  const { data: subDistricts, isLoading: loadSubDist } = useQuery<Region[]>({
    queryKey: ['subdistricts', districtVal],
    queryFn: async () => {
      if (!districtVal) return [];
      const res = await fetch(`${API_BASE}/villages/${districtVal as string}.json`);
      if (!res.ok) throw new Error('Failed to fetch villages');
      return res.json();
    },
    enabled: !!districtVal,
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormItem>
        <FormLabel className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Provinsi</FormLabel>
        <Select 
          value={provinceVal || undefined} 
          onValueChange={(val) => {
            const name = provinces?.find(p => p.id === val)?.name || '';
            onProvinceChange(val as string, name as string);
          }}
          disabled={loadProv}
        >
          <FormControl>
            <SelectTrigger className="h-9.5 text-sm dark:bg-zinc-900">
              <SelectValue placeholder="Pilih Provinsi" />
            </SelectTrigger>
          </FormControl>
          <SelectContent className="bg-white dark:bg-zinc-950">
            {provinces?.map((p) => (
              <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormItem>

      <FormItem>
        <FormLabel className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Kabupaten / Kota</FormLabel>
        <Select 
          value={cityVal || undefined} 
          onValueChange={(val) => {
            const name = cities?.find(c => c.id === val)?.name || '';
            onCityChange(val as string, name as string);
          }}
          disabled={!provinceVal || loadCity}
        >
          <FormControl>
            <SelectTrigger className="h-9.5 text-sm dark:bg-zinc-900">
              <SelectValue placeholder="Pilih Kab/Kota" />
            </SelectTrigger>
          </FormControl>
          <SelectContent className="bg-white dark:bg-zinc-950">
            {cities?.map((c) => (
              <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormItem>

      <FormItem>
        <FormLabel className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Kecamatan</FormLabel>
        <Select 
          value={districtVal || undefined} 
          onValueChange={(val) => {
            const name = districts?.find(d => d.id === val)?.name || '';
            onDistrictChange(val as string, name as string);
          }}
          disabled={!cityVal || loadDist}
        >
          <FormControl>
            <SelectTrigger className="h-9.5 text-sm dark:bg-zinc-900">
              <SelectValue placeholder="Pilih Kecamatan" />
            </SelectTrigger>
          </FormControl>
          <SelectContent className="bg-white dark:bg-zinc-950">
            {districts?.map((d) => (
              <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormItem>

      <FormItem>
        <FormLabel className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Desa / Kelurahan</FormLabel>
        <Select 
          value={subDistrictVal || undefined} 
          onValueChange={(val) => {
            const name = subDistricts?.find(s => s.id === val)?.name || '';
            onSubDistrictChange(val as string, name as string);
          }}
          disabled={!districtVal || loadSubDist}
        >
          <FormControl>
            <SelectTrigger className="h-9.5 text-sm dark:bg-zinc-900">
              <SelectValue placeholder="Pilih Desa/Kelurahan" />
            </SelectTrigger>
          </FormControl>
          <SelectContent className="bg-white dark:bg-zinc-950">
            {subDistricts?.map((s) => (
              <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormItem>
    </div>
  );
}
