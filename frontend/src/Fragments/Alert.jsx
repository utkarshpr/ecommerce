import React from 'react';
import Alert from '@mui/material/Alert';
import CheckIcon from '@mui/icons-material/Check';

const Alerts = ({ severity = 'success', message = '', icon = null }) => {
  return (
    <Alert 
      icon={icon || <CheckIcon fontSize="inherit" />} 
      severity={severity}
    >
      {message || 'Default alert message'}
    </Alert>
  );
};

export default Alerts;
