import React from 'react';
import Select from 'react-select';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';

const SelectComponent = ({ options, value, onChange, label, name,defaultplaceholder }) => {
  return (
    <div className="flex flex-col mt-[3px]">
      {label && <label htmlFor={name} className="text-sm font-medium text-start text-[12px] font-[Montserrat]">{label}</label>}
      <Select
  id={name}
  name={name}
  value={
    options.find((option) => option.value === value)   
  }
  // required
  onChange={onChange}
  options={options}
  getOptionLabel={(e) => <div>{e.label}</div>}
  getOptionValue={(e) => e.value}
  className="react-select-container"
  classNamePrefix="react-select"

  styles={{
    control: (base, { isFocused }) => ({
      ...base,
      border: isFocused ? "2px solid #045D78" : " 1px solid #EAEAFF",
      boxShadow: isFocused ? 'none':'none',
      borderRadius: "8px",
      padding: "2px",
      fontSize: "12px", 
      height:"40px",
      color: "#757575",
      
      "&:hover":{
        
      }
    }),
    placeholder: (base) => ({
      ...base,
      color: "#757575",
      fontSize: "12px",
    }),
    
    singleValue: (base) => ({
      ...base,
      fontSize: "14px",
      fontWeight: "500",
      color: "#757575",
    }),
    option: (base, { isFocused, isSelected }) => ({
      ...base,
          backgroundColor: "white",
          color: "#757575",
          fontSize: "12px",
          cursor: "pointer",
          "&:hover": {
            backgroundColor: "#045D78",
            color: "white",
          },
    }),
    
  
    
  }}

  components={{
    DropdownIndicator: () => (
      <KeyboardArrowDownOutlinedIcon className="w-[16px] h-[16px] pr-1" />
    ),
    IndicatorSeparator: () => null,
  }}
/>
    </div>
  );
};

export default SelectComponent;
