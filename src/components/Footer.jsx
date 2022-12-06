import { useTheme } from '@emotion/react';
import { Box } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';

const admin = {
  instagramurl: 'https://www.instagram.com/revrentalsdfw',
  facebookurl: 'https://www.facebook.com/revrentals',
};

const Footer = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        width: '100%',
        backgroundColor: theme.palette.primary.light,
        height: '200px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: { sm: '0 40px', xs: '0 20px' },
      }}
    >
      <Link to='/privacy' style={{ color: 'white' }}>
        Privacy Policy
      </Link>
      <Link to='/privacy' style={{ color: 'white' }}>
        Contact Us
      </Link>
      <Stack direction='row'>
        <IconButton size='large' onClick={() => window.open(admin.facebookurl)}>
          <FacebookIcon sx={{ color: 'white' }} fontSize='large' />
        </IconButton>
        <IconButton
          size='large'
          onClick={() => window.open(admin.instagramurl)}
        >
          <InstagramIcon sx={{ color: 'white' }} fontSize='large' />
        </IconButton>
      </Stack>
    </Box>
  );
};

export default Footer;
