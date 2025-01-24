// Table.js
import React from 'react';
import { GoArrowUp, GoArrowDown } from 'react-icons/go';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faToggleOn, faToggleOff } from '@fortawesome/free-solid-svg-icons';

const Table = ({ columns, data, onSort, onToggleChange, onUpdate, onDelete, currentPage, totalPages, paginate, filteredData }) => {
    return (
        <div className="bg-white w-full rounded-xl border border-[#EAE5FF] overflow-x-auto scrollbar-thin">
            <div className="relative sm:rounded-lg h-full flex flex-col">
                {/* Table Container with a fixed height */}
                <div className="flex-grow overflow-y-auto">
                    <table className="min-w-full text-sm text-left text-gray-700">
                        <thead className="bg-[#045D78] bg-opacity-75 text-xs uppercase font-medium text-white sticky top-0" style={{ lineHeight: "6px" }}>
                            <tr>
                                {columns.map((col, index) => (
                                    <th key={index} className={`px-4 py-2 ${col.minWidth || 'min-w-[120px]'}`}>
                                        {col.label}
                                        {col.sortable && (
                                            <div className="inline-flex items-center ml-2">
                                                <GoArrowUp className='cursor-pointer' onClick={() => onSort(col.field)} />
                                                <GoArrowDown className='cursor-pointer' onClick={() => onSort(col.field)} />
                                            </div>
                                        )}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {data.length > 0 ? (
                                data.map((row, index) => (
                                    <tr key={row.id} className='h-[70px]'>
                                        {columns.map((col, colIndex) => (
                                            <td key={colIndex} className="px-4 py-1">
                                                {col.field === 'status' ? (
                                                    <FontAwesomeIcon
                                                        className="h-7 w-16"
                                                        style={{ color: row[col.field] === 1 ? "#045D78" : "#e9ecef" }}
                                                        icon={row[col.field] === 1 ? faToggleOn : faToggleOff}
                                                        onClick={() => onToggleChange(row.id, row[col.field], col.field)} 
                                                    />
                                                ) : (
                                                    row[col.field] || "N/A"
                                                )}
                                            </td>
                                        ))}
                                        <td className="px-4 py-3">
                                            <button className="bg-[#2dce89] text-white p-2 rounded-full hover:bg-green-600 transition mr-2" onClick={() => onUpdate(row.id)}>
                                                <FontAwesomeIcon icon="pen" />
                                            </button>
                                            <button className="bg-[#f5365c] text-white p-2 rounded-full hover:bg-red-600 transition" onClick={() => onDelete(row.id)}>
                                                <FontAwesomeIcon icon="trash" />
                                            </button>
                                        </td>
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
                {/* Pagination */}
                <div className="bottom-0 left-0 w-full bg-[#f7fbff] py-2 flex justify-between items-center">
                    <span className="text-sm font-normal text-gray-500">
                        Showing <span className="font-semibold text-gray-900">{(currentPage - 1) * 10 + 1}</span> to <span className="font-semibold text-gray-900">{Math.min(currentPage * 10, filteredData.length)}</span> of <span className="font-semibold text-gray-900">{filteredData.length}</span>
                    </span>
                    <ul className="inline-flex -space-x-px rtl:space-x-reverse text-sm h-8">
                        <li>
                            <button
                                onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
                                className="previous-button"
                                disabled={currentPage === 1 || filteredData.length === 0}
                                title={filteredData.length === 0 ? 'No data available' : ''}
                            >
                                Previous
                            </button>
                        </li>
                        <li>
                            <span className="current-page">
                                Page {filteredData.length > 0 ? currentPage : 0} of {filteredData.length > 0 ? totalPages : 0}
                            </span>
                        </li>
                        <li>
                            <button
                                onClick={() => paginate(currentPage < totalPages ? currentPage + 1 : totalPages)}
                                className="next-button"
                                disabled={currentPage === totalPages || filteredData.length === 0}
                                title={filteredData.length === 0 ? 'No data available' : ''}
                            >
                                Next
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default Table;
