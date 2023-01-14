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
import { useNavigate } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import { useContext, useState } from 'react';
import moment from 'moment';
import { BookingContext } from '../context/BookingContext';
import axios from 'axios';
import { useEffect } from 'react';
import Skeleton from '@mui/material/Skeleton';

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

  const { state, dispatch } = useContext(BookingContext);
  const { startDate, endDate } = state;
  const [cars, setCars] = useState([]);
  const [availableLoading, setAvailableLoading] = useState(false);

  const filterStart = moment(startDate).startOf('month').toDate();

  const { data, loading, error, reFetch } = useFetch(
    `/cars?populate=*&filters[type][$eq]=${selectedType}`
  );

  const handleCarSelect = async (id, vehicle) => {
    dispatch({ type: 'SET_VEHICLE', payload: id });
    // push event to GTM
    window.dataLayer.push({
      event: 'checkout_view',
      customData: {
        vehicle: id,
      },
    });
    try {
      const logged = await axios.post(
        'https://api.logsnag.com/v1/log',
        {
          project: 'revrentals',
          channel: `interactions`,
          event: 'View Checkout',
          description: `User viewed checkout page for ${vehicle.make} ${vehicle.model}`,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.REACT_APP_LOGSNAG_KEY}`,
          },
        }
      );
    } catch (error) {
      console.log(error);
    }

    const startEndRemoved = alldates;
    startEndRemoved.splice(0, 2);
    const state = {
      allDates: startEndRemoved,
    };
    if (localStorage.getItem('token')) {
      navigate('/checkout', { state });
      return;
    }
    dispatch({ type: 'NEW_CUSTOMER', payload: true });
    navigate('/register', { state });
    return;
  };

  const handleSelect = (type) => {
    setSelectedType(type);
    reFetch();
  };

  // Create array of days between start and end date where vehicle is unavailable
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

  const alldates = getDatesInRange(startDate, endDate);

  const isAvailable = async (vehicle) => {
    const isAvailable = await axios.post('/api/car/isAvailable', {
      id: vehicle,
      start_date: startDate,
      end_date: endDate,
    });
    return isAvailable.data;
  };

  useEffect(() => {
    setAvailableLoading(true);
    const addAvailability = async () => {
      const filteredCars = await Promise.all(
        data.data.map(async (car) => {
          const available = await isAvailable(car.id);
          return {
            ...car,
            available,
          };
        })
      );

      setCars(filteredCars.filter((car) => car.available));
    };
    if (data) {
      addAvailability();
      setAvailableLoading(false);
    }
  }, [data]);

  return (
    <div>
      <Container maxWidth='md'>
        <Typography
          variant='h4'
          mb={3}
          mt={4}
          textAlign='center'
          justifyContent='center'
          alignItems='center'
        >
          Available Vehicles
        </Typography>
        <Stack
          direction={matches ? 'row' : 'column'}
          sx={{ justifyContent: 'space-between' }}
        >
          {/* Type Picker */}
          {/* <Stack sx={{ flex: 2 }}>
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
          </Stack> */}
          <Box sx={{ flex: 4 }}>
            <Stack gap={10} mt={5} mb={5}>
              {availableLoading || loading ? (
                <>
                  <Skeleton variant='rectangular' width={723} height={350} />
                  <Skeleton variant='rectangular' width={723} height={350} />
                </>
              ) : (
                cars.map((vehicle) => (
                  <Card
                    sx={{
                      backgroundColor: theme.palette.secondary.dark,
                      borderRadius: '25px',
                    }}
                    key={vehicle.id}
                    raised
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
                        sx={{
                          '$:hover': {
                            backgroundColor: theme.palette.primary.hover,
                          },
                        }}
                        variant='contained'
                        onClick={() =>
                          handleCarSelect(vehicle.id, vehicle.attributes)
                        }
                      >
                        Book Now
                      </Button>
                    </CardActions>
                  </Card>
                ))
              )}
            </Stack>
          </Box>
        </Stack>
      </Container>
    </div>
  );
};

export default Cars;
