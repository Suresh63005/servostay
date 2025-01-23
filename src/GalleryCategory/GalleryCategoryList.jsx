import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import { GoArrowDown, GoArrowUp } from 'react-icons/go';
import { FaPen,FaTrash } from "react-icons/fa";
import GalleryCategoryHeader from './GalleryCategoryHeader';
import { useLoading } from '../Context/LoadingContext';
import { useLocation, useNavigate } from 'react-router-dom';
import Loader from '../common/Loader';
import axios from 'axios';
import { DeleteEntity } from '../utils/Delete';
import { handleSort } from '../utils/sorting';

const GalleryCategoryList = () => {
    const navigate=useNavigate();
    const [galleryCategory,setGalleryCategory]=useState([])
    const location = useLocation();
    const { isLoading, setIsLoading } = useLoading();
    const [filteredgalleryCat, setFilteredgalleryCat] = useState(galleryCategory);
    const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [properties, setProperties] = useState([]);


    useEffect(()=>{
        fetchGalleryCategory()
    },[])

    useEffect(() => {
        const fetchProperties = async () => {
          try {
            const response = await axios.get('http://localhost:5000/properties', {
              withCredentials: true,
          });
            setProperties(response.data);
          } catch (error) {
            console.error('Error fetching properties:', error);
          }
        };
        fetchProperties();
      }, []);

    const fetchGalleryCategory=async()=>{
        try {
            const response=await axios.get(`http://localhost:5000/galleryCategories/all`)
            // console.log(response.data)
            setGalleryCategory(response.data)
            setFilteredgalleryCat(response.data)
        } catch (error) {
            console.error("Error fetching galleries:", error);
        }
    }

    useEffect(() => {
        setIsLoading(true);

        const timer = setTimeout(() => {
        setIsLoading(false);
        }, 1000); 

        return () => clearTimeout(timer);
    }, [location, setIsLoading]); 


    // for searching
    const handleSearch = (event) => {
    };

    // for sorting
    const sortData = (key) => {
        handleSort(filteredgalleryCat,key,sortConfig,setSortConfig,setFilteredgalleryCat)
    };

    // Calculate paginated galleryCat
    const indexOfLastCountry = currentPage * itemsPerPage;
    const indexOfFirstCountry = indexOfLastCountry - itemsPerPage;
    const currentgalleryCat = filteredgalleryCat.slice(indexOfFirstCountry, indexOfLastCountry);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const totalPages = Math.ceil(filteredgalleryCat.length / itemsPerPage);

    // for delete
    const handledelete=async(id)=>{
        const success=await DeleteEntity('GalleryCategory',id);
        if(success){
            const updatedGalleryCategory=galleryCategory.filter((galleryCategory)=>galleryCategory.id !== id);
            setGalleryCategory(updatedGalleryCategory)
            setFilteredgalleryCat(updatedGalleryCategory)
        }
    }

    // for update
    const updateGalleryCategory=(id)=>{
        navigate('/create-gallery-category',{state:{id:id}})
    }

    return (
        <div>
            {isLoading && <Loader />}
            <div className="h-screen flex">
                <div className="flex flex-1 flex-col bg-[#f7fbff]">
                    {/* Header */}
                    <Header />
                    {/* Searching, sorting, and main content area */}
                    <GalleryCategoryHeader onSearch={handleSearch} />
                    {/* Card */}
                    <div className="px-6 h-full w-[1000px] overflow-scroll scrollbar-none">
                        <div className="bg-white w-full rounded-xl border border-[#EAE5FF] py-4 px-3 overflow-x-auto scrollbar-none">
                            <div className="relative sm:rounded-lg">
                                <table className="min-w-full text-sm text-left text-gray-700">
                                    <thead className="bg-[#045D78] bg-opacity-75 text-xs uppercase font-medium text-white">
                                        <tr>
                                            <th className="px-4 py-3 min-w-[150px]">
                                                Sr. No
                                                <div className="inline-flex items-center ml-2">
                                                    <GoArrowUp className="text-gray-500 hover:text-gray-700 cursor-pointer" onClick={() => sortData('slno')} />
                                                    <GoArrowDown className="text-gray-500 hover:text-gray-700 cursor-pointer" onClick={() => sortData('slno')} />
                                                </div>
                                            </th>
                                            <th className="px-4 py-3 min-w-[250px]">
                                              Gallery Category  Title 
                                                <div className="inline-flex items-center ml-2">
                                                    <GoArrowUp className="text-gray-500 hover:text-gray-700 cursor-pointer" onClick={() => sortData('name')} />
                                                    <GoArrowDown className="text-gray-500 hover:text-gray-700 cursor-pointer" onClick={() => sortData('name')} />
                                                </div>
                                            </th>
                                            <th className="px-4 py-3 min-w-[200px]">
                                                Property Title
                                                <div className="inline-flex items-center ml-2">
                                                    <GoArrowUp className="text-gray-500 hover:text-gray-700 cursor-pointer" onClick={() => sortData('name')} />
                                                    <GoArrowDown className="text-gray-500 hover:text-gray-700 cursor-pointer" onClick={() => sortData('name')} />
                                                </div>
                                            </th>
                                            
                                            <th className="px-4 py-3 min-w-[250px]">
                                              Gallery Category  Status
                                                <div className="inline-flex items-center ml-2">
                                                    <GoArrowUp className="text-gray-500 hover:text-gray-700 cursor-pointer" onClick={() => sortData('status')} />
                                                    <GoArrowDown className="text-gray-500 hover:text-gray-700 cursor-pointer" onClick={() => sortData('status')} />
                                                </div>
                                            </th>
                                            <th className="px-4 py-3 min-w-[150px]">
                                                Action
                                                <div className="inline-flex items-center ml-2">
                                                    <GoArrowUp className="text-gray-500 hover:text-gray-700 cursor-pointer" onClick={() => sortData('action')} />
                                                    <GoArrowDown className="text-gray-500 hover:text-gray-700 cursor-pointer" onClick={() => sortData('action')} />
                                                </div>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {currentgalleryCat.length > 0 ? (
                                            currentgalleryCat.map((gcat, index) => (
                                            <tr key={gcat.id}>
                                                <td className="px-4 py-3">{index + 1 }</td>
                                                <td className="px-4 py-3">{gcat?.pid || "N/A"}</td>
                                                <td className="px-4 py-3">{gcat?.title || "N/A"}</td>
                                                                                             
                                                <td className="px-4 py-3">
                                                    <span
                                                        className={`px-3 py-1 text-sm rounded-full ${gcat.status === 1 ? 'bg-green-500 text-white' : 'bg-gray-400 text-white'}`}
                                                    >
                                                        {gcat.status === 1 ? "publish" : "unpublish"}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <button className="bg-[#2dce89] text-white p-2 rounded-full hover:bg-green-600 transition mr-2" onClick={()=>{updateGalleryCategory(gcat.id)}}>
                                                        <FaPen />
                                                    </button>
                                                    <button className="bg-[#f5365c] text-white p-2 rounded-full hover:bg-red-600 transition" onClick={()=>{handledelete(gcat.id)}}>
                                                        <FaTrash  />
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
                        <div className="bottom-0 left-0 w-full bg-[#f7fbff] py-4 flex justify-between items-center">
                            <span className="text-sm font-normal text-gray-500">
                                Showing <span className="font-semibold text-gray-900">{indexOfFirstCountry + 1}</span> to <span className="font-semibold text-gray-900">{Math.min(indexOfLastCountry, filteredgalleryCat.length)}</span> of <span className="font-semibold text-gray-900">{filteredgalleryCat.length}</span>
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
                                    <button style={{background:'#045D78'}} onClick={() => paginate(currentPage < totalPages ? currentPage + 1 : totalPages)} className="next-button" disabled={currentPage === totalPages}>
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

export default GalleryCategoryList;