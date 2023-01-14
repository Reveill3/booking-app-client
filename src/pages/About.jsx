import { useTheme } from '@emotion/react';
import { Box, Typography, useMediaQuery } from '@mui/material';
import { Stack } from '@mui/system';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import useFetch from '../hooks/useFetch';
import { useContext, useState } from 'react';
import { BookingContext } from '../context/BookingContext';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const About = () => {
  const { data, loading, error } = useFetch('/cars?[filters][featured]=true');

  const [carSelected, setCarSelected] = useState(false);
  const theme = useTheme();

  //use booking context
  const { dispatch } = useContext(BookingContext);

  // funtion to update booking context with id of selected car
  const selectCar = (id) => {
    if (carSelected) {
      setCarSelected(false);
      dispatch({
        type: 'SET_VEHICLE',
        payload: null,
      });
      return;
    }
    setCarSelected(true);
    dispatch({
      type: 'SET_VEHICLE',
      payload: id,
    });
  };

  const matches = useMediaQuery(theme.breakpoints.up('sm'));
  return (
    <Box sx={{ paddingBottom: '20px' }}>
      <Stack
        sx={{
          gap: '40px',
          paddingTop: matches ? 0 : '40px',
          height: '100%',
        }}
      >
        <Box
          sx={{
            marginTop: matches ? 0 : '75px',
            paddingTop: '100px',
            width: '100%',
            textAlign: 'center',
          }}
        >
          <Typography
            variant={matches ? 'h1' : 'h2'}
            fontWeight={400}
            color={theme.palette.primary.dark}
          >
            Mobility. Delivered.
          </Typography>
        </Box>
        <Typography variant='h4' component='h1' textAlign='center'>
          Explore Dallas-Fort Worth and beyond with our reliable car rentals
        </Typography>
        <Typography
          variant={matches ? 'h6' : 'subtitle1'}
          color={theme.palette.primary.dark}
          mt={5}
        >
          Looking for an affordable and reliable car rental in the Dallas-Fort
          Worth area? Our local car rental company offers several vehicles to
          suit your needs and budget. Whether you're visiting for business or
          planning a road trip adventure, we have the perfect rental car for
          you. Convenient pick-up and drop-off locations, including Dallas-Fort
          Worth International Airport, makes renting a car from us easy. Trust
          in our commitment to a personable customer service for a hassle-free
          car rental experience in Dallas-Fort Worth.
        </Typography>
        <Box
          sx={{
            display: matches ? 'flex' : 'none',
            flexDirection: 'column',
            width: '100%',
          }}
        >
          <Box
            sx={{
              paddingTop: '20px',
              paddingBottom: '20px',
              width: '100%',
              textAlign: 'center',
            }}
          >
            <Typography variant='h2' color={theme.palette.primary.dark}>
              Featured Vehicle
            </Typography>
          </Box>

          <Card
            key={data?.data[0].id}
            sx={{
              backgroundColor: theme.palette.secondary,
            }}
          >
            <CardMedia
              component='img'
              image={data?.data[0].attributes.primaryImg}
              height='500'
            />
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography gutterBottom variant='h3' component='div'>
                {data?.data[0].attributes.make} {data?.data[0].attributes.model}
              </Typography>
            </CardContent>
            <CardActions sx={{ justifyContent: 'center' }}>
              <Button
                size='large'
                variant='contained'
                color={carSelected ? 'success' : 'primary'}
                fullWidth
                onClick={() => selectCar(data?.data[0].id)}
                sx={{
                  '&:hover': { backgroundColor: theme.palette.primary.hover },
                }}
              >
                {carSelected ? (
                  <>
                    <CheckCircleIcon />
                    <Typography variant='button' sx={{ ml: 1 }}>
                      Select Dates/Location above and check availability
                    </Typography>
                  </>
                ) : (
                  'Select Car'
                )}
              </Button>
            </CardActions>
          </Card>
        </Box>
      </Stack>
    </Box>
  );
};

export default About;
