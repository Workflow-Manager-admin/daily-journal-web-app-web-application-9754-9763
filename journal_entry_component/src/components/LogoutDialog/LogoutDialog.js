import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from '@mui/material';

/**
 * A confirmation dialog component for logout action.
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.open - Controls the visibility of the dialog
 * @param {Function} props.onClose - Callback function when dialog is closed
 * @param {Function} props.onConfirm - Callback function when logout is confirmed
 * @returns {JSX.Element} The LogoutDialog component
 */
const LogoutDialog = ({ open, onClose, onConfirm }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="logout-dialog-title"
      aria-describedby="logout-dialog-description"
    >
      <DialogTitle id="logout-dialog-title">
        Confirm Logout
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="logout-dialog-description">
          Are you sure you want to logout? Any unsaved changes will be lost.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={onConfirm} color="primary" variant="contained" autoFocus>
          Logout
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LogoutDialog;
