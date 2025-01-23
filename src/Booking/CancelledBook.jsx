import React, { useEffect, useRef, useState } from 'react';
import Header from '../components/Header';
import { GoArrowDown, GoArrowUp } from 'react-icons/go';
import axios from 'axios';
import PendingBookHeader from './PendingBookHeader';
import 'jspdf-autotable';
import OrderPreviewModal from './OrderPreviewModal';
import { handleSort } from '../utils/sorting';
import api from '../utils/api';

const CancelledBook = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProperty, setSelectedProperty] = useState(null);
    const [cancelled, setcancelled] = useState([]);
    const [filteredcancelled, setFilteredcancelled] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const status = 'Cancelled'

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await api.get(`/bookings/status/${status}`
                );
                //   console.log(response.data)
                setcancelled(response.data);
                setFilteredcancelled(response.data);
            } catch (error) {
                console.error('Error fetching bookings:', error.message);
            }
        };
        fetchBookings();
    }, []);


    // Search functionality
    const handleSearch = (event) => {
        const querySearch = event.target.value.toLowerCase();
        const filteredData = cancelled.filter(item =>
            Object.values(item).some(value =>
                typeof value === 'object' && value !== null
                    ? Object.values(value).some(nestedValue =>
                        String(nestedValue).toLowerCase().includes(querySearch)
                    )
                    : String(value).toLowerCase().includes(querySearch)
            )
        );
        setFilteredcancelled(filteredData);
        setCurrentPage(1);
    };

    const sortData = (key) => {
        handleSort(filteredcancelled, key, sortConfig, setSortConfig, setFilteredcancelled)
    };

    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    const currentcancelled = filteredcancelled.slice(indexOfFirst, indexOfLast);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const totalPages = Math.ceil(filteredcancelled.length / itemsPerPage);

    const openModal = (property) => {
        setSelectedProperty(property);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedProperty(null);
    };

    return (
        <div>
            <div className="h-screen flex">

                <div className="flex flex-1 flex-col bg-[#f7fbff]">
                    <Header />
                    <PendingBookHeader onSearch={handleSearch} />
                    <div className="px-6 h-full w-[1000px] overflow-scroll scrollbar-none">
                        <div className={`bg-white w-full rounded-xl border border-[#EAE5FF] py-4 px-3 overflow-x-auto scrollbar-thin ${filteredcancelled.length > 0 ? 'h-[500px]' : ''}`}>
                            <div className="relative sm:rounded-lg scrollbar-thin overflow-y-auto ">
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
                                                    <GoArrowUp className='cursor-pointer' onClick={() => sortData('prop_img')} />
                                                    <GoArrowDown className='cursor-pointer' onClick={() => sortData('prop_img')} />
                                                </div>
                                            </th>
                                            <th className="px-4 py-2 min-w-[180px]">
                                            Booking Price
                                                <div className="inline-flex items-center ml-2">
                                                    <GoArrowUp className='cursor-pointer' onClick={() => sortData('prop_price')} />
                                                    <GoArrowDown className='cursor-pointer' onClick={() => sortData('prop_price')} />
                                                </div>
                                            </th>
                                            <th className="px-4 py-2 min-w-[250px]">
                                                Total Booking Days
                                                <div className="inline-flex items-center ml-2">
                                                    <GoArrowUp className='cursor-pointer' onClick={() => sortData('total_day')} />
                                                    <GoArrowDown className='cursor-pointer' onClick={() => sortData('total_day')} />
                                                </div>
                                            </th>

                                            <th className=" py-2 min-w-[150px]">Action </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {currentcancelled.length > 0 ? (
                                            currentcancelled.map((cancellList, index) => (
                                                <tr key={index + 1} className=''>
                                                    <td className="text-center py-1">{index + 1 + indexOfFirst}</td>
                                                    <td className="text-center py-1">{cancellList.prop_title || 'N/A'}</td>
                                                    <td className="flex justify-center py-1">
                                                        {cancellList.prop_img ? (
                                                            <img src={cancellList.prop_img} className="w-10 h-10 object-cover rounded-full" alt="Coupon"
                                                                onError={(e) => {
                                                                    e.target.src = 'https://t4.ftcdn.net/jpg/04/73/25/49/360_F_473254957_bxG9yf4ly7OBO5I0O5KABlN930GwaMQz.jpg';
                                                                }}
                                                            />
                                                        ) : (
                                                            <img src="https://t4.ftcdn.net/jpg/04/73/25/49/360_F_473254957_bxG9yf4ly7OBO5I0O5KABlN930GwaMQz.jpg" className="w-16 h-16 object-cover rounded-full" alt="Placeholder" />
                                                        )}
                                                    </td>
                                                    <td className="text-center py-1">{cancellList?.prop_price || 'N/A'}</td>
                                                    <td className="text-center py-1">{cancellList?.total_day || 'N/A'}</td>
                                                    <td className="text-center py-1">
                                                        <span className='px-2 py-1 font-medium text-[12px] rounded-full bg-[#d3ffec] cursor-pointer text-[#2dce89] mr-2' onClick={() => openModal(cancellList,cancellList.id)}>View</span>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td className="px-4 py-1 text-center" colSpan="6">
                                                    No data available
                                                </td>
                                            </tr>
                                        )
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="bottom-0 left-0 w-full bg-[#f7fbff] py-2 flex justify-between items-center">
                            <span className="text-sm font-normal text-gray-500">
                                Showing <span className="font-semibold text-gray-900">{indexOfFirst + 1}</span> to <span className="font-semibold text-gray-900">{Math.min(indexOfLast, filteredcancelled.length)}</span> of <span className="font-semibold text-gray-900">{filteredcancelled.length}</span>
                            </span>
                            <ul className="inline-flex -space-x-px rtl:space-x-reverse text-sm h-8">
                                <li>
                                    <button onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)} className={`previous-button ${filteredcancelled.length === 0 ? 'cursor-not-allowed' : ''}`}
                                        disabled={currentPage === 1 || filteredcancelled.length === 0}
                                        title={filteredcancelled.length === 0 ? 'No data available' : ''}
                                    >
                                        <img src="/image/action/Left Arrow.svg" alt="Left" /> Previous
                                    </button>
                                </li>
                                <li>
                                    <span className="current-page">
                                        Page {filteredcancelled.length > 0 ? currentPage : 0} of {filteredcancelled.length > 0 ? totalPages : 0}
                                    </span>
                                </li>
                                <li>
                                    <button style={{background:'#045D78'}} onClick={() => paginate(currentPage < totalPages ? currentPage + 1 : totalPages)}
                                        className={`next-button ${filteredcancelled.length === 0 ? 'cursor-not-allowed button-disable' : ''}`}
                                        disabled={currentPage === totalPages || filteredcancelled.length === 0}
                                        title={filteredcancelled.length === 0 ? 'No data available' : ''}
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

export default CancelledBook;