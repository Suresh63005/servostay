// UserTable.js
import React, { useState } from 'react';
import Table from './Table';

const UserTable = () => {
    const [users, setUsers] = useState([  // Example data
        { id: 1, name: 'John Doe', email: 'john@example.com', password: '1234', status: 1 },
        { id: 2, name: 'Jane Doe', email: 'jane@example.com', password: 'abcd', status: 0 },
    ]);
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(users.length / 10);

    const columns = [
        { label: 'Name', field: 'name', sortable: true },
        { label: 'Email', field: 'email', sortable: true },
        { label: 'Password', field: 'password', sortable: true },
        { label: 'Status', field: 'status', sortable: true },
    ];

    const paginate = (page) => {
        setCurrentPage(page);
    };

    const sortData = (field) => {
        const sortedUsers = [...users].sort((a, b) => a[field] > b[field] ? 1 : -1);
        setUsers(sortedUsers);
    };

    const handleToggleChange = (id, currentStatus, field) => {
        const updatedUsers = users.map(user => user.id === id ? { ...user, [field]: currentStatus === 1 ? 0 : 1 } : user);
        setUsers(updatedUsers);
    };

    const handleUpdate = (id) => {
        // Handle update logic
    };

    const handleDelete = (id) => {
        const updatedUsers = users.filter(user => user.id !== id);
        setUsers(updatedUsers);
    };

    const filteredData = users.slice((currentPage - 1) * 10, currentPage * 10);

    return (
        <div>
            <h1>User List</h1>
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
                filteredData={users}
            />
        </div>
    );
}

export default UserTable;
