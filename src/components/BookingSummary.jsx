import { Stack, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { format } from 'date-fns';
import DoubleArrowIcon from '@mui/icons-material/DoubleArrow';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import styled from '@emotion/styled';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

const vehicle = {
  id: 1,
  make: 'Tesla',
  model: 'Model 3',
  year: 2021,
  dailyRate: 100,
  primaryImg:
    'https://res.cloudinary.com/dgplbptdj/image/upload/v1669926365/Booking%20App/Vehicles/Tesla_Creative_1_zzqhcj.jpg',
};

const reservation = {
  vehicle: 1,
  startDate: '2021-12-01 13:00:00',
  endDate: '2021-12-05 14:00:00',
};

const fees = {
  deliveryFee: 90,
  stateTax: 0.1,
  localTax: 0.05,
};

const DateBox = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '10px',
});

const BookingSummary = () => {
  const MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24;
  function dayDifference(date1, date2) {
    const timeDiff = Math.abs(date2.getTime() - date1.getTime());
    const diffDays = Math.ceil(timeDiff / MILLISECONDS_PER_DAY);
    return diffDays;
  }

  const matches = useMediaQuery(useTheme().breakpoints.up('md'));

  const days = dayDifference(
    new Date(reservation.startDate),
    new Date(reservation.endDate)
  );

  return (
    <Stack marginTop={10} gap={2} maxWidth={matches ? '275px' : null}>
      <Box textAlign='center'>
        <img src={vehicle.primaryImg} alt='' width='215px' height='137px' />
      </Box>
      <Typography variant='h5' fontWeight={700} textAlign='center'>
        {vehicle.make} {vehicle.model} {vehicle.year}
      </Typography>
      <Box sx={{ display: 'flex', gap: '20px' }}>
        <DateBox>
          <Typography variant='body1' fontWeight={700}>
            {format(new Date(reservation.startDate), 'EEE MMM dd, yyyy')}
          </Typography>
          <Typography variant='body2' fontWeight={300}>
            {format(new Date(reservation.startDate), 'hh:mm a')}
          </Typography>
        </DateBox>
        <DoubleArrowIcon fontSize='medium' />
        <DateBox>
          <Typography variant='body1' fontWeight={700}>
            {format(new Date(reservation.endDate), 'EEE MMM dd, yyyy')}
          </Typography>
          <Typography variant='body2' fontWeight={300}>
            {format(new Date(reservation.endDate), 'hh:mm a')}
          </Typography>
        </DateBox>
      </Box>
      <Typography variant='body1' fontWeight={700}>
        Delivery Location
      </Typography>
      <Box display='flex' alignItems='center' gap={3}>
        <FlightTakeoffIcon fontSize='large' />
        <Typography variant='body2' fontWeight={400}>
          DFW Airport
        </Typography>
      </Box>
      <Box
        display='flex'
        justifyContent='space-between'
        alignItems='center'
        marginTop={2}
      >
        <Typography variant='subtitle1' fontWeight={400}>
          ${vehicle.dailyRate} x {days} days
        </Typography>
        <Typography variant='subtitle1' fontWeight={400}>
          ${vehicle.dailyRate * days}
        </Typography>
      </Box>
      <Box display='flex' justifyContent='space-between' alignItems='center'>
        <Typography
          variant='subtitle1'
          fontWeight={400}
          sx={{ textDecoration: 'underline' }}
        >
          Delivery Fee
        </Typography>
        <Typography variant='subtitle1' fontWeight={400}>
          ${fees.deliveryFee}
        </Typography>
      </Box>
      <Box display='flex' justifyContent='space-between' alignItems='center'>
        <Typography
          variant='subtitle1'
          fontWeight={400}
          sx={{ textDecoration: 'underline' }}
        >
          State Taxes
        </Typography>
        <Typography variant='subtitle1' fontWeight={400}>
          ${fees.stateTax * vehicle.dailyRate * days}
        </Typography>
      </Box>
      <Box display='flex' justifyContent='space-between' alignItems='center'>
        <Typography
          variant='subtitle1'
          fontWeight={400}
          sx={{ textDecoration: 'underline' }}
        >
          Local Taxes
        </Typography>
        <Typography variant='subtitle1' fontWeight={400}>
          ${fees.localTax * vehicle.dailyRate * days}
        </Typography>
      </Box>
      <Box
        display='flex'
        justifyContent='space-between'
        alignItems='center'
        padding={3}
      >
        <Typography variant='subtitle1' fontWeight={700}>
          Total
        </Typography>
        <Typography>
          $
          {vehicle.dailyRate * days +
            fees.stateTax * vehicle.dailyRate * days +
            fees.localTax * vehicle.dailyRate * days}
        </Typography>
      </Box>
    </Stack>
  );
};

export default BookingSummary;
