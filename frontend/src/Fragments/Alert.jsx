import React from 'react';
import Alert from '@mui/material/Alert';
import CheckIcon from '@mui/icons-material/Check';

const Alerts = ({ severity = 'success', message = '', icon = null }) => {
  return (
    <Alert  
      severity={severity}
      variant="filled"
    >
      {message || 'Default alert message'}
    </Alert>
  );
};

export default Alerts;
