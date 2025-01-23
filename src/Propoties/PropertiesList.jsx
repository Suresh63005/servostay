import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import { GoArrowDown, GoArrowUp } from 'react-icons/go';
import { FaPen, FaTrash } from "react-icons/fa";
import PropotiesHeader from './PropotiesHeader';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { DeleteEntity } from '../utils/Delete';
import { NotificationContainer } from 'react-notifications';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faToggleOff, faToggleOn } from "@fortawesome/free-solid-svg-icons";
import api from '../utils/api';
import { StatusEntity } from '../utils/Status';
import Loader from '../common/Loader';
import { useLoading } from '../Context/LoadingContext';

const PropotiesList = () => {
    const [properties, setProperties] = useState([]);
    const [filteredProperties, setFilteredProperties] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const navigate = useNavigate()

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const response = await api.get('/properties');
                const fetchedProperties = response.data.map((property) => {
                    return {
                        ...property,
                        rules: (() => {
                            try {
                                return JSON.parse(property.rules);
                            } catch (error) {
                                return property.rules ? [property.rules] : [];
                            }
                        })(),
                    }
                })
                console.log(response.data);
                // setProperties(response.data);
                // setFilteredProperties(response.data);
                setProperties(fetchedProperties);
                setFilteredProperties(fetchedProperties);
            } catch (error) {
                console.error('Error fetching properties:', error.response ? error.response.data : error.message);
            }
        };
        fetchProperties();
    }, []);

    // Search functionality
    const handleSearch = (event) => {
        const query = event.target.value.toLowerCase();
        const filteredData = properties.filter(property =>
            Object.values(property).some(value =>
                typeof value === 'object' && value !== null
                    ? Object.values(value).some(nestedValue =>
                        String(nestedValue).toLowerCase().includes(query)
                    )
                    : String(value).toLowerCase().includes(query)
            )
        );
        setFilteredProperties(filteredData);
        setCurrentPage(1);
    };

    // Sorting functionality
    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }

        const sortedData = [...filteredProperties].sort((a, b) => {
            if (key === 'id' || key === 'totalProperties') {
                return direction === 'asc' ? a[key] - b[key] : b[key] - a[key];
            }
            return a[key] < b[key]
                ? direction === 'asc' ? -1 : 1
                : direction === 'asc' ? 1 : -1;
        });

        setFilteredProperties(sortedData);
        setSortConfig({ key, direction });
        setCurrentPage(1);
    };

    const propertyUpdate = (id) => {
        navigate("/create-property", { state: { id: id } })
    }

    const deleteProperty = async (id) => {
        const success = await DeleteEntity('Property', id);
        if (success) {
            const updatedProperties = properties.filter((property) => property.id !== id);
            setProperties(updatedProperties);
            setFilteredProperties(updatedProperties)
        }
    }

    const { isLoading, setIsLoading } = useLoading();

    useEffect(() => {
        setIsLoading(true);
        
        const timer = setTimeout(() => {
          setIsLoading(false);
        }, 1000);
        return () => clearTimeout(timer);
      }, [ setIsLoading]);

    // Pagination calculations
    const indexOfLastItem = currentPage * itemsPerPage; 
    console.log(indexOfLastItem)
    const indexOfFirstItem = indexOfLastItem - itemsPerPage; 
    console.log(indexOfFirstItem)
    const currentProperties = filteredProperties.slice(indexOfFirstItem, indexOfLastItem);
    console.log(currentProperties)
    const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);
    console.log(totalPages)

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    console.log(paginate)

    const handleToggleChange = async (id, currentStatus, field) => {
        console.log(`Toggling ${field} for ID: ${id} with current status: ${currentStatus}`);
        if (!id || currentStatus === undefined) {
            console.error(`Invalid arguments: ID=${id}, currentStatus=${currentStatus}`);
            return;
        }
        try {
            await StatusEntity("Property", id, currentStatus, setFilteredProperties, filteredProperties, field);
            
        } catch (error) {
            console.error("Error toggling property status:", error);
        }
    };

    const handlePanoramaToggle = async (id, currentStatus, field) => {
        console.log(`Toggling ${field} for ID: ${id} with current status: ${currentStatus}`);
        if (!id || currentStatus === undefined) {
            console.error(`Invalid arguments: ID=${id}, currentStatus=${currentStatus}`);
            return;
        }
        try {
            await StatusEntity("Panorama", id, currentStatus, setFilteredProperties, filteredProperties, field);

        } catch (error) {
            console.error("Error toggling panorama status:", error);
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
                    <PropotiesHeader onSearch={handleSearch} />
                    {/* Card */}
                    <div className=" px-6 h-full w-[1000px] overflow-scroll scrollbar-none">
                        <div className={`bg-white w-full rounded-xl border border-[#EAE5FF] py-4 px-3 overflow-x-auto scrollbar-thin  table-container ${filteredProperties.length > 0 ? 'h-[500px]' : ''}`} >
                            <div className="relative sm:rounded-lg h-[80%] scrollbar-thin overflow-y-auto  table-scroll">
                                <table className="min-w-full text-sm text-left text-gray-700">
                                    <thead className="bg-[#045D78] bg-opacity-75 text-xs uppercase font-medium text-white">
                                        <tr>
                                            <th className="px-2 py-2 min-w-[100px]">
                                                Sr. No
                                                <div className="inline-flex items-center ml-2">
                                                    <GoArrowUp className="text-white hover:text-gray-700 cursor-pointer" onClick={() => handleSort('slno')} />
                                                    <GoArrowDown className="text-white hover:text-gray-700 cursor-pointer" onClick={() => handleSort('slno')} />
                                                </div>
                                            </th>
                                            <th className=" py-2 min-w-[140px]">
                                                Property Image
                                            </th>
                                            
                                            <th className=" py-2 min-w-[150px]">
                                                property Tittle
                                                <div className="inline-flex items-center ml-2">
                                                    <GoArrowUp className="text-white hover:text-gray-700 cursor-pointer" onClick={() => handleSort('propertyTittle')} />
                                                    <GoArrowDown className="text-white hover:text-gray-700 cursor-pointer" onClick={() => handleSort('propertyTittle')} />
                                                </div>
                                            </th>
                                            <th className=" py-2 min-w-[150px]">
                                                Is Panorama
                                                <div className="inline-flex items-center ml-2">
                                                    <GoArrowUp className="text-white hover:text-gray-700 cursor-pointer" onClick={() => handleSort('image')} />
                                                    <GoArrowDown className="text-white hover:text-gray-700 cursor-pointer" onClick={() => handleSort('image')} />
                                                </div>
                                            </th>
                                            <th className=" py-2 min-w-[150px]">
                                                property Type
                                                <div className="inline-flex items-center ml-2">
                                                    <GoArrowUp className="text-white hover:text-gray-700 cursor-pointer" onClick={() => handleSort('propertyType')} />
                                                    <GoArrowDown className="text-white hover:text-gray-700 cursor-pointer" onClick={() => handleSort('propertyType')} />
                                                </div>
                                            </th>
                                            <th className=" py-2 min-w-[180px]">
                                                Description
                                                <div className="inline-flex items-center ml-2">
                                                    <GoArrowUp className="text-white hover:text-gray-700 cursor-pointer" onClick={() => handleSort('propertyDescription')} />
                                                    <GoArrowDown className="text-white hover:text-gray-700 cursor-pointer" onClick={() => handleSort('propertyDescription')} />
                                                </div>
                                            </th>
                                            <th className=" py-2 min-w-[160px]">
                                                Address
                                                <div className="inline-flex items-center ml-2">
                                                    <GoArrowUp className="text-white hover:text-gray-700 cursor-pointer" onClick={() => handleSort('propertyAddress')} />
                                                    <GoArrowDown className="text-white hover:text-gray-700 cursor-pointer" onClick={() => handleSort('propertyAddress')} />
                                                </div>
                                            </th>
                                            <th className=" py-2 min-w-[100px]">
                                                City
                                                <div className="inline-flex items-center ml-2">
                                                    <GoArrowUp className="text-white hover:text-gray-700 cursor-pointer" onClick={() => handleSort('city')} />
                                                    <GoArrowDown className="text-white hover:text-gray-700 cursor-pointer" onClick={() => handleSort('city')} />
                                                </div>
                                            </th>
                                            <th className=" py-2 min-w-[130px]">
                                                Listing Date
                                                <div className="inline-flex items-center ml-2">
                                                    <GoArrowUp className="text-white hover:text-gray-700 cursor-pointer" onClick={() => handleSort('listing_date')} />
                                                    <GoArrowDown className="text-white hover:text-gray-700 cursor-pointer" onClick={() => handleSort('listing_date')} />
                                                </div>
                                            </th>
                                            <th className=" py-2 min-w-[100px]">
                                                Is_Sell
                                                <div className="inline-flex items-center ml-2">
                                                    <GoArrowUp className="text-white hover:text-gray-700 cursor-pointer" onClick={() => handleSort('is_sell')} />
                                                    <GoArrowDown className="text-white hover:text-gray-700 cursor-pointer" onClick={() => handleSort('is_sell')} />
                                                </div>
                                            </th>
                                            <th className=" py-2 min-w-[130px]">
                                                Rules
                                                <div className="inline-flex items-center ml-2">
                                                    <GoArrowUp className="text-white hover:text-gray-700 cursor-pointer" onClick={() => handleSort('is_sell')} />
                                                    <GoArrowDown className="text-white hover:text-gray-700 cursor-pointer" onClick={() => handleSort('is_sell')} />
                                                </div>
                                            </th>
                                            <th className=" py-2 min-w-[150px]">
                                                Factility
                                                <div className="inline-flex items-center ml-2">
                                                    <GoArrowUp className="text-white hover:text-gray-700 cursor-pointer" onClick={() => handleSort('propertyFacility')} />
                                                    <GoArrowDown className="text-white hover:text-gray-700 cursor-pointer" onClick={() => handleSort('propertyFacility')} />
                                                </div>
                                            </th>
                                            <th className=" py-2 min-w-[110px]">
                                                Adults
                                                <div className="inline-flex items-center ml-2">
                                                    <GoArrowUp className="text-white hover:text-gray-700 cursor-pointer" onClick={() => handleSort('propertyFacility')} />
                                                    <GoArrowDown className="text-white hover:text-gray-700 cursor-pointer" onClick={() => handleSort('propertyFacility')} />
                                                </div>
                                            </th>
                                            <th className=" py-2 min-w-[110px]">
                                                Children
                                                <div className="inline-flex items-center ml-2">
                                                    <GoArrowUp className="text-white hover:text-gray-700 cursor-pointer" onClick={() => handleSort('propertyFacility')} />
                                                    <GoArrowDown className="text-white hover:text-gray-700 cursor-pointer" onClick={() => handleSort('propertyFacility')} />
                                                </div>
                                            </th>
                                            <th className=" py-2 min-w-[110px]">
                                                Infants
                                                <div className="inline-flex items-center ml-2">
                                                    <GoArrowUp className="text-white hover:text-gray-700 cursor-pointer" onClick={() => handleSort('propertyFacility')} />
                                                    <GoArrowDown className="text-white hover:text-gray-700 cursor-pointer" onClick={() => handleSort('propertyFacility')} />
                                                </div>
                                            </th>
                                            <th className=" py-2 min-w-[110px]">
                                                Pets
                                                <div className="inline-flex items-center ml-2">
                                                    <GoArrowUp className="text-white hover:text-gray-700 cursor-pointer" onClick={() => handleSort('propertyFacility')} />
                                                    <GoArrowDown className="text-white hover:text-gray-700 cursor-pointer" onClick={() => handleSort('propertyFacility')} />
                                                </div>
                                            </th>
                                            <th className=" py-2 min-w-[150px]">
                                                Price/Night
                                                <div className="inline-flex items-center ml-2">
                                                    <GoArrowUp className="text-white hover:text-gray-700 cursor-pointer" onClick={() => handleSort('propertyPrice')} />
                                                    <GoArrowDown className="text-white hover:text-gray-700 cursor-pointer" onClick={() => handleSort('propertyPrice')} />
                                                </div>
                                            </th>

                                            <th className=" py-2 min-w-[110px]">
                                                Mobile
                                                <div className="inline-flex items-center ml-2">
                                                    <GoArrowUp className="text-white hover:text-gray-700 cursor-pointer" onClick={() => handleSort('mobile')} />
                                                    <GoArrowDown className="text-white hover:text-gray-700 cursor-pointer" onClick={() => handleSort('mobile')} />
                                                </div>
                                            </th>
                                            <th className=" py-2 min-w-[110px]">
                                                Country
                                                <div className="inline-flex items-center ml-2">
                                                    <GoArrowUp className="text-white hover:text-gray-700 cursor-pointer" onClick={() => handleSort('country_id')} />
                                                    <GoArrowDown className="text-white hover:text-gray-700 cursor-pointer" onClick={() => handleSort('country_id')} />
                                                </div>
                                            </th>
                                            <th className=" py-2 min-w-[130px]">
                                                Total Beds
                                                <div className="inline-flex items-center ml-2">
                                                    <GoArrowUp className="text-white hover:text-gray-700 cursor-pointer" onClick={() => handleSort('totalBeds')} />
                                                    <GoArrowDown className="text-white hover:text-gray-700 cursor-pointer" onClick={() => handleSort('totalBeds')} />
                                                </div>
                                            </th>
                                            <th className=" py-2 min-w-[170px]">
                                                Total BathRooms
                                                <div className="inline-flex items-center ml-2">
                                                    <GoArrowUp className="text-white hover:text-gray-700 cursor-pointer" onClick={() => handleSort('totalBathrooms')} />
                                                    <GoArrowDown className="text-white hover:text-gray-700 cursor-pointer" onClick={() => handleSort('totalBathrooms')} />
                                                </div>
                                            </th>
                                            <th className=" py-2 min-w-[130px]">
                                                total SQFT.
                                                <div className="inline-flex items-center ml-2">
                                                    <GoArrowUp className="text-white hover:text-gray-700 cursor-pointer" onClick={() => handleSort('totalSQFT')} />
                                                    <GoArrowDown className="text-white hover:text-gray-700 cursor-pointer" onClick={() => handleSort('totalSQFT')} />
                                                </div>
                                            </th>
                                            <th className=" py-2 min-w-[120px]">
                                                Rating
                                                <div className="inline-flex items-center ml-2">
                                                    <GoArrowUp className="text-white hover:text-gray-700 cursor-pointer" onClick={() => handleSort('rating')} />
                                                    <GoArrowDown className="text-white hover:text-gray-700 cursor-pointer" onClick={() => handleSort('rating')} />
                                                </div>
                                            </th>
                                            <th className=" py-2 min-w-[120px]">
                                                Status
                                                <div className="inline-flex items-center ml-2">
                                                    <GoArrowUp className="text-white hover:text-gray-700 cursor-pointer" onClick={() => handleSort('status')} />
                                                    <GoArrowDown className="text-white hover:text-gray-700 cursor-pointer" onClick={() => handleSort('status')} />
                                                </div>
                                            </th>
                                            <th className=" py-2 min-w-[120px]">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {currentProperties.length > 0 ? (
                                            currentProperties.map((property, index) => (
                                                <tr key={property.id} className='h-[70px]'>
                                                    <td className="text-center ">{index + 1 + indexOfFirstItem}</td>
                                                    <td className="text-center ">
                                                        {property.image && property.image.trim() !== '' ? (
                                                            <img src={property.image} className="w-10 h-10 object-cover rounded-full" height={50} width={50} loading="lazy" alt="" onError={(e) => {
                                                                if (e.target.src !== 'https://t4.ftcdn.net/jpg/04/73/25/49/360_F_473254957_bxG9yf4ly7OBO5I0O5KABlN930GwaMQz.jpg') {
                                                                    e.target.src = 'https://t4.ftcdn.net/jpg/04/73/25/49/360_F_473254957_bxG9yf4ly7OBO5I0O5KABlN930GwaMQz.jpg';
                                                                }
                                                            }} />
                                                        ) : (
                                                            <img src={'https://t4.ftcdn.net/jpg/04/73/25/49/360_F_473254957_bxG9yf4ly7OBO5I0O5KABlN930GwaMQz.jpg'} height={50} width={50} loading="lazy" alt="" />
                                                        )}
                                                    </td>
                                                    <td className=" ">{property.title || 'N/A'}</td>
                                                    <td>
                                                        <FontAwesomeIcon
                                                            className="h-7 w-16 cursor-pointer"
                                                            style={{ color: property.is_panorama === 1 ? "#045D78" : "#e9ecef" }}
                                                            icon={property.is_panorama === 1 ? faToggleOn : faToggleOff}
                                                            onClick={() => handlePanoramaToggle(property.id, property.is_panorama, "is_panorama")}
                                                        />
                                                    </td>
                                                    
                                                    <td className=" ">{property.category?.title || 'N/A'}</td>
                                                    <td className=" ">{property?.description || 'N/A'}</td>
                                                    <td className=" ">{property?.address || 'N/A'}</td>
                                                    <td className=" ">{property?.city || 'N/A'}</td>
                                                    {/* <td className=" ">{property?.listing_date || 'N/A'}</td> */}
                                                    <td className=" ">
                                                        {property?.listing_date ? new Date(property.listing_date).toISOString().split("T")[0] : 'N/A'}
                                                    </td>

                                                    <td>
                                                        <FontAwesomeIcon
                                                            className="h-7 w-16 cursor-pointer"
                                                            style={{ color: property.is_sell === 1 ? "#045D78" : "#e9ecef" }}
                                                            icon={property.is_sell === 1 ? faToggleOn : faToggleOff}
                                                            onClick={() => handleToggleChange(property.id, property.is_sell, "is_sell")}
                                                        />
                                                    </td>
                                                    {/* <td className=" ">{property?.rules || 'N/A'}</td> */}
                                                    <td className=" ">
                                                        {Array.isArray(property.rules) ? property.rules.join(', ') : 'N/A'}
                                                    </td>

                                                    <td className="  ">
                                                        {property.facilities?.map((item) => (
                                                            <span className='' key={item.id}>
                                                                {item.title}
                                                            </span>
                                                        )) || 'N/A'}
                                                    </td>
                                                    <td className=" ">{property?.adults || 'N/A'}</td>
                                                    <td className=" ">{property?.children || 'N/A'}</td>
                                                    <td className=" ">{property?.infants || 'N/A'}</td>
                                                    <td className=" ">{property?.pets || 'N/A'}</td>
                                                    <td className=" ">₹{property?.price || 'N/A'}</td>
                                                    <td className=" ">{property?.mobile || 'N/A'}</td>
                                                    <td className=" ">{property.country?.title || 'N/A'}</td>
                                                    <td className=" ">{property?.beds || 'N/A'}</td>
                                                    <td className=" ">{property?.bathroom || 'N/A'}</td>
                                                    <td className=" ">{property?.sqrft || 'N/A'}</td>
                                                    <td className=" ">{property?.rate || 'N/A'}</td>
                                                    <td>
                                                        <FontAwesomeIcon
                                                            className="h-7 w-16 cursor-pointer"
                                                            style={{ color: property.status === 1 ? "#045D78" : "#e9ecef" }}
                                                            icon={property.status === 1 ? faToggleOn : faToggleOff}
                                                            onClick={() => handleToggleChange(property.id, property.status, "status")}
                                                        />
                                                    </td>
                                                    <td className=" py-2">
                                                        <NotificationContainer />
                                                        <button className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600 transition mr-2" onClick={() => propertyUpdate(property.id)}>
                                                            <FaPen />
                                                        </button>
                                                        <button className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition" onClick={() => deleteProperty(property.id)}>
                                                            <FaTrash />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="20" className="text-center py-4">
                                                    No properties found.

                                                </td>
                                            </tr>
                                        )}
                                    </tbody>

                                </table>
                            </div>
                        </div>
                        <div className="bottom-0 left-0 w-full bg-[#f7fbff] py-2 flex justify-between items-center">
                            <span className="text-sm font-normal text-gray-500">
                                Showing <span className="font-semibold text-gray-900">{indexOfFirstItem + 1}</span> to <span className="font-semibold text-gray-900">{Math.min(indexOfLastItem, filteredProperties.length)}</span> of <span className="font-semibold text-gray-900">{filteredProperties.length}</span>
                            </span>
                            <ul className="inline-flex -space-x-px rtl:space-x-reverse text-sm h-8">
                                <li>
                                    <button
                                        onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
                                        className={`previous-button ${filteredProperties.length === 0 ? 'cursor-not-allowed' : ''}`}
                                        disabled={currentPage === 1 || filteredProperties.length === 0}
                                        title={filteredProperties.length === 0 ? 'No data available' : ''}
                                    >
                                        <img src="/image/action/Left Arrow.svg" alt="Left" /> Previous
                                    </button>
                                </li>
                                <li>
                                    <span className="current-page">
                                        Page {filteredProperties.length > 0 ? currentPage : 0} of {filteredProperties.length > 0 ? totalPages : 0}
                                    </span>
                                </li>
                                <li>
                                    <button style={{background:'#045D78'}}
                                        onClick={() => paginate(currentPage < totalPages ? currentPage + 1 : totalPages)}
                                        className={`next-button ${filteredProperties.length === 0 ? 'cursor-not-allowed button-disable' : ''}`}
                                        disabled={currentPage === totalPages || filteredProperties.length === 0}
                                        title={filteredProperties.length === 0 ? 'No data available' : ''}
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

export default PropotiesList;