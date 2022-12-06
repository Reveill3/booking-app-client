import styled from '@emotion/styled';
import { Button, Toolbar, Typography } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import ButtonGroup from '@mui/material/ButtonGroup';
import { useTheme } from '@mui/material/styles';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Box } from '@mui/system';

const StyledToolbar = styled(Toolbar)({
  display: 'flex',
  justifyContent: 'space-between',
});

const SpacedButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.main,
  color: theme.palette.primary.main,
}));

const StyledLink = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  display: 'none',
  [theme.breakpoints.up('sm')]: {
    display: 'flex',
    justifyContent: 'space-between',
  },
}));

const MobileMenu = styled(IconButton)(({ theme }) => ({
  display: 'none',
  [theme.breakpoints.down('sm')]: {
    display: 'flex',
  },
}));

const DesktopButtonGroup = styled(ButtonGroup)(({ theme }) => ({
  boxShadow: '0px 0px 0px 0px',
  gap: theme.spacing(2),
  [theme.breakpoints.down('sm')]: {
    display: 'none',
  },
}));

const user = {
  id: 1,
  name: 'John Doe',
  email: 'test@test.net',
  reservations: [
    {
      id: 1,
      car: {
        id: 1,
        make: 'Ford',
        model: 'Mustang',
      },
    },
  ],
};

const NavBar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const theme = useTheme();
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const path = useLocation().pathname;

  const notAuth = path !== '/login' && path !== '/register';
  return (
    <div>
      <AppBar position='static'>
        <StyledToolbar>
          {/* Mobile Menu Button*/}
          {notAuth ? (
            <MobileMenu
              onClick={handleClick}
              sx={{ flex: 1, justifyContent: 'left' }}
            >
              <MenuIcon sx={{ color: 'white' }} />
            </MobileMenu>
          ) : null}
          <Box sx={{ display: { sm: 'none' }, flex: 3 }}>
            <Link style={{ textDecoration: 'none' }} to='/'>
              <Typography variant='h4' color='secondary'>
                Rev Rentals
              </Typography>
            </Link>
          </Box>

          <StyledLink to='/'>
            <img
              src='https://res.cloudinary.com/ddq3k3ntz/image/upload/v1669392582/Rev%20Rentals/White_logo_-_no_background_gbijh5.png'
              alt='logo'
              height={100}
              width={200}
            />
          </StyledLink>

          {notAuth ? (
            <DesktopButtonGroup variant='contained'>
              {user ? (
                <>
                  <Link
                    style={{ textDecoration: 'none' }}
                    to='/user/reservations'
                  >
                    <SpacedButton>Reservations</SpacedButton>
                  </Link>
                  <Link style={{ textDecoration: 'none' }} to='/user/profile'>
                    <SpacedButton>Profile</SpacedButton>
                  </Link>{' '}
                </>
              ) : (
                <>
                  <Link style={{ textDecoration: 'none' }} to='/login'>
                    <SpacedButton>Login</SpacedButton>
                  </Link>
                  <Link style={{ textDecoration: 'none' }} to='/register'>
                    <SpacedButton>Register</SpacedButton>
                  </Link>{' '}
                </>
              )}
            </DesktopButtonGroup>
          ) : null}
        </StyledToolbar>
      </AppBar>
      {/* Mobile Friendly Menu */}
      <Menu open={open} anchorEl={anchorEl} onClose={handleClose}>
        <MenuItem>
          <Link style={{ textDecoration: 'none' }} to='/login'>
            <SpacedButton
              sx={{ width: '100%' }}
              onClick={() => setAnchorEl(null)}
            >
              Login
            </SpacedButton>
          </Link>
        </MenuItem>
        <MenuItem>
          <Link style={{ textDecoration: 'none' }} to='/login'>
            <SpacedButton onClick={() => setAnchorEl(null)}>
              Register
            </SpacedButton>
          </Link>
        </MenuItem>
      </Menu>
    </div>
  );
};

export default NavBar;
