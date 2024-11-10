import React from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getPaginationRowModel,
  Row,
  SortingState,
  ColumnDef,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { Input } from "@/components/ui/input";


/// @Tanstack table related terminology and other parameters
// Table: The table component that will be displayed in the UI 
// TableHeader: The header of the table
// TableBody: The body of the table
// TableRow: The row of the table
// TableCell: The cell of the table that will contain the data
// Row: The row of the table
// 

interface DataTableProps<T> {
  // The data that will be displayed in the table
  data: T[];
  // The columns that will be displayed in the table
  columns: ColumnDef<T>[];
  // The total number of pages
  pageCount: number;
  // The current page
  currentPage: number;
  // The number of rows per page
  pageSize?: number;
  // The function that will be called when the page changes
  onPageChange: (page: number) => void;
  // The function that will be called when the edit button is clicked
  onEdit?: (record: T) => void;
  // The function that will be called when the delete button is clicked
  onDelete?: (record: T) => void;
  // The route to the edit page
  editRoute?: string;
  // Whether the table is loading
  isLoading?: boolean;
  // Add these new props
  searchValue?: string;
  onSearch?: (value: string) => void;
  // Add new prop for column styles
  columnStyles?: Record<string, string>;
}

const DataTable = <T extends { id: string | number }>({
  data = [],
  columns = [],
  pageCount = 0,
  currentPage = 1,
  pageSize = 10,
  onPageChange,
  onEdit,
  onDelete,
  editRoute,
  isLoading = false,
  searchValue = '',
  onSearch,
  columnStyles = {},
}: DataTableProps<T>) => {
  // The function that will be called when the page changes
  const navigate = useNavigate();

  // The state that will be used to sort the table
  const [sorting, setSorting] = React.useState<SortingState>([]);

  // The columns that will be displayed in the table
  const tableColumns = React.useMemo(() => {
    if (!onEdit && !onDelete) return columns;

    // The columns that will be displayed in the table with the actions column added
    return [
      ...columns,
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }: { row: Row<T> }) => (
          <div className="flex gap-2">
            {onEdit && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (editRoute) {
                    navigate(`${editRoute}/${row.original.id}`);
                  } else {
                    onEdit(row.original);
                  }
                }}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            )}

            {/* 
              When the delete button is clicked, an alert dialog will be displayed to confirm the deletion
            */}
            {onDelete && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this item? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={() => onDelete(row.original)}
                      className="bg-red-500 hover:bg-red-600"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        ),
      },
    ];
  }, [columns, onEdit, onDelete, editRoute, navigate]);

  // The table that will be used to display the data 
  const table = useReactTable({
    data,
    columns: tableColumns,
    state: {
      sorting,
    },
    // The function that will be called when the sorting changes
    onSortingChange: setSorting,
    // The function that will be used to get the core row model
    getCoreRowModel: getCoreRowModel(),
    // The function that will be used to get the pagination row model
    getPaginationRowModel: getPaginationRowModel(),
    // Whether the pagination is manual
    manualPagination: true,
    // The total number of pages
    pageCount,
    // The initial state of the table
    initialState: {
      pagination: {
        pageSize,
      },
    },
  });

  // The table component that will be displayed in the UI 
  return (
    <div className="w-full">
      {onSearch && (
        <div className="flex items-center py-4">
          <Input
            placeholder="Search..."
            value={searchValue}
            onChange={(e) => onSearch(e.target.value)}
            className="max-w-sm"
          />
        </div>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead 
                    key={header.id}
                    className={columnStyles[header.column.id] || ''}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="min-h-[400px]">
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={tableColumns.length}
                  className="h-24 text-center"
                >
                  Loading...
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell 
                      key={cell.id}
                      className={columnStyles[cell.column.id] || ''}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={tableColumns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="text-sm text-gray-500">
          Page {currentPage} of {pageCount}
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === pageCount}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DataTable;