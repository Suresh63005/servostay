import React, { useEffect, useRef, useState } from 'react';
import Header from '../components/Header';
// import SidebarMenu from '../components/SideBar';
import { GoArrowDown, GoArrowUp } from 'react-icons/go';
// import axios from 'axios';
import PendingBookHeader from './PendingBookHeader';
import 'jspdf-autotable';
import OrderPreviewModal from './OrderPreviewModal';
import { handleSort } from '../utils/sorting';
import api from '../utils/api';

const CompletedBook = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProperty, setSelectedProperty] = useState(null);
    const [completed, setcompleted] = useState([]);
    const [filteredcompleted, setFilteredcompleted] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const status = 'Completed'
    const[loading,setLoading] = useState(false);
    useEffect(() => {
        const fetchBookings = async () => {
            setLoading(true);
            try {
                const response = await api.get(`bookings/status/${status}`,);
                console.log(response.data)
                setcompleted(response.data);
                setFilteredcompleted(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching bookings:', error.message);
            }
            finally{
                setLoading(false);
            }
        };
        fetchBookings();
    }, []);

    console.log(completed)
    // console.log(completed)
    // Search functionality
    const handleSearch = (event) => {
        const querySearch = event.target.value.toLowerCase();
        const filteredData = completed.filter(item =>
            Object.values(item).some(value =>
                typeof value === 'object' && value !== null
                    ? Object.values(value).some(nestedValue =>
                        String(nestedValue).toLowerCase().includes(querySearch)
                    )
                    : String(value).toLowerCase().includes(querySearch)
            )
        );
        setFilteredcompleted(filteredData);
        setCurrentPage(1);
    };

    const sortData = (key) => {
        handleSort(filteredcompleted, key, sortConfig, setSortConfig, setFilteredcompleted)
    };

    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    const currentcompleted = filteredcompleted.slice(indexOfFirst, indexOfLast);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const totalPages = Math.ceil(filteredcompleted.length / itemsPerPage);

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

                    <div className=" px-6 h-full w-[79vw] overflow-scroll scrollbar-none">
                        <div className={`bg-white w-full rounded-xl border border-[#EAE5FF]  overflow-x-auto scrollbar-thin  ${filteredcompleted.length > 0 ? 'max-h-[380px]' : ''}`}>

                            <div className="relative sm:rounded-lg scrollbar-thin overflow-y-auto">
                                <table className="min-w-full text-sm text-left text-gray-700">
                                {loading ? (<div className="flex flex-col justify-center items-center h-64">
                

                <img width={100} src="image/Hotels Search.gif" alt="loading" />
                
            </div>):(<>
            
            <thead className="bg-[#045D78] sticky top-0 text-xs uppercase font-medium text-white">
                                        <tr>
                                            <th className="px-4 py-2 min-w-[130px]">
                                                Sr. No
                                                <div className="inline-flex items-center ml-2">
                                                    <GoArrowUp className='cursor-pointer' onClick={() => sortData('id')} />
                                                    <GoArrowDown className='cursor-pointer' onClick={() => sortData('id')} />
                                                </div>
                                            </th>
                                            <th className="pl-4 py-2 min-w-[150px]">
                                                Property Title
                                                <div className="inline-flex items-center ml-2">
                                                    <GoArrowUp className='cursor-pointer' onClick={() => sortData('prop_title')} />
                                                    <GoArrowDown className='cursor-pointer' onClick={() => sortData('prop_title')} />
                                                </div>
                                            </th>
                                            <th className="pl-4 py-2 min-w-[120px]">
                                                Property Image
                                               

                                            </th>
                                            <th className="pl-4 py-2 min-w-[120px]">
                                            Booking Price
                                                <div className="inline-flex items-center ml-2">
                                                    <GoArrowUp className='cursor-pointer' onClick={() => sortData('prop_price')} />
                                                    <GoArrowDown className='cursor-pointer' onClick={() => sortData('prop_price')} />
                                                </div>
                                            </th>
                                            <th className="pl-4 py-2 min-w-[130px]">
                                                Total Booking Days
                                                <div className="inline-flex items-center ml-2">
                                                    <GoArrowUp className='cursor-pointer' onClick={() => sortData('total_day')} />
                                                    <GoArrowDown className='cursor-pointer' onClick={() => sortData('total_day')} />
                                                </div>
                                            </th>

                                            <th className="pl-4 py-2 min-w-[100px]">
                                                Action
                                            </th>

                                        </tr>
                                    </thead>


                                    <tbody className="divide-y divide-gray-200">
                                        {currentcompleted.length > 0 ? (
                                            currentcompleted.map((completedList, index) => (
                                                <tr key={index + 1} className=''>
                                                    <td className="pl-4 py-1">{index + 1 + indexOfFirst}</td>
                                                    <td className="pl-4 py-1">{completedList?.prop_title || 'N/A'}</td>
                                                    <td className="flex justify-center py-1">
                                                        {completedList.prop_img ? (
                                                            <img src={completedList.prop_img} className="w-10 h-10 object-cover rounded-full" alt="Coupon"
                                                                onError={(e) => {
                                                                    e.target.src = 'https://t4.ftcdn.net/jpg/04/73/25/49/360_F_473254957_bxG9yf4ly7OBO5I0O5KABlN930GwaMQz.jpg';
                                                                }}
                                                            />
                                                        ) : (
                                                            <img src="https://t4.ftcdn.net/jpg/04/73/25/49/360_F_473254957_bxG9yf4ly7OBO5I0O5KABlN930GwaMQz.jpg" className="w-16 h-16 object-cover rounded-full" alt="Placeholder" />
                                                        )}
                                                    </td>
                                                    <td className="pl-4 py-1">{completedList?.prop_price || 'N/A'}</td>
                                                    <td className="pl-4 py-1">{completedList?.total_day || 'N/A'}</td>
                                                    <td className="py-1 px-4">
                                                        <span className='px-2 py-1 font-medium text-[12px] rounded-full bg-green-400 cursor-pointer text-white mr-2' onClick={() => openModal(completedList,completedList.id)}>View</span>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                        <td  className="text-[30px] w-[79vw] flex flex-col justify-center align-items-center font-semibold p-10 text-center">
                                           <img className='w-[10%]' src="image/no-data.png" alt="" />
      <span className='mt-3'>No data found
        </span>   
                                        </td>
                                    </tr>
                                        )
                                        }
                                    </tbody>

            </>)}
                                    
                                </table>
                            </div>
                        </div>
                        <div className="bottom-0 left-0 w-full bg-[#f7fbff] py-2 flex justify-between items-center">
                            <span className="text-sm font-normal text-gray-500">
                                Showing <span className="font-semibold text-gray-900">{indexOfFirst + 1}</span> to <span className="font-semibold text-gray-900">{Math.min(indexOfLast, filteredcompleted.length)}</span> of <span className="font-semibold text-gray-900">{filteredcompleted.length}</span>
                            </span>
                            <ul className="inline-flex -space-x-px rtl:space-x-reverse gap-2 text-sm h-8">
                                <li>
                                    <button onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)} className={`previous-button ${filteredcompleted.length === 0 ? 'cursor-not-allowed' : ''}`}
                                        disabled={currentPage === 1 || filteredcompleted.length === 0}
                                        title={filteredcompleted.length === 0 ? 'No data available' : ''}
                                    >
                                        <img src="/image/action/Left Arrow.svg" alt="Left" /> Previous
                                    </button>
                                </li>
                                <li>
                                    <span className="current-page">
                                        Page {filteredcompleted.length > 0 ? currentPage : 0} of {filteredcompleted.length > 0 ? totalPages : 0}
                                    </span>
                                </li>
                                <li>
                                    <button style={{background:'#045D78'}} onClick={() => paginate(currentPage < totalPages ? currentPage + 1 : totalPages)}
                                        className={`next-button ${filteredcompleted.length === 0 ? 'cursor-not-allowed button-disable' : ''}`}
                                        disabled={currentPage === totalPages || filteredcompleted.length === 0}
                                        title={filteredcompleted.length === 0 ? 'No data available' : ''}
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

export default CompletedBook;