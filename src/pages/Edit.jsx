import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Alert, Button, Container, Stack, TextField } from '@mui/material';
import { useState } from 'react';
import { Box } from '@mui/system';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { DateTime } from 'luxon';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';

import { useEffect } from 'react';
import { setDate } from 'date-fns';

const Edit = () => {
  const location = useLocation();

  const [startDate, setStartDate] = useState(location.state.reservation.start);
  const [endDate, setEndDate] = useState(location.state.reservation.end);
  const [dateError, setDateError] = useState(false);
  const [dateErrorMessage, setDateErrorMessage] = useState('');

  const [updateLoading, setUpdateLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (location.state.reservation) {
      setStartDate(location.state.reservation.start);
      setEndDate(location.state.reservation.end);
    }
  }, [location.state.reservation]);

  const handleUpdate = async () => {
    setDateError(false);
    setUpdateLoading(true);
    //check if start date is before end date
    if (
      DateTime.fromJSDate(startDate).toMillis() <
      DateTime.fromJSDate(endDate).toMillis()
    ) {
      //check if start date is after current date
      if (DateTime.fromJSDate(startDate) > DateTime.now()) {
        //check if car is available for those dates
        const available = await axios.post('/api/car/isAvailable', {
          start_date: DateTime.fromJSDate(startDate).toISO(),
          end_date: DateTime.fromJSDate(endDate).toISO(),
          id: location.state.reservation.car.id,
        });
        if (available.data) {
          location.state.reservation.start = startDate;
          location.state.reservation.end = endDate;
          //update reservation
          await axios.put(
            `/api/reservations/${location.state.reservation.id}`,
            {
              data: {
                start: DateTime.fromJSDate(startDate).toISO(),
                end: DateTime.fromJSDate(endDate).toISO(),
              },
              entity: 'api::reservation.reservation',
            },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
              },
            }
          );
          setUpdateLoading(false);
          return;
        } else {
          //show error
          setUpdateLoading(false);
          setDateError(true);
          setDateErrorMessage('Car is not available for those dates');

          return;
        }
      }

      setDateError(true);
      setDateErrorMessage('Start date must be after current date');
      setUpdateLoading(false);
      return;
    }
    setUpdateLoading(false);
    setDateError(true);
    setDateErrorMessage(
      'Start date must be before end date and after current date'
    );
  };

  const handleDelete = async (id) => {
    setUpdateLoading(true);
    try {
      await axios.post(
        `/api/reservations/me/${id}`,
        {
          entity: 'api::reservation.reservation',
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      navigate('/user/reservations');
    } catch (error) {
      console.log(error);
    }
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
        {dateError && <Alert severity='error'>{dateErrorMessage}</Alert>}
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
        <Box display='flex' alignItems='center' gap={2} flexDirection='column'>
          {updateLoading ? (
            <CircularProgress />
          ) : (
            <>
              <Button variant='contained' onClick={handleUpdate}>
                Update Reservation
              </Button>
              <Button
                variant='contained'
                color='error'
                onClick={() => {
                  handleDelete(location.state.reservation.id);
                }}
              >
                Delete Reservation
              </Button>
            </>
          )}
        </Box>
      </Stack>
    </Container>
  );
};

export default Edit;
