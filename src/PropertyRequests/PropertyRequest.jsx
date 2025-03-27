import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import PropotiesHeader from "./PropotiesHeader";
import { useNavigate } from "react-router-dom";
import { DeleteEntity } from "../utils/Delete";
import { NotificationContainer } from "react-notifications";
import api from "../utils/api";
import { useLoading } from "../Context/LoadingContext";
import { GoArrowUp, GoArrowDown } from 'react-icons/go';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faTrash } from '@fortawesome/free-solid-svg-icons';
import "../App.css";

const PropertyRequest = () => {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [facilityOptions, setFacilityOptions] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const navigate = useNavigate();
  const { isLoading, setIsLoading } = useLoading();

  // Fetch facilities
  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const response = await api.get("/facilities/all");
        if (response.status === 200 && Array.isArray(response.data)) {
          setFacilityOptions(response.data);
        }
      } catch (error) {
        console.error("Error fetching facilities:", error);
      }
    };
    fetchFacilities();
  }, []);

  // Fetch properties
  useEffect(() => {
    const fetchProperties = async () => {
      setIsLoading(true);
      try {
        const response = await api.get("/request-property");
        console.log(response);
        const fetchedProperties = await Promise.all(
          response.data.map(async (property) => {
            const maxLength = 100;
            const shortDescription =
              property.description && property.description.length > maxLength
                ? property.description.substring(0, maxLength) + "..."
                : property.description;

            let facilityIds = [];
            if (Array.isArray(property.facility)) {
              facilityIds = property.facility;
            } else if (typeof property.facility === "string") {
              try {
                const parsed = JSON.parse(property.facility);
                facilityIds = Array.isArray(parsed) ? parsed : [];
              } catch (e) {
                facilityIds = property.facility
                  ? property.facility.split(",").map((item) => Number(item.trim()))
                  : [];
              }
            }

            const facilityNames = facilityOptions
              .filter((fac) => facilityIds.includes(fac.id))
              .map((fac) => fac.title);

            let standardRules;
            try {
              standardRules =
                typeof property.standard_rules === "string"
                  ? JSON.parse(property.standard_rules)
                  : property.standard_rules;
            } catch (error) {
              console.error("Error parsing standard_rules:", error.message);
              standardRules = null;
            }

            return {
              ...property,
              shortDescription,
              facility: facilityNames.join(", "),
              formatted_standard_rules: standardRules,
            };
          })
        );

        setProperties(fetchedProperties);
        setFilteredProperties(fetchedProperties);
      } catch (error) {
        console.error(
          "Error fetching properties:",
          error.response ? error.response.data : error.message
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchProperties();
  }, [facilityOptions, setIsLoading]);

  // Search functionality
  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    const filteredData = properties.filter((property) =>
      Object.values(property).some((value) =>
        typeof value === "object" && value !== null
          ? Object.values(value).some((nestedValue) =>
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
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }

    const sortedData = [...filteredProperties].sort((a, b) => {
      if (key === "id" || key === "price") {
        return direction === "asc" ? a[key] - b[key] : b[key] - a[key];
      }
      if (key === "accept") {
        const aValue = a[key] === null || a[key] === undefined ? -1 : a[key] ? 1 : 0;
        const bValue = b[key] === null || b[key] === undefined ? -1 : b[key] ? 1 : 0;
        return direction === "asc" ? aValue - bValue : bValue - aValue;
      }
      return a[key] < b[key]
        ? direction === "asc"
          ? -1
          : 1
        : direction === "asc"
        ? 1
        : -1;
    });

    setFilteredProperties(sortedData);
    setSortConfig({ key, direction });
    setCurrentPage(1);
  };

  const propertyUpdate = (id) => {
    navigate(`/view-property/${id}`);
  };

  const deleteProperty = async (id) => {
    const success = await DeleteEntity("Property", id);
    if (success) {
      const updatedProperties = properties.filter((property) => property.id !== id);
      setProperties(updatedProperties);
      setFilteredProperties(updatedProperties);
    }
  };

  // Pagination calculations
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(currentPage * itemsPerPage, filteredProperties.length);
  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const renderImageField = (row, field) => {
    const images = row[field];
    if (Array.isArray(images) && images.length > 0) {
      return (
        <div className="flex space-x-2">
          {images.map((img, index) => (
            <img
              key={index}
              src={img.url || img}
              alt={`Image ${index}`}
              loading="lazy"
              className="w-8 h-8 object-cover rounded-md"
              onError={(e) => {
                e.target.src = 'https://t4.ftcdn.net/jpg/04/73/25/49/360_F_473254957_bxG9yf4ly7OBO5I0O5KABlN930GwaMQz.jpg';
              }}
            />
          ))}
        </div>
      );
    } else if (typeof images === 'string' && images.trim() !== '') {
      return (
        <img
          src={images}
          alt="Image"
          loading="lazy"
          className="w-8 h-8 object-cover rounded-lg"
          onError={(e) => {
            e.target.src = 'https://t4.ftcdn.net/jpg/04/73/25/49/360_F_473254957_bxG9yf4ly7OBO5I0O5KABlN930GwaMQz.jpg';
          }}
        />
      );
    }
    return <span>No Image</span>;
  };

  const renderAcceptStatus = (accept) => {
    if (accept === null || accept === undefined) {
      return <span className="text-gray-500">Pending</span>;
    }
    return accept ? (
      <span className="text-green-600 font-semibold">Accepted</span>
    ) : (
      <span className="text-red-600 font-semibold">Rejected</span>
    );
  };

  const columns = [
    { label: "Sr. No", field: "id", sortable: true, minWidth: "130px" },
    { label: "Image", field: "image", sortable: true, minWidth: "130px" },
    { label: "Title", field: "title", sortable: true, minWidth: "180px" },
    { label: "Price", field: "price", sortable: true, minWidth: "120px" },
    { label: "Address", field: "address", sortable: true, minWidth: "150px" },
    { label: "Mobile", field: "mobile", sortable: true, minWidth: "130px" },
    { label: "City", field: "cities.title", sortable: true, minWidth: "120px" },
    { label: "Verify", field: "accept", sortable: true, minWidth: "120px" },
    { label: "Actions", field: "view", minWidth: "150px", sortable: false },
  ];

  return (
    <div className="h-screen flex">
      <div className="flex flex-1 flex-col bg-[#f7fbff]">
        <Header />
        <PropotiesHeader name="Properties Request List" onSearch={handleSearch} />
        <div className="px-6 h-full w-[79vw] overflow-scroll scrollbar-none">
          <div className="bg-white w-full rounded-xl border border-[#EAE5FF]">
            <div className="relative sm:rounded-lg max-h-[370px] scrollbar-thin overflow-y-auto">
              <div className="flex-grow max-h-[370px] overflow-y-auto scrollbar-thin scrollbar-thumb-rounded-md scrollbar-thumb-gray-300">
                <table className="min-w-full text-sm text-left text-gray-700">
                  {isLoading ? (
                    <tbody>
                      <tr>
                        <td colSpan={columns.length} className="p-10 text-center">
                          <img width={100} src="image/Hotels Search.gif" alt="loading" />
                        </td>
                      </tr>
                    </tbody>
                  ) : (
                    <>
                      <thead className="bg-[#045d78] bg-opacity-100 text-xs uppercase font-medium text-white sticky top-0">
                        <tr>
                          {columns.map((col, index) => (
                            <th
                              key={index}
                              className={`px-4 py-2 ${col.minWidth ? `min-w-[${col.minWidth}]` : 'min-w-[120px]'}`}
                            >
                              {col.label}
                              {col.sortable && (
                                <div className="inline-flex items-center ml-2">
                                  <GoArrowUp
                                    className="cursor-pointer"
                                    onClick={() => handleSort(col.field)}
                                  />
                                  <GoArrowDown
                                    className="cursor-pointer"
                                    onClick={() => handleSort(col.field)}
                                  />
                                </div>
                              )}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {filteredProperties.length > 0 ? (
                          filteredProperties.slice(startIndex, endIndex).map((row, index) => (
                            <tr key={row.id}>
                              {columns.map((col, colIndex) => (
                                <td key={colIndex} className="px-4 py-1">
                                  {col.field === "id" ? (
                                    <span>{startIndex + index + 1}</span>
                                  ) : col.field === "image" ? (
                                    renderImageField(row, col.field)
                                  ) : col.field === "view" ? (
                                    <div className="flex items-center space-x-2">
                                      <NotificationContainer />
                                      <button
                                        className="bg-[#86b6e5] text-white p-[5px] rounded-full hover:bg-[#63a8ed] transition"
                                        onClick={() => propertyUpdate(row.id)}
                                      >
                                        <FontAwesomeIcon icon={faEye} />
                                      </button>
                                      <button
                                        className="bg-[#f5365c] text-white p-[5px] rounded-full hover:bg-red-600 transition"
                                        onClick={() => deleteProperty(row.id)}
                                      >
                                        <FontAwesomeIcon icon={faTrash} />
                                      </button>
                                    </div>
                                  ) : col.field === "accept" ? (
                                    renderAcceptStatus(row[col.field])
                                  ) : col.field.includes(".") ? (
                                    col.field.split(".").reduce((obj, key) => obj?.[key], row) || "N/A"
                                  ) : (
                                    row[col.field] || "N/A"
                                  )}
                                </td>
                              ))}
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan={columns.length}
                              className="text-[30px] w-[79vw] flex flex-col justify-center items-center font-semibold p-10 text-center"
                            >
                              <img className="w-[10%]" src="image/no-data.png" alt="" />
                              <span className="mt-3">No data found</span>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </>
                  )}
                </table>
              </div>
            </div>
          </div>

          <div className="bottom-0 left-0 w-full bg-[#f7fbff] mb-2 pt-2 flex justify-between items-center">
            <span className="text-sm font-normal text-gray-500">
              Showing <span className="font-semibold text-gray-900">{startIndex + 1}</span> to{" "}
              <span className="font-semibold text-gray-900">{endIndex}</span> of{" "}
              <span className="font-semibold text-gray-900">{filteredProperties.length}</span>
            </span>
            <ul className="inline-flex gap-2 -space-x-px rtl:space-x-reverse text-sm h-8">
              <li>
                <button
                  onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
                  className="previous-button"
                  disabled={currentPage === 1 || filteredProperties.length === 0}
                  title={filteredProperties.length === 0 ? "No data available" : ""}
                >
                  <img src="/image/action/Left Arrow.svg" alt="Left" />
                  Previous
                </button>
              </li>
              <li>
                <span className="current-page">
                  Page {filteredProperties.length > 0 ? currentPage : 0} of {totalPages}
                </span>
              </li>
              <li>
                <button
                  style={{ background: "#045D78" }}
                  onClick={() => paginate(currentPage < totalPages ? currentPage + 1 : totalPages)}
                  className="next-button"
                  disabled={currentPage === totalPages || filteredProperties.length === 0}
                  title={filteredProperties.length === 0 ? "No data available" : ""}
                >
                  Next <img src="/image/action/Right Arrow (1).svg" alt="Right" />
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyRequest;