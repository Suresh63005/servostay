import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import ExtraImageHeader from "./ExtraImageHeader";
import { GoArrowDown, GoArrowUp } from "react-icons/go";
import { FaPen, FaTrash } from "react-icons/fa";
import Loader from "../common/Loader";
import axios from "axios";
import { handleSort } from "../utils/sorting";
import { DeleteEntity } from "../utils/Delete";
import { useNavigate } from "react-router-dom";
import { NotificationContainer } from "react-notifications";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faToggleOff, faToggleOn } from "@fortawesome/free-solid-svg-icons";

import api from "../utils/api";
import { StatusEntity } from "../utils/Status";
import { useLoading } from "../Context/LoadingContext";


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
            
            try {
                const response = await api.get("/extra");
                console.log(response.data);
                setExtraImages(response.data);
                setFilteredImages(response.data);
            } catch (error) {
                console.error(
                    "Error fetching extra images:",
                    error.response ? error.response.data : error.message
                );
            } 
        };
        fetchExtraImages();
    }, []);

    useEffect(() => {
        setIsLoading(true);
        
        const timer = setTimeout(() => {
          setIsLoading(false);
        }, 1000);
        return () => clearTimeout(timer);
      }, [ setIsLoading]);

    

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

    return (
        <div>
            {isLoading && <Loader />}
            <div className="h-screen flex">
                {/* Sidebar */}

                <div className="flex flex-1 flex-col bg-[#f7fbff]">
                    <Header />
                    <ExtraImageHeader onSearch={handleSearch} />
                    <div className="px-6 h-full w-[1000px] overflow-scroll scrollbar-none">
                        <div className={`bg-white w-full rounded-xl border border-[#EAE5FF] py-4 px-3 overflow-y-auto scrollbar-thin ${filteredImages.length > 0 ? 'h-[500px]' : ''} `}>
                            <div className="relative sm:rounded-lg ">
                            
                                <table className="min-w-full text-sm text-left text-gray-700">
                                    <thead className="bg-[#045D78] bg-opacity-75 text-xs uppercase font-medium text-white">
                                        <tr>
                                            <th className="px-4 py-2 min-w-[130px]">
                                                Sr. No
                                                <div className="inline-flex items-center ml-2">
                                                    <GoArrowUp className="text-white hover:text-gray-700 cursor-pointer" onClick={() => sortData("id")} />
                                                    <GoArrowDown className="text-white hover:text-gray-700 cursor-pointer" onClick={() => sortData("id")} />
                                                </div>
                                            </th>
                                            <th className="px-4 py-2 min-w-[150px]">
                                                Image
                                            </th>
                                            <th className="px-4 py-2 min-w-[150px]">
                                                Property Title
                                                <div className="inline-flex items-center ml-2">
                                                    <GoArrowUp className="text-white hover:text-gray-700 cursor-pointer" onClick={() => sortData("title")} />
                                                    <GoArrowDown className="text-white hover:text-gray-700 cursor-pointer" onClick={() => sortData("title")} />
                                                </div>
                                            </th>
                                            <th className="px-4 py-2 min-w-[150px]">
                                                Status
                                                <div className="inline-flex items-center ml-2">
                                                    <GoArrowUp className="text-white hover:text-gray-700 cursor-pointer" onClick={() => sortData("status")} />
                                                    <GoArrowDown className="text-white hover:text-gray-700 cursor-pointer" onClick={() => sortData("status")} />
                                                </div>
                                            </th>
                                            <th className="px-4 py-2 min-w-[150px]">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {filteredImages.length > 0 ? (
                                            filteredImages.map((extraImage, index) => (
                                                <tr key={extraImage.id} className="h-[70px]">
                                                    <td className="px-4 py-1">{index + 1 + indexOfFirstImage}</td>
                                                    <td className="px-4 py-1">
                                                        {extraImage.images && extraImage.images.length > 0 ? (
                                                            <div className="flex flex-wrap space-x-2">
                                                                {extraImage.images.map((image, index) => (
                                                                    <img
                                                                        key={index}
                                                                        src={image.url}
                                                                        className="w-10 h-10 object-cover rounded-full"
                                                                        height={50}
                                                                        width={50}
                                                                        loading="lazy"
                                                                        alt={`Image ${index + 1}`}
                                                                        onError={(e) => {
                                                                            if (
                                                                                e.target.src !==
                                                                                "https://t4.ftcdn.net/jpg/04/73/25/49/360_F_473254957_bxG9yf4ly7OBO5I0O5KABlN930GwaMQz.jpg"
                                                                            ) {
                                                                                e.target.src =
                                                                                    "https://t4.ftcdn.net/jpg/04/73/25/49/360_F_473254957_bxG9yf4ly7OBO5I0O5KABlN930GwaMQz.jpg";
                                                                            }
                                                                        }}
                                                                    />
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <img
                                                                src={
                                                                    "https://t4.ftcdn.net/jpg/04/73/25/49/360_F_473254957_bxG9yf4ly7OBO5I0O5KABlN930GwaMQz.jpg"
                                                                }
                                                                height={50}
                                                                width={50}
                                                                loading="lazy"
                                                                alt="No images available"
                                                            />
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-1">{extraImage?.Property?.title || "No Title"}</td>
                                                    <td>
                                                        <FontAwesomeIcon
                                                            className="h-7 w-16 cursor-pointer"
                                                            style={{ color: extraImage.status === 1 ? "#045D78" : "#e9ecef" }}
                                                            icon={extraImage.status === 1 ? faToggleOn : faToggleOff}
                                                            onClick={() => handleToggleChange(extraImage.id, extraImage.status, "status")}
                                                        />
                                                    </td>
                                                    <td className="px-4 py-1">
                                                        <NotificationContainer />
                                                        <button className="bg-[#2dce89] text-white p-2 rounded-full hover:bg-green-600 transition mr-2" onClick={() => { updateExtraImage(extraImage.id) }}>
                                                            <FaPen />
                                                        </button>
                                                        <button className="bg-[#f5365c] text-white p-2 rounded-full hover:bg-red-600 transition" onClick={() => { handledelete(extraImage.id) }}>
                                                            <FaTrash />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="10" className="text-center">
                                                    No data available
                                                </td>
                                            </tr>
                                        )
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        
                        <div className="bottom-0 left-0 w-full bg-[#f7fbff] py-2 flex justify-between items-center">
                            <span className="text-sm font-normal text-gray-500">
                                Showing <span className="font-semibold text-gray-900">{indexOfFirstImage + 1}</span> to <span className="font-semibold text-gray-900">{Math.min(indexOfLastImage, filteredImages.length)}</span> of <span className="font-semibold text-gray-900">{filteredImages.length}</span>
                            </span>
                            <ul className="inline-flex -space-x-px rtl:space-x-reverse text-sm h-8">
                                <li>
                                    <button
                                        onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
                                        className={`previous-button ${filteredImages.length === 0 ? 'cursor-not-allowed' : ''}`}
                                        disabled={currentPage === 1 || filteredImages.length === 0}
                                        title={filteredImages.length === 0 ? 'No data available' : ''}
                                    >
                                        <img src="/image/action/Left Arrow.svg" alt="Left" /> Previous
                                    </button>
                                </li>
                                <li>
                                    <span className="current-page">
                                        Page {filteredImages.length > 0 ? currentPage : 0} of {filteredImages.length > 0 ? totalPages : 0}
                                    </span>
                                </li>
                                <li>
                                    <button style={{background:'#045D78'}}
                                        onClick={() => paginate(currentPage < totalPages ? currentPage + 1 : totalPages)}
                                        className={`next-button ${filteredImages.length === 0 ? 'cursor-not-allowed button-disable' : ''}`}
                                        disabled={currentPage === totalPages || filteredImages.length === 0}
                                        title={filteredImages.length === 0 ? 'No data available' : ''}
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

export default ExtraImageList;