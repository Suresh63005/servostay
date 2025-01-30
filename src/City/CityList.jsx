import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useLoading } from '../Context/LoadingContext';
import Header from '../components/Header';
import api from '../utils/api';
import { handleSort } from '../utils/sorting';
import Loader from '../common/Loader';
import { GoArrowDown, GoArrowUp } from 'react-icons/go';
import CityHeader from './CityHeader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faToggleOff, faToggleOn } from '@fortawesome/free-solid-svg-icons';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import Cookies from "js-cookie";
import { FaPen, FaTrash } from 'react-icons/fa';
import { StatusEntity } from '../utils/Status';
import { DeleteEntity } from '../utils/Delete';
import Table from '../common/Table';

const CityList = () => {
    const navigate = useNavigate();
    const [cities, setCities] = useState([]);
    const [filteredCities, setFilteredCities] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const location = useLocation()
    const { isLoading, setIsLoading } = useLoading();

    useEffect(() => {
        fetchAllActiveCities();
    }, [])

    // useEffect(() => {
    //     setIsLoading(true);
    //     const timer = setTimeout(() => {
    //         setIsLoading(false);
    //     }, 1000);
    //     return () => clearTimeout(timer);
    // }, [location, setIsLoading]);

    const fetchAllActiveCities = async () => {
        const token = Cookies.get("user");
        if (!token) {
            NotificationManager.error("No authentication token found. Please log in.");
            return;
        }
        setIsLoading(true);
        try {
            const response = await api.get("/cities/active-cities", {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true,
            });
            console.log(response.data)
            if (response?.data?.cities && Array.isArray(response.data.cities)) {
                const citiesWithCountry = response.data.cities.map((city, index) => ({
                    id: city.id, 
                    img: city.img,
                    title: city.title,
                    countryName: city.country?.title || "N/A", 
                    status: city.status,
                    
                }));
                setCities(citiesWithCountry);
                setFilteredCities(citiesWithCountry);
                
            } else {
                console.error("Unexpected data format:", response.data);
                setCities([]);
                setFilteredCities([]);
            }
        } catch (error) {
            console.error("Error fetching cities:", error);
            NotificationManager.error("Failed to fetch cities. Please try again.");
            setCities([]);
            setFilteredCities([]);
        }finally{
            setIsLoading(false);
        }
    };

    const handleSearch = (event) => {
        const searchQuery = event.target.value.toLowerCase();
        const filteredData = cities.filter(city =>
            Object.values(city).some(value =>
                String(value).toLocaleLowerCase().includes(searchQuery)
            )
        )
        setFilteredCities(filteredData)
        setCurrentPage(1)
    }

    const sortData = (key) => {
        handleSort(filteredCities, key, sortConfig, setSortConfig, setFilteredCities);
    };

    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    const currentCities = filteredCities.slice(indexOfFirst, indexOfLast);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const totalPages = Math.ceil(filteredCities.length / itemsPerPage);

    const updateCity = (id) => {
        navigate('/add-city', { state: { id: id } })
    }

    const handledelete = async (id) => {
        const success = await DeleteEntity("City", id);
        if (success) {
            const updatedCities = cities.filter((city) => city.id !== id);
            setCities(updatedCities);
            setFilteredCities(updatedCities);
        }
    };

    const handleToggleChange = async (id, currentStatus, field) => {
        console.log(`Toggling ${field} for ID: ${id} with current status: ${currentStatus}`);

        try {
            await StatusEntity("City", id, currentStatus, setFilteredCities, filteredCities, field);
        } catch (error) {
            console.error("Error toggling country status:", error);
        }
    };

    const columns = [
        { label: "Sr. No", field: "id", sortable: true, minWidth: "150px" },
        { label: "Image", field: "img", sortable: false, minWidth: "180px" },
        { label: "City", field: "title", sortable: true, minWidth: "180px" },
        { label: "Country Name", field: "countryName", sortable: true, minWidth: "180px" },
        { label: "Status", field: "status", sortable: true, minWidth: "130px" },
        { label: "Actions", field: "actions", minWidth: "150px", sortable: false },
    ];
    
    return (
        <div>
            {/* {isLoading && <Loader />} */}
            <div className="h-screen flex">
                <div className="flex flex-1 flex-col bg-[#f7fbff]">
                    <Header />
                    <CityHeader onSearch={handleSearch} />
                    <div className="px-6 h-full w-[79vw] overflow-scroll scrollbar-none">
                        <Table 
                            columns={columns}
                            onSort={sortData}
                            onToggleChange={handleToggleChange}
                            onUpdate={updateCity}
                            onDelete={handledelete}
                            currentPage={currentPage}
                            totalPages={totalPages}
                            paginate={paginate}
                            filteredData={filteredCities}
                            loading={isLoading}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CityList
