import React from 'react';
import ArrowBackIosNewIcon  from '@mui/icons-material/ArrowBackIosNew';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const PendingBookHeader = ({ onSearch }) => {
    const location = useLocation();

    const navigate = useNavigate()

    const getTitle = () => {
        let title = '';
        if (location.pathname === '/pending-book-list') {
            title = 'Pending Book List';
        } else if (location.pathname === '/approved-book-list') {
            title = 'Approved Book List';
        } else if (location.pathname === '/check-in-list') {
            title = 'Check-In List';
        } else if (location.pathname === '/completed-list') {
            title = 'Completed List';
        } else if (location.pathname === '/cancelled-list') {
            title = 'Cancelled List';
        }
        return title;
    };

    return (
        <div className="bg-[#f7fbff] p-6 w-[1000px]">
            <div className="flex items-center justify-between h-9" style={{ height: "36px" }}>
                <div className="flex items-center mt-6 mb-4">
                    <Link onClick={()=>{navigate(-1)}} className="cursor-pointer ml-6">
                        <ArrowBackIosNewIcon style={{color:'#045D78'}} />
                    </Link>
                    <h2 className="text-lg font-semibold ml-4" style={{ color: '#000000', fontSize: '24px', fontFamily: 'Montserrat' }}>
                        {getTitle()}
                    </h2>
                </div>
                <div className="flex items-center gap-3">
                    <div className="hidden sm:flex items-center relative">
                        {/* Search Icon */}
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                        <img
                            src="/image/action/search-normal.svg"
                            alt="Search"
                            className="w-5 h-5"
                        />
                        </div>

                        {/* Search Input */}
                        <input
                        type="search"
                        placeholder="Search"
                        className="outline-none text-sm placeholder-gray-500 pl-10 pr-4 w-72 h-10 rounded-lg font-sans border border-[#EAE5FF] shadow-sm"
                        style={{
                            boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.1)',
                        }}
                        onChange={onSearch}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PendingBookHeader;