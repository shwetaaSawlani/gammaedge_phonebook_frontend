import { useState, useCallback } from 'react';
import { Box, Card, CardContent, Typography, IconButton, Avatar, Grid, Tooltip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import Paginationn from './Paginationn';
import { useDispatch, useSelector } from 'react-redux';
import { deleteContactFromDB, toggleBookmarkContact, fetchContacts, } from '../features/contacts/contactSlice';
import PropTypes from 'prop-types';

const ContactList = ({ onEdit, onView }) => {
  const dispatch = useDispatch();

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [contactToDeleteId, setContactToDeleteId] = useState(null);
  const [contactToDeleteName, setContactToDeleteName] = useState(null);

  const {
    data: contactsToDisplay,
    currentPage,
    itemsPerPage,
    loading,
    activeSearchTerm,
    activeLabel,
  } = useSelector((state) => state.contacts);

  const refreshCurrentView = useCallback(() => {
    dispatch(
      fetchContacts({
        page: currentPage,
        limit: itemsPerPage,
        searchTerm: activeSearchTerm,
        label: activeLabel,
      })
    );
  }, [dispatch, currentPage, itemsPerPage, activeSearchTerm, activeLabel]);

  const confirmDelete = (id, name) => {
    setContactToDeleteId(id);
    setContactToDeleteName(name);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setContactToDeleteId(null);
    setContactToDeleteName(null);
  };

  const handleConfirmDelete = useCallback(async () => {
    if (!contactToDeleteId) return;

    handleCloseDeleteDialog();
    try {
      await dispatch(deleteContactFromDB(contactToDeleteId)).unwrap();
      // console.log('Contact deleted successfully!');

      refreshCurrentView();
    } catch (error) {
      // console.error('Failed to delete contact:', error);
      alert(`Failed to delete contact: ${error.message}`);
    }
  }, [dispatch, contactToDeleteId, refreshCurrentView]);

  const handleToggleBookmark = useCallback(
    async (e, id) => {
      e.stopPropagation();

      try {
        await dispatch(toggleBookmarkContact(id)).unwrap();
        refreshCurrentView();
      } catch (error) {
        // console.error('Failed to toggle bookmark:', error);
        alert(`failed to toggle bookmark: ${error.message}`);
      }
    },
    [dispatch, refreshCurrentView]
  );

  if (loading && contactsToDisplay.length === 0) {
    return (
      <Typography variant="h6" align="center" mt={4}>
              Loading contacts...
      </Typography>
    );
  }

  return (
    <Box>
      <Grid container spacing={4}>
        {!loading && contactsToDisplay.length === 0 && (
          <Typography
            variant="h6"
            align="center"
            mt={4}
            sx={{ width: '100%' }}
          >
            {activeSearchTerm && activeLabel && activeLabel !== 'All'
              ? `No contacts found with name "${activeSearchTerm}" and label "${activeLabel}".`
              : activeSearchTerm
                ? `No contacts found matching "${activeSearchTerm}".`
                : activeLabel && activeLabel !== 'All'
                  ? `No contacts found with label "${activeLabel}".`
                  : 'No contacts found. Start by adding a new one!'
            }
          </Typography>
        )}

        {contactsToDisplay.map((contact) => {

          if (!contact || !contact._id) {

            return null;
          }

          const isContactBookmarked = contact.bookmarked;

          return (
            <Grid item sx={{ width: '100%' }} key={contact._id}>
              <Card
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  px: 3,
                  py: 1,
                  boxShadow: 2,
                  borderRadius: 3,
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'scale(1.02)' },
                }}
                onClick={() => onView(contact)}
              >
                <Avatar
                  src={contact.avatar}
                  alt={contact.name}
                  sx={{ width: 56, height: 56, mr: 2 }}
                />
                <CardContent sx={{ flexGrow: 1, minWidth: 0 }}>
                  <Typography variant="subtitle1">
                    {contact.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                                        📞 {contact.phoneNumber}
                    {contact.label && ` 🏷️ ${contact.label}`}
                  </Typography>
                </CardContent>

                <Tooltip
                  title={
                    isContactBookmarked
                      ? 'Remove Bookmark'
                      : 'Bookmark'
                  }
                >
                  <IconButton
                    onClick={(e) =>
                      handleToggleBookmark(e, contact._id)
                    }
                  >
                    {isContactBookmarked ? (
                      <BookmarkIcon color="primary" />
                    ) : (
                      <BookmarkBorderIcon />
                    )}
                  </IconButton>
                </Tooltip>

                <Tooltip title="Edit">
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(contact);
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Delete">
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      confirmDelete(contact._id, contact.name);
                    }}
                  >
                    <DeleteIcon color="error" />
                  </IconButton>
                </Tooltip>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      <Paginationn />

      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{'Confirm Delete'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
                        Are you sure you want to permanently delete{' '}
            <Typography component="span" sx={{ fontWeight: 'bold' }}>
              {contactToDeleteName}
            </Typography>
                        ? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error" autoFocus>
                        Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

ContactList.propTypes = {
  onEdit: PropTypes.func.isRequired,
  onView: PropTypes.func.isRequired,
};

export default ContactList;
