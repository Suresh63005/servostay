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
import Table from '../common/Table';

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
            setIsLoading(true)
            try {
                const response = await api.get("/coupons/all", {
                    withCredentials: true,
                });
                console.log("API Response:", response.data);
                setcouppons(response.data);
                setFilteredcouppons(response.data);
                setIsLoading(false)
            } catch (error) {
                console.error("API Error:", error);
            }finally{
                setIsLoading(false)
            }
        }
        fetchData();
    }, []);

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

    const columns = [
        { label: "Sr. No", field: "id", sortable: true, minWidth: "120px" },
        { label: "Coupon Image", field: "c_img", sortable: false, minWidth: "150px" },
        { label: "Coupon Title", field: "ctitle", sortable: true, minWidth: "180px" },
        { label: "Coupon SubTitle", field: "subtitle", sortable: true, minWidth: "220px" },
        { label: "Coupon Code", field: "c_title", sortable: true, minWidth: "180px" },
        { label: "min amount", field: "min_amt", sortable: true, minWidth: "180px" },
        { label: "Coupon Value", field: "c_value", sortable: true, minWidth: "180px" },
        { label: "Coupon Description", field: "c_desc", sortable: true, minWidth: "220px" },
        { label: "Status", field: "status", sortable: true, minWidth: "130px" },
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
                    <CupponHeader onSearch={handleSearch} />
                    {/* card */}
                    <div className='px-6 h-full w-[1000px] overflow-scroll scrollbar-none'>
                        <Table 
                            columns={columns}
                            data={currentcouppons}
                            onSort={sortData}
                            onToggleChange={handleToggleChange}
                            onUpdate={updateCuppon}
                            onDelete={handledelete}
                            currentPage={currentPage}
                            totalPages={totalPages}
                            paginate={paginate}
                            filteredData={filteredcouppons}
                            loading={isLoading}
                        >

                        </Table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CupponList;
