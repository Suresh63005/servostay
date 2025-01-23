export const handleSort = (data, key, sortConfig, setSortConfig, setData) => {
  console.log(data, key, sortConfig, setSortConfig, setData);

  let direction = 'asc';
  if (sortConfig.key === key && sortConfig.direction === 'asc') {
    direction = 'desc';
  }

  const sortedData = [...data].sort((a, b) => {
    const valA = a[key] ?? ''; 
    const valB = b[key] ?? ''; 

    if (typeof valA === 'string' && typeof valB === 'string') {
      return valA.localeCompare(valB) * (direction === 'asc' ? 1 : -1);
    }

    if (typeof valA === 'number' && typeof valB === 'number') {
      return direction === 'asc' ? valA - valB : valB - valA;
    }

    return String(valA).localeCompare(String(valB)) * (direction === 'asc' ? 1 : -1);
  });

  setData(sortedData);
  setSortConfig({ key, direction });
};
