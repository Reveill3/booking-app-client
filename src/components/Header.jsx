import {
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
import { DateRangePicker, DateRange } from 'mui-daterange-picker';
import { useState } from 'react';
import { FormGroup } from '@mui/material';
import { format } from 'date-fns';
import './header.css';
import { useNavigate } from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';

const StyledVideo = styled('video')({
  width: '100%',
});

const SearchBarPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.main,
  border: '5px solid #000000',
  width: '80vw',
  height: '155px',
  borderRadius: '40px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  [theme.breakpoints.down('md')]: {
    width: '90vw',
    height: '230px',
    padding: '10px',
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
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
  });
  const [location, setLocation] = useState('');
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());

  const navigate = useNavigate();

  // Combine Dates and times
  // console.log(
  //   new Date(
  //     new Date(startTime).toLocaleDateString() +
  //       ' ' +
  //       new Date(startTime).toLocaleTimeString()
  //   )
  // );

  console.log(startTime);
  console.log(endTime);
  return (
    <Box
      sx={{
        width: '100vw',
        position: 'relative',
        height: '100%',
        backgroundColor: theme.palette.secondary.dark,
      }}
    >
      <StyledVideo
        src='https://res.cloudinary.com/ddq3k3ntz/video/upload/v1669230118/Pexels_Videos_1437396_zafgx1.mp4'
        autoPlay
        loop
        muted
      />

      <Box
        sx={{
          position: 'absolute',
          bottom: { xs: '-120px', md: '-25px' },
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
                    top: { xs: '0px', md: '38px' },
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
                  onChange={(e) => setLocation(e.target.value)}
                >
                  <MenuItem value='DFW'>DFW Airport</MenuItem>
                  <MenuItem value='STOVALL'>Stovall Park Arlington</MenuItem>
                </StyledSelect>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Typography variant='h6' color={theme.palette.primary.main}>
                    Rental Dates
                  </Typography>
                  <Typography
                    color={theme.palette.primary.main}
                    variant='body1'
                    sx={{ flex: 1, border: '1px solid #000', padding: '5px' }}
                    onClick={() => setOpen(!open)}
                  >
                    {`${format(dateRange.startDate, 'MM/dd/yyyy')} to
                  ${format(dateRange.endDate, 'MM/dd/yyyy')}`}
                  </Typography>
                  <Box sx={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <MobileTimePicker
                        label='Start Time'
                        value={startTime}
                        onChange={(value) => {
                          setStartTime(value);
                        }}
                        renderInput={(params) => <TextField {...params} />}
                      />
                    </LocalizationProvider>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <MobileTimePicker
                        label='End Time'
                        value={endTime}
                        onChange={(newValue) => {
                          setEndTime(newValue);
                        }}
                        renderInput={(params) => <TextField {...params} />}
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
            />
          </Box>
          <Button
            sx={{ height: '50%' }}
            variant='contained'
            onClick={() => navigate('/cars')}
          >
            Check Availability
          </Button>
        </SearchStack>
      </Box>
    </Box>
  );
};

export default Header;
