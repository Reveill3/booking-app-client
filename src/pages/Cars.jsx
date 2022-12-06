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

const cars = [
  {
    id: 1,
    make: 'Toyota',
    model: 'Camry',
    year: 2021,
    unavailableDates: [],
    dailyRate: 50,
    primaryImg:
      'https://res.cloudinary.com/dgplbptdj/image/upload/v1669926365/Booking%20App/Vehicles/Tesla_Creative_1_zzqhcj.jpg',
    images: [],
    type: 'car',
  },
  {
    id: 2,
    make: 'Tesla',
    model: 'Model 3',
    year: 2021,
    unavailableDates: [],
    dailyRate: 50,
    primaryImg:
      'https://res.cloudinary.com/dgplbptdj/image/upload/v1669926365/Booking%20App/Vehicles/Tesla_Creative_1_zzqhcj.jpg',
    images: [],
    type: 'car',
  },
  {
    id: 3,
    make: 'Subaru',
    model: 'Outback',
    year: 2021,
    unavailableDates: [],
    dailyRate: 50,
    primaryImg:
      'https://res.cloudinary.com/dgplbptdj/image/upload/v1669926392/Booking%20App/Vehicles/Subaru_Creative_1_cpfeqi.jpg',
    images: [],
    type: 'suv',
  },
  {
    id: 4,
    make: 'Maxda',
    model: 'CX-30',
    year: 2021,
    unavailableDates: [],
    dailyRate: 50,
    primaryImg:
      'https://res.cloudinary.com/dgplbptdj/image/upload/v1669926385/Booking%20App/Vehicles/CX-30_Creative_1_gqqihy.jpg',
    images: [],
    type: 'suv',
  },
];

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
  const theme = useTheme();
  const matches = useMediaQuery(useTheme().breakpoints.up('md'));
  const navigate = useNavigate();

  const handleCarSelect = (id) => {
    navigate('/info', { state: { id } });
  };

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
                  <Box>
                    <SelectOption position={{ x: '0px', y: '0px' }}>
                      <Box sx={{ width: '60px', height: '30px' }}></Box>
                    </SelectOption>
                    <TypePickerText variant='h6'>Cars</TypePickerText>
                  </Box>
                  <Box>
                    <SelectOption position={{ x: '0px', y: '-62px' }}>
                      <Box sx={{ width: '60px', height: '30px' }}></Box>
                    </SelectOption>
                    <TypePickerText variant='h6'>SUV's</TypePickerText>
                  </Box>
                </Stack>
                <Stack direction='row' gap={3} justifyContent='center'>
                  <Box>
                    <SelectOption position={{ x: '-75px', y: '0px' }}>
                      <Box sx={{ width: '60px', height: '30px' }}></Box>
                    </SelectOption>
                    <TypePickerText variant='h6'>Minivans</TypePickerText>
                  </Box>
                  <Box>
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
              {cars.map((vehicle) => (
                <Card
                  sx={{ backgroundColor: theme.palette.secondary.dark }}
                  key={vehicle.id}
                >
                  <CardMedia
                    component='img'
                    height='200'
                    image={vehicle.primaryImg}
                  />
                  <CardContent>
                    <Typography variant='h4' textAlign='center'>
                      {vehicle.make} {vehicle.model}
                    </Typography>
                    <Typography variant='h5' textAlign='center' mt={3}>
                      ${vehicle.dailyRate} / day
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
