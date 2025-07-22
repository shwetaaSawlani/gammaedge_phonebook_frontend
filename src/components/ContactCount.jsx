
import { useSelector } from 'react-redux';
import { Typography, Box } from '@mui/material';

const ContactCount = () => {
  const totalContacts = useSelector((state) => state.contacts.totalCount);

  return (
    <Box component="span" sx={{
      py: '11px',
      px: 2,
      border: '1px solid #ccc',
      borderRadius: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      minWidth: '15px'
    }}>
      <Typography variant="subtitle1" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
        Total Contacts:
      </Typography>
      <Typography component="span" variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
        {totalContacts}
      </Typography>
    </Box>
  );
};

export default ContactCount;
