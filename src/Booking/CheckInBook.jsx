import React, { useEffect, useRef, useState } from 'react';
import Header from '../components/Header';
import { GoArrowDown, GoArrowUp } from 'react-icons/go';
import axios from 'axios';
import PendingBookHeader from './PendingBookHeader';
import 'jspdf-autotable';
import { useNavigate } from 'react-router-dom';
import OrderPreviewModal from './OrderPreviewModal';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import { handleSort, sortData } from '../utils/sorting'
import api from '../utils/api';

const CheckInBook = () => {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProperty, setSelectedProperty] = useState(null);
    const [checkIn, setcheckIn] = useState([]);
    const [filteredcheckIn, setFilteredcheckIn] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const status = 'Check_in'

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await api.get(`/bookings/status/${status}` );
                setcheckIn(response.data);
                setFilteredcheckIn(response.data);
            } catch (error) {
                console.error('Error fetching bookings:', error.message);
            }
        };
        fetchBookings();
    }, []);

    // Search functionality
    const handleSearch = (event) => {
        const querySearch = event.target.value.toLowerCase();
        const filteredData = checkIn.filter(item =>
            Object.values(item).some(value =>
                typeof value === 'object' && value !== null
                    ? Object.values(value).some(nestedValue =>
                        String(nestedValue).toLowerCase().includes(querySearch)
                    )
                    : String(value).toLowerCase().includes(querySearch)
            )
        );
        setFilteredcheckIn(filteredData);
        setCurrentPage(1);
    };

    const sortData = (key) => {
        handleSort(filteredcheckIn, key, sortConfig, setSortConfig, setFilteredcheckIn)
    };

    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    const currentcheckIn = filteredcheckIn.slice(indexOfFirst, indexOfLast);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const totalPages = Math.ceil(filteredcheckIn.length / itemsPerPage);

    const openModal = (property) => {
        setSelectedProperty(property);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedProperty(null);
    };

    const navigateApprove = async (id, newStatus) => {
        try {
            const response = await axios.put(
                `http://localhost:5000/bookings/status/${id}`,
                { status: newStatus },
                { withCredentials: true }
            );
            if (response.status === 200) {
                NotificationManager.removeAll();
                NotificationManager.success('Status updated successfully!');
                setTimeout(() => {
                    navigate('/completed-list');
                }, 3000);
            }
        } catch (error) {
            NotificationManager.removeAll();
            console.error('Error updating status:', error.response?.data || error.message);
            NotificationManager.error(error.response?.data?.error || 'Failed to update status. Please try again.');
        }
    };

    return (
        <div>
            <div className="h-screen flex">

                <div className="flex flex-1 flex-col bg-[#f7fbff]">
                    <Header />
                    <PendingBookHeader onSearch={handleSearch} />
                    <div className="px-6 h-full w-[1000px] overflow-scroll scrollbar-none">

                        <div className={`bg-white w-full rounded-xl border border-[#EAE5FF] py-4 px-3 overflow-x-auto ${filteredcheckIn.length > 0 ? 'h-[500px]' : ''}`}>
                            <div className="relative sm:rounded-lg scrollbar-thin overflow-y-auto">
                                <table className="min-w-full text-sm text-left text-gray-700">
                                    <thead className="bg-[#045D78] bg-opacity-75 text-xs uppercase font-medium text-white">
                                        <tr>
                                            <th className="px-4 py-2 min-w-[130px]">
                                                Sr. No
                                                <div className="inline-flex items-center ml-2">
                                                    <GoArrowUp className='cursor-pointer' onClick={() => sortData('id')} />
                                                    <GoArrowDown className='cursor-pointer' onClick={() => sortData('id')} />
                                                </div>
                                            </th>
                                            <th className="px-4 py-2 min-w-[180px]">
                                                Property Title
                                                <div className="inline-flex items-center ml-2">
                                                    <GoArrowUp className='cursor-pointer' onClick={() => sortData('prop_title')} />
                                                    <GoArrowDown className='cursor-pointer' onClick={() => sortData('prop_title')} />
                                                </div>
                                            </th>
                                            <th className="px-4 py-2 min-w-[200px]">Property Image 
                                            <div className="inline-flex items-center ml-2">
                                                    <GoArrowUp className='cursor-pointer' onClick={() => sortData('image')} />
                                                    <GoArrowDown className='cursor-pointer' onClick={() => sortData('image')} />
                                                </div>
                                            </th>
                                            <th className="px-4 py-2 min-w-[200px]">
                                            Booking Price
                                                <div className="inline-flex items-center ml-2">
                                                    <GoArrowUp className='cursor-pointer' onClick={() => sortData('prop_price')} />
                                                    <GoArrowDown className='cursor-pointer' onClick={() => sortData('prop_price')} />
                                                </div>
                                            </th>
                                            <th className="px-4 py-2 min-w-[220px]">
                                                Total Booking Days
                                                <div className="inline-flex items-center ml-2">
                                                    <GoArrowUp className='cursor-pointer' onClick={() => sortData('total_day')} />
                                                    <GoArrowDown className='cursor-pointer' onClick={() => sortData('total_day')} />
                                                </div>
                                            </th>

                                            <th className="px-4 py-2 min-w-[250px]">Action</th>

                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {currentcheckIn.length > 0 ? (
                                            currentcheckIn.map((checkIn, index) => (
                                                <tr key={index + 1} className=''>
                                                    <td className="text-center py-1">{index + 1 + indexOfFirst}</td>
                                                    <td className="text-center py-1">{checkIn?.prop_title || 'N/A'}</td>
                                                    <td className="flex justify-center py-1">
                                                        {checkIn.prop_img ? (
                                                            <img src={checkIn.prop_img} className="w-10 h-10 object-cover rounded-full" alt="Coupon"
                                                                onError={(e) => {
                                                                    e.target.src = 'https://t4.ftcdn.net/jpg/04/73/25/49/360_F_473254957_bxG9yf4ly7OBO5I0O5KABlN930GwaMQz.jpg';
                                                                }}
                                                            />
                                                        ) : (
                                                            <img src="https://t4.ftcdn.net/jpg/04/73/25/49/360_F_473254957_bxG9yf4ly7OBO5I0O5KABlN930GwaMQz.jpg" className="w-16 h-16 object-cover rounded-full" alt="Placeholder" />
                                                        )}
                                                    </td>
                                                    <td className="text-center py-1">{checkIn?.prop_price || 'N/A'}</td>
                                                    <td className="text-center py-1">{checkIn?.total_day || 'N/A'}</td>
                                                    <td className="text-center py-1">
                                                        <NotificationContainer />
                                                        <span className='px-4 py-1 font-medium text-[12px] rounded-full bg-green-400 cursor-pointer text-white mr-2' onClick={() => openModal(checkIn,checkIn.id)}>View</span>
                                                        <span className=' px-4 py-1 font-medium text-[12px] rounded-full bg-cyan-100 cursor-pointer text-cyan-400 mr-2' onClick={() => { navigateApprove(checkIn.id, 'Completed') }}>Check Out</span>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td className="px-4 py-1 text-center" colSpan="6">
                                                    No data available
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="bottom-0 left-0 w-full bg-[#f7fbff] py-2 flex justify-between items-center">
                            <span className="text-sm font-normal text-gray-500">
                                Showing <span className="font-semibold text-gray-900">{indexOfFirst + 1}</span> to <span className="font-semibold text-gray-900">{Math.min(indexOfLast, filteredcheckIn.length)}</span> of <span className="font-semibold text-gray-900">{filteredcheckIn.length}</span>
                            </span>
                            <ul className="inline-flex -space-x-px rtl:space-x-reverse text-sm h-8">
                                <li>
                                    <button onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)} className={`previous-button ${filteredcheckIn.length === 0 ? 'cursor-not-allowed' : ''}`}
                                        disabled={currentPage === 1 || filteredcheckIn.length === 0}
                                        title={filteredcheckIn.length === 0 ? 'No data available' : ''}
                                    >
                                        <img src="/image/action/Left Arrow.svg" alt="Left" /> Previous
                                    </button>
                                </li>
                                <li>
                                    <span className="current-page">
                                        Page {filteredcheckIn.length > 0 ? currentPage : 0} of {filteredcheckIn.length > 0 ? totalPages : 0}
                                    </span>
                                </li>
                                <li>
                                    <button style={{background:'#045D78'}} onClick={() => paginate(currentPage < totalPages ? currentPage + 1 : totalPages)}
                                        className={`next-button ${filteredcheckIn.length === 0 ? 'cursor-not-allowed button-disable' : ''}`}
                                        disabled={currentPage === totalPages || filteredcheckIn.length === 0}
                                        title={filteredcheckIn.length === 0 ? 'No data available' : ''}
                                    >
                                        Next <img src="/image/action/Right Arrow (1).svg" alt="Right" />
                                    </button>
                                </li>
                            </ul>
                        </div>
                        <OrderPreviewModal isOpen={isModalOpen} closeModal={closeModal} selectedProperty={selectedProperty} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckInBook;