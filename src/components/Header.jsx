import {
  Alert,
  Box,
  Button,
  FormControl,
  InputLabel,
  TextField,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import styled from '@emotion/styled';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import { DateRangePicker } from 'mui-daterange-picker';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { useState } from 'react';
import { FormGroup } from '@mui/material';
import { format } from 'date-fns';
import './header.css';
import { useNavigate } from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';
import useFetch from '../hooks/useFetch';
import { BookingContext } from '../context/BookingContext';
import { useContext } from 'react';
import { DateTime } from 'luxon';
import axiosInstance from '../axios.config';

const StyledVideo = styled('video')({
  width: '100%',
});

const SearchBarPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.main,
  border: '5px solid #000000',
  width: '80vw',
  height: '195px',
  borderRadius: '40px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  [theme.breakpoints.down('md')]: {
    width: '90vw',
    height: '260px',
    padding: '40px',
  },
}));

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  width: '100%',
  textAlign: 'center',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'row',
  gap: '20px',
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
    gap: '0',
  },
}));

const SearchStack = styled(Stack)(({ theme }) => ({
  position: 'relative',
  marginLeft: '0px !important',
  gap: '20px',
  [theme.breakpoints.down('md')]: {
    width: '100vw',
    flexDirection: 'column',

    padding: '0 20px',
  },
}));

const StyledSelect = styled(Select)({
  width: '100%',
});

const Header = () => {
  const currentTime = DateTime.local();

  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: DateTime.local(),
    endDate: DateTime.local(),
  });
  const [bufferError, setBufferError] = useState(false);
  const [location, setLocation] = useState('');
  const [openHours, setOpenHours] = useState(7);
  const [closeHours, setCloseHours] = useState(20);
  const [startTime, setStartTime] = useState(
    currentTime.startOf('hour').plus({ hours: 1 }).toJSDate()
  );
  const [endTime, setEndTime] = useState(
    currentTime.startOf('hour').plus({ hours: 1 }).toJSDate()
  );
  const [dateError, setDateError] = useState(false);
  const [tripBuffer, setTripBuffer] = useState(0);

  const { state, dispatch } = useContext(BookingContext);

  // combine dateRange.startDate with startTime and dateRange.endDate with endTime using luxon
  const combinedStart = DateTime.fromISO(dateRange.startDate).set({
    hour: startTime.hour,
    minute: startTime.minute,
  });

  const combinedEnd = DateTime.fromISO(dateRange.endDate).set({
    hour: endTime.hour,
    minute: endTime.minute,
  });

  const { data, loading, error } = useFetch('/locations');

  const navigate = useNavigate();
  const checkAvailability = async () => {
    // check that selected times are after location opening time and before closing time
    if (
      startTime.hour < openHours ||
      startTime.hour > closeHours ||
      endTime.hour < openHours ||
      endTime.hour > closeHours
    ) {
      setDateError(true);
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      return;
    }

    // if start date is today, check that start time is at least trip buffer from now
    if (dateRange.startDate.hasSame(DateTime.local(), 'day')) {
      if (DateTime.fromISO(startTime).diff(endTime).milliseconds < 0) {
        setBufferError(true);
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
        return;
      }
    }
    setBufferError(false);
    setDateError(false);
    // push event to GTM
    window.dataLayer.push({
      event: 'check_availability',
      customData: {
        locationId: location,
      },
    });
    //Log insight Logsnag
    const request_config = {
      method: 'POST',
      url: 'https://api.logsnag.com/v1/insight',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.REACT_APP_LOGSNAG_KEY}`,
      },
      data: JSON.stringify({
        project: 'revrentals',
        title: `Check Availability for location ${location}`,
        value: 1,
        icon: '🚙',
      }),
    };

    const logged = await axiosInstance(request_config);
    //if no location selected or date range is on same day, return
    if (
      location === '' ||
      dateRange.startDate.startOf('day') === dateRange.endDate.startOf('day') ||
      combinedStart > combinedEnd ||
      combinedStart < DateTime.now()
    ) {
      setDateError(true);
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      return;
    }
    dispatch({
      type: 'SET_START_DATE',
      payload: combinedStart.toISO(),
    });
    //dispatch end date to booking context
    dispatch({
      type: 'SET_END_DATE',
      payload: combinedEnd.toISO(),
    });

    dispatch({
      type: 'SET_LOCATION',
      payload: {
        id: location,
        name: data?.data.find((loc) => loc.id === location).attributes.name,
      },
    });

    if (state.vehicle) {
      const isAvailable = await axiosInstance.post(
        '/api/car/isAvailable',
        {
          id: state.vehicle,
          start_date: combinedStart.toISO(),
          end_date: combinedEnd.toISO(),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      if (!isAvailable.data) {
        alert('Vehicle is not available for this date range');
        return;
      }
      return navigate('/checkout');
    }
    //if vehicle is selected, navigate to checkout else navigate to cars
    return navigate('/cars');
  };

  // handle location select
  const selectLocation = (location) => {
    setLocation(location);

    // get location opening hours
    const locationOpenHours = data?.data.find((loc) => loc.id === location)
      .attributes.open;
    const locationCloseHours = data?.data.find((loc) => loc.id === location)
      .attributes.close;

    const tripBuffer = data?.data.find((loc) => loc.id === location).attributes
      .trip_buffer;

    setOpenHours(locationOpenHours);
    setCloseHours(locationCloseHours);
    setTripBuffer(tripBuffer);
  };

  return (
    <Box
      sx={{
        width: '100vw',
        position: 'relative',
        backgroundColor: theme.palette.secondary.dark,
      }}
    >
      {dateError && (
        <Alert severity='error'>
          Please select a valid date range and select location. Open from{' '}
          {DateTime.fromObject({ hour: openHours }).toFormat('h a')} to{' '}
          {DateTime.fromObject({ hour: closeHours }).toFormat('h a')}
        </Alert>
      )}
      {bufferError && (
        <Alert severity='error'>
          Please select a start time at least {tripBuffer} hours from now
        </Alert>
      )}
      <StyledVideo
        src='https://res.cloudinary.com/ddq3k3ntz/video/upload/v1673656556/pexels-cityxcape-10227678_hkdfri.mp4'
        autoPlay
        loop
        muted
        playsInline
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: { xs: '-200px', md: '-25px' },
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <SearchStack direction='row' alignItems='center'>
          <SearchBarPaper>
            <FormGroup sx={{ width: '90%' }}>
              <StyledFormControl>
                <InputLabel
                  id='locationLabel'
                  sx={{
                    top: { xs: '0px', md: '57px' },
                  }}
                >
                  Pickup/Return Location
                </InputLabel>
                <StyledSelect
                  labelId='locationLabel'
                  id='location'
                  sx={{
                    flex: 1,
                  }}
                  label='Pickup/Return Location'
                  value={location}
                  onChange={(e) => selectLocation(e.target.value)}
                >
                  {data?.data.map((location) => {
                    if (location.attributes.visible) {
                      return (
                        <MenuItem key={location.id} value={location.id}>
                          {location.attributes.name}
                        </MenuItem>
                      );
                    }
                  })}
                </StyledSelect>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                  }}
                >
                  <Typography variant='h6' color={theme.palette.primary.main}>
                    Rental Dates
                  </Typography>
                  {/* Start and end date pickers */}
                  <Box display='flex' gap={1}>
                    <LocalizationProvider dateAdapter={AdapterLuxon}>
                      <MobileDatePicker
                        label='Start Date'
                        value={dateRange.startDate}
                        onChange={(value) => {
                          setDateRange({
                            ...dateRange,
                            startDate: value,
                          });
                        }}
                        renderInput={(params) => <TextField {...params} />}
                        minDate={DateTime.now().minus({ days: 1 }).toISO()}
                      />
                    </LocalizationProvider>
                    <LocalizationProvider dateAdapter={AdapterLuxon}>
                      <MobileDatePicker
                        label='End Date'
                        value={dateRange.endDate}
                        onChange={(value) => {
                          setDateRange({ ...dateRange, endDate: value });
                        }}
                        renderInput={(params) => <TextField {...params} />}
                        minDate={DateTime.now().minus({ days: 1 }).toISO()}
                      />
                    </LocalizationProvider>
                  </Box>
                  {/* <Typography
                    color={theme.palette.primary.main}
                    variant='body1'
                    sx={{ flex: 1, border: '1px solid #000', padding: '5px' }}
                    onClick={() => setOpen(!open)}
                  >
                    {`${format(dateRange.startDate, 'MM/dd/yyyy')} to
                  ${format(dateRange.endDate, 'MM/dd/yyyy')}`}
                  </Typography> */}
                  <Box sx={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
                    <LocalizationProvider dateAdapter={AdapterLuxon}>
                      <MobileTimePicker
                        label='Start Time'
                        value={startTime}
                        onChange={(value) => {
                          setStartTime(value);
                        }}
                        renderInput={(params) => <TextField {...params} />}
                        minutesStep={15}
                        minTime={DateTime.local().set({ hour: 7 })}
                        maxTime={DateTime.local().set({
                          hour: 22,
                          minute: 30,
                        })}
                      />
                    </LocalizationProvider>
                    <LocalizationProvider dateAdapter={AdapterLuxon}>
                      <MobileTimePicker
                        label='End Time'
                        value={endTime}
                        onChange={(newValue) => {
                          setEndTime(newValue);
                        }}
                        renderInput={(params) => <TextField {...params} />}
                        minutesStep={15}
                        minTime={DateTime.local().set({ hour: 7 })}
                        maxTime={DateTime.local().set({
                          hour: 22,
                          minute: 30,
                        })}
                      />
                    </LocalizationProvider>
                  </Box>
                </Box>
              </StyledFormControl>
            </FormGroup>
          </SearchBarPaper>
          <Box
            sx={{
              position: 'absolute',
              right: { xs: '50px', md: '100px' },
              top: { xs: '-100px', sm: '0' },
            }}
          >
            <DateRangePicker
              open={open}
              toggle={() => setOpen(!open)}
              onChange={(dates) => setDateRange(dates)}
              closeOnClickOutside={true}
              minDate={DateTime.now().minus({ days: 1 }).toISO()}
            />
          </Box>
          {/* Style button to have different color on hover */}
          <Button
            sx={{
              height: '50%',
              '&:hover': {
                backgroundColor: theme.palette.primary.hover,
              },
            }}
            variant='contained'
            onClick={checkAvailability}
          >
            Check Availability
          </Button>
        </SearchStack>
      </Box>
    </Box>
  );
};

export default Header;
