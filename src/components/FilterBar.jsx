
import { TextField, MenuItem, Box } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setPaginationParams, fetchContacts } from '../features/contacts/contactSlice';

const contactLabels = ['', 'Work', 'School', 'Friends', 'Family'];

const FilterBar = () => {
  const dispatch = useDispatch();

  const activeLabel = useSelector((state) => state.contacts.activeLabel);
  const itemsPerPage = useSelector((state) => state.contacts.itemsPerPage);
  const activeSearchTerm = useSelector((state) => state.contacts.activeSearchTerm);

  const handleChange = (event) => {
    const newLabel = event.target.value;

    dispatch(setPaginationParams({ label: newLabel, page: 1 }));

    dispatch(fetchContacts({
      page: 1,
      limit: itemsPerPage,
      searchTerm: activeSearchTerm,
      label: newLabel,
    }));
  };

  return (
    <Box >
      <TextField
        fullWidth
        select
        label="Filter by label"
        value={activeLabel}
        onChange={handleChange}
        variant="outlined"
      >

        <MenuItem value="">All</MenuItem>

        {contactLabels.slice(1).map((label) => (
          <MenuItem key={label} value={label}>
            {label}
          </MenuItem>
        ))}
      </TextField>
    </Box>
  );
};

export default FilterBar;
