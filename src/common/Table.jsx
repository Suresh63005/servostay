import React, { useState } from 'react';
import { GoArrowUp, GoArrowDown } from 'react-icons/go';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faToggleOn, faToggleOff, faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { NotificationContainer } from 'react-notifications';
import { ColorRing } from 'react-loader-spinner';

const Table = ({
    columns,
    data,
    onSort,
    onToggleChange,
    onUpdate,
    onDelete,
    currentPage,
    totalPages,
    paginate,
    filteredData,
    loading
}) => {
    const [loadingId, setLoadingId] = useState(null);
    const rowsPerPage = 10;
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = Math.min(currentPage * rowsPerPage, filteredData.length);
    const totalPagesCalculated = Math.ceil(filteredData.length / rowsPerPage);

    const handleStatusChange = async (id, currentValue, field) => {
        setLoadingId(id);
        await onToggleChange(id, currentValue, field);
        setLoadingId(null);
    };

    const renderImageField = (row, col) => {
        if (row[col.field]) {
            return (
                <img
                    src={row[col.field]}
                    alt="Image"
                    loading="lazy"
                    className="w-8 h-8 object-cover rounded-lg"
                    onError={(e) => {
                        e.target.src = 'https://t4.ftcdn.net/jpg/04/73/25/49/360_F_473254957_bxG9yf4ly7OBO5I0O5KABlN930GwaMQz.jpg'; 
                    }}
                />
            );
        } else {
            return <span>No Image</span>;
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <ColorRing
                    visible={true}
                    height="80"
                    width="80"
                    ariaLabel="loading-indicator"
                    colors={['#045D78', '#045D78', '#045D78', '#045D78', '#045D78']}
                />
            </div>
        );
    }

    return (
        <div>
            <div className={`bg-white w-full rounded-xl border border-[#EAE5FF] ${columns.length > 0 ? `h-[380px]` : ''}`}>
                <div className="relative sm:rounded-lg h-[380px] scrollbar-thin overflow-y-auto">
                    <div className="flex-grow h-[380px] overflow-y-auto scrollbar-thin scrollbar-thumb-rounded-md scrollbar-thumb-gray-300">
                        <table className="min-w-full text-sm text-left text-gray-700">
                            <thead className="bg-[#045D78] bg-opacity-75 text-xs uppercase font-medium text-white sticky top-0">
                                <tr>
                                    {columns.map((col, index) => (
                                        <th key={index} className={`px-4 py-2 ${col.minWidth ? `min-w-[${col.minWidth}]` : 'min-w-[120px]'}`}>
                                            {col.label}
                                            {col.sortable && (
                                                <div className="inline-flex items-center ml-2">
                                                    <GoArrowUp className="cursor-pointer" onClick={() => onSort(col.field)} />
                                                    <GoArrowDown className="cursor-pointer" onClick={() => onSort(col.field)} />
                                                </div>
                                            )}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredData.length > 0 ? (
                                    filteredData.slice(startIndex, endIndex).map((row, index) => (
                                        <tr key={row.id}>
                                            {columns.map((col, colIndex) => (
                                                <td key={colIndex} className="px-4 py-1">
                                                    {col.field === 'id' ? (
                                                        <span>{startIndex + index + 1}</span>
                                                    ) : col.field === 'status' ? (
                                                        <div className="relative">
                                                            {loadingId === row.id ? (
                                                                <ColorRing
                                                                    visible={true}
                                                                    height="30"
                                                                    width="60"
                                                                    ariaLabel="color-ring-loading"
                                                                    wrapperStyle={{}}
                                                                    wrapperClass="color-ring-wrapper"
                                                                    colors={['#045D78', '#045D78', '#045D78', '#045D78', '#045D78']}
                                                                />
                                                            ) : (
                                                                <FontAwesomeIcon
                                                                    className="h-7 w-16 cursor-pointer"
                                                                    style={{ color: row[col.field] === 1 ? '#045D78' : '#e9ecef' }}
                                                                    icon={row[col.field] === 1 ? faToggleOn : faToggleOff}
                                                                    onClick={() => handleStatusChange(row.id, row[col.field], col.field)}
                                                                />
                                                            )}
                                                        </div>
                                                    ) : col.field === 'actions' ? (
                                                        <div className="flex items-center space-x-2">
                                                            <NotificationContainer />
                                                            <button
                                                                className="bg-[#2dce89] text-white p-[5px] rounded-full hover:bg-green-600 transition"
                                                                onClick={() => onUpdate(row.id)}
                                                            >
                                                                <FontAwesomeIcon icon={faPen} />
                                                            </button>
                                                            <button
                                                                className="bg-[#f5365c] text-white p-[5px] rounded-full hover:bg-red-600 transition"
                                                                onClick={() => onDelete(row.id)}
                                                            >
                                                                <FontAwesomeIcon icon={faTrash} />
                                                            </button>
                                                        </div>
                                                    ) : col.field === 'img' || col.field === 'c_img' || col.field === 'image' || col.field === 'images' || col.field === 'pro_pic' ? (
                                                        renderImageField(row, col)
                                                    ) : (
                                                        row[col.field] || 'N/A'
                                                    )}
                                                </td>
                                            ))}
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={columns.length + 1} className="text-center">
                                            No data found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div className="bottom-0 left-0 w-full bg-[#f7fbff] pt-2 flex justify-between items-center">
                <span className="text-sm font-normal text-gray-500">
                    Showing <span className="font-semibold text-gray-900">{startIndex + 1}</span> to{' '}
                    <span className="font-semibold text-gray-900">{endIndex}</span> of{' '}
                    <span className="font-semibold text-gray-900">{filteredData.length}</span>
                </span>
                <ul className="inline-flex -space-x-px rtl:space-x-reverse text-sm h-8">
                    <li>
                        <button
                            onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
                            className="previous-button"
                            disabled={currentPage === 1 || filteredData.length === 0}
                            title={filteredData.length === 0 ? 'No data available' : ''}
                        >
                            <img src="/image/action/Left Arrow.svg" alt="Left" />
                            Previous
                        </button>
                    </li>
                    <li>
                        <span className="current-page">
                            Page {filteredData.length > 0 ? currentPage : 0} of {totalPagesCalculated}
                        </span>
                    </li>
                    <li>
                        <button
                            style={{ background: '#045D78' }}
                            onClick={() => paginate(currentPage < totalPagesCalculated ? currentPage + 1 : totalPagesCalculated)}
                            className="next-button"
                            disabled={currentPage === totalPagesCalculated || filteredData.length === 0}
                            title={filteredData.length === 0 ? 'No data available' : ''}
                        >
                            Next <img src="/image/action/Right Arrow (1).svg" alt="Right" />
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default Table;
