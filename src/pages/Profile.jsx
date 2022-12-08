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
import { useEffect, useState } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { FileUploader } from 'react-drag-drop-files';
import ClearIcon from '@mui/icons-material/Clear';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import useFetch from '../hooks/useFetch';
import axios from 'axios';

const user = {
  id: 1,
};

const Profile = () => {
  const { data, loading, error } = useFetch(`/api/users/me`, 'auth');

  const [inputs, setInputs] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    insurance: [],
    files: [],
  });

  const [insuranceError, setInsuranceError] = useState(false);
  const [uploadError, setUploadError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const matches = useMediaQuery(useTheme().breakpoints.up('sm'));

  const navigate = useNavigate();
  useEffect(() => {
    setInputs({
      firstName: data?.first_name,
      lastName: data?.last_name,
      email: data?.email,
      phone: data?.phone,
      address: data?.address,
      insurance1: data?.insurance1,
      insurance2: data?.insurance2,
      files: [],
    });
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value);
    setInputs((prev) => {
      console.log(prev);
      return { ...prev, [name]: value };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (inputs.files.length > 0) {
        const insuranceData = new FormData();
        insuranceData.append('files', inputs.files[0]);
        if (inputs.files[1]) {
          insuranceData.append('files', inputs.files[1]);
        }
        const insurance = await axios.post(
          `${process.env.REACT_APP_API_URL}/upload`,
          insuranceData,
          {
            headers: {
              Authorization: 'Bearer ' + localStorage.getItem('token'),
            },
          }
        );
        const updated = await axios.put(
          `${process.env.REACT_APP_API_URL}/user/me`,

          {
            first_name: inputs.firstName,
            last_name: inputs.lastName,
            email: inputs.email,
            phone: inputs.phone,
            address: inputs.address,
            insurance1: insurance?.data[0]?.url,
            insurance2: insurance?.data[1]?.url,
          },
          {
            headers: {
              Authorization: 'Bearer ' + localStorage.getItem('token'),
            },
          }
        );
        return;
      }

      const updated = await axios.put(
        `${process.env.REACT_APP_API_URL}/user/me`,

        {
          first_name: inputs.firstName,
          last_name: inputs.lastName,
          email: inputs.email,
          phone: inputs.phone,
          address: inputs.address,
        },
        {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token'),
          },
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleFileAdd = (newFiles) => {
    console.log(newFiles);
    setInsuranceError(false);
    setInputs((prev) => ({ ...prev, files: [...prev.files, ...newFiles] }));
  };

  console.log(inputs.files);
  return (
    <Container maxWidth='lg'>
      <Box sx={{ display: 'flex', marginTop: '50px', marginBottom: '50px' }}>
        <Stack sx={{ flex: 4 }} gap={5}>
          <Box gap={5} display='flex'>
            <TextField
              name='firstName'
              value={inputs.firstName}
              label='First Name'
              variant='outlined'
              onChange={handleChange}
            />
            <TextField
              name='lastName'
              value={inputs.lastName}
              label='Last Name'
              variant='outlined'
              onChange={handleChange}
            />
          </Box>
          <TextField
            name='email'
            value={inputs.email}
            label='Email'
            variant='outlined'
            onChange={handleChange}
          />
          <TextField
            name='phone'
            value={inputs.phone}
            label='Phone'
            variant='outlined'
            onChange={handleChange}
          />
          <TextField
            name='address'
            value={inputs.address}
            label='Address'
            variant='outlined'
            onChange={handleChange}
          />
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            <Typography variant='h6'>
              Insurance Card (Two Files Only)
            </Typography>
            <FileUploader
              types={['png', 'jpg', 'pdf']}
              handleChange={handleFileAdd}
              multiple
              onTypeError={() => {
                setInsuranceError(true);
                setErrorMessage('File type not supported');
              }}
              children={
                <Box
                  sx={{
                    border: '5px dotted black',
                    height: '150px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    padding: '10px',
                  }}
                >
                  {inputs.files?.length > 0 ? (
                    inputs.files.map((file) => {
                      return (
                        <Box
                          sx={{
                            position: 'relative',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexDirection: 'column',
                          }}
                        >
                          {file.type === 'application/pdf' ? (
                            <PictureAsPdfIcon sx={{ fontSize: '50px' }} />
                          ) : (
                            <InsertPhotoIcon sx={{ fontSize: '50px' }} />
                          )}
                          <Typography variant='subtitle1' textAlign='center'>
                            {file.name}
                          </Typography>
                          <IconButton
                            sx={{
                              position: 'absolute',
                              top: '-5px',
                              right: '-5px',
                            }}
                            onClick={(e) => {
                              setInputs((prev) => ({
                                ...prev,
                                files: prev.files.filter((f) => f !== file),
                              }));
                            }}
                          >
                            <ClearIcon color='error' />
                          </IconButton>
                        </Box>
                      );
                    })
                  ) : (
                    <Box sx={{ cursor: 'pointer' }}>
                      <Box sx={{ width: '100%', textAlign: 'center' }}>
                        <AttachFileIcon
                          sx={{
                            fontSize: '50px',
                          }}
                        />
                      </Box>
                      <Typography variant='subtitle2'>
                        Drag and Drop Insurance Card Images
                      </Typography>
                    </Box>
                  )}
                </Box>
              }
            />
            {insuranceError && (
              <Typography color='error' variant='subtitle2'>
                {errorMessage}
              </Typography>
            )}
          </Box>
          <Button variant='contained' onClick={handleSubmit}>
            Update Info
          </Button>
        </Stack>
      </Box>
    </Container>
  );
};

export default Profile;
