import {
  Box,
  Container,
  Stack,
  Typography,
  Checkbox,
  Button,
  Slide,
} from '@mui/material';
import BookingSummary from '../components/BookingSummary';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import format from 'date-fns/format';
import { useContext, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from '@emotion/styled';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CircularProgress from '@mui/material/CircularProgress';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import useFetch from '../hooks/useFetch';
import moment from 'moment';
import qs from 'qs';
import axios from 'axios';
import { BookingContext } from '../context/BookingContext';

const TermsLink = styled(Link)({
  textDecoration: 'none',
  marginLeft: '4px',
  '&:hover': {
    textDecoration: 'underline',
  },
});

const Checkout = () => {
  const { state, dispatch } = useContext(BookingContext);
  const { startDate, endDate, location, vehicle, submitted, agree } = state;
  const {
    data: fetchedVehicle,
    loading: vehicleLoading,
    error: vehicleError,
  } = useFetch(`/cars/${vehicle}`);

  const addOnQuery = qs.stringify(
    {
      filters: {
        $or: [
          {
            locations: {
              id: { $eq: location.id },
            },
          },
          {
            locations: {
              name: { $eq: 'all' },
            },
          },
          {
            cars: {
              id: { $eq: location.id },
            },
          },
        ],
      },
    },
    {
      encodeValuesOnly: true, // prettify URL
    }
  );

  const {
    data: addOns,
    loading: addOnsLoading,
    error: addOnsError,
  } = useFetch(`/add-ons?populate=*&${addOnQuery}`);

  const [error, setError] = useState(true);
  const [reservationLoading, setReservationLoading] = useState(false);

  const totalDays = moment(endDate).diff(startDate, 'days', true).toFixed(2);

  const MS_IN_DAY = 1000 * 60 * 60 * 24;

  const matches = useMediaQuery(useTheme().breakpoints.up('md'));

  function oneBefore(date) {
    const newDate = new Date(date);
    const dayBefore = newDate.getTime() - MS_IN_DAY;
    return format(dayBefore, 'MMM dd, yyyy hh:mm a');
  }

  const handleSubmit = async () => {
    if (agree) {
      setReservationLoading(true);
      const reservation = await axios.post(
        `${process.env.REACT_APP_API_URL}/reservations`,
        {
          car: vehicle,
          location: location.id,
          start: startDate,
          end: endDate,
          totalDays: totalDays,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      dispatch({ type: 'SUBMIT', payload: true });
      setReservationLoading(false);
    } else {
      setError(true);
      setReservationLoading(false);
    }
  };

  const summaryData = {
    vehicle: fetchedVehicle?.data.attributes,
    addOns: addOns?.data,
    reservation: {
      startDate: startDate,
      endDate: endDate,
      totalDays: totalDays,
      subTotal: fetchedVehicle?.data.attributes.dailyRate * totalDays,
      locationName: location.name,
    },
  };

  return (
    <>
      <Container
        maxWidth='lg'
        sx={{
          marginTop: '50px',
        }}
      >
        <Stack
          justifyContent='space-between'
          direction={matches ? 'row' : 'column'}
        >
          <Slide
            direction='down'
            in={submitted}
            mountOnEnter
            unmountOnExit
            timeout={750}
          >
            <Stack justifyContent='center' alignItems='center'>
              <Box
                display='flex'
                gap={4}
                justifyContent='center'
                alignItems='center'
                marginRight={10}
              >
                <CheckCircleIcon
                  sx={{
                    height: '75px',
                    width: '75px',
                  }}
                  color='success'
                />
                <Typography variant='h3' fontWeight={700}>
                  You're almost there!
                </Typography>
              </Box>
              <Typography
                variant='subtitle1'
                fontWeight={600}
                maxWidth='500px'
                mt={4}
              >
                Your reservation has been made and is pending payment. You can
                complete the payment by clicking the link sent by email or by
                going to your reservations.
              </Typography>
            </Stack>
          </Slide>
          <Stack
            justifyContent='center'
            gap={5}
            display={agree && submitted ? 'none' : 'flex'}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '20px',
              }}
            >
              <ThumbUpOffAltIcon fontSize='large' />
              <Typography variant='h6' fontWeight={300}>
                Free cancellation before <b>{oneBefore(startDate)}</b>
              </Typography>
            </Box>
            <Box display='flex' alignItems='center'>
              <Checkbox
                checked={agree || false}
                onChange={() => {
                  dispatch({ type: 'AGREE', payload: !agree });
                  setError(!error);
                }}
              />
              <Typography variant='subtitle1' fontWeight={300}>
                I agree to the
                <TermsLink to='/terms'>Terms And Conditions</TermsLink> and
                <TermsLink to='/cancellation'>Cancellation policy</TermsLink>.
              </Typography>
            </Box>
            {addOnsLoading ||
            vehicleLoading ||
            !fetchedVehicle ||
            reservationLoading ? (
              <CircularProgress />
            ) : (
              <Button
                variant='contained'
                onClick={handleSubmit}
                disabled={error}
              >
                Complete Reservation
              </Button>
            )}
          </Stack>
          <Box>
            {addOnsLoading || vehicleLoading || !fetchedVehicle ? (
              <CircularProgress />
            ) : (
              <Box mb={15}>
                <BookingSummary data={summaryData} />
              </Box>
            )}
          </Box>
        </Stack>
      </Container>
    </>
  );
};

export default Checkout;
