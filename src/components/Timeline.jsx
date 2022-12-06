import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import { Typography } from '@mui/material';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import PaymentIcon from '@mui/icons-material/Payment';
import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';

const StyledDot = styled(TimelineDot)(({ theme }) => ({
  cursor: 'pointer',
  margin: '7px',
}));

export default function ReservationTimeline() {
  const navigate = useNavigate();

  return (
    <Timeline position='left'>
      <TimelineItem>
        <TimelineSeparator>
          <StyledDot color='secondary' onClick={() => navigate('/')}>
            <LocationCityIcon />
          </StyledDot>
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent>
          <Typography variant='h5'>Location and Dates</Typography>
        </TimelineContent>
      </TimelineItem>
      <TimelineItem>
        <TimelineSeparator>
          <StyledDot color='success' onClick={() => navigate('/cars')}>
            <DirectionsCarIcon />
          </StyledDot>
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent>
          <Typography variant='h5'>Select A Vehicle</Typography>
        </TimelineContent>
      </TimelineItem>
      <TimelineItem>
        <TimelineSeparator>
          <StyledDot color='secondary' onClick={() => navigate('/info')}>
            <PermIdentityIcon />
          </StyledDot>
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent>
          <Typography variant='h5'>Enter Information</Typography>
        </TimelineContent>
      </TimelineItem>
      <TimelineItem>
        <TimelineSeparator>
          <StyledDot color='secondary' onClick={() => navigate('/checkout')}>
            <PaymentIcon />
          </StyledDot>
        </TimelineSeparator>
        <TimelineContent>
          <Typography variant='h5'>Terms/Payment</Typography>
        </TimelineContent>
      </TimelineItem>
    </Timeline>
  );
}
