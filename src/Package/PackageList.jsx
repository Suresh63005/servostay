import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import { GoArrowDown, GoArrowUp } from 'react-icons/go';
import { FaPen, FaTrash } from "react-icons/fa";
import axios from 'axios';
import PackageHeader from './PackageHeader';
import { useNavigate } from 'react-router-dom';
import { DeleteEntity } from '../utils/Delete';
import { handleSort } from '../utils/sorting';
import { NotificationContainer } from 'react-notifications';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faToggleOff, faToggleOn } from "@fortawesome/free-solid-svg-icons";
import { StatusEntity } from '../utils/Status';

const PackageList = () => {
    const navigate = useNavigate();
    const [packages, setpackages] = useState([]);
    const [filteredpackages, setFilteredpackages] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        const fetchPackages = async () => {
            try {
                const response = await axios.get("http://localhost:5000/packages/all");
                setpackages(response.data);
                setFilteredpackages(response.data);
            } catch (error) {
                console.error("Error fetching countries:", error);
            }
        };
        fetchPackages();
    }, []);

    // Search functionality
    const handleSearch = (event) => {
        const searchQuery = event.target.value.toLowerCase();
        const filteredData = packages.filter(item =>
            Object.values(item).some(value =>
                String(value).toLocaleLowerCase().includes(searchQuery)
            )
        )
        setFilteredpackages(filteredData)
        setCurrentPage(1)
    }

    const sortData = (key) => {
        handleSort(filteredpackages, key, sortConfig, setSortConfig, setFilteredpackages)
    };

    const indexOfLastPackage = currentPage * itemsPerPage;
    const indexOfFirstPackage = indexOfLastPackage - itemsPerPage;
    const currentpackages = filteredpackages.slice(indexOfFirstPackage, indexOfLastPackage);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const totalPages = Math.ceil(filteredpackages.length / itemsPerPage);

    // for update
    const updatePackage = (id) => {
        navigate('/create-package', { state: { id: id } })
    }

    // for delete
    const handledelete = async (id) => {
        const success = await DeleteEntity("Package", id);
        if (success) {
            const updatedPackage = packages.filter((packages) => packages.id !== id);
            setpackages(updatedPackage);
            setFilteredpackages(updatedPackage);
        }
    };

    const handleToggleChange = async (id, currentStatus, field) => {
        console.log(`Toggling ${field} for ID: ${id} with current status: ${currentStatus}`);
        if (!id || currentStatus === undefined) {
            console.error(`Invalid arguments: ID=${id}, currentStatus=${currentStatus}`);
            return;
        }

        try {
            await StatusEntity("Package", id, currentStatus, setFilteredpackages, filteredpackages, field);
        } catch (error) {
            console.error("Error toggling payment status:", error);
        }
    };

    return (
        <div>
            <div className="h-screen flex">

                <div className="flex flex-1 flex-col bg-[#f7fbff]">
                    <Header />
                    <PackageHeader onSearch={handleSearch} />
                    <div className="px-6 h-full w-[1000px] overflow-scroll scrollbar-none">
                        <div className="bg-white w-full rounded-xl border border-[#EAE5FF] py-4 px-3 overflow-x-auto scrollbar-none">
                            <div className="relative sm:rounded-lg">
                                <table className="min-w-full text-sm text-left text-gray-700">
                                    <thead className="bg-[#045D78] bg-opacity-75 text-xs uppercase font-medium text-white">
                                        <tr>
                                            <th className="px-4 py-3 min-w-[130px]">
                                                Sr. No
                                                <div className="inline-flex items-center ml-2">
                                                    <GoArrowUp className='cursor-pointer' onClick={() => sortData('id')} />
                                                    <GoArrowDown className='cursor-pointer' onClick={() => sortData('id')} />
                                                </div>
                                            </th>
                                            <th className="px-4 py-3 min-w-[180px]">
                                                Package Title
                                                <div className="inline-flex items-center ml-2">
                                                    <GoArrowUp className='cursor-pointer' onClick={() => sortData('title')} />
                                                    <GoArrowDown className='cursor-pointer' onClick={() => sortData('title')} />
                                                </div>
                                            </th>
                                            <th className="px-4 py-3 min-w-[180px]">
                                                Package Image
                                                <div className="inline-flex items-center ml-2">
                                                    <GoArrowUp className='cursor-pointer' onClick={() => sortData('image')} />
                                                    <GoArrowDown className='cursor-pointer' onClick={() => sortData('image')} />
                                                </div>
                                            </th>
                                            <th className="px-4 py-3 min-w-[180px]">
                                                Package Day
                                                <div className="inline-flex items-center ml-2">
                                                    <GoArrowUp className='cursor-pointer' onClick={() => sortData('day')} />
                                                    <GoArrowDown className='cursor-pointer' onClick={() => sortData('day')} />
                                                </div>
                                            </th>
                                            <th className="px-4 py-3 min-w-[180px]">
                                                Package Price
                                                <div className="inline-flex items-center ml-2">
                                                    <GoArrowUp className='cursor-pointer' onClick={() => sortData('price')} />
                                                    <GoArrowDown className='cursor-pointer' onClick={() => sortData('price')} />
                                                </div>
                                            </th>
                                            <th className="px-4 py-3 min-w-[150px]">
                                                Status
                                                <div className="inline-flex items-center ml-2">
                                                    <GoArrowUp className='cursor-pointer' onClick={() => sortData('status')} />
                                                    <GoArrowDown className='cursor-pointer' onClick={() => sortData('status')} />
                                                </div>
                                            </th>
                                            <th className="px-4 py-3 min-w-[150px]"> Action  </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {filteredpackages.length > 0 ? (
                                            filteredpackages.map((Package, index) => (
                                                <tr key={Package.id} className='h-[70px]'>
                                                    <td className="px-4 py-1">{index + 1 + indexOfFirstPackage}</td>
                                                    <td className="px-4 py-1">{Package?.title || "N/A"}</td>
                                                    <td className="px-4 py-1">
                                                        <img
                                                            src={Package.image || 'fallback-image.jpg'}
                                                            alt={Package.title || "N/A"}
                                                            className="w-10 h-10 object-cover rounded-full"
                                                        // onError={(e) => (e.target.src = 'fallback-image.jpg')}

                                                        />
                                                    </td>
                                                    <td className="px-4 py-1">{Package?.day || "N/A"}</td>
                                                    <td className="px-4 py-1">{Package?.price || "N/A"}</td>
                                                    <td>
                                                        <FontAwesomeIcon
                                                            className="h-7 w-16 cursor-pointer"
                                                            style={{ color: Package.status === 1 ? "#045D78" : "#e9ecef" }}
                                                            icon={Package.status === 1 ? faToggleOn : faToggleOff}
                                                            onClick={() => handleToggleChange(Package.id, Package.status, "status")}
                                                        />
                                                    </td>
                                                    <td className="px-4 py-1">
                                                        <NotificationContainer />
                                                        <button className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600 transition mr-2" onClick={() => { updatePackage(Package.id) }}>
                                                            <FaPen />
                                                        </button>
                                                        <button className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition" onClick={() => { handledelete(Package.id) }}>
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
                        {/* for pagination */}
                        <div className="bottom-0 left-0 w-full bg-[#f7fbff] py-4 flex justify-between items-center">
                            <span className="text-sm font-normal text-gray-500">
                                Showing <span className="font-semibold text-gray-900">{indexOfFirstPackage + 1}</span> to <span className="font-semibold text-gray-900">{Math.min(indexOfLastPackage, filteredpackages.length)}</span> of <span className="font-semibold text-gray-900">{filteredpackages.length}</span>
                            </span>
                            <ul className="inline-flex -space-x-px rtl:space-x-reverse text-sm h-8">
                                <li>
                                    <button
                                        onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
                                        className={`previous-button ${filteredpackages.length === 0 ? 'cursor-not-allowed' : ''}`}
                                        disabled={currentPage === 1 || filteredpackages.length === 0}
                                        title={filteredpackages.length === 0 ? 'No data available' : ''}
                                    >
                                        <img src="/image/action/Left Arrow.svg" alt="Left" /> Previous
                                    </button>
                                </li>
                                <li>
                                    <span className="current-page">
                                        Page {filteredpackages.length > 0 ? currentPage : 0} of {filteredpackages.length > 0 ? totalPages : 0}
                                    </span>
                                </li>
                                <li>
                                    <button style={{background:'#045D78'}}
                                        onClick={() => paginate(currentPage < totalPages ? currentPage + 1 : totalPages)}
                                        className={`next-button ${filteredpackages.length === 0 ? 'cursor-not-allowed button-disable' : ''}`}
                                        disabled={currentPage === totalPages || filteredpackages.length === 0}
                                        title={filteredpackages.length === 0 ? 'No data available' : ''}
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

export default PackageList;
