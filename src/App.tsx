import { useEffect, useState } from 'react';
import './App.css';
import DataTable from './DataTable';
import { ColumnDef } from '@tanstack/react-table';

interface AuctionData {
  id: number;
  dateString: string;
  auctioneer: string;
  lots: number;
  qty: number;
  qtySold: number;
  maxPrice: number;
  avgPrice: number;
  type: string;
}

function App() {
  const [data, setData] = useState<AuctionData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const columns: ColumnDef<AuctionData>[] = [
    {
      id: 'dateString',
      header: 'Date',
      accessorKey: 'dateString',
    },
    {
      id: 'auctioneer',
      header: 'Auctioneer',
      accessorKey: 'auctioneer',
    },
    {
      id: 'lots',
      header: 'Lots',
      accessorKey: 'lots',
    },
    {
      id: 'qty',
      header: 'Quantity',
      accessorKey: 'qty',
    },
    {
      id: 'qtySold',
      header: 'Quantity Sold',
      accessorKey: 'qtySold',
    },
    {
      id: 'maxPrice',
      header: 'Max Price',
      accessorKey: 'maxPrice',
    },
    {
      id: 'avgPrice',
      header: 'Average Price',
      accessorKey: 'avgPrice',
    },
    {
      id: 'type',
      header: 'Type',
      accessorKey: 'type',
    },
  ];

  const columnStyles: Partial<Record<keyof AuctionData | 'actions', string>> = {
    dateString: 'w-28',
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`https://spicesinfo.in/auction-all/${currentPage-1}/10`);
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [currentPage]);

  return (
    <div className="container mx-auto py-10">
      <DataTable
        data={data}
        columns={columns}
        pageCount={10}
        currentPage={currentPage}
        pageSize={10}
        onPageChange={setCurrentPage}
        isLoading={isLoading}
        columnStyles={columnStyles}
      />
    </div>
  )
}

export default App;
