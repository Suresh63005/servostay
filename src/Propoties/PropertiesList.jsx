import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import PropotiesHeader from "./PropotiesHeader";
import { useNavigate } from "react-router-dom";
import { DeleteEntity } from "../utils/Delete";
import { NotificationContainer } from "react-notifications";
import api from "../utils/api";
import { StatusEntity } from "../utils/Status";
import Loader from "../common/Loader";
import { useLoading } from "../Context/LoadingContext";
import Table from "../common/Table";
import "../App.css";

const PropotiesList = () => {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [facilityOptions, setFacilityOptions] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const navigate = useNavigate();
  const { isLoading, setIsLoading } = useLoading();

  // Fetch facilities so we can map IDs to names
  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const response = await api.get("/facilities/all");
        // Assuming the API returns an array of facilities with { id, title }
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
        const response = await api.get("/properties");
        console.log("Property data:", response.data);
        const fetchedProperties = await Promise.all(
          response.data.map(async (property) => {
            // Create a short description (for display purposes)
            const maxLength = 100;
            const shortDescription =
              property.description &&
              property.description.length > maxLength
                ? property.description.substring(0, maxLength) + "..."
                : property.description;

            // Process facility field: if it's a string, try parsing or splitting; if an array, use it.
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

            // Now convert facilityIds to facility names using facilityOptions
            const facilityNames = facilityOptions
              .filter((fac) => facilityIds.includes(fac.id))
              .map((fac) => fac.title);

            // Process standard_rules (assuming it's stored as JSON string)
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
              // Replace facility IDs with facility names (as a comma‑separated string)
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
      if (key === "id") {
        return direction === "asc" ? a[key] - b[key] : b[key] - a[key];
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
    navigate("/create-property", { state: { id } });
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

  // Helper to format standard rules for display
  const formatRules = (rules) => {
    if (!rules || typeof rules !== "object") return "N/A";
    return `checkIn: ${rules.checkIn}, checkOut: ${rules.checkOut}, smokingAllowed: ${rules.smokingAllowed ? "Yes" : "No"}`;
  };

  const columns = [
    { label: "Sr. No", field: "id", sortable: true, minWidth: "130px" },
    { label: "Image", field: "image", sortable: true, minWidth: "130px" },
    { label: "Title", field: "title", sortable: true, minWidth: "180px" },
    { label: "Price", field: "price", sortable: true, minWidth: "120px" },
    { label: "Is Panorama", field: "is_panorama", sortable: true, minWidth: "200px" },
    { label: "Address", field: "address", sortable: true, minWidth: "150px" },
    { label: "Facility", field: "facility", sortable: true, minWidth: "150px" },
    { label: "Description", field: "shortDescription", sortable: true, minWidth: "200px" },
    { label: "Beds", field: "beds", sortable: true, minWidth: "120px" },
    { label: "Bathroom", field: "bathroom", sortable: true, minWidth: "150px" },
    { label: "Sqrft", field: "sqrft", sortable: true, minWidth: "130px" },
    { label: "Rate", field: "rate", sortable: true, minWidth: "120px" },
    { label: "Property Type", field: "ptype", sortable: true, minWidth: "200px" },
    { label: "Latitude", field: "latitude", sortable: true, minWidth: "150px" },
    { label: "Longtitude", field: "longtitude", sortable: true, minWidth: "180px" },
    { label: "Mobile", field: "mobile", sortable: true, minWidth: "130px" },
    { label: "City", field: "cities.title", sortable: true, minWidth: "120px" },
    { label: "Listing Date", field: "listing_date", sortable: true, minWidth: "180px" },
    { label: "Rules", field: "rules", sortable: true, minWidth: "150px"},
      {
      label: "Standard Rules",
      field: "formatted_standard_rules",
      sortable: true,
      minWidth: "200px",
      render: (row) => formatRules(row.formatted_standard_rules),
    },
    { label: "Adults", field: "adults", sortable: true, minWidth: "130px" },
    { label: "Children", field: "children", sortable: true, minWidth: "150px" },
    { label: "Infants", field: "infants", sortable: true, minWidth: "150px" },
    { label: "Pets", field: "pets", sortable: true, minWidth: "120px" },
    { label: "Actions", field: "actions", minWidth: "150px", sortable: false },
  ];

  return (
    <div>
      <div className="h-screen flex">
        <div className="flex flex-1 flex-col bg-[#f7fbff]">
          <Header />
          <PropotiesHeader onSearch={handleSearch} />
          <div className="px-6 h-full w-[79vw] overflow-scroll scrollbar-none">
            <Table
              columns={columns}
              data={filteredProperties}
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
