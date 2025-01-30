import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import ExtraImageHeader from "./ExtraImageHeader";
import { handleSort } from "../utils/sorting";
import { DeleteEntity } from "../utils/Delete";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { StatusEntity } from "../utils/Status";
import { useLoading } from "../Context/LoadingContext";
import Table from "../common/Table";

const ExtraImageList = () => {
    const navigate = useNavigate()
    const [extraImages, setExtraImages] = useState([]);
    const [filteredImages, setFilteredImages] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });
    const [currentPage, setCurrentPage] = useState(1);
    const { isLoading, setIsLoading } = useLoading();
    const itemsPerPage = 10;

    useEffect(() => {
        const fetchExtraImages = async () => {
            setIsLoading(true)
            try {
                const response = await api.get("/extra");
                console.log(response.data);
                setExtraImages(response.data);
                setFilteredImages(response.data);
                setIsLoading(false)
            } catch (error) {
                console.error(
                    "Error fetching extra images:",
                    error.response ? error.response.data : error.message
                );
            }finally{
                setIsLoading(false)
            }
        };
        fetchExtraImages();
    }, []);

    // Search functionality
    const handleSearch = (event) => {
        const query = event.target.value.toLowerCase();
        const filteredData = extraImages.filter(extraImage =>
            Object.values(extraImage).some(value =>
                typeof value === 'object' && value !== null
                    ? Object.values(value).some(nestedValue =>
                        String(nestedValue).toLowerCase().includes(query)
                    )
                    : String(value).toLowerCase().includes(query)
            )
        );
        setFilteredImages(filteredData);
        setCurrentPage(1);
    };

    // for sorting
    const sortData = (key) => {
        handleSort(filteredImages, key, sortConfig, setSortConfig, setFilteredImages)
    };

    const indexOfLastImage = currentPage * itemsPerPage;
    const indexOfFirstImage = indexOfLastImage - itemsPerPage;
    const currentImages = filteredImages.slice(indexOfFirstImage, indexOfLastImage);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const totalPages = Math.ceil(filteredImages.length / itemsPerPage);

    // for delete
    const handledelete = async (id) => {
        const success = await DeleteEntity('ExtraImages', id);
        if (success) {
            const updatedExtraImage = extraImages.filter((extraImages) => extraImages.id !== id);
            setExtraImages(updatedExtraImage)
            setFilteredImages(updatedExtraImage)
        }
    }

    const updateExtraImage = (id) => {
        if (!id) {
            return;
        }
        navigate("/create-extra-image", { state: { id: id } })
    }

    const handleToggleChange = async (id, currentStatus, field) => {
        console.log(`Toggling ${field} for ID: ${id} with current status: ${currentStatus}`);
        if (!id || currentStatus === undefined) {
            console.error(`Invalid arguments: ID=${id}, currentStatus=${currentStatus}`);
            return;
        }

        try {
            await StatusEntity("ExtraImage", id, currentStatus, setFilteredImages, filteredImages, field);
        } catch (error) {
            console.error("Error toggling image status:", error);
        }
    };

    const columns = [
        { label: "Sr. No", field: "id", sortable: true, minWidth: "150px" },
        { label: "Extra Image", field: "images", sortable: false, minWidth: "100px" },
        { label: "Property Title", field: "Property.title", sortable: true, minWidth: "180px" },
        { label: "Status", field: "status", sortable: true, minWidth: "100px" },
        { label: 'Actions', field: 'actions', minWidth: '150px', sortable: false },
      ];

    return (
        <div>
            {/* {isLoading && <Loader />} */}
            <div className="h-screen flex">
                {/* Sidebar */}

                <div className="flex flex-1 flex-col bg-[#f7fbff]">
                    <Header />
                    <ExtraImageHeader onSearch={handleSearch} />
                    <div className="px-6 h-full w-[79vw] overflow-scroll scrollbar-none">
                    <Table
                        columns={columns}
                        data={currentImages}
                        onSort={sortData}
                        onToggleChange={handleToggleChange}
                        onUpdate={updateExtraImage}
                        onDelete={handledelete}
                        currentPage={currentPage}
                        totalPages={totalPages}
                        paginate={paginate}
                        filteredData={filteredImages}
                        loading={isLoading}
                    />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExtraImageList;