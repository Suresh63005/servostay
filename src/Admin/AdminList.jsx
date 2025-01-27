import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Modal, Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaPen, FaTrash } from "react-icons/fa";
import Header from '../components/Header';
import { useLoading } from '../Context/LoadingContext';
import { useLocation, useNavigate } from 'react-router-dom';
import Loader from '../common/Loader';
import AdminHeader from './AdminHeader';
import { DeleteEntity } from '../utils/Delete';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import Swal from 'sweetalert2';
import api from '../utils/api';
import { handleSort } from '../utils/sorting';
import { GoArrowDown, GoArrowUp } from 'react-icons/go';

const AdminList = () => {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const adminsPerPage = 10;
    const { isLoading, setIsLoading } = useLoading();
    const location = useLocation();
    const [admins, setAdmins] = useState([]);
    const [filteredAdmins, setFilteredAdmins] = useState([]);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [adminToEdit, setAdminToEdit] = useState(null);
    const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });
    const [editForm, setEditForm] = useState({
        username: '',
        password: '',
        userType: ''
    });
    const [addForm, setAddForm] = useState({
        username: '',
        password: '',
        userType: 'admin'
    });

    useEffect(() => {
        fetchAdmins();
    }, []);

    const fetchAdmins = async () => {
        setIsLoading(true)
        try {
            const response = await api.get('/admin/all-admins');
            console.log('API Response:', response.data);
            const { admins } = response.data;
            if (Array.isArray(admins)) {
                setAdmins(admins);
                setFilteredAdmins(admins);
            } else {
                console.error('Unexpected data format:', response.data);
            }
            setIsLoading(false)
        } catch (error) {
            console.error('Error fetching admins:', error);
        }finally{
            setIsLoading(false)
        }
    };

    // Handle sorting
    const sortData = (key) => {
        handleSort(filteredAdmins, key, sortConfig, setSortConfig, setFilteredAdmins)
    };


    const handleDelete = async (id) => {
        const success = await DeleteEntity('Admin', id);
        if (success) {
            const updatedAdmins = admins.filter((item) => item.id !== id);
            setAdmins(updatedAdmins);
            setFilteredAdmins(updatedAdmins);
        }
    };

    const confirmEdit = (admin) => {
        setAdminToEdit(admin);
        setEditForm({ username: admin.username, password: admin.password, userType: admin.userType });
        setShowEditModal(true);
    };

    const handleEditChange = (e) => {
        setEditForm({ ...editForm, [e.target.name]: e.target.value });
    };

    const handleUpdate = async (adminId) => {
        try {
            await api.put(`/admin/update/${adminId}`, editForm,

            );
            // setAdmins(admins.map(admin => admin.id === adminId ? { ...admin, ...editForm } : admin));
            const updatedAdmins = admins.map(admin => admin.id === adminId ? { ...admin, ...editForm } : admin);
            setAdmins(updatedAdmins);
            setFilteredAdmins(updatedAdmins);
            setShowEditModal(false);
            NotificationManager.removeAll();
            NotificationManager.success("Updated Successfully!");
        } catch (error) {
            NotificationManager.removeAll();
            NotificationManager.error("Failed to update admin");
            console.error('Error updating admin:', error);
        }
    };

    const handleAddChange = (e) => {
        setAddForm({ ...addForm, [e.target.name]: e.target.value });
    };


    const handleAdd = async () => {
        console.log("Form Data: ", addForm)
        try {
            const response = await api.post('/admin/register', addForm, { withCredentials: true });
            console.log(response.status)
            const updatedAdmins = [...admins, response.data.admin];
            setAdmins(updatedAdmins);
            setFilteredAdmins(updatedAdmins);
            setShowAddModal(false);
            NotificationManager.removeAll();
            NotificationManager.success("Added successfully!");
        } catch (error) {
            NotificationManager.removeAll();

            if (error.response && error.response.status === 400) {
                Swal.fire({
                    icon: 'warning',
                    title: 'User Already Exists',
                    text: 'This username is already taken. Please use a different username.',
                });
            } else {
                NotificationManager.error("Failed to add admin");
                console.error('Error adding admin:', error);
            }
        }
    };


    // Search functionality
    const handleSearch = (event) => {
        const querySearch = event.target.value.toLowerCase();
        const filteredData = admins.filter(item =>
            Object.values(item).some(value =>
                typeof value === 'object' && value !== null
                    ? Object.values(value).some(nestedValue =>
                        String(nestedValue).toLowerCase().includes(querySearch)
                    )
                    : String(value).toLowerCase().includes(querySearch)
            )
        );
        setFilteredAdmins(filteredData);
        setCurrentPage(1);

    };

    // useEffect(() => {
    //     setIsLoading(true);
    //     const timer = setTimeout(() => {
    //         setIsLoading(false);
    //     }, 1000);
    //     return () => clearTimeout(timer);
    // }, [location, setIsLoading])

    const indexOfLastAdmin = currentPage * adminsPerPage;
    const indexOfFirstAdmin = indexOfLastAdmin - adminsPerPage;
    const currentAdmins = filteredAdmins.slice(indexOfFirstAdmin, indexOfLastAdmin);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const columns = [
        { label: "Sr. No", field: "id", sortable: true, minWidth: "150px" },
        { label: "username", field: "username", sortable: true, minWidth: "100px" },
        { label: "password", field: "password", sortable: true, minWidth: "180px" },
        { label: "userType", field: "userType", sortable: true, minWidth: "100px" },
        { label: 'Actions', field: 'actions', minWidth: '150px', sortable: false },
      ];

    return (
        <div>
            {/* {isLoading && <Loader />} */}
            <div className="h-screen flex">
                <div className="flex flex-1 flex-col bg-[#f7fbff]">
                    <Header />
                    <AdminHeader setShowAddModal={setShowAddModal} onSearch={handleSearch} />
                    <div className="px-6 h-full w-[1000px] overflow-scroll scrollbar-none">
                    <Table
              columns={columns}
              data={currentAdmins}
              onSort={sortData}
            //   onToggleChange={handleToggleChange}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
              currentPage={currentPage}
            //   totalPages={}
              paginate={paginate}
              filteredData={filteredAdmins}
              loading={isLoading}
            />

                    </div>

                    {/* Edit Admin Modal */}
                    <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title>Edit Admin</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form>
                                <Form.Group controlId="formUsername">
                                    <Form.Label>Username</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="username"
                                        value={editForm.username}
                                        onChange={handleEditChange} />
                                </Form.Group>
                                <Form.Group controlId="formPassword">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        name="password"
                                        value={editForm.password}
                                        onChange={handleEditChange} />
                                </Form.Group>
                                <Form.Group controlId="formUserType">
                                    <Form.Label>User Type</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="userType"
                                        value={editForm.userType}
                                        onChange={handleEditChange} />
                                </Form.Group>
                            </Form>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                                Cancel
                            </Button>
                            <Button variant="primary" onClick={() => handleUpdate(adminToEdit?.id)}>
                                Update
                            </Button>
                        </Modal.Footer>
                    </Modal>

                    {/* Add Admin Modal */}
                    <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title>Add Admin</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form>
                                <Form.Group controlId="formAddUsername">
                                    <Form.Label>Username</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="username"
                                        value={addForm.username}
                                        onChange={handleAddChange} />
                                </Form.Group>
                                <Form.Group controlId="formAddPassword">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        name="password"
                                        value={addForm.password}
                                        onChange={handleAddChange} />
                                </Form.Group>
                                <Form.Group controlId="formAddUserType">
                                    <Form.Label>User Type</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="userType"
                                        value={addForm.userType}
                                        onChange={handleAddChange} />
                                </Form.Group>
                            </Form>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setShowAddModal(false)}>
                                Cancel
                            </Button>
                            <Button variant="primary" onClick={handleAdd}>
                                Add
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </div>
            </div>
        </div>
    );
};

export default AdminList;
