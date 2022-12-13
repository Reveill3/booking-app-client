import {
  Card,
  Typography,
  CardMedia,
  CardContent,
  CardActions,
  Button,
} from '@mui/material';
import Container from '@mui/material/Container';
import { Box, Stack } from '@mui/system';
import styled from '@emotion/styled';
import { useTheme } from '@emotion/react';
import ReservationTimeline from '../components/Timeline';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useLocation, useNavigate } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import { useEffect, useState } from 'react';
import moment from 'moment';

const SelectOption = styled('div')(({ theme, position }) => ({
  backgroundImage:
    'url(https://res.cloudinary.com/dgplbptdj/image/upload/v1669920962/Booking%20App/carTypes_samdv6.png)',
  backgroundSize: '225px 156px',
  backgroundPosition: `${position.x} ${position.y}`,
  width: '70px',
  cursor: 'pointer',
}));

const TypePickerText = styled(Typography)(({ theme }) => ({
  textAlign: 'center',
  paddingTop: '10px',
}));

const Cars = () => {
  const [selectedType, setSelectedType] = useState('car');
  const theme = useTheme();
  const matches = useMediaQuery(useTheme().breakpoints.up('md'));
  const navigate = useNavigate();
  const location = useLocation();

  const filterStart = moment(location.state.startDate)
    .startOf('month')
    .toDate();

  const { data, loading, error, reFetch } = useFetch(
    `/cars?populate=*&filters[type][$eq]=${selectedType}`
  );

  const handleCarSelect = (id) => {
    const startEndRemoved = alldates;
    startEndRemoved.splice(0, 2);
    const state = {
      id,
      location: {
        name: location.state.location.name,
        id: location.state.location.id,
      },
      startDate: location.state.startDate,
      endDate: location.state.endDate,
      allDates: startEndRemoved,
    };
    if (localStorage.getItem('token')) {
      navigate('/checkout', { state });
      return;
    }

    navigate('/info', { state });
  };

  const handleSelect = (type) => {
    setSelectedType(type);
    reFetch();
  };

  const getDatesInRange = (startDate, endDate) => {
    const start = moment(startDate).startOf('day').add(1, 'days').toDate();
    const end = moment(endDate).startOf('day').subtract(1, 'days').toDate();

    const date = new Date(start.getTime());

    const dates = [
      moment(startDate).startOf('day').toDate().getTime(),
      moment(endDate).startOf('day').toDate().getTime(),
    ];

    while (date <= end) {
      dates.push(new Date(date).getTime());
      date.setDate(date.getDate() + 1);
    }

    return dates;
  };

  const alldates = getDatesInRange(
    location.state.startDate,
    location.state.endDate
  );

  const isAvailable = (vehicle) => {
    const isFound = vehicle.attributes.unavailable_dates.data.some((date) =>
      alldates.includes(new Date(date.attributes.date).getTime())
    );
    if (vehicle.attributes.reservations.data.length > 0) {
      const startDay = moment(location.state.startDate).startOf('day').toDate();
      console.log(startDay.getTime(), location.state.startDate, 'COMPARE 1');
      const endDay = moment(location.state.endDate).startOf('day').toDate();

      let matchedReservation;

      const isOnStartDay = vehicle.attributes.reservations.data.some(
        (reservation) => {
          console.log(
            moment(reservation.attributes.end)
              .startOf('day')
              .toDate()
              .getTime(),
            reservation.attributes.end,
            'COMPARE 2'
          );
          if (
            moment(reservation.attributes.end)
              .startOf('day')
              .toDate()
              .getTime() === startDay.getTime()
          ) {
            matchedReservation = reservation;
            return true;
          }
          return false;
        }
      );
      console.log(isOnStartDay, 'START', matchedReservation);
      const isOnEndDay = vehicle.attributes.reservations.data.some(
        (reservation) => {
          if (
            moment(reservation.attributes.start)
              .startOf('day')
              .toDate()
              .getTime() === endDay.getTime()
          ) {
            matchedReservation = reservation;
            return true;
          }
          return false;
        }
      );
      console.log(isOnEndDay, 'END');

      if (isOnStartDay) {
        const resEndPlusThreeHours = moment(matchedReservation.attributes.end)
          .add(3, 'hours')
          .toDate();
        if (
          resEndPlusThreeHours.getTime() > location.state.startDate.getTime()
        ) {
          return false;
        }
      }

      if (isOnEndDay) {
        const resStartMinusThreeHours = moment(
          matchedReservation.attributes.start
        )
          .subtract(3, 'hours')
          .toDate();
        if (
          resStartMinusThreeHours.getTime() < location.state.endDate.getTime()
        ) {
          return false;
        }
      }
    }

    return !isFound;
  };
  console.log(data);

  return (
    <div>
      <Container maxWidth='xl'>
        <Stack
          direction={matches ? 'row' : 'column'}
          sx={{ justifyContent: 'space-between' }}
        >
          <Stack sx={{ flex: 2 }}>
            <Box>
              <Typography variant='h4' mb={3} mt={4} textAlign='center'>
                Type
              </Typography>
              <Stack gap={3} mb={3}>
                <Stack direction='row' gap={3} justifyContent='center'>
                  <Box onClick={() => handleSelect('car')}>
                    <SelectOption position={{ x: '0px', y: '0px' }}>
                      <Box sx={{ width: '60px', height: '30px' }}></Box>
                    </SelectOption>
                    <TypePickerText variant='h6'>Cars</TypePickerText>
                  </Box>
                  <Box onClick={() => handleSelect('suv')}>
                    <SelectOption position={{ x: '0px', y: '-62px' }}>
                      <Box sx={{ width: '60px', height: '30px' }}></Box>
                    </SelectOption>
                    <TypePickerText variant='h6'>SUV's</TypePickerText>
                  </Box>
                </Stack>
                <Stack direction='row' gap={3} justifyContent='center'>
                  <Box onClick={() => handleSelect('van')}>
                    <SelectOption position={{ x: '-75px', y: '0px' }}>
                      <Box sx={{ width: '60px', height: '30px' }}></Box>
                    </SelectOption>
                    <TypePickerText variant='h6'>Minivans</TypePickerText>
                  </Box>
                  <Box onClick={() => handleSelect('truck')}>
                    <SelectOption position={{ x: '-75px', y: '-30px' }}>
                      <Box sx={{ width: '60px', height: '30px' }}></Box>
                    </SelectOption>
                    <TypePickerText variant='h6'>Trucks</TypePickerText>
                  </Box>
                </Stack>
              </Stack>
            </Box>
            {matches ? (
              <>
                <Box>
                  <Typography variant='h4' mb={3} mt={4} textAlign='center'>
                    Reservation Status
                  </Typography>
                </Box>

                <Box>
                  <ReservationTimeline />
                </Box>
              </>
            ) : null}
          </Stack>
          <Box sx={{ flex: 4 }}>
            <Stack gap={10} mt={5} mb={5}>
              {data?.data
                ?.filter((vehicle) => isAvailable(vehicle))
                .map((vehicle) => (
                  <Card
                    sx={{ backgroundColor: theme.palette.secondary.dark }}
                    key={vehicle.id}
                  >
                    <CardMedia
                      component='img'
                      height='200'
                      image={vehicle.attributes.primaryImg}
                    />
                    <CardContent>
                      <Typography variant='h4' textAlign='center'>
                        {vehicle.attributes.make} {vehicle.attributes.model}
                      </Typography>
                      <Typography variant='h5' textAlign='center' mt={3}>
                        ${vehicle.attributes.dailyRate} / day
                      </Typography>
                    </CardContent>
                    <CardActions
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Button
                        variant='contained'
                        onClick={() => handleCarSelect(vehicle.id)}
                      >
                        Book Now
                      </Button>
                    </CardActions>
                  </Card>
                ))}
            </Stack>
          </Box>
        </Stack>
      </Container>
    </div>
  );
};

export default Cars;
