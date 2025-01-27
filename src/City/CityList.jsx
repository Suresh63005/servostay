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

    useEffect(() => {
        setIsLoading(true);
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, [location, setIsLoading]);

    const fetchAllActiveCities = async () => {
        const token = Cookies.get("user");
        console.log("Fetched Token:", token);

        if (!token) {
            NotificationManager.error("No authentication token found. Please log in.");
            return;
        }

        try {
            const response = await api.get("/cities/active-cities", {
                headers: { "Authorization": `Bearer ${token}` },
                withCredentials: true,
            });
            console.log("Response:", response);

            if (response.data && Array.isArray(response.data.cities)) {
                setCities(response.data.cities);
                setFilteredCities(response.data.cities);
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

    const updateCountry = (id) => {
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

        if (!id || currentStatus === undefined) {
            console.error(`Invalid arguments: ID=${id}, currentStatus=${currentStatus}`);
            return;
        }

        try {
            await StatusEntity("City", id, currentStatus, setFilteredCities, filteredCities, field);
        } catch (error) {
            console.error("Error toggling country status:", error);
        }
    };

    return (
        <div>
            {isLoading && <Loader />}
            <div className="h-screen flex">
                <div className="flex flex-1 flex-col bg-[#f7fbff]">
                    <Header />
                    <CityHeader onSearch={handleSearch} />
                    <div className="px-6 h-full w-[1000px] overflow-scroll scrollbar-none">
                        <div className={`bg-white w-full rounded-xl border border-[#EAE5FF] py-4 px-3  overflow-y-auto scrollbar-thin ${filteredCities.length > 0 ? 'h-[500px]' : ''}`}>
                            <div className="relative scrollbar-thin h-[80%] sm:rounded-lg overflow-x-auto">
                                <table className="min-w-full text-sm text-left text-gray-700">
                                    <thead className="bg-[#045D78] bg-opacity-75 text-xs uppercase font-medium text-white">
                                        <tr>
                                            <th className="px-4 py-2 min-w-[120px]">
                                                Sr. No
                                                <div className="inline-flex items-center ml-2">
                                                    <GoArrowUp className='cursor-pointer' onClick={() => sortData('id')} />
                                                    <GoArrowDown className='cursor-pointer' onClick={() => sortData('id')} />
                                                </div>
                                            </th>
                                            <th className="px-4 py-2 min-w-[180px]">
                                                City Name
                                                <div className="inline-flex items-center ml-2">
                                                    <GoArrowUp className='cursor-pointer' onClick={() => sortData('title')} />
                                                    <GoArrowDown className='cursor-pointer' onClick={() => sortData('title')} />
                                                </div>
                                            </th>
                                            
                                            <th className="px-4 py-2 min-w-[180px]">
                                                Country Name
                                                <div className="inline-flex items-center ml-2">
                                                    <GoArrowUp className='cursor-pointer' onClick={() => sortData('title')} />
                                                    <GoArrowDown className='cursor-pointer' onClick={() => sortData('title')} />
                                                </div>
                                            </th>

                                            <th className="px-4 py-2 min-w-[150px]">
                                                Image
                                                <div className="inline-flex items-center ml-2">
                                                    <GoArrowUp className='cursor-pointer' onClick={() => sortData('currrency')} />
                                                    <GoArrowDown className='cursor-pointer' onClick={() => sortData('currrency')} />
                                                </div>
                                            </th>
                                            <th className="px-4 py-2 min-w-[150px]">
                                                Status
                                                <div className="inline-flex items-center ml-2">
                                                    <GoArrowUp className='cursor-pointer' onClick={() => sortData('status')} />
                                                    <GoArrowDown className='cursor-pointer' onClick={() => sortData('status')} />
                                                </div>
                                            </th>
                                            <th className="px-4 py-2 min-w-[150px]">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {filteredCities.length === 0 ? (
                                            <tr>
                                                <td colSpan="6" className="text-center py-2">
                                                    No Cities Found
                                                </td>
                                            </tr>
                                        ) : (
                                            currentCities.map((city, index) => {
                                                return (
                                                    <tr key={city.id} className='h-[70px]'>
                                                        <td className="px-4 py-1 text-sm">{index + 1 + indexOfFirst}</td>
                                                        <td className="px-4 py-1 text-sm">{city?.title || "N/A"}</td>
                                                        <td className="px-4 py-1 text-sm">{city.TblCountry ? city.TblCountry.countryName : "N/A"}</td>

                                                        <td className="px-4 py-1 text-sm">
                                                            {city.img && city.img.trim() !== '' ? (
                                                                <img
                                                                    src={city.img}
                                                                    className="w-10 h-10 object-cover rounded-full"
                                                                    alt=""
                                                                    onError={(e) => {
                                                                        if (e.target.src !== 'https://t4.ftcdn.net/jpg/04/73/25/49/360_F_473254957_bxG9yf4ly7OBO5I0O5KABlN930GwaMQz.jpg') {
                                                                            e.target.src = 'https://t4.ftcdn.net/jpg/04/73/25/49/360_F_473254957_bxG9yf4ly7OBO5I0O5KABlN930GwaMQz.jpg';
                                                                        }
                                                                    }}
                                                                    height={50}
                                                                    width={50}
                                                                    loading="lazy"
                                                                />
                                                            ) : (
                                                                <img
                                                                    src="https://t4.ftcdn.net/jpg/04/73/25/49/360_F_473254957_bxG9yf4ly7OBO5I0O5KABlN930GwaMQz.jpg"
                                                                    height={50}
                                                                    width={50}
                                                                    loading="lazy"
                                                                    alt=""
                                                                />
                                                            )}
                                                        </td>
                                                        <td>
                                                            <FontAwesomeIcon
                                                                className="h-7 w-16 cursor-pointer"
                                                                style={{ color: city.status === 1 ? "#045D78" : "#e9ecef" }}
                                                                icon={city.status === 1 ? faToggleOn : faToggleOff}
                                                                onClick={() => handleToggleChange(city.id, city.status, "status")}
                                                            />
                                                        </td>
                                                        <td className="px-4 py-1 text-sm">
                                                            <NotificationContainer />
                                                            <button className="bg-green-500 text-white p-1 rounded-full hover:bg-green-600 transition mr-2" onClick={() => { updateCountry(city.id) }}>
                                                                <FaPen />
                                                            </button>
                                                            <button className="bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition" onClick={() => { handledelete(city.id) }}>
                                                                <FaTrash />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="bottom-0 left-0 w-full bg-[#f7fbff] py-2 flex justify-between items-center">
                            <span className="text-sm font-normal text-gray-500">
                                Showing <span className="font-semibold text-gray-900">{indexOfFirst + 1}</span> to <span className="font-semibold text-gray-900">{Math.min(indexOfLast, filteredCities.length)}</span> of <span className="font-semibold text-gray-900">{filteredCities.length}</span>
                            </span>
                            <ul className="inline-flex -space-x-px rtl:space-x-reverse text-sm h-8">
                                <li>
                                    <button
                                        onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
                                        className={`previous-button ${filteredCities.length === 0 ? 'cursor-not-allowed button-disable' : ''}`}
                                        disabled={currentPage === 1 || filteredCities.length === 0}
                                        title={filteredCities.length === 0 ? 'No data available' : ''}
                                    >
                                        <img src="/image/action/Left Arrow.svg" alt="Left" /> Previous
                                    </button>
                                </li>
                                <li>
                                    <span className="current-page">
                                        Page {filteredCities.length > 0 ? currentPage : 0} of {filteredCities.length > 0 ? totalPages : 0}
                                    </span>
                                </li>
                                <li>
                                    <button style={{ background: '#045D78' }}
                                        onClick={() => paginate(currentPage < totalPages ? currentPage + 1 : totalPages)}
                                        className={`next-button ${filteredCities.length === 0 ? 'cursor-not-allowed' : ''}`}
                                        disabled={currentPage === totalPages || filteredCities.length === 0}
                                        title={filteredCities.length === 0 ? 'No data available' : ''}
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
    )
}

export default CityList
