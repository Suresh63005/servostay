import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import { GoArrowDown, GoArrowUp } from 'react-icons/go';
import { FaPen, FaTrash } from "react-icons/fa";
import PaymentGatewayHeader from './PaymentGatewayHeader';
import axios from 'axios';
import { useLoading } from '../Context/LoadingContext';
import { useLocation } from 'react-router-dom';
import Loader from '../common/Loader';
import { handleSort } from '../utils/sorting';
import { DeleteEntity } from '../utils/Delete';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faToggleOn, faToggleOff } from '@fortawesome/free-solid-svg-icons';
import { NotificationContainer } from 'react-notifications';
import api from '../utils/api';
import { StatusEntity } from '../utils/Status';

const PaymentGatewayList = () => {
    const [paymentGateway, setPaymentGateway] = useState([]);
    const [filteredPaymentGateway, setFilteredPaymentGateway] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const location = useLocation();
    const { isLoading, setIsLoading } = useLoading();

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await api.get("/payment-methods/");
                console.log("API Response:", response.data);
                setPaymentGateway(response.data);
                setFilteredPaymentGateway(response.data);
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
        const searchQuery = event.target.value.toLowerCase();
        const filteredResults = paymentGateway.filter(gateway =>
            Object.values(gateway).some(value =>
                String(value).toLowerCase().includes(searchQuery)
            )
        );
        setFilteredPaymentGateway(filteredResults);
        setCurrentPage(1);
    };

    // for sorting
    const sortData = (key) => {
        handleSort(filteredPaymentGateway, key, sortConfig, setSortConfig, setFilteredPaymentGateway);
    };

    // Calculate paginated paymentGateway
    const indexOfLastPaymentGateway = currentPage * itemsPerPage;
    const indexOfFirstPaymentGateway = indexOfLastPaymentGateway - itemsPerPage;
    const currentPaymentGateway = filteredPaymentGateway.slice(indexOfFirstPaymentGateway, indexOfLastPaymentGateway);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const totalPages = Math.ceil(filteredPaymentGateway.length / itemsPerPage);


    // for delete
    const handleDelete = async (id) => {
        const success = await DeleteEntity('PaymentGateway', id);
        if (success) {
            const updatedPaymentGateway = paymentGateway.filter((item) => item.id !== id);
            setPaymentGateway(updatedPaymentGateway);
            setFilteredPaymentGateway(updatedPaymentGateway);
        }
    };

    useEffect(() => {
        console.log("Filtered Payment Gateway:", filteredPaymentGateway);
    }, [filteredPaymentGateway]);

    const handleToggleChange = async (id, currentStatus, field) => {
        console.log(`Toggling ${field} for ID: ${id} with current status: ${currentStatus}`);
        if (!id || currentStatus === undefined) {
            console.error(`Invalid arguments: ID=${id}, currentStatus=${currentStatus}`);
            return;
        }

        try {
            await StatusEntity("Payment", id, currentStatus, setFilteredPaymentGateway, filteredPaymentGateway, field);
        } catch (error) {
            console.error("Error toggling payment status:", error);
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
                    {/* Searching, sorting, and main content area */}
                    <PaymentGatewayHeader onSearch={handleSearch} />
                    {/* Card */}
                    <div className="px-6 h-full w-[1000px] overflow-scroll scrollbar-none">
                        <div className={` bg-white w-full rounded-xl border border-[#EAE5FF] py-4 px-3 overflow-x-auto scrollbar-thin  ${filteredPaymentGateway.length > 0 ? 'h-[500px]' : ''}`}>
                            <div className="relative sm:rounded-lg h-[80%] scrollbar-thin overflow-y-auto">
                                <table className="min-w-full text-sm text-left text-gray-700">
                                    <thead className="bg-[#045D78] bg-opacity-75 text-xs uppercase font-medium text-white">
                                        <tr>
                                            <th className="px-4 py-2 min-w-[120px]">
                                                Sr. No
                                                <div className="inline-flex items-center ml-2">
                                                    <GoArrowUp className="text-white hover:text-gray-700 cursor-pointer" onClick={() => sortData('id')} />
                                                    <GoArrowDown className="text-white hover:text-gray-700 cursor-pointer" onClick={() => sortData('id')} />
                                                </div>
                                            </th>
                                            <th className="px-4 py-2 min-w-[250px]">
                                                PaymentGateway Name
                                                <div className="inline-flex items-center ml-2">
                                                    <GoArrowUp className="text-white hover:text-gray-700 cursor-pointer" onClick={() => sortData('title')} />
                                                    <GoArrowDown className="text-white hover:text-gray-700 cursor-pointer" onClick={() => sortData('title')} />
                                                </div>
                                            </th>
                                            <th className="px-4 py-2 min-w-[250px]">
                                                PaymentGateway SubTitle
                                                <div className="inline-flex items-center ml-2">
                                                    <GoArrowUp className="text-white hover:text-gray-700 cursor-pointer" onClick={() => sortData('subtitle')} />
                                                    <GoArrowDown className="text-white hover:text-gray-700 cursor-pointer" onClick={() => sortData('subtitle')} />
                                                </div>
                                            </th>

                                            <th className="px-4 py-1 min-w-[250px]">  PaymentGateway Image  
                                            </th>
                                            <th className="px-4 py-1 min-w-[200px]">  Show On Wallet
                                                <div className="inline-flex items-center ml-2">
                                                    <GoArrowUp className="text-white hover:text-gray-700 cursor-pointer" onClick={() => sortData('p_show')} />
                                                    <GoArrowDown className="text-white hover:text-gray-700 cursor-pointer" onClick={() => sortData('p_show')} />
                                                </div>
                                            </th>
                                            <th className="px-4 py-1 min-w-[230px]">  Show On Subscribe
                                                <div className="inline-flex items-center ml-2">
                                                    <GoArrowUp className="text-white hover:text-gray-700 cursor-pointer" onClick={() => sortData('s_show')} />
                                                    <GoArrowDown className="text-white hover:text-gray-700 cursor-pointer" onClick={() => sortData('s_show')} />
                                                </div>
                                            </th>
                                            <th className="px-4 py-1 min-w-[250px]">  PaymentGateway Status
                                                <div className="inline-flex items-center ml-2">
                                                    <GoArrowUp className="text-white hover:text-gray-700 cursor-pointer" onClick={() => sortData('status')} />
                                                    <GoArrowDown className="text-white hover:text-gray-700 cursor-pointer" onClick={() => sortData('status')} />
                                                </div>
                                            </th>
                                            <th className="px-4 py-1 min-w-[150px]"> Action </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {filteredPaymentGateway.length > 0 ? (
                                            filteredPaymentGateway.map((paymentGateway, index) => (
                                                <tr key={paymentGateway.id}>
                                                    <td className="px-4 py-2">{index + 1 + indexOfFirstPaymentGateway}</td>
                                                    <td className="px-4 py-2">{paymentGateway?.title || "N/A"}</td>
                                                    <td className="px-4 py-2">{paymentGateway?.subtitle || "N/A"}</td>
                                                    <td className="px-4 py-2">
                                                        {paymentGateway.img && paymentGateway.img.trim() !== '' ? (
                                                            <img src={paymentGateway.img} className="w-12 h-12 object-cover rounded-full" height={50} width={50} loading="lazy" alt="" onError={(e) => {
                                                                if (e.target.src !== 'https://t4.ftcdn.net/jpg/04/73/25/49/360_F_473254957_bxG9yf4ly7OBO5I0O5KABlN930GwaMQz.jpg') {
                                                                    e.target.src = 'https://t4.ftcdn.net/jpg/04/73/25/49/360_F_473254957_bxG9yf4ly7OBO5I0O5KABlN930GwaMQz.jpg';
                                                                }
                                                            }} />
                                                        ) : (
                                                            <img src={'https://t4.ftcdn.net/jpg/04/73/25/49/360_F_473254957_bxG9yf4ly7OBO5I0O5KABlN930GwaMQz.jpg'} height={50} width={50} loading="lazy" alt="" />
                                                        )}
                                                    </td>
                                                    <td>
                                                        <FontAwesomeIcon
                                                            className="h-7 w-16 cursor-pointer"
                                                            style={{ color: paymentGateway.status === 1 ? "#045D78" : "#e9ecef" }}
                                                            icon={paymentGateway.status === 1 ? faToggleOn : faToggleOff}
                                                            onClick={() => handleToggleChange(paymentGateway.id, paymentGateway.status, "status")}
                                                        />
                                                    </td>
                                                    <td className="px-4 py-2">
                                                        <FontAwesomeIcon
                                                            className="h-7 w-16 cursor-pointer"
                                                            style={{ color: paymentGateway.p_show === 1 ? "#045D78" : "#e9ecef" }}
                                                            icon={paymentGateway.p_show === 1 ? faToggleOn : faToggleOff}
                                                            onClick={() => handleToggleChange(paymentGateway.id, paymentGateway.p_show, "p_show")}
                                                        />
                                                    </td>
                                                    <td className="px-4 py-2">
                                                        <FontAwesomeIcon
                                                            className="h-7 w-16 cursor-pointer"
                                                            style={{ color: paymentGateway.s_show === 1 ? "#045D78" : "#e9ecef" }}
                                                            icon={paymentGateway.s_show === 1 ? faToggleOn : faToggleOff}
                                                            onClick={() => handleToggleChange(paymentGateway.id, paymentGateway.s_show, "s_show")}
                                                        />
                                                    </td>
                                                    <td className="px-4 py-2">
                                                        <NotificationContainer />
                                                        <button className="bg-[#2dce89] text-white p-2 rounded-full hover:bg-green-600 transition mr-2">
                                                            <FaPen />
                                                        </button>
                                                        <button className="bg-[#f5365c] text-white p-2 rounded-full hover:bg-red-600 transition" onClick={() => { handleDelete(paymentGateway.id) }}>
                                                            <FaTrash />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={6} className="px-4 py-2 text-center">No data available</td>
                                            </tr>
                                        )}
                                    </tbody>

                                </table>
                            </div>
                        </div>
                        <div className="bottom-0 left-0 w-full bg-[#f7fbff] py-2 flex justify-between items-center">
                            <span className="text-sm font-normal text-gray-500">
                                Showing <span className="font-semibold text-gray-900">{indexOfFirstPaymentGateway + 1}</span> to <span className="font-semibold text-gray-900">{Math.min(indexOfLastPaymentGateway, filteredPaymentGateway.length)}</span> of <span className="font-semibold text-gray-900">{filteredPaymentGateway.length}</span>
                            </span>
                            <ul className="inline-flex -space-x-px rtl:space-x-reverse text-sm h-8">
                                <li>
                                    <button
                                        onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
                                        className={`previous-button ${filteredPaymentGateway.length === 0 ? 'cursor-not-allowed' : ''}`}
                                        disabled={currentPage === 1 || filteredPaymentGateway.length === 0}
                                        title={filteredPaymentGateway.length === 0 ? 'No data available' : ''}
                                    >
                                        <img src="/image/action/Left Arrow.svg" alt="Left" /> Previous
                                    </button>
                                </li>
                                <li>
                                    <span className="current-page">
                                        Page {filteredPaymentGateway.length > 0 ? currentPage : 0} of {filteredPaymentGateway.length > 0 ? totalPages : 0}
                                    </span>
                                </li>
                                <li>
                                    <button style={{background:'#045D78'}}
                                        onClick={() => paginate(currentPage < totalPages ? currentPage + 1 : totalPages)}
                                        className={`next-button ${filteredPaymentGateway.length === 0 ? 'cursor-not-allowed button-disable' : ''}`}
                                        disabled={currentPage === totalPages || filteredPaymentGateway.length === 0}
                                        title={filteredPaymentGateway.length === 0 ? 'No data available' : ''}
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

export default PaymentGatewayList;