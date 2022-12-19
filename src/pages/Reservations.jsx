import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Container, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import { Link, useNavigate } from 'react-router-dom';
import { DateTime } from 'luxon';
import useFetch from '../hooks/useFetch';
import axios from 'axios';

const Reservations = () => {
  const {
    data: reservations,
    loading,
    error,
    reFetch,
  } = useFetch('/reservations/me');

  const navigate = useNavigate();

  const handleDelete = () => {
    console.log('delete');
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
                  <TableCell>
                    <a href={reservation.stripeUrl}>
                      <IconButton>
                        <CreditCardIcon />
                      </IconButton>
                    </a>
                  </TableCell>
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
                  <TableCell>
                    <IconButton>
                      <DeleteIcon onClick={handleDelete} />
                    </IconButton>
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
