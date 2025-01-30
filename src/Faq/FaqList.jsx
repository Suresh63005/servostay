import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import { GoArrowDown, GoArrowUp } from 'react-icons/go';
import { FaPen, FaTrash } from "react-icons/fa";
import axios from 'axios';
import FaqHeader from './FaqHeader';
import { useLocation, useNavigate } from 'react-router-dom';
import { DeleteEntity } from '../utils/Delete';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import { handleSort } from '../utils/sorting';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faToggleOff, faToggleOn } from "@fortawesome/free-solid-svg-icons";
import api from '../utils/api';
import { StatusEntity } from '../utils/Status';
import { useLoading } from '../Context/LoadingContext';
import Table from '../common/Table';

const FaqList = () => {
    const navigate = useNavigate();
    const [faq, setfaq] = useState([]);
    const [filteredfaq, setFilteredfaq] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [searchQuery, setSearchQuery] = useState("");
    const location = useLocation();
    const { isLoading, setIsLoading } = useLoading();

    useEffect(() => {
        const fetchfaq = async () => {
            setIsLoading(true)
            try {
                const response =await  api.get("/faqs/all");
                console.log(response.data)
                setfaq(response.data);
                setFilteredfaq(response.data);
                setIsLoading(false)
            } catch (error) {
                console.error("Error fetching faq:", error);
            }finally{
                setIsLoading(false)
            }
        };
        fetchfaq();
    }, []);

    // Search functionality
    const handleSearch = (event) => {
        const querySearch = event.target.value.toLowerCase();
        const filteredData = faq.filter(item =>
            Object.values(item).some(value =>
                typeof value === 'object' && value !== null
                    ? Object.values(value).some(nestedValue =>
                        String(nestedValue).toLowerCase().includes(querySearch)
                    )
                    : String(value).toLowerCase().includes(querySearch)
            )
        );
        setFilteredfaq(filteredData);
        setCurrentPage(1);
    };

    const sortData = (key) => {
        handleSort(filteredfaq, key, sortConfig, setSortConfig, setFilteredfaq)
    };

    const indexOfLastFaq = currentPage * itemsPerPage;
    const indexOfFirstFaq = indexOfLastFaq - itemsPerPage;
    const currentfaq = filteredfaq.slice(indexOfFirstFaq, indexOfLastFaq);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const totalPages = Math.ceil(filteredfaq.length / itemsPerPage);

    const updateFAQ = (id) => {
        navigate('/create-faq', { state: { id: id } })
    }

    // for delete
    const handledelete = async (id) => {
        const success = await DeleteEntity("FAQ", id);
        if (success) {
            const updatedFaq = faq.filter((faq) => faq.id !== id);
            setfaq(updatedFaq);
            setFilteredfaq(updatedFaq);
        }
    };

    const handleToggleChange = async (id, currentStatus, field) => {
        console.log(`Toggling ${field} for ID: ${id} with current status: ${currentStatus}`);
        if (!id || currentStatus === undefined) {
            console.error(`Invalid arguments: ID=${id}, currentStatus=${currentStatus}`);
            return;
        }

        try {
            await StatusEntity("FAQ'S", id, currentStatus, setFilteredfaq, filteredfaq, field);
        } catch (error) {
            console.error("Error toggling payment status:", error);
        }
    };

    const columns = [
        { label: "Sr. No", field: "id", sortable: true, minWidth: "150px" },
        { label: "question", field: "question", sortable: true, minWidth: "100px" },
        { label: "answer", field: "answer", sortable: true, minWidth: "180px" },
        { label: "Status", field: "status", sortable: true, minWidth: "150px" },
        { label: 'Actions', field: 'actions', minWidth: '150px', sortable: false },
      ];

    return (
        <div>
            <div className="h-screen flex">

                <div className="flex flex-1 flex-col bg-[#f7fbff]">
                    <Header />
                    <FaqHeader onSearch={handleSearch} />
                    <div className="px-6 h-full w-[79vw] overflow-scroll scrollbar-none">
                    <Table
              columns={columns}
              data={currentfaq}
              onSort={sortData}
              onToggleChange={handleToggleChange}
              onUpdate={updateFAQ}
              onDelete={handledelete}
              currentPage={currentPage}
              totalPages={totalPages}
              paginate={paginate}
              filteredData={filteredfaq}
              loading={isLoading}
            />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FaqList;
