import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Container, IconButton, Slide, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import { Link, useNavigate } from 'react-router-dom';
import { DateTime } from 'luxon';
import useFetch from '../hooks/useFetch';
import axios from 'axios';
import { useRef, useState } from 'react';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import { Box } from '@mui/system';

const Reservations = () => {
  const containerRef = useRef(null);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const {
    data: reservations,
    loading,
    error,
    reFetch,
  } = useFetch('/reservations/me');

  const navigate = useNavigate();

  const startDelete = () => {
    setDeleteConfirm(true);
  };

  // function to delete reservation and associated unavailable dates from strapi db
  const handleDelete = async (id) => {
    try {
      await axios.post(
        `/api/reservations/me/${id}`,
        {
          entity: 'api::reservation.reservation',
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      reFetch();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Container maxWidth='lg' sx={{ marginTop: '50px', marginBottom: '50px' }}>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label='simple table'>
          <TableHead>
            <TableRow>
              <TableCell>Start Time</TableCell>
              <TableCell>End Time</TableCell>
              <TableCell>Vehicle</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reservations?.map((reservation) => {
              return (
                <TableRow key={reservation.id}>
                  <TableCell>
                    {DateTime.fromISO(reservation.start).toLocaleString(
                      DateTime.DATETIME_MED
                    )}
                  </TableCell>
                  <TableCell>
                    {DateTime.fromISO(reservation.end).toLocaleString(
                      DateTime.DATETIME_MED
                    )}
                  </TableCell>
                  <TableCell>
                    {`${reservation.car.make} ${reservation.car.model} ${reservation.car.year}`}
                  </TableCell>
                  {reservation.status === 'awaiting_session_complete' && (
                    <TableCell>
                      <a href={reservation.stripeUrl}>
                        <IconButton>
                          <CreditCardIcon />
                        </IconButton>
                      </a>
                    </TableCell>
                  )}
                  <TableCell>
                    <IconButton
                      onClick={() =>
                        navigate(`/user/reservations/${reservation.id}`, {
                          state: {
                            reservation: {
                              ...reservation,
                            },
                          },
                        })
                      }
                    >
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                  <TableCell ref={containerRef}>
                    <Slide
                      direction='right'
                      in={!deleteConfirm}
                      mountOnEnter
                      unmountOnExit
                      container={containerRef.current}
                      appear={false}
                    >
                      <IconButton>
                        <DeleteIcon onClick={startDelete} />
                      </IconButton>
                    </Slide>
                    <Slide
                      direction='left'
                      in={deleteConfirm}
                      mountOnEnter
                      unmountOnExit
                    >
                      <Box>
                        <IconButton>
                          <CheckIcon color='success' />
                        </IconButton>
                        <IconButton onClick={() => setDeleteConfirm(false)}>
                          <ClearIcon color='error' />
                        </IconButton>
                        <Typography variant='caption'>
                          Are you sure you want to delete?
                        </Typography>
                      </Box>
                    </Slide>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default Reservations;
