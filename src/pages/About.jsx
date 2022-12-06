import { useTheme } from '@emotion/react';
import { Box, Typography, useMediaQuery } from '@mui/material';
import { Stack } from '@mui/system';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';

const About = () => {
  const theme = useTheme();

  const matches = useMediaQuery(theme.breakpoints.up('sm'));

  return (
    <Box>
      <Stack
        sx={{
          gap: '40px',
          overflow: 'hidden',
          paddingTop: matches ? 0 : '40px',
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
        <Typography
          variant={matches ? 'h6' : 'subtitle1'}
          color={theme.palette.primary.dark}
          mt={5}
        >
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam maximus
          eget purus vitae laoreet. Mauris id purus a nisl posuere pretium. Nunc
          a velit nec ante dignissim volutpat ut ac nibh. Sed sodales sit amet
          felis et feugiat. Nunc ullamcorper, odio quis ullamcorper tempus, leo
          nisl euismod neque, eu pellentesque lorem tellus eu elit. Pellentesque
          et lorem elementum, lacinia sem ut, hendrerit lacus. Vestibulum
          faucibus non odio tempor ornare. Vivamus eget dui nisi. Nunc lorem
          tortor, varius vitae massa a, egestas molestie odio. Quisque viverra
          sapien mi. Sed vitae lectus in tortor dignissim malesuada.
        </Typography>
        <Box sx={{ display: matches ? 'block' : 'none' }}>
          <Box
            sx={{
              paddingTop: '100px',
              width: '100%',
              textAlign: 'center',
            }}
          >
            <Typography variant='h2' color={theme.palette.primary.dark}>
              Featured Vehicle
            </Typography>
          </Box>
          <Card
            sx={{
              backgroundColor: theme.palette.secondary,
            }}
          >
            <CardMedia
              component='img'
              image='https://res.cloudinary.com/ddq3k3ntz/image/upload/v1669394139/Rev%20Rentals/Tesla_Creative_1_ir1osw.jpg'
              height='500'
            />
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography gutterBottom variant='h3' component='div'>
                Tesla Model 3
              </Typography>
            </CardContent>
            <CardActions sx={{ justifyContent: 'center' }}>
              <Button size='large' variant='contained' fullWidth>
                Book Now
              </Button>
            </CardActions>
          </Card>
        </Box>
      </Stack>
    </Box>
  );
};

export default About;
