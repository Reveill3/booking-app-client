import { Stack, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { format } from 'date-fns';
import DoubleArrowIcon from '@mui/icons-material/DoubleArrow';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import styled from '@emotion/styled';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

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

const BookingSummary = ({ data }) => {
  const matches = useMediaQuery(useTheme().breakpoints.up('md'));

  let feeTotal = 0;

  return (
    <Stack marginTop={10} gap={2} maxWidth={matches ? '275px' : null}>
      <Box textAlign='center'>
        <img
          src={data.vehicle.primaryImg}
          alt=''
          width='215px'
          height='137px'
          style={{ borderRadius: '10px' }}
        />
      </Box>
      <Typography variant='h5' fontWeight={700} textAlign='center'>
        {data.vehicle.make} {data.vehicle.model} {data.vehicle.year}
      </Typography>
      <Box sx={{ display: 'flex', gap: '20px' }}>
        <DateBox>
          <Typography variant='body1' fontWeight={700}>
            {format(new Date(data.reservation.startDate), 'EEE MMM dd, yyyy')}
          </Typography>
          <Typography variant='body2' fontWeight={300}>
            {format(new Date(data.reservation.startDate), 'hh:mm a')}
          </Typography>
        </DateBox>
        <DoubleArrowIcon fontSize='medium' />
        <DateBox>
          <Typography variant='body1' fontWeight={700}>
            {format(new Date(data.reservation.endDate), 'EEE MMM dd, yyyy')}
          </Typography>
          <Typography variant='body2' fontWeight={300}>
            {format(new Date(data.reservation.endDate), 'hh:mm a')}
          </Typography>
        </DateBox>
      </Box>
      <Typography variant='body1' fontWeight={700}>
        Delivery Location
      </Typography>
      <Box display='flex' alignItems='center' gap={3}>
        <FlightTakeoffIcon fontSize='large' />
        <Typography variant='body2' fontWeight={400}>
          {data.reservation.locationName}
        </Typography>
      </Box>
      <Box
        display='flex'
        justifyContent='space-between'
        alignItems='center'
        marginTop={2}
      >
        <Typography variant='subtitle1' fontWeight={400}>
          ${data.vehicle.dailyRate} x {data.reservation.totalDays} days
        </Typography>
        <Typography variant='subtitle1' fontWeight={400}>
          ${(data.vehicle.dailyRate * data.reservation.totalDays).toFixed(2)}
        </Typography>
      </Box>
      {data.addOns.map((addOn) => {
        if (addOn.attributes.type === 'percentage') {
          feeTotal += addOn.attributes.amount * data.reservation.subTotal;
        }
        if (addOn.attributes.type === 'flat') {
          feeTotal += addOn.attributes.amount;
        }
        return (
          <Box
            key={addOn.id}
            display='flex'
            justifyContent='space-between'
            alignItems='center'
          >
            <Typography
              variant='subtitle1'
              fontWeight={400}
              sx={{ textDecoration: 'underline' }}
            >
              {addOn.attributes.name}
            </Typography>
            <Typography variant='subtitle1' fontWeight={400}>
              $
              {addOn.attributes.type === 'percentage'
                ? (addOn.attributes.amount * data.reservation.subTotal).toFixed(
                    2
                  )
                : addOn.attributes.amount.toFixed(2)}
            </Typography>
          </Box>
        );
      })}
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
          ${(data.reservation.subTotal + feeTotal).toFixed(2)}
        </Typography>
      </Box>
    </Stack>
  );
};

export default BookingSummary;
