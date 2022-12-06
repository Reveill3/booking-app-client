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
import { useState } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { FileUploader } from 'react-drag-drop-files';
import ClearIcon from '@mui/icons-material/Clear';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';

const user = {
  id: 1,
};

const Profile = () => {
  const { data, loading, error } = {
    data: {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'test@test.net',
      phone: '123-456-7890',
      address: '123 Main St',
      insurance1: 'https://picsum.photos/200',
      insurance2: 'https://picsum.photos/200',
    },
    loading: false,
    error: null,
  };

  const [firstName, setFirstName] = useState(data?.firstName || '');
  const [lastName, setLastName] = useState(data?.lastName || '');
  const [email, setEmail] = useState(data?.email || '');
  const [phone, setPhone] = useState(data?.phone || '');
  const [address, setAddress] = useState(data?.address || '');
  const [files, setFiles] = useState([]);
  const [insuranceError, setInsuranceError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const matches = useMediaQuery(useTheme().breakpoints.up('sm'));

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('submitting...');
  };

  const handleFileAdd = (newFiles) => {
    setInsuranceError(false);
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
  };

  console.log(files);

  return (
    <Container maxWidth='lg'>
      <Box sx={{ display: 'flex', marginTop: '50px', marginBottom: '50px' }}>
        <Stack sx={{ flex: 4 }} gap={5}>
          <Box gap={5} display='flex'>
            <TextField
              name='firstName'
              value={firstName}
              label='First Name'
              variant='outlined'
              onChange={handleChange}
              placeholder={data.firstName}
            />
            <TextField
              name='lastName'
              value={lastName}
              label='Last Name'
              variant='outlined'
              onChange={handleChange}
              placeholder={data.lastName}
            />
          </Box>
          <TextField
            name='email'
            value={email}
            label='Email'
            variant='outlined'
            onChange={handleChange}
            placeholder={data.email}
          />
          <TextField
            name='phone'
            value={phone}
            label='Phone'
            variant='outlined'
            onChange={handleChange}
            placeholder={data.phone}
          />
          <TextField
            name='address'
            value={address}
            label='Address'
            variant='outlined'
            onChange={handleChange}
            placeholder={data.address}
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
                  {files.length > 0 ? (
                    files.map((file) => {
                      const img = URL.createObjectURL(file);
                      console.log(file);
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
                              setFiles((prevFiles) =>
                                prevFiles.filter((f) => f !== file)
                              );
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
