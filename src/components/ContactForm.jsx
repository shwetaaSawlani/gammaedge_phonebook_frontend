import { useEffect, useState, useCallback } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, Button, MenuItem, Box, Avatar, Grid, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { addContactToDB, updateContactToDB, fetchContacts } from '../features/contacts/contactSlice';
import PropTypes from 'prop-types';

const labels = ['Work', 'School', 'Friends', 'Family'];

const ContactForm = ({ open, handleClose, editData }) => {
  const dispatch = useDispatch();

  const { currentPage, itemsPerPage, activeSearchTerm, activeLabel } = useSelector((state) => state.contacts);
  const [form, setForm] = useState({ name: '', phoneNumber: '', address: '', label: '', avatar: null,   existingAvatarUrl: '' });
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');

  useEffect(() => {
    if (editData) {
      setForm({
        name: editData.name || '',
        phoneNumber: String(editData.phoneNumber || ''),
        address: editData.address || '',
        label: editData.label || '',
        avatar: null,
        existingAvatarUrl: editData.avatar || ''
      });
    } else {
      setForm({ name: '', phoneNumber: '', address: '', label: '', avatar: null, existingAvatarUrl: '' });
    }
    setErrors({});
    setGeneralError('');

  }, [editData, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    setGeneralError('');
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];

    if (file) {
      setForm((prev) => ({ ...prev, avatar: file }));
      setGeneralError('');
    }
  };

  const validateForm = useCallback(() => {
    const newErrors = {};
    const phoneRegex = /^\d{10}$/;

    if (!form.name.trim()) {
      newErrors.name = 'Name is required.';
    }

    if (typeof form.phoneNumber !== 'string' || !form.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required.';

    } else if (!phoneRegex.test(form.phoneNumber)) {
      newErrors.phoneNumber = 'Phone number must be exactly 10 digits.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;

  }, [form.name, form.phoneNumber]);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!validateForm()) {
      return;
    }

    setUploading(true);
    setGeneralError('');

    try {
      const dataToSubmit = { ...form };
      const parsedPhoneNumber = Number(form.phoneNumber);

      if (isNaN(parsedPhoneNumber)) {
        setErrors((prev) => ({ ...prev, phoneNumber: 'Phone number must be a valid number.' }));
        setUploading(false);
        return;
      }

      dataToSubmit.phoneNumber = parsedPhoneNumber;

      if (editData) {
        if (!editData || typeof editData !== 'object') {
          throw new Error('Invalid contact data provided for update operation.');
        }
        let contactIdToUpdate = editData._id;

        if (contactIdToUpdate === null || contactIdToUpdate === undefined) {
          contactIdToUpdate = '';
        } else {
          contactIdToUpdate = String(contactIdToUpdate);
        }

        const objectIdRegex = /^[0-9a-fA-F]{24}$/;

        if (!contactIdToUpdate || !objectIdRegex.test(contactIdToUpdate)) {
          throw new Error('Invalid or missing Contact ID for update operation. Please ensure the contact data is valid.');
        }

        await dispatch(updateContactToDB({ id: contactIdToUpdate, updatedData: dataToSubmit })).unwrap();

      } else {
        await dispatch(addContactToDB(dataToSubmit)).unwrap();
      }

      dispatch(fetchContacts({
        page: currentPage,
        limit: itemsPerPage,
        searchTerm: activeSearchTerm,
        label: activeLabel,

      }));

      handleClose();

    } catch (err) {
      setGeneralError(err);

    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>{editData ? 'Edit Contact' : 'Add Contact'}</DialogTitle>
      <DialogContent dividers>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <Grid container spacing={3} direction="column">
            <Grid>
              <TextField
                fullWidth
                required
                label="Name"
                name="name"
                value={form.name}
                onChange={handleChange}
                error={!!errors.name}
                helperText={errors.name}
              />
            </Grid>
            <Grid>
              <TextField
                fullWidth
                required
                label="Phone Number"
                name="phoneNumber"
                value={form.phoneNumber}
                onChange={handleChange}
                error={!!errors.phoneNumber}
                helperText={errors.phoneNumber}
                inputProps={{
                  inputMode: 'numeric',
                  pattern: '[0-9]*',
                  maxLength: 10,
                }}
              />
            </Grid>
            <Grid>
              <TextField
                fullWidth
                label="Address"
                name="address"
                value={form.address}
                onChange={handleChange}
              />
            </Grid>

            <Grid>
              <TextField
                fullWidth
                select
                label="Label"
                name="label"
                value={form.label}
                onChange={handleChange}
                helperText="Select a category for this contact"
              >

                {labels.map((label) => (
                  <MenuItem key={label} value={label}>
                    {label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid display="flex" alignItems="center" gap={2}>
              <Avatar
                src={
                  form.avatar instanceof File
                    ? URL.createObjectURL(form.avatar)
                    : form.existingAvatarUrl
                }
                alt="Contact Avatar"
                sx={{ width: 56, height: 56 }}
              />
              <Button
                component="label"
                variant="outlined"
                disabled={uploading}
              >
                {uploading ? 'Uploading...' : 'Upload Avatar'}
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </Button>
            </Grid>

            {generalError && (
              <Grid>
                <Typography color="error" variant="body2" sx={{ textAlign: 'center' }}>
                  {generalError}
                </Typography>
              </Grid>
            )}

            <Grid>
              <Button
                fullWidth
                variant="contained"
                sx={{ mt: 2 }}
                onClick={handleSubmit}
                disabled={uploading}

              >
                {editData ? 'Update Contact' : 'Add Contact'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

ContactForm.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  editData: PropTypes.shape({
    _id: PropTypes.string,
    name: PropTypes.string,
    phoneNumber: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    address: PropTypes.string,
    label: PropTypes.string,
    avatar: PropTypes.string,
  }),
};

export default ContactForm;
