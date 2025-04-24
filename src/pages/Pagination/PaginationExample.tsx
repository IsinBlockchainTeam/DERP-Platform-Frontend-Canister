import React, { useState, useEffect } from 'react';
import GenericTable, { GenericTableColumn } from '../../components/Table/GenericTable';
import PaginationIndicator from './PaginationIndicator';

// Example data type for the table
type DataItem = {
  id: number;
  name: string;
  email: string;
  status: string;
};

// Example data for demonstration
const exampleData: DataItem[] = Array.from({ length: 55 }, (_, i) => ({
  id: i + 1,
  name: `User ${i + 1}`,
  email: `user${i + 1}@example.com`,
  status: i % 3 === 0 ? 'Active' : i % 3 === 1 ? 'Inactive' : 'Pending',
}));

const PaginationExample: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [paginatedData, setPaginatedData] = useState<DataItem[]>([]);
  
  // Table columns definition
  const columns: GenericTableColumn<DataItem>[] = [
    { header: 'ID', accessor: 'id' },
    { header: 'Name', accessor: 'name' },
    { header: 'Email', accessor: 'email' },
    { header: 'Status', accessor: 'status' },
  ];

  // Update paginated data when currentPage or pageSize changes
  useEffect(() => {
    const startIndex = (currentPage - 1) * pageSize;
    setPaginatedData(exampleData.slice(startIndex, startIndex + pageSize));
  }, [currentPage, pageSize]);

  // Calculate the pagination metadata
  const totalItems = exampleData.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startItem = Math.min((currentPage - 1) * pageSize + 1, totalItems);
  const endItem = Math.min(currentPage * pageSize, totalItems);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="flex flex-col w-full">
      <h1 className="text-2xl font-bold mb-4">Pagination Example</h1>
      
      {/* Table with data */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <GenericTable 
            data={paginatedData} 
            columns={columns} 
          />
          
          {/* Pagination indicator at the bottom */}
          <PaginationIndicator
            currentPage={currentPage}
            totalPages={totalPages}
            startItem={startItem}
            endItem={endItem}
            totalItems={totalItems}
            onPageChange={handlePageChange}
            className="mt-4"
          />
        </div>
      </div>
    </div>
  );
};

export default PaginationExample; 