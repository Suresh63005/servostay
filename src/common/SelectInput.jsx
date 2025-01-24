import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import Select from 'react-select';

export const SelectField = ({ label, options, value, onChange, name, defaultplaceholder }) => (
    <div className="mb-0">
      <label className="block text-xs font-medium mb-1">{label}</label>
      <Select
        value={
           options.find((option) => option.value === value) 
        }
        onChange={onChange}
        options={options}
        getOptionLabel={(e) => <div>{e.label}</div>}
        getOptionValue={(e) => e.value}
        name={name}
        className="text-[12px]" 
        styles={{
          control: (base, {isFocused}) => ({
            ...base,
            border: isFocused ? "2px solid #660F5D" : " 1px solid #EAEAFF",
            boxShadow: isFocused ? 'none':'none',
            borderRadius: "5px",
            padding: "2px",
            fontSize: "12px", 
            color: "#757575",
            
            "&:hover":{
              
            }
          }),
          placeholder: (base) => ({
            ...base,
            color: "#757575",
            fontSize: "12px", // Placeholder font size
          }),
          singleValue: (base) => ({
            ...base,
            fontSize: "12px",
            fontWeight: "600",
            color:"#757575",
            fontFamily:"Montserrat', sans-serif",
          }),
          option: (base) => ({
            ...base,
            backgroundColor: "white", // No background color change for selected state
            color: "#757575", // Default text color
            fontWeight: "100",
            cursor: "pointer",
            fontSize: "12px", // Option font size
             // Fixed option width
            "&:hover": {
              backgroundColor: "#660F5D", // Apply hover effect
              color: "white", // Change text color to white on hover
            },
          }),
          // menu: (base) => ({
          //   ...base,
          //   width: "150px", // Fixed dropdown menu width
          // }),
        }}
        components={{
          DropdownIndicator: () => (
            <KeyboardArrowDownOutlinedIcon className="w-[16px] h-[16px] pr-1" /> 
          ),
          IndicatorSeparator: () => null, // Remove indicator separator
        }}
      />
    </div>
  );