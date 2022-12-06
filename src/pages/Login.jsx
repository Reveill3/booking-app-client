import { useTheme } from '@emotion/react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const Login = () => {
  const theme = useTheme();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    console.log('Logging in...');
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
      <Link to='/register' style={{ textDecoration: 'none' }}>
        <Typography variant='body1' color={theme.palette.secondary.dark}>
          Create an account
        </Typography>
      </Link>
      <Button
        variant='contained'
        sx={{ width: '100px', marginBottom: '20px' }}
        onClick={handleLogin}
      >
        Login
      </Button>
    </Box>
  );
};

export default Login;
