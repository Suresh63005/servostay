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
import Table from '../common/Table';

const PropotiesList = () => {
    const [properties, setProperties] = useState([]);

    const [filteredProperties, setFilteredProperties] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const navigate = useNavigate()
    const { isLoading, setIsLoading } = useLoading();

    useEffect(() => {
        const fetchProperties = async () => {
            setIsLoading(true);
            try {
                const response = await api.get('/properties');
                console.log("Property data:", response.data);

                const fetchedProperties = response.data.map((property) => {
                    return {
                        ...property,
                        city:property.cities?.title || "",
                        rules: (() => {
                            try {
                                return JSON.parse(property.rules);
                            } catch (error) {
                                return property.rules ? [property.rules] : [];
                            }
                        })(),
                        // standard_rules: property.standard_rules
                    }
                })
                // console.log(response.data);
                // setProperties(response.data);
                // setFilteredProperties(response.data);
                setProperties(fetchedProperties);
                setFilteredProperties(fetchedProperties);
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching properties:', error.response ? error.response.data : error.message);
            }
            finally{
                setIsLoading(false);
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

    // Pagination calculations
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentProperties = filteredProperties.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleToggleChange = async (id, currentStatus, field) => {
        console.log(`Toggling ${field} for ID: ${id} with current status: ${currentStatus}`);
        if (!id || currentStatus === undefined) {
            console.error(`Invalid arguments: ID=${id}, currentStatus=${currentStatus}`);
            return;
        }
    
        try {

            // Dynamically determine the entity type based on the field
            const entityType = field === "is_panorama" ? "Panorama" : "Property";
    
            await StatusEntity(entityType, id, currentStatus, setFilteredProperties, filteredProperties, field);

        } catch (error) {
            console.error(`Error toggling ${field} status:`, error);
        }
    };
    
    const columns = [
        { label: "Sr. No", field: "id", sortable: true, minWidth: "130px" },
        { label: "Image", field: "image", sortable: true, minWidth: "130px" },
        { label: "title", field: "title", sortable: true, minWidth: "180px" },
        { label: "price", field: "price", sortable: true, minWidth: "120px" },
        { label: "is panorama", field: "is_panorama", sortable: true, minWidth: "200px" },
        { label: "address", field: "address", sortable: true, minWidth: "150px" },
        { label: "facilities", field: "facilities", sortable: true, minWidth: "150px" },
        { label: "description", field: "description", sortable: true, minWidth: "180px" },
        { label: "beds", field: "beds", sortable: true, minWidth: "120px" },
        { label: "bathroom", field: "bathroom", sortable: true, minWidth: "150px" },
        { label: "sqrft", field: "sqrft", sortable: true, minWidth: "130px" },
        { label: "rate", field: "rate", sortable: true, minWidth: "120px" },
        { label: "property type", field: "ptype", sortable: true, minWidth: "200px" },
        { label: "latitude", field: "latitude", sortable: true, minWidth: "150px" },
        { label: "longtitude", field: "longtitude", sortable: true, minWidth: "180px" },
        { label: "mobile", field: "mobile", sortable: true, minWidth: "130px" },
        // { label: "city", field: "city", sortable: true, minWidth: "120px" },
        { label: "City", field: "cities.title", sortable: true, minWidth: "120px" },
        { label: "listing date", field: "listing_date", sortable: true, minWidth: "180px" },
        {
            label: "Standard Rules",
            field: "standard_rules",
            sortable: true,
            minWidth: "180px",
            render: (row) => {
              console.log("Raw standard_rules data:", row.standard_rules);
          
              let standardRules = row.standard_rules;
          
              if (typeof standardRules === "string") {
                try {
                  standardRules = JSON.parse(standardRules);
                } catch (error) {
                  console.error("Error parsing standard_rules:", error);
                  return "N/A";
                }
              }
          
              console.log("Parsed standard_rules object:", standardRules);
          
              return standardRules && typeof standardRules === "object" ? (
                `Check-In: ${standardRules.checkIn || "N/A"}, Check-Out: ${standardRules.checkOut || "N/A"}, Smoking: ${standardRules.smokingAllowed ? "Allowed" : "Not Allowed"}`
              ) : (
                "N/A"
              );
            },
          }
          ,
                           
        { label: "rules", field: "rules", sortable: true, minWidth: "150px" },
        { label: "adults", field: "adults", sortable: true, minWidth: "130px" },
        { label: "children", field: "children", sortable: true, minWidth: "150px" },
        { label: "infants", field: "infants", sortable: true, minWidth: "150px" },
        { label: "pets", field: "pets", sortable: true, minWidth: "120px" },
        
        { label: "Status", field: "status", sortable: false, minWidth: "120px" },
        { label: "Actions", field: "actions", minWidth: "150px", sortable: false },
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
                    <PropotiesHeader onSearch={handleSearch} />
                    {/* Card */}
                    <div className=" px-6 h-full w-[79vw] overflow-scroll scrollbar-none">

                        <Table 
                            columns={columns}
                            data={filteredProperties}
                            // onSort={sortedData}
                            onToggleChange={handleToggleChange}
                            onUpdate={propertyUpdate}
                            onDelete={deleteProperty}
                            currentPage={currentPage}
                            totalPages={totalPages}
                            paginate={paginate}
                            filteredData={filteredProperties}
                            loading={isLoading}
                        />


                    </div>
                </div>
            </div>
        </div>
    );
};

export default PropotiesList;