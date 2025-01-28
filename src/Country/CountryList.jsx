import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import CountryHeader from './CountryHeader';
import { GoArrowDown, GoArrowUp } from 'react-icons/go';
import { FaPen, FaTrash } from "react-icons/fa";
import { DeleteEntity } from '../utils/Delete';
import { useLocation, useNavigate } from 'react-router-dom';
import { handleSort } from '../utils/sorting';
import api from '../utils/api';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import { StatusEntity } from '../utils/Status';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faToggleOff, faToggleOn } from '@fortawesome/free-solid-svg-icons';
import CountryCodes from "../utils/CountryCodes";
import Loader from '../common/Loader';
import { useLoading } from '../Context/LoadingContext';
import Table from '../common/Table';

const CountryList = () => {
    const navigate = useNavigate();
    const [countries, setCountries] = useState([]);
    const [filteredCountries, setFilteredCountries] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const location = useLocation()
    const { isLoading, setIsLoading } = useLoading();

    useEffect(() => {
        fetchCountries();
    }, []);

    // useEffect(() => {
    //     setIsLoading(true);
    //     const timer = setTimeout(() => {
    //       setIsLoading(false);
    //     }, 1000);
    //     return () => clearTimeout(timer);
    //   }, [ location, setIsLoading]);

    const fetchCountries = async () => {
        setIsLoading(true);
        try {
            const response = await api.get("/countries/all")
            console.log(response.data)
            setCountries(response.data);
            setFilteredCountries(response.data);
            setIsLoading(false);
        } catch (error) {
            console.error("Error fetching countries:", error);
        }
    };

    const handleSearch = (event) => {
        const searchQuery = event.target.value.toLowerCase();
        const filteredData = countries.filter(country =>
            Object.values(country).some(value =>
                String(value).toLocaleLowerCase().includes(searchQuery)
            )
        )
        setFilteredCountries(filteredData)
        setCurrentPage(1)
    }

    // for sorting
    const sortData = (key) => {
        handleSort(filteredCountries, key, sortConfig, setSortConfig, setFilteredCountries);
    };

    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    const currentCountries = filteredCountries.slice(indexOfFirst, indexOfLast);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const totalPages = Math.ceil(filteredCountries.length / itemsPerPage);

    const handledelete = async (id) => {
        const success = await DeleteEntity("Country", id);
        if (success) {
            const updatedCountries = countries.filter((country) => country.id !== id);
            setCountries(updatedCountries);
            setFilteredCountries(updatedCountries);
        }
    };

    // for update
    const updateCountry = (id) => {
        navigate('/add-country', { state: { id: id } })
    }

    const handleToggleChange = async (id, currentStatus, field) => {
        console.log(`Toggling ${field} for ID: ${id} with current status: ${currentStatus}`);
        if (!id || currentStatus === undefined) {
            console.error(`Invalid arguments: ID=${id}, currentStatus=${currentStatus}`);
            return;
        }

        try {
            await StatusEntity("Country", id, currentStatus, setFilteredCountries, filteredCountries, field);
        } catch (error) {
            console.error("Error toggling country status:", error);
        }
    };
    const columns = [
        { label: "Sr. No", field: "id", sortable: true, minWidth: "150px" },
        { label: " Image", field: "img", sortable: true, minWidth: "180px" },
        { label: " Country Name", field: "title", sortable: true, minWidth: "180px" },
        { label: " Currency", field: "currency", sortable: true, minWidth: "180px" },
        { label: " cities", field: "cities", sortable: true, minWidth: "180px" },
        { label: " Total Properties", field: "d_con", sortable: true, minWidth: "220px" },
        { label: "Status", field: "status", sortable: true, minWidth: "130px" },
        { label: 'Actions', field: 'actions', minWidth: '150px', sortable: false },
      ];

    return (
        <div>
            {/* {isLoading && <Loader />} */}
            <div className="h-screen flex">

                <div className="flex flex-1 flex-col bg-[#f7fbff]">
                    <Header />
                    <CountryHeader onSearch={handleSearch} />
                    <div className="px-6 h-full w-[1000px] overflow-scroll scrollbar-none">
                        <Table 
                            columns={columns}
                            data={currentCountries}
                            onSort={sortData}
                            onToggleChange={handleToggleChange}
                            onUpdate={updateCountry}
                            onDelete={handledelete}
                            currentPage={currentPage}
                            totalPages={totalPages}
                            paginate={paginate}
                            filteredData={filteredCountries}
                            loading={isLoading}
                        />

                    </div>
                </div>
            </div>
        </div>
    );
};

export default CountryList;
