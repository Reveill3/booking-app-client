import { useTheme } from '@emotion/react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const Register = () => {
  const theme = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');

  const handleRegister = () => {
    console.log('Registering...');
  };
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '20px',
      }}
    >
      <TextField
        id='email'
        label='Email'
        variant='outlined'
        sx={{ marginTop: '30px' }}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <TextField
        id='password'
        label='Password'
        variant='outlined'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <TextField
        id='password2'
        label='Confirm Password'
        variant='outlined'
        value={password2}
        onChange={(e) => setPassword2(e.target.value)}
      />
      <Link to='/login' style={{ textDecoration: 'none' }}>
        <Typography variant='body1' color={theme.palette.secondary.dark}>
          Already have an account? Login
        </Typography>
      </Link>
      <Button
        variant='contained'
        sx={{ width: '100px', marginBottom: '20px' }}
        onClick={handleRegister}
      >
        Register
      </Button>
    </Box>
  );
};

export default Register;
