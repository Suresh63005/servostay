import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import { GoArrowDown, GoArrowUp } from 'react-icons/go';
import { FaPen,FaTrash } from "react-icons/fa";
import EnquiryHeader from './EnquiryHeader';
import axios from 'axios';
import { DeleteEntity } from '../utils/Delete';
import { handleSort } from '../utils/sorting';

const EnquiryList = () => {
    const [enquiry,setenquiry]=useState([]);
    const [filterData, setFilterData] = useState(enquiry);
    const [filteredenquiry, setFilteredenquiry] = useState(enquiry);
    const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10; 

    useEffect(()=>{
        // getEnquiryList()
    },[])

    // const getEnquiryList= async()=>{
    //     const response=await axios.get(`http://localhost:5000/enquiries/retrieve`,{withCredentials:true})
    //     console.log(response.data)
    // }
    // for searching
    const handleSearch = (event) => {
        
    };

    // for sorting
    const handleSort=(key)=>{
        handleSort(filteredenquiry, key, sortConfig, setSortConfig, setFilteredenquiry);
    }
    // Calculate paginated enquiry
    const indexOfLastEnquiry = currentPage * itemsPerPage;
    const indexOfFirstEnquiry = indexOfLastEnquiry - itemsPerPage;
    const currentenquiry = filteredenquiry.slice(indexOfFirstEnquiry, indexOfLastEnquiry);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const totalPages = Math.ceil(filteredenquiry.length / itemsPerPage);

    const handledelete = async (id) => {
        const success = await DeleteEntity("Enquiry", id);
        if (success) {
            const updatedEnquiry = enquiry.filter((enquiry) => enquiry.id !== id);
            setenquiry(updatedEnquiry);
            setFilteredenquiry(updatedEnquiry);
        }
    };
    return (
        <div>
            <div className="h-screen flex">
                {/* Sidebar */}
                
                <div className="flex flex-1 flex-col bg-[#f7fbff]">
                    {/* Header */}
                    <Header />
                    {/* Searching, sorting, and main content area */}
                    <EnquiryHeader onSearch={handleSearch} />
                    {/* Card */}
                    <div className="px-6 h-full w-[1000px] overflow-scroll scrollbar-none">
                        <div className="bg-white w-full rounded-xl border border-[#EAE5FF] py-4 px-3 overflow-x-auto scrollbar-none">
                            <div className="relative sm:rounded-lg">
                                <table className="min-w-full text-sm text-left text-gray-700">
                                    <thead className="bg-[#045D78] bg-opacity-75 text-xs uppercase font-medium text-white">
                                        <tr>
                                            <th className="px-4 py-3 min-w-[130px]">
                                                Sr. No
                                                <div className="inline-flex items-center ml-2">
                                                    <GoArrowUp className="text-gray-500 hover:text-gray-700 cursor-pointer" onClick={() => handleSort('slno')} />
                                                    <GoArrowDown className="text-gray-500 hover:text-gray-700 cursor-pointer" onClick={() => handleSort('slno')} />
                                                </div>
                                            </th>
                                            <th className="px-4 py-3 min-w-[150px]">
                                                Amount
                                                <div className="inline-flex items-center ml-2">
                                                    <GoArrowUp className="text-gray-500 hover:text-gray-700 cursor-pointer" onClick={() => handleSort('amount')} />
                                                    <GoArrowDown className="text-gray-500 hover:text-gray-700 cursor-pointer" onClick={() => handleSort('amount')} />
                                                </div>
                                            </th>
                                                                                        
                                            <th className="px-4 py-3 min-w-[220px]">
                                                Service Provider Name
                                                <div className="inline-flex items-center ml-2">
                                                    <GoArrowUp className="text-gray-500 hover:text-gray-700 cursor-pointer" onClick={() => handleSort('serviceprovidername')} />
                                                    <GoArrowDown className="text-gray-500 hover:text-gray-700 cursor-pointer" onClick={() => handleSort('serviceprovidername')} />
                                                </div>
                                            </th>
                                            <th className="px-4 py-3 min-w-[180px]">
                                                Transfer Details 
                                                <div className="inline-flex items-center ml-2">
                                                    <GoArrowUp className="text-gray-500 hover:text-gray-700 cursor-pointer" onClick={() => handleSort('transferdetails')} />
                                                    <GoArrowDown className="text-gray-500 hover:text-gray-700 cursor-pointer" onClick={() => handleSort('transferdetails')} />
                                                </div>
                                            </th>
                                            <th className="px-4 py-3 min-w-[180px]">
                                                Transfer Type 
                                                <div className="inline-flex items-center ml-2">
                                                    <GoArrowUp className="text-gray-500 hover:text-gray-700 cursor-pointer" onClick={() => handleSort('transfertype')} />
                                                    <GoArrowDown className="text-gray-500 hover:text-gray-700 cursor-pointer" onClick={() => handleSort('transfertype')} />
                                                </div>
                                            </th>
                                            <th className="px-4 py-3 min-w-[180px]">
                                                Vendor Mobile 
                                                <div className="inline-flex items-center ml-2">
                                                    <GoArrowUp className="text-gray-500 hover:text-gray-700 cursor-pointer" onClick={() => handleSort('mobile')} />
                                                    <GoArrowDown className="text-gray-500 hover:text-gray-700 cursor-pointer" onClick={() => handleSort('mobile')} />
                                                </div>
                                            </th>
                                            <th className="px-4 py-3 min-w-[180px]">
                                                Transfer Photo
                                                <div className="inline-flex items-center ml-2">
                                                    <GoArrowUp className="text-gray-500 hover:text-gray-700 cursor-pointer" onClick={() => handleSort('transferphoto')} />
                                                    <GoArrowDown className="text-gray-500 hover:text-gray-700 cursor-pointer" onClick={() => handleSort('transferphoto')} />
                                                </div>
                                            </th>
                                            
                                            <th className="px-4 py-3 min-w-[150px]">
                                                 Status
                                                <div className="inline-flex items-center ml-2">
                                                    <GoArrowUp className="text-gray-500 hover:text-gray-700 cursor-pointer" onClick={() => handleSort('status')} />
                                                    <GoArrowDown className="text-gray-500 hover:text-gray-700 cursor-pointer" onClick={() => handleSort('status')} />
                                                </div>
                                            </th>
                                            <th className="px-4 py-3 min-w-[150px]">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {currentenquiry.length > 0 ? (
                                            currentenquiry.map((enquiry, index) => (
                                                <tr key={enquiry.id}>
                                                    <td className="px-4 py-3">{index + 1 + indexOfFirstEnquiry}</td> Enquiry?.title || "N/A"
                                                    <td className="px-4 py-3">{enquiry?.amount || "N/A"}</td>
                                                    <td className="px-4 py-3">{enquiry?.sProviderName || "N/A"}</td>
                                                    <td className="px-4 py-3">{enquiry?.transferDetails || "N/A"}</td>
                                                    <td className="px-4 py-3">{enquiry?.transferType || "N/A"}</td>
                                                    <td className="px-4 py-3">{enquiry?.vendorMobile || "N/A"}</td>
                                                    <td className="px-4 py-3">
                                                        {enquiry.img && enquiry.img.trim() !== '' ? (
                                                            <img src={enquiry.img} className="w-16 h-16 object-cover rounded-full" height={50} width={50} loading="lazy" alt="" 
                                                                onError={(e) => {
                                                                    if ( e.target.src !== 'https://t4.ftcdn.net/jpg/04/73/25/49/360_F_473254957_bxG9yf4ly7OBO5I0O5KABlN930GwaMQz.jpg' ) {
                                                                        e.target.src = 'https://t4.ftcdn.net/jpg/04/73/25/49/360_F_473254957_bxG9yf4ly7OBO5I0O5KABlN930GwaMQz.jpg';
                                                                    }
                                                                }}
                                                            />
                                                        ) : (
                                                            <img src="https://t4.ftcdn.net/jpg/04/73/25/49/360_F_473254957_bxG9yf4ly7OBO5I0O5KABlN930GwaMQz.jpg"    height={50}    width={50}    loading="lazy"    alt=""/>
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <span   className={`px-3 py-1 text-sm rounded-full ${ enquiry.status === 'publish' ? 'bg-green-500 text-white'  : 'bg-gray-400 text-white' }`}   >
                                                            {enquiry.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <button className="bg-[#2dce89] text-white p-2 rounded-full hover:bg-green-600 transition mr-2">
                                                            <FaPen />
                                                        </button>
                                                        <button className="bg-[#f5365c] text-white p-2 rounded-full hover:bg-red-600 transition" onClick={()=>{handledelete(enquiry.id)}}>
                                                            <FaTrash />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td className="px-4 py-3 text-center" colSpan="6">
                                                    No data available
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>

                                </table>
                            </div>
                        </div>
                        <div className="bottom-0 left-0 w-full bg-[#f7fbff] py-4 flex justify-between items-center">
                            <span className="text-sm font-normal text-gray-500">
                                Showing <span className="font-semibold text-gray-900">{indexOfFirstEnquiry + 1}</span> to <span className="font-semibold text-gray-900">{Math.min(indexOfLastEnquiry, filteredenquiry.length)}</span> of <span className="font-semibold text-gray-900">{filteredenquiry.length}</span>
                            </span>
                            <ul className="inline-flex -space-x-px rtl:space-x-reverse text-sm h-8">
                                <li>
                                    <button onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)} className="previous-button" disabled={currentPage === 1}>
                                        <img src="/image/action/Left Arrow.svg" alt="Left" /> Previous
                                    </button>
                                </li>
                                <li>
                                    <span className="current-page">
                                        Page {currentPage} of {totalPages}
                                    </span>
                                </li>
                                <li>
                                    <button onClick={() => paginate(currentPage < totalPages ? currentPage + 1 : totalPages)} className="next-button" disabled={currentPage === totalPages}>
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

export default EnquiryList;