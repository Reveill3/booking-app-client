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
import { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from '@emotion/styled';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { isSameDateError } from '@mui/x-date-pickers/internals/hooks/validation/useDateValidation';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

const reservation = {
  vehicle: 1,
  startDate: '2021-12-01 13:00:00',
  endDate: '2021-12-05 14:00:00',
};

const TermsLink = styled(Link)({
  textDecoration: 'none',
  marginLeft: '4px',
  '&:hover': {
    textDecoration: 'underline',
  },
});

const Checkout = () => {
  const [agree, setAgree] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(true);

  const MS_IN_DAY = 1000 * 60 * 60 * 24;

  const matches = useMediaQuery(useTheme().breakpoints.up('md'));

  function oneBefore(date) {
    const newDate = new Date(date);
    const dayBefore = newDate.getTime() - MS_IN_DAY;
    return format(dayBefore, 'MMM dd, yyyy hh:mm a');
  }

  const handleSubmit = () => {
    if (agree) {
      setSubmitted(true);
    } else {
      setError(true);
    }
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
            in={agree && submitted}
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
                Free cancellation before{' '}
                <b>{oneBefore(reservation.startDate)}</b>
              </Typography>
            </Box>
            <Box display='flex' alignItems='center'>
              <Checkbox
                checked={agree}
                onChange={() => {
                  setAgree(!agree);
                  setError(!error);
                }}
              />
              <Typography variant='subtitle1' fontWeight={300}>
                I agree to the
                <TermsLink to='/terms'>Terms And Conditions</TermsLink> and
                <TermsLink to='/cancellation'>Cancellation policy</TermsLink>.
              </Typography>
            </Box>
            <Button variant='contained' onClick={handleSubmit} disabled={error}>
              Complete Reservation
            </Button>
          </Stack>
          <Box>
            <BookingSummary />
          </Box>
        </Stack>
      </Container>
    </>
  );
};

export default Checkout;
