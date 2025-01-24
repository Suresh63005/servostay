import React from 'react';
import Select from 'react-select';

const SelectComponent = ({ options, value, onChange, label, name }) => {
  return (
    <div className="flex flex-col mt-[3px]">
      {label && <label htmlFor={name} className="text-sm font-medium text-start text-[12px] font-[Montserrat]">{label}</label>}
      <Select
  id={name}
  value={options.find(option => option.value === value)}
  onChange={onChange}
  options={options}
  getOptionLabel={(e) => <div>{e.label}</div>}
  getOptionValue={(e) => e.value}
  className="react-select-container"
  classNamePrefix="react-select"
//   components={{
//     Input: () => null, 
//   }}
  styles={{
    control: (base, { isFocused }) => ({
      ...base,
      borderRadius: '8px',
      borderColor: isFocused ? '#045D78' : '##dee2e6',
      boxShadow: isFocused ? '0px 0px 0 2px #045D78' : 'none',
      padding: '3px',
      height: '40px',
    }),
    menu: (base) => ({
      ...base,
      borderRadius: '8px',
      boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
    }),
    option: (base, { isFocused, isSelected }) => ({
      ...base,
      fontSize: '12px',
      padding: '8px 12px',
      backgroundColor: isSelected
        ? '#045D78' // Selected option background color
        : isFocused
        ? '#f0f0f0' // Hover background color
        : '#ffffff', // Default background color
      color: isSelected ? '#ffffff' : '#000000', // Selected option text color
      cursor: 'pointer',
    }),
    input: (base) => ({
        ...base,
        border: 'none',
        outline: 'none',
        boxShadow: 'none',
        padding: '0',
        
        minWidth:'0',
        ':after': {
          content: 'none', 
          
        },
      }),
  
    singleValue: (base) => ({
      ...base,
      fontSize: '14px',
    }),
  }}
/>
    </div>
  );
};

export default SelectComponent;
