import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
    Container,
    Typography,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    Box,
    Avatar,
    Divider,
    Stack,
    IconButton
} from '@mui/material';


import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person'; 
import EditIcon from '@mui/icons-material/Edit';



import ContactForm from './components/ContactForm';
import ContactList from './components/ContactList';
import SearchBar from './components/SearchBar';
import FilterBar from './components/FilterBar';
import ContactCount from './components/ContactCount';
import { fetchContacts } from './features/contacts/contactSlice';

const PhonebookApp = () => {
    const [openForm, setOpenForm] = useState(false);
    const [editContact, setEditContact] = useState(null);
    const [selectedContact, setSelectedContact] = useState(null);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchContacts({ page: 1, limit: 10 }));
    }, [dispatch]);

    const handleEdit = (contact) => {
        setEditContact(contact);
        setOpenForm(true);
    };

    return (
        <Container sx={{ mt: 4, mb: 4, py: 4 }}>
            <Typography variant="h4" align="center" gutterBottom>
                📘 My Phonebook
            </Typography>

         
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={3} alignItems="center">
                <Box flex={1}>
                    <SearchBar />
                </Box>
                <Box flex={1}>
                    <FilterBar />
                </Box>
                <Box flex={1}> 
                    <ContactCount/>
                </Box>
                <Button
                    variant="contained"
                    onClick={() => setOpenForm(true)}
                    sx={{ whiteSpace: 'nowrap' }}
                >
                    + Create Contact
                </Button>
            </Stack>

            <ContactForm
                open={openForm}
                handleClose={() => {
                    setOpenForm(false);
                    setEditContact(null);
                }}
                editData={editContact}
            />

            <ContactList
                onEdit={handleEdit}
                onView={setSelectedContact}
            />

            <Dialog open={!!selectedContact} onClose={() => setSelectedContact(null)} fullWidth>
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    Contact Details
                    <IconButton onClick={() => setSelectedContact(null)} aria-label="close dialog">
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    {selectedContact && (
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 2,
                            py: 2
                        }}>
                            <Avatar
                                src={selectedContact.avatar}
                                alt={selectedContact.name}
                                sx={{
                                    width: 80,
                                    height: 80,
                                    bgcolor: 'primary.light',
                                    fontSize: '2rem'
                                }}
                            >
                                {!selectedContact.avatar && selectedContact.name ? selectedContact.name.charAt(0).toUpperCase() : <PersonIcon />}
                            </Avatar>
                            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
                                {selectedContact.name}
                            </Typography>
                            <Divider sx={{ width: '80%' }} />
                            <Box sx={{ width: '100%', px: 2 }}>
                                <Typography mb={1}>
                                    <strong>📞 Phone:</strong> {selectedContact.phoneNumber}
                                </Typography>
                                <Typography mb={1}>
                                    <strong>🏠 Address:</strong> {selectedContact.address}
                                </Typography>
                                <Typography mb={1}>
                                    <strong>🏷️ Label:</strong> {selectedContact.label}
                                </Typography>
                            </Box>

                            <Stack direction="row" spacing={2} mt={2}>
                                <Button
                                    variant="outlined"
                                    startIcon={<EditIcon />}
                                    onClick={() => {
                                        handleEdit(selectedContact);
                                        setSelectedContact(null);
                                    }}
                                >
                                    Edit
                                </Button>
                    
                            </Stack>
                        </Box>
                    )}
                </DialogContent>
            </Dialog>

        </Container>
    );
};

export default PhonebookApp;