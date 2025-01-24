// ProductTable.js
import React, { useState } from 'react';
import Table from './Table';

const ProductTable = () => {
    const [products, setProducts] = useState([  // Example data
        { id: 1, category: 'Electronics', product: 'Laptop', banner: 'laptop-banner.jpg', status: 1 },
        { id: 2, category: 'Furniture', product: 'Chair', banner: 'chair-banner.jpg', status: 0 },
    ]);
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(products.length / 10);

    const columns = [
        { label: 'Category', field: 'category', sortable: true },
        { label: 'Product', field: 'product', sortable: true },
        { label: 'Banner', field: 'banner', sortable: true },
        { label: 'Status', field: 'status', sortable: true },
    ];

    const paginate = (page) => {
        setCurrentPage(page);
    };

    const sortData = (field) => {
        const sortedProducts = [...products].sort((a, b) => a[field] > b[field] ? 1 : -1);
        setProducts(sortedProducts);
    };

    const handleToggleChange = (id, currentStatus, field) => {
        const updatedProducts = products.map(product => product.id === id ? { ...product, [field]: currentStatus === 1 ? 0 : 1 } : product);
        setProducts(updatedProducts);
    };

    const handleUpdate = (id) => {
        // Handle update logic
    };

    const handleDelete = (id) => {
        const updatedProducts = products.filter(product => product.id !== id);
        setProducts(updatedProducts);
    };

    const filteredData = products.slice((currentPage - 1) * 10, currentPage * 10);

    return (
        <div>
            <h1>Product List</h1>
            <Table
                columns={columns}
                data={filteredData}
                onSort={sortData}
                onToggleChange={handleToggleChange}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
                currentPage={currentPage}
                totalPages={totalPages}
                paginate={paginate}
                filteredData={products}
            />
        </div>
    );
}

export default ProductTable;
