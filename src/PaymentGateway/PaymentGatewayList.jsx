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
import Table from '../common/Table';

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
            setIsLoading(true)
            try {
                const response = await api.get("/payment-methods/");
                console.log("API Response:", response.data);
                setPaymentGateway(response.data);
                setFilteredPaymentGateway(response.data);
                setIsLoading(true)
            } catch (error) {
                console.error("API Error:", error);
            }finally{
                setIsLoading(false)
            }
        }
        fetchData();
    }, []);

    // useEffect(() => {
    //     setIsLoading(true);
    //     const timer = setTimeout(() => {
    //         setIsLoading(false);
    //     }, 1000);
    //     return () => clearTimeout(timer);
    // }, [location, setIsLoading]);

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

    const columns = [
        { label: "Sr. No", field: "id", sortable: true, minWidth: "150px" },
        { label: " Title", field: "title", sortable: true, minWidth: "180px" },
        { label: " subtitle", field: "subtitle", sortable: true, minWidth: "180px" },
        { label: " attributes", field: "attributes", sortable: true, minWidth: "180px" },
        { label: " p_show", field: "p_show", sortable: true, minWidth: "180px" },
        { label: " s_show", field: "s_show", sortable: true, minWidth: "180px" },
        { label: "Status", field: "status", sortable: true, minWidth: "100px" },
        { label: 'Actions', field: 'actions', minWidth: '150px', sortable: false },
      ];

    return (
        <div>
            {/* {isLoading && <Loader />} */}
            <div className="h-screen flex">
                {/* Sidebar */}

                <div className="flex flex-1 flex-col bg-[#f7fbff]">
                    {/* Header */}
                    <Header />
                    {/* Searching, sorting, and main content area */}
                    <PaymentGatewayHeader onSearch={handleSearch} />
                    {/* Card */}
                    <div className="px-6 h-full w-[1000px] overflow-scroll scrollbar-none">
                    <Table
              columns={columns}
              data={currentPaymentGateway}
              onSort={sortData}
              onToggleChange={handleToggleChange}
            //   onUpdate={up}
              onDelete={handleDelete}
              currentPage={currentPage}
              totalPages={totalPages}
              paginate={paginate}
              filteredData={filteredPaymentGateway}
              loading={isLoading}
            />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentGatewayList;