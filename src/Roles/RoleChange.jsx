    import React, { useEffect, useState } from 'react';
    import Header from '../components/Header';
    import { GoArrowDown, GoArrowUp } from 'react-icons/go';
    import { FaTrash } from "react-icons/fa";
    import axios from 'axios';
    import { useNavigate } from 'react-router-dom';
    import RoleHeader from './RoleHeader';
    import { NotificationContainer } from 'react-notifications';
    import { useLoading } from '../Context/LoadingContext';
    import api from '../utils/api';
    import Swal from 'sweetalert2';
    import Loader from '../common/Loader';
    import Table from '../common/Table';

    const RoleChange = () => {
        const navigate = useNavigate();
        const [role, setRole] = useState([]);
        const [filteredRole, setFilteredRole] = useState([]);
        const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });
        const [currentPage, setCurrentPage] = useState(1);
        const itemsPerPage = 10;
        const { isLoading, setIsLoading } = useLoading();

        useEffect(() => {
            fetchRoles();
        }, []);

        const handleSearch = (event) => {
            const querySearch = event.target.value.toLowerCase();
            const filteredData = role.filter(item =>
                Object.values(item).some(value =>
                    typeof value === 'object' && value !== null
                        ? Object.values(value).some(nestedValue =>
                            String(nestedValue).toLowerCase().includes(querySearch)
                        )
                        : String(value).toLowerCase().includes(querySearch)
                )
            );
            setFilteredRole(filteredData);
            setCurrentPage(1);
        };

        const fetchRoles = async () => {
            setIsLoading(true);
            try {
                const response = await api.get("/rollrequest/all");
                
                console.log(response.data)
                setRole(response.data);
                setFilteredRole(response.data);
            } catch (error) {
                console.error("Error fetching roles:", error);
            } finally {
                setIsLoading(false);
            }
        };

        const sortData = (key) => {
            const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
            const sortedData = [...filteredRole].sort((a, b) => {
                const aValue = key.includes('.') ? key.split('.').reduce((obj, key) => obj?.[key], a) : a[key];
                const bValue = key.includes('.') ? key.split('.').reduce((obj, key) => obj?.[key], b) : b[key];
                if (aValue < bValue) return direction === 'asc' ? -1 : 1;
                if (aValue > bValue) return direction === 'asc' ? 1 : -1;
                return 0;
            });
            setSortConfig({ key, direction });
            setFilteredRole(sortedData);
        };

        const handleDelete = async (id) => {
            const confirmed = await Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, delete it!',
            });

            if (confirmed.isConfirmed) {
                try {
                    await api.delete(`/rollrequest/delete/${id}`);
                    const updatedRole = role.filter(item => item.id !== id);
                    setRole(updatedRole);
                    setFilteredRole(updatedRole);
                    Swal.fire('Deleted!', 'The role has been deleted.', 'success');
                } catch (error) {
                    console.error("Error deleting role:", error);
                    Swal.fire('Error!', 'Failed to delete the role.', 'error');
                }
            }
        };

        const toggleStatus = async (id, currentStatus) => {
            try {
                const newStatus = currentStatus === 'approved' ? 'pending' : 'approved';
                const response = await api.put(`/rollrequest/update/${id}`, { status: newStatus });
                Swal.fire('Success', response.data.message, 'success');
                fetchRoles();
            } catch (error) {
                console.error('Error updating status:', error);
                Swal.fire('Error', 'Failed to update status.', 'error');
            }
        };

        const indexOfLast = currentPage * itemsPerPage;
        const indexOfFirst = indexOfLast - itemsPerPage;
        const currentRole = filteredRole.slice(indexOfFirst, indexOfLast);
        const paginate = (pageNumber) => setCurrentPage(pageNumber);
        const totalPages = Math.ceil(filteredRole.length / itemsPerPage);

        const columns = [
            { label: "Sr. No", field: "id", sortable: true, minWidth: "150px" },
            { label: "Name", field: "user.name", sortable: true, minWidth: "130px" },
            { label: "Email", field: "user.email", sortable: true, minWidth: "180px" },
            { label: "ID Proof", field: "id_proof", sortable: true, minWidth: "180px" },
            { label: "Image", field: "id_proof_img", sortable: false, minWidth: "120px" },
            { label: "Role", field: "user.role", sortable: true, minWidth: "120px" },
            { label: "Request Role", field: "requested_role", sortable: true, minWidth: "220px" },
            { label: "Status", field: "status", sortable: true, minWidth: "130px" },
            { label: "Actions", field: "actions", minWidth: "150px", sortable: false },
        ];
        

        return (
            <div>
                {isLoading && <Loader />}
                <div className="h-screen flex">
                    <div className="flex flex-1 flex-col bg-[#f7fbff]">
                        <Header />
                        <RoleHeader onSearch={handleSearch} />
                        <div className="px-6 h-full w-[79vw] overflow-scroll scrollbar-none">
                            <Table
                                columns={columns}
                                data={currentRole}
                                onSort={sortData}
                                onToggleChange={toggleStatus}
                                onDelete={handleDelete}
                                currentPage={currentPage}
                                totalPages={totalPages}
                                paginate={paginate}
                                filteredData={filteredRole}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    export default RoleChange;
