import React, { useState } from "react";

const CustomDropdown = ({ options, label, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  const handleOptionClick = (value) => {
    setSelectedOption(value);
    setIsOpen(false);
    if (onChange) onChange(value);
  };

  return (
    <div className="flex flex-col relative">
      <label
        htmlFor="custom-dropdown"
        className="text-sm font-medium text-start text-[12px] font-[Montserrat]"
      >
        {label}
      </label>
      <div
        id="custom-dropdown"
        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm cursor-pointer"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {selectedOption !== null
          ? options.find((opt) => opt.value === selectedOption).label
          : "Select Status"}
      </div>
      {isOpen && (
        <ul
          className="absolute mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm text-sm z-10"
        >
          {options.map((option) => (
            <li
              key={option.value}
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleOptionClick(option.value)}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default function App() {
  const [status, setStatus] = useState(null);

  const handleStatusChange = (value) => {
    setStatus(value);
  };

  const statusOptions = [
    { value: 1, label: "Publish" },
    { value: 0, label: "Unpublish" },
  ];

  return (
    <CustomDropdown
      label="Status"
      options={statusOptions}
      onChange={handleStatusChange}
    />
  );
}
