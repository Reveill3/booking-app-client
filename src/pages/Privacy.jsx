import { Typography } from '@mui/material';
import { Box, Container } from '@mui/system';
import React from 'react';

const Privacy = () => {
  return (
    <Container maxWidth='md'>
      <Box
        display='flex'
        flexDirection='column'
        alignItems='center'
        justifyContent='center'
        gap={3}
      >
        <Typography variant='h3'>
          Privacy Policy for Rev Rentals, LLC
        </Typography>
        <Typography variant='h4'>Personal Information</Typography>
        <Typography variant='body'>
          We do not collect personal information beyond the user name and email
          address you provide. We do not share this information with any third
          parties. All reasonable practices are in place to ensure confidential
          storage and handling of personal information. You understand that your
          content (not including credit card information), may be transferred
          unencrypted and involve (a) transmissions over various networks; and
          (b) changes to conform and adapt to technical requirements of
          connecting networks or devices. We do not have access to your credit
          card information; this is managed by our payment gateway providers.
          All credit/debit cards details and personally identifiable information
          will NOT be stored, sold, shared, rented or leased to any third
          parties The Website Policies and Terms & Conditions may be changed or
          updated occasionally to meet the requirements and standards. Therefore
          the Customers’ are encouraged to frequently visit these sections in
          order to be updated about the changes on the website. Modifications
          will be effective on the day they are posted
        </Typography>
      </Box>
    </Container>
  );
};

export default Privacy;
