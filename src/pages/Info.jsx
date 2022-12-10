import {
  Container,
  TextField,
  Box,
  Stack,
  Typography,
  Button,
} from '@mui/material';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { IconButton } from '@mui/material';
import ReservationTimeline from '../components/Timeline';
import { useState } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Info = () => {
  const [password2, setPassword2] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [textError, setTextError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [takenError, setTakenError] = useState(false);
  const [emailError, setEmailError] = useState(false);

  const [inputs, setInputs] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
    password: '',
  });

  const matches = useMediaQuery(useTheme().breakpoints.up('sm'));

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPasswordError(false);
    setTextError(false);
    setEmailError(false);
    setErrorMessage('');
    setTakenError(false);
    Object.keys(inputs).forEach((key) => {
      if (inputs[key] === '') {
        setTextError(true);
        setErrorMessage('Please fill out all fields');
        return;
      }
    });
    if (inputs.password !== password2) {
      setPasswordError(true);
      setErrorMessage('Passwords do not match');
      return;
    }
    if (!inputs.email.includes('@')) {
      setEmailError(true);
      setErrorMessage('Please enter a valid email');
      return;
    }
    if (!textError && !passwordError && !emailError) {
      try {
        const user = await axios.post('/api/auth/local/register', {
          ...inputs,
          username: inputs.email,
        });
        console.log(user);
        localStorage.setItem('token', user.data.jwt);
        navigate('/checkout');
      } catch (error) {
        setTakenError(true);
        console.log(error);
      }
    }
  };

  return (
    <Container maxWidth='lg'>
      <Box sx={{ display: 'flex', marginTop: '50px', marginBottom: '50px' }}>
        {matches ? (
          <Box sx={{ flex: 3 }}>
            <ReservationTimeline />
          </Box>
        ) : null}
        <Stack sx={{ flex: 4 }} gap={5}>
          <Box gap={5} display='flex'>
            <TextField
              error={textError}
              name='first_name'
              value={inputs.first_name}
              label='First Name'
              variant='outlined'
              onChange={handleChange}
              helperText={textError ? 'All fields must be filled out.' : ''}
            />
            <TextField
              error={textError}
              name='last_name'
              value={inputs.last_name}
              label='Last Name'
              variant='outlined'
              onChange={handleChange}
              helperText={textError ? 'All fields must be filled out.' : ''}
            />
          </Box>
          <TextField
            error={textError || emailError || takenError}
            name='email'
            type='email'
            value={inputs.email}
            label='Email'
            variant='outlined'
            onChange={handleChange}
            helperText={
              textError
                ? 'All fields must be filled out.'
                : emailError
                ? 'Please enter a valid email'
                : takenError
                ? 'Email is already taken'
                : ''
            }
          />
          <TextField
            error={textError}
            name='phone'
            value={inputs.phone}
            label='Phone'
            variant='outlined'
            onChange={handleChange}
            helperText={textError ? 'All fields must be filled out.' : ''}
          />
          <TextField
            error={textError}
            name='address'
            value={inputs.address}
            label='Address(As on Credit Card)'
            variant='outlined'
            onChange={handleChange}
            helperText={textError ? 'All fields must be filled out.' : ''}
          />
          <TextField
            error={passwordError || textError}
            name='password'
            type='password'
            value={inputs.password}
            label='Password'
            variant='outlined'
            onChange={handleChange}
            helperText={
              passwordError
                ? 'Passwords do not match'
                : textError
                ? 'All fields must be filled out.'
                : ''
            }
          />
          <TextField
            error={passwordError || textError}
            type='password'
            name='password2'
            value={password2}
            label='Password Confirmation'
            variant='outlined'
            onChange={(e) => setPassword2(e.target.value)}
            helperText={
              passwordError
                ? 'Passwords do not match'
                : textError
                ? 'All fields must be filled out.'
                : ''
            }
          />
          <Button variant='contained' onClick={handleSubmit}>
            Continue to Terms/Payment
          </Button>
        </Stack>
      </Box>
    </Container>
  );
};

export default Info;
