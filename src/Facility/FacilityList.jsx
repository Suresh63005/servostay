import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import { GoArrowDown, GoArrowUp } from 'react-icons/go';
import { FaPen, FaTrash } from "react-icons/fa";
import FacilityHeader from './FacilityHeader';
import axios from 'axios';
import { useLoading } from '../Context/LoadingContext';
import { useLocation, useNavigate } from 'react-router-dom';
import Loader from '../common/Loader';
import { handleSort } from '../utils/sorting';
import { DeleteEntity } from '../utils/Delete';
import { NotificationContainer } from 'react-notifications';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faToggleOff, faToggleOn } from "@fortawesome/free-solid-svg-icons";
import api from '../utils/api';
import { StatusEntity } from '../utils/Status';
import Table from '../common/Table';

const FacilityList = () => {
    const navigate = useNavigate()
    const [facility, setfacility] = useState([]);
    const [filterData, setFilterData] = useState(facility);
    const [filteredfacility, setFilteredfacility] = useState(facility);
    const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [searchQuery, setSearchQuery] = useState("");
    const location = useLocation();
    const { isLoading, setIsLoading } = useLoading();

    useEffect(() => {
        async function fetchData() {
            setIsLoading(true);
            try {
                const response = await api.get("/facilities/all",);
                console.log("API Response:", response.data);
                setfacility(response.data);
                setFilterData(response.data);
                setFilteredfacility(response.data);
                setIsLoading(false)
            } catch (error) {
                console.error("API Error:", error);
            }finally{
                setIsLoading(false)
            }
        }
        fetchData();
    }, []);


    // for sorting
    const sortData = (key) => {
        handleSort(filteredfacility, key, sortConfig, setSortConfig, setFilteredfacility)
    };

    // Search functionality
    const handleSearch = (event) => {
        const query = event.target.value.toLowerCase();
        const filteredData = facility.filter(feature =>
            Object.values(feature).some(value =>
                String(value).toLowerCase().includes(query)
            )
        );
        setFilteredfacility(filteredData);
        setCurrentPage(1);
    };

    // Calculate paginated facility
    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    const currentfacility = filteredfacility.slice(indexOfFirst, indexOfLast);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const totalPages = Math.ceil(filteredfacility.length / itemsPerPage);

    const handledelete = async (id) => {
        const success = await DeleteEntity('Facility', id);
        if (success) {
            const updatedFacility = facility.filter((item) => item.id !== id);
            setfacility(updatedFacility);
            setFilterData(updatedFacility);
            setFilteredfacility(updatedFacility);
        }
    };

    // for update
    const updateFacility = (id) => {
        navigate('/create-facility', { state: { id: id } })
    }

    const handleToggleChange = async (id, currentStatus, field) => {
        console.log(`Toggling ${field} for ID: ${id} with current status: ${currentStatus}`);
        if (!id || currentStatus === undefined) {
            console.error(`Invalid arguments: ID=${id}, currentStatus=${currentStatus}`);
            return;
        }

        try {
            await StatusEntity("Facility", id, currentStatus, setFilteredfacility, filteredfacility, field);
        } catch (error) {
            console.error("Error toggling facility status:", error);
        }
    };
    const columns = [
        { label: "Sr. No", field: "id", sortable: true, minWidth: "150px" },
        { label: "Facility Image", field: "img", sortable: false, minWidth: "100px" },
        { label: "Facility Title", field: "title", sortable: true, minWidth: "180px" },
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
                    <FacilityHeader onSearch={handleSearch} />
                    {/* Card */}
                    <div className="px-6 h-full w-[79vw] overflow-scroll scrollbar-none">
                    <Table
              columns={columns}
              data={currentfacility}
              onSort={sortData}
              onToggleChange={handleToggleChange}
              onUpdate={updateFacility}
              onDelete={handledelete}
              currentPage={currentPage}
              totalPages={totalPages}
              paginate={paginate}
              filteredData={filteredfacility}
              loading={isLoading}
            />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FacilityList;