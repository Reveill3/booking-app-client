import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Button, Container, Stack, TextField } from '@mui/material';
import { useState } from 'react';
import { Box } from '@mui/system';
import { useLocation } from 'react-router-dom';

import { useEffect } from 'react';

const Edit = () => {
  const location = useLocation();

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  useEffect(() => {
    if (location.state.reservation) {
      setStartDate(location.state.reservation.start);
      setEndDate(location.state.reservation.end);
    }
  }, [location.state.reservation]);

  const handleUpdate = () => {
    console.log('update');
  };

  const handleDelete = () => {
    console.log('delete');
  };

  return (
    <Container
      maxWidth='lg'
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '20px',
      }}
    >
      <Stack justifyContent='center' textAlign='center' gap={3} mt={6} mb={6}>
        <Box>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateTimePicker
              renderInput={(props) => <TextField {...props} />}
              label='Start Date/Time'
              value={startDate}
              onChange={(newDate) => {
                setStartDate(newDate);
              }}
            />
          </LocalizationProvider>
        </Box>
        <Box>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateTimePicker
              renderInput={(props) => <TextField {...props} />}
              label='End Date/Time'
              value={endDate}
              onChange={(newDate) => {
                setEndDate(newDate);
              }}
            />
          </LocalizationProvider>
        </Box>
        <Button variant='contained' onClick={handleUpdate}>
          Update Reservation
        </Button>
        <Button variant='contained' color='error' onClick={handleDelete}>
          Delete Reservation
        </Button>
      </Stack>
    </Container>
  );
};

export default Edit;
