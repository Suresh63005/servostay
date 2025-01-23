import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import { GoArrowDown, GoArrowUp } from 'react-icons/go';
import { useLoading } from '../Context/LoadingContext';
import { useLocation, useNavigate } from 'react-router-dom';
import Loader from '../common/Loader';
import { FaPen, FaTrash } from "react-icons/fa";
import CupponHeader from './CupponHeader';
import { DeleteEntity } from '../utils/Delete';
import axios from 'axios';
import { handleSort } from '../utils/sorting';
import { NotificationContainer } from 'react-notifications';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faToggleOff, faToggleOn } from "@fortawesome/free-solid-svg-icons";
import api from '../utils/api';
import { StatusEntity } from '../utils/Status';

const CupponList = () => {
    const navigate = useNavigate();
    const [couppons, setcouppons] = useState([]);
    const [filteredcouppons, setFilteredcouppons] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const location = useLocation();
    const { isLoading, setIsLoading } = useLoading();

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await api.get("/coupons/all", {
                    withCredentials: true,
                });
                console.log("API Response:", response.data);
                setcouppons(response.data);
                setFilteredcouppons(response.data);
            } catch (error) {
                console.error("API Error:", error);
            }
        }
        fetchData();
    }, []);

    useEffect(() => {
        setIsLoading(true);

        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, [location, setIsLoading]);

    const handleSearch = (event) => {
        const query = event.target.value.toLowerCase();
        const filteredData = couppons.filter(coppon =>
            Object.values(coppon).some(value =>
                String(value).toLocaleLowerCase().includes(query)
            )
        )
        setFilteredcouppons(filteredData)
        setCurrentPage(1)
    }

    // Handle sorting
    const sortData = (key) => {
        handleSort(filteredcouppons, key, sortConfig, setSortConfig, setFilteredcouppons)
    };

    // Pagination logic
    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    const currentcouppons = filteredcouppons.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(filteredcouppons.length / itemsPerPage);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // for dalete
    const handledelete = async (id) => {
        const success = await DeleteEntity('Coupon', id)
        if (success) {
            const updatedCuppon = couppons.filter((couppons) => couppons.id !== id);
            setcouppons(updatedCuppon);
            setFilteredcouppons(updatedCuppon)
        }
    }

    // for update
    const updateCuppon = (id) => {
        navigate('/add-cuppon', { state: { id: id } })
    }

    const handleToggleChange = async (id, currentStatus, field) => {
        try {
            await StatusEntity("Coupon", id, currentStatus, setFilteredcouppons, filteredcouppons, field);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            {isLoading && <Loader />}
            <div className="h-screen flex">
                {/* Sidebar */}
                <div className="flex flex-1 flex-col bg-[#f7fbff]">
                    {/* Header */}
                    <Header />
                    <CupponHeader onSearch={handleSearch} />
                    {/* Main Content */}
                    <div className="px-6 h-full w-[1000px] overflow-scroll scrollbar-none">
                        <div className={` bg-white w-full rounded-xl border border-[#EAE5FF] py-4 px-3 overflow-x-auto  scrollbar-thin ${filteredcouppons.length > 0 ? 'h-[500px]' : ''}`}>
                            <div className="relative sm:rounded-lg h-[80%] scrollbar-thin overflow-y-auto">
                                <table className="min-w-full text-sm text-left text-gray-700">
                                    <thead className="bg-[#045D78] bg-opacity-75 text-xs uppercase font-medium text-white" style={{lineHeight:"6px"}}>
                                        <tr>
                                            <th className="px-4 py-2 min-w-[120px]">
                                                Sr. No
                                                <div className="inline-flex items-center ml-2">
                                                    <GoArrowUp className='cursor-pointer' onClick={() => sortData('id')} />
                                                    <GoArrowDown className='cursor-pointer' onClick={() => sortData('id')} />
                                                </div>
                                            </th>
                                            <th className="px-4 py-2 min-w-[120px]">
                                                title
                                                <div className="inline-flex items-center ml-2">
                                                    <GoArrowUp className='cursor-pointer' onClick={() => sortData('ctitle')} />
                                                    <GoArrowDown className='cursor-pointer' onClick={() => sortData('ctitle')} />
                                                </div>
                                            </th>
                                            <th className="px-4 py-2 min-w-[150px]">
                                                subtitle
                                                <div className="inline-flex items-center ml-2">
                                                    <GoArrowUp className='cursor-pointer' onClick={() => sortData('subtitle')} />
                                                    <GoArrowDown className='cursor-pointer' onClick={() => sortData('subtitle')} />
                                                </div>
                                            </th>
                                            <th className="px-4 py-2 min-w-[100px]">
                                                code
                                                <div className="inline-flex items-center ml-2">
                                                    <GoArrowUp className='cursor-pointer' onClick={() => sortData('c_title')} />
                                                    <GoArrowDown className='cursor-pointer' onClick={() => sortData('c_title')} />
                                                </div>
                                            </th>
                                            <th className="px-4 py-2 min-w-[120px]">
                                                image
                                            </th>
                                            <th className="px-4 py-2 min-w-[160px]">
                                                expiredDate
                                                <div className="inline-flex items-center ml-2">
                                                    <GoArrowUp className='cursor-pointer' onClick={() => sortData('cdate')} />
                                                    <GoArrowDown className='cursor-pointer' onClick={() => sortData('cdate')} />
                                                </div>
                                            </th>
                                            <th className="px-4 py-2 min-w-[180px]">
                                                minAmount
                                                <div className="inline-flex items-center ml-2">
                                                    <GoArrowUp className='cursor-pointer' onClick={() => sortData('min_amt')} />
                                                    <GoArrowDown className='cursor-pointer' onClick={() => sortData('min_amt')} />
                                                </div>
                                            </th>
                                            <th className="px-4 py-2 min-w-[150px]">
                                                discount
                                                <div className="inline-flex items-center ml-2">
                                                    <GoArrowUp className='cursor-pointer' onClick={() => sortData('c_value')} />
                                                    <GoArrowDown className='cursor-pointer' onClick={() => sortData('c_value')} />
                                                </div>
                                            </th>
                                            <th className="px-4 py-2 min-w-[140px]">
                                                Status
                                                <div className="inline-flex items-center ml-2">
                                                    <GoArrowUp className='cursor-pointer' onClick={() => sortData('status')} />
                                                    <GoArrowDown className='cursor-pointer' onClick={() => sortData('status')} />
                                                </div>
                                            </th>
                                            <th className="px-4 py-2 min-w-[120px]">
                                                Action
                                            </th>

                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {currentcouppons.length > 0 ? (
                                            currentcouppons.map((cuppon, index) => (
                                                <tr key={cuppon.id} className='h-[70px]'>
                                                    <td className="px-4 py-1">{index + 1 + indexOfFirst}</td>
                                                    <td className="px-4 py-1">{cuppon?.ctitle || "N/A"}</td>
                                                    <td className="px-4 py-1">{cuppon?.subtitle || "N/A"}</td>
                                                    <td className="px-4 py-1">{cuppon?.c_title || "N/A"}</td>
                                                    <td className="px-4 py-1">
                                                        {cuppon.c_img ? (
                                                            <img src={cuppon.c_img} className="w-10 h-10 object-cover rounded-full" alt="Coupon"
                                                                onError={(e) => { e.target.src = 'https://t4.ftcdn.net/jpg/04/73/25/49/360_F_473254957_bxG9yf4ly7OBO5I0O5KABlN930GwaMQz.jpg'; }}
                                                            />
                                                        ) : (
                                                            <img src="https://t4.ftcdn.net/jpg/04/73/25/49/360_F_473254957_bxG9yf4ly7OBO5I0O5KABlN930GwaMQz.jpg" className="w-16 h-16 object-cover rounded-full" alt="Placeholder" />
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-1">{ new Date(cuppon?.cdate).toISOString().split("T")[0] || "N/A"}</td>
                                                    <td className="px-4 py-1">{cuppon?.min_amt || "N/A"}</td>
                                                    <td className="px-4 py-1">{cuppon?.c_value || "N/A"}</td>
                                                    <td className="px-4 py-1">

                                                        <FontAwesomeIcon
                                                            className="h-7 w-16"
                                                            style={{ color: cuppon.status === 1 ? "#045D78" : "#e9ecef" }}
                                                            icon={cuppon.status === 1 ? faToggleOn : faToggleOff}
                                                            onClick={() => handleToggleChange(cuppon.id, cuppon.status, "status")} // Pass 'status' field
                                                        />

                                                    </td>
                                                    <td className="px-4 py-3">

                                                        <NotificationContainer />
                                                        <button className="bg-[#2dce89] text-white p-2 rounded-full hover:bg-green-600 transition mr-2" onClick={() => { updateCuppon(cuppon.id) }}>
                                                            <FaPen />
                                                        </button>
                                                        <button className="bg-[#f5365c] text-white p-2 rounded-full hover:bg-red-600 transition" onClick={() => { handledelete(cuppon.id) }}>
                                                            <FaTrash />
                                                        </button>

                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="10" className="text-center">
                                                    Coupon not found
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>

                                </table>
                            </div>
                        </div>

                        {/* Pagination */}
                        <div className="bottom-0 left-0 w-full bg-[#f7fbff] py-2 flex justify-between items-center">
                            <span className="text-sm font-normal text-gray-500">
                                Showing <span className="font-semibold text-gray-900">{indexOfFirst + 1}</span> to <span className="font-semibold text-gray-900">{Math.min(indexOfLast, filteredcouppons.length)}</span> of <span className="font-semibold text-gray-900">{filteredcouppons.length}</span>
                            </span>
                            <ul className="inline-flex -space-x-px rtl:space-x-reverse text-sm h-8">
                                <li>
                                    <button
                                        onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
                                        className={`previous-button ${filteredcouppons.length === 0 ? 'cursor-not-allowed' : ''}`}
                                        disabled={currentPage === 1 || filteredcouppons.length === 0}
                                        title={filteredcouppons.length === 0 ? 'No data available' : ''}
                                    >
                                        <img src="/image/action/Left Arrow.svg" alt="Left" /> Previous
                                    </button>
                                </li>
                                <li>
                                    <span className="current-page">
                                        Page {filteredcouppons.length > 0 ? currentPage : 0} of {filteredcouppons.length > 0 ? totalPages : 0}
                                    </span>
                                </li>
                                <li>
                                    <button style={{background:'#045D78'}}
                                        onClick={() => paginate(currentPage < totalPages ? currentPage + 1 : totalPages)}
                                        className={`next-button ${filteredcouppons.length === 0 ? 'cursor-not-allowed button-disable' : ''}`}
                                        disabled={currentPage === totalPages || filteredcouppons.length === 0}
                                        title={filteredcouppons.length === 0 ? 'No data available' : ''}
                                    >
                                        Next <img src="/image/action/Right Arrow (1).svg" alt="Right" />
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CupponList;
