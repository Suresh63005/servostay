import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import SidebarMenu from '../components/SideBar';
import { GoArrowDown, GoArrowUp } from 'react-icons/go';
import { FaPen,FaTrash } from "react-icons/fa";
// import { searchFunction } from '../Entity/SearchEntity';
import axios from 'axios';
import PageHeader from './PageHeader';
import { useNavigate } from 'react-router-dom';
import { DeleteEntity } from '../utils/Delete';

const PageList = () => {
    const navigate=useNavigate()
    const [page, setpage] = useState([]);
    const [filteredpage, setFilteredpage] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        const fetchpage = async () => {
            try {
                const response = await axios.get("http://localhost:5000/pages/all");
                console.log(response)
                setpage(response.data);
                setFilteredpage(response.data); 
            } catch (error) {
                console.error("Error fetching page:", error);
            }
        };
        fetchpage();
    }, []);

    const handleSearch = (event) => {
        
    };

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }

        const sortedData = [...filteredpage].sort((a, b) => {
            if (key === 'slno') {
                return direction === 'asc' ? a.id - b.id : b.id - a.id;
            } 
            return a[key]?.localeCompare(b[key]) * (direction === 'asc' ? 1 : -1);
        });

        setFilteredpage(sortedData);
        setSortConfig({ key, direction });
        setCurrentPage(1);
    };

    const indexOfLastpage = currentPage * itemsPerPage;
    const indexOfFirstpage = indexOfLastpage - itemsPerPage;
    const currentpage = filteredpage.slice(indexOfFirstpage, indexOfLastpage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const totalPages = Math.ceil(filteredpage.length / itemsPerPage);

    // for update 
    const updatePage=(id)=>{
        navigate('/create-page',{state:{id:id}})
    }
    // for delete
    const handledelete=async(id)=>{
        const success=await DeleteEntity("Page",id);
        if (success) {
            const updatedPages = page.filter((item) => page.id !== id);       
            setFilteredpage(updatedPages)
            setpage(updatedPages)
        }
    }
    return (
        <div>
            <div className="h-screen flex">
               
                <div className="flex flex-1 flex-col bg-[#f7fbff]">
                    <Header />
                    <PageHeader onSearch={handleSearch} />
                    <div className="px-6 h-full w-[1000px] overflow-scroll scrollbar-none">
                        <div className="bg-white w-full rounded-xl border border-[#EAE5FF] py-4 px-3 overflow-x-auto scrollbar-none">
                            <div className="relative sm:rounded-lg">
                                <table className="min-w-full text-sm text-left text-gray-700">
                                    <thead className="bg-[#045D78] bg-opacity-75 text-xs uppercase font-medium text-white">
                                        <tr>
                                            <th className="px-4 py-3 min-w-[150px]">
                                                Sr. No
                                                <div className="inline-flex items-center ml-2">
                                                    <GoArrowUp className='cursor-pointer' onClick={() => handleSort('slno')} />
                                                    <GoArrowDown className='cursor-pointer' onClick={() => handleSort('slno')} />
                                                </div>
                                            </th>
                                            <th className="px-4 py-3 min-w-[250px]">
                                                Page Name 
                                                <div className="inline-flex items-center ml-2">
                                                    <GoArrowUp className='cursor-pointer' onClick={() => handleSort('title')} />
                                                    <GoArrowDown className='cursor-pointer' onClick={() => handleSort('title')} />
                                                </div>
                                            </th>
                                            <th className="px-4 py-3 min-w-[250px]">
                                                Page Description 
                                                <div className="inline-flex items-center ml-2">
                                                    <GoArrowUp className='cursor-pointer' onClick={() => handleSort('title')} />
                                                    <GoArrowDown className='cursor-pointer' onClick={() => handleSort('title')} />
                                                </div>
                                            </th>                                            
                                            <th className="px-4 py-3 min-w-[250px]">
                                              Status
                                              <div className="inline-flex items-center ml-2">
                                                  <GoArrowUp className='cursor-pointer' onClick={() => handleSort('status')} />
                                                  <GoArrowDown className='cursor-pointer' onClick={() => handleSort('status')} />
                                              </div>
                                              </th>
                                            <th className="px-4 py-3 min-w-[250px]">
                                              Action
                                              <div className="inline-flex items-center ml-2">
                                                  <GoArrowUp className='cursor-pointer' onClick={() => handleSort('action')} />
                                                  <GoArrowDown className='cursor-pointer' onClick={() => handleSort('action')} />
                                              </div>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {currentpage.map((page, index) => (
                                            <tr key={page.id}>
                                                <td className="px-4 py-3">{index + 1 + indexOfFirstpage}</td>
                                                <td className="px-4 py-3">{page?.title || "N/A"}</td>
                                                <td className="px-4 py-3">{page?.description || "N/A"}</td>
                                                <td className="px-4 py-3">
                                                    <span
                                                        className={`px-3 py-1 text-sm rounded-full ${page.cstatus === 1 ? 'bg-green-500 text-white' : 'bg-gray-400 text-white'}`}
                                                    >
                                                        {page.cstatus === 1 ? "publish" : "unpublish"}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <button className="bg-[#2dce89] text-white p-2 rounded-full hover:bg-green-600 transition mr-2" onClick={()=>{updatePage(page.id)}}>
                                                        <FaPen />
                                                    </button>
                                                    <button className="bg-[#f5365c] text-white p-2 rounded-full hover:bg-red-600 transition" onClick={()=>{handledelete(page.id)}}>
                                                        <FaTrash />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="bottom-0 left-0 w-full bg-[#f7fbff] py-4 flex justify-between items-center">
                            <span className="text-sm font-normal text-gray-500">
                                Showing <span className="font-semibold text-gray-900">{indexOfFirstpage + 1}</span> to{" "}
                                <span className="font-semibold text-gray-900">{Math.min(indexOfLastpage, filteredpage.length)}</span> of{" "}
                                <span className="font-semibold text-gray-900">{filteredpage.length}</span>
                            </span>
                            <ul className="inline-flex -space-x-px text-sm h-8">
                                <li>
                                    <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
                                        Previous
                                    </button>
                                </li>
                                <li>
                                    <span>Page {currentPage} of {totalPages}</span>
                                </li>
                                <li>
                                    <button style={{background:'#045D78'}} onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages}>
                                        Next
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

export default PageList;
