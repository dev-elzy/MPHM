'use client';

import * as React from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
  RowSelectionState,
} from '@tanstack/react-table';
import {
  Plus,
  Upload,
  Download,
  RotateCw,
  SlidersHorizontal,
  ChevronDown,
  Filter,
  FolderOpen,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { SearchBox } from './SearchBox';
import { Pagination } from './Pagination';
import { BulkToolbar, BulkAction } from './BulkToolbar';
import { FilterPanel, FilterDefinition } from './FilterPanel';
import { TableSkeleton } from '@/components/ui-custom/TableSkeleton';
import { EmptyState } from '@/components/ui-custom/EmptyState';

interface DataGridProps<TData> {
  data: TData[];
  columns: ColumnDef<TData, unknown>[];
  totalItems: number;
  currentPage: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (limit: number) => void;
  
  // Search
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
  searchPlaceholder?: string;

  // Sorting
  sortBy?: string;
  order?: 'asc' | 'desc';
  onSortChange?: (field: string, direction: 'asc' | 'desc') => void;

  // Filters
  filters?: FilterDefinition[];
  activeFilters?: Record<string, string>;
  onFilterChange?: (key: string, value: string) => void;
  onResetFilters?: () => void;

  // Actions
  onAddClick?: () => void;
  addLabel?: string;
  onImportClick?: () => void;
  onExportClick?: () => void;
  onRefreshClick?: () => void;

  // Bulk Actions
  bulkActions?: BulkAction[];

  // States
  isLoading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
}

export function DataGrid<TData>({
  data,
  columns,
  totalItems,
  currentPage,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  searchQuery = '',
  onSearchChange,
  searchPlaceholder = 'Cari data...',
  sortBy,
  order,
  onSortChange,
  filters = [],
  activeFilters = {},
  onFilterChange,
  onResetFilters,
  onAddClick,
  addLabel = 'Tambah Data',
  onImportClick,
  onExportClick,
  onRefreshClick,
  bulkActions = [],
  isLoading = false,
  emptyTitle,
  emptyDescription,
}: DataGridProps<TData>) {
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);
  const [columnVisibility, setColumnVisibility] = React.useState<Record<string, boolean>>({});

  // Reset selection on data change
  React.useEffect(() => {
    setRowSelection({});
  }, [data]);

  // Append checkbox selection column if bulk actions exist
  const gridColumns = React.useMemo(() => {
    if (bulkActions.length === 0) return columns;

    const selectColumn: ColumnDef<TData, unknown> = {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="translate-y-[2px]"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-[2px]"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    };

    return [selectColumn, ...columns];
  }, [columns, bulkActions]);

  const table = useReactTable({
    data,
    columns: gridColumns,
    state: {
      rowSelection,
      columnVisibility,
    },
    enableRowSelection: bulkActions.length > 0,
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
  });

  const selectedCount = Object.keys(rowSelection).length;

  const handleSort = (field: string) => {
    if (!onSortChange) return;
    if (sortBy === field) {
      onSortChange(field, order === 'asc' ? 'desc' : 'asc');
    } else {
      onSortChange(field, 'desc');
    }
  };

  // Convert bulk actions to target actual selected row data
  const resolvedBulkActions = React.useMemo(() => {
    return bulkActions.map((action) => ({
      ...action,
      onClick: () => {
        action.onClick();
        setRowSelection({});
      },
    }));
  }, [bulkActions]);

  return (
    <div className="space-y-4 text-left">
      {/* 1. TOOLBAR AREA */}
      <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="flex items-center gap-2.5 w-full md:max-w-md">
          {onSearchChange && (
            <SearchBox
              value={searchQuery}
              onChange={onSearchChange}
              placeholder={searchPlaceholder}
            />
          )}

          {filters.length > 0 && (
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`h-9 w-9 border-zinc-200 dark:border-zinc-800 shrink-0 ${
                isFilterOpen ? 'bg-zinc-100 dark:bg-zinc-800' : ''
              }`}
            >
              <Filter className="h-4 w-4 text-zinc-500" />
            </Button>
          )}

          {/* Column Visibility Manager */}
          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 disabled:pointer-events-none disabled:opacity-50 border border-zinc-200 bg-white shadow-xs hover:bg-zinc-100 hover:text-zinc-900 dark:border-zinc-850 dark:bg-zinc-950 dark:hover:bg-zinc-800 dark:hover:text-zinc-50 h-9 w-9 shrink-0 cursor-pointer">
              <SlidersHorizontal className="h-4 w-4 text-zinc-500" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[180px] bg-white dark:bg-zinc-950">
              <DropdownMenuLabel className="text-xs">Kelola Kolom</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {table
                .getAllColumns()
                .filter((col) => col.getCanHide())
                .map((col) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={col.id}
                      className="capitalize text-xs cursor-pointer"
                      checked={col.getIsVisible()}
                      onCheckedChange={(value) => col.toggleVisibility(!!value)}
                    >
                      {col.id.replace(/([A-Z])/g, ' $1').trim()}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Global actions */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          {onRefreshClick && (
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={onRefreshClick}
              className="h-9 w-9 border-zinc-200 dark:border-zinc-800 shrink-0"
            >
              <RotateCw className="h-4 w-4 text-zinc-500" />
            </Button>
          )}
          {onImportClick && (
            <Button
              type="button"
              variant="outline"
              onClick={onImportClick}
              className="h-9 text-xs border-zinc-200 dark:border-zinc-800 flex items-center gap-1.5"
            >
              <Upload className="h-4 w-4 text-zinc-500" />
              Impor
            </Button>
          )}
          {onExportClick && (
            <Button
              type="button"
              variant="outline"
              onClick={onExportClick}
              className="h-9 text-xs border-zinc-200 dark:border-zinc-800 flex items-center gap-1.5"
            >
              <Download className="h-4 w-4 text-zinc-500" />
              Ekspor
            </Button>
          )}
          {onAddClick && (
            <Button
              type="button"
              onClick={onAddClick}
              className="h-9 text-xs bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 flex items-center gap-1.5 font-semibold hover:bg-zinc-850 dark:hover:bg-zinc-100"
            >
              <Plus className="h-4 w-4" />
              {addLabel}
            </Button>
          )}
        </div>
      </div>

      {/* 2. FILTER PANEL AREA */}
      {filters.length > 0 && onFilterChange && onResetFilters && (
        <FilterPanel
          isOpen={isFilterOpen}
          filters={filters}
          activeFilters={activeFilters}
          onFilterChange={onFilterChange}
          onResetFilters={onResetFilters}
        />
      )}

      {/* 3. BULK ACTIONS FLOATING TOOLBAR */}
      {selectedCount > 0 && bulkActions.length > 0 && (
        <BulkToolbar
          selectedCount={selectedCount}
          actions={resolvedBulkActions}
          onClearSelection={() => setRowSelection({})}
        />
      )}

      {/* 4. TABLE CONTAINER */}
      <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden bg-white dark:bg-zinc-950 shadow-sm">
        {isLoading ? (
          <TableSkeleton />
        ) : data.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-zinc-50 dark:bg-zinc-900/50 sticky top-0 border-b border-zinc-200 dark:border-zinc-800">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id} className="hover:bg-transparent">
                    {headerGroup.headers.map((header) => {
                      const isSortable = header.column.getCanSort() && onSortChange;
                      
                      return (
                        <TableHead
                          key={header.id}
                          onClick={() => isSortable && handleSort(header.column.id)}
                          className={`text-xs font-semibold text-zinc-500 p-3 h-10 select-none ${
                            isSortable ? 'cursor-pointer hover:text-zinc-950 dark:hover:text-zinc-200' : ''
                          }`}
                        >
                          <div className="flex items-center gap-1.5">
                            {header.isPlaceholder
                              ? null
                              : flexRender(header.column.columnDef.header, header.getContext())}
                            {isSortable && sortBy === header.column.id && (
                              <ChevronDown
                                className={`h-3.5 w-3.5 transition-transform ${
                                  order === 'asc' ? 'rotate-180' : ''
                                }`}
                              />
                            )}
                          </div>
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                    className="hover:bg-zinc-50/70 dark:hover:bg-zinc-900/35 border-b border-zinc-150 dark:border-zinc-800/80 last:border-0"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="p-3 text-sm text-zinc-700 dark:text-zinc-300">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <EmptyState
            icon={FolderOpen}
            title={emptyTitle || 'Belum Ada Data'}
            description={
              emptyDescription ||
              'Tidak ada rekaman data yang ditemukan. Klik tombol Tambah Data di atas untuk menambahkan record baru.'
            }
            action={onAddClick ? (
              <Button
                type="button"
                onClick={onAddClick}
                className="h-9 text-xs bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 flex items-center gap-1.5 font-semibold hover:bg-zinc-850 dark:hover:bg-zinc-100"
              >
                <Plus className="h-4 w-4" />
                {addLabel}
              </Button>
            ) : undefined}
          />
        )}
      </div>

      {/* 5. PAGINATION CONTROL */}
      {totalItems > 0 && (
        <Pagination
          currentPage={currentPage}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={onPageChange}
          onItemsPerPageChange={onItemsPerPageChange}
        />
      )}
    </div>
  );
}
