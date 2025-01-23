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
        } catch (error) {
            console.error('Error fetching admins:', error);
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

    useEffect(() => {
        setIsLoading(true);
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, [location, setIsLoading])

    const indexOfLastAdmin = currentPage * adminsPerPage;
    const indexOfFirstAdmin = indexOfLastAdmin - adminsPerPage;
    const currentAdmins = filteredAdmins.slice(indexOfFirstAdmin, indexOfLastAdmin);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div>
            {isLoading && <Loader />}
            <div className="h-screen flex">
                <div className="flex flex-1 flex-col bg-[#f7fbff]">
                    <Header />
                    <AdminHeader setShowAddModal={setShowAddModal} onSearch={handleSearch} />
                    <div className="px-6 h-full w-[1000px] overflow-scroll scrollbar-none">
                        <div className={`bg-white w-full rounded-xl border border-[#EAE5FF] py-4 px-3  h-full overflow-x-auto scrollbar-thin  table-container ${filteredAdmins.length > 0 ? 'h-[500px]' : ''}`}>
                            <div className="relative sm:rounded-lg">
                                <table className="min-w-full text-sm text-left text-gray-700 ">
                                    <thead className="bg-[#045D78] bg-opacity-75 text-xs uppercase font-medium text-white">
                                        <tr>
                                            <th className="px-2 py-2 min-w-[100px]">
                                                Sr. No
                                                <div className="inline-flex items-center ml-2">

                                                    <GoArrowUp className="text-white hover:text-gray-700 cursor-pointer" onClick={() => sortData('id')} />
                                                    <GoArrowDown className="text-white hover:text-gray-700 cursor-pointer" onClick={() => sortData('id')} />

                                                </div>
                                            </th>
                                            <th className="px-2 py-2 min-w-[100px]">
                                                Username
                                                <div className="inline-flex items-center ml-2">

                                                    <GoArrowUp className="text-white hover:text-gray-700 cursor-pointer" onClick={() => sortData('username')} />
                                                    <GoArrowDown className="text-white hover:text-gray-700 cursor-pointer" onClick={() => sortData('username')} />

                                                </div>
                                            </th>
                                            <th className="px-2 py-2 min-w-[100px]">
                                                Password
                                                <div className="inline-flex items-center ml-2">
                                                    <GoArrowUp className='cursor-pointer' onClick={() => sortData('password')} />
                                                    <GoArrowDown className='cursor-pointer' onClick={() => sortData('password')} />
                                                </div>
                                            </th>

                                            <th className="px-2 py-2 min-w-[100px]">
                                                User Type
                                                <div className="inline-flex items-center ml-2">

                                                    <GoArrowUp className="text-white hover:text-gray-700 cursor-pointer" onClick={() => sortData('title')} />
                                                    <GoArrowDown className="text-white hover:text-gray-700 cursor-pointer" onClick={() => sortData('title')} />

                                                </div>
                                            </th>
                                            <th className="px-2 py-2 min-w-[150px]">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {currentAdmins.length > 0 ? (
                                            currentAdmins.map((admin, index) => (
                                                <tr key={admin.id} className='h-[50px]'>
                                                    <td className="px-2 py-1">{indexOfFirstAdmin + index + 1}</td>
                                                    <td className="px-2 py-1">{admin?.username || "N/A"}</td>
                                                    <td className="px-2 py-1">{"●●●●●●●" || "N/A"}</td>
                                                    <td className="px-2 py-1">{admin?.userType || "N/A"}</td>
                                                    <td className="px-2 py-1">
                                                        <NotificationContainer />
                                                        <button variant="" className="bg-[#2dce89] text-white p-2 rounded-full hover:bg-green-600 transition mr-2" onClick={() => confirmEdit(admin)}>
                                                            <FaPen />
                                                        </button>
                                                        <button
                                                            className="bg-[#f5365c] text-white p-2 rounded-full hover:bg-red-600 transition mr-2"
                                                            onClick={() => { handleDelete(admin.id); }}
                                                        >
                                                            <FaTrash />
                                                        </button>

                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="5" className="text-center py-4">
                                                    No admins found.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="bottom-0 left-0 w-full bg-[#f7fbff] py-2 flex justify-between items-center">
                            <span className="text-sm font-normal text-gray-500">
                                Showing <span className="font-semibold text-gray-900">{indexOfFirstAdmin + 1}</span> to <span className="font-semibold text-gray-900">{Math.min(indexOfLastAdmin, admins.length)}</span> of <span className="font-semibold text-gray-900">{admins.length}</span>
                            </span>
                            <ul className="inline-flex -space-x-px rtl:space-x-reverse text-sm h-8">
                                <li>
                                    <button onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)} className="previous-button" disabled={currentPage === 1}>
                                        <img src="/image/action/Left Arrow.svg" alt="Left" /> Previous
                                    </button>
                                </li>
                                <li>
                                    <span className="current-page">
                                        Page {currentPage} of {Math.ceil(admins.length / adminsPerPage)}
                                    </span>
                                </li>
                                <li>
                                    <button style={{background:'#045D78'}} onClick={() => paginate(currentPage < Math.ceil(admins.length / adminsPerPage) ? currentPage + 1 : Math.ceil(admins.length / adminsPerPage))} className="next-button" disabled={currentPage === Math.ceil(admins.length / adminsPerPage)}>
                                        Next <img src="/image/action/Right Arrow (1).svg" alt="Right" />
                                    </button>
                                </li>
                            </ul>
                        </div>

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
