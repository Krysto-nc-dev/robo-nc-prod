import React from 'react';
import { Box, Card, CardContent, CardMedia, Typography, Grid, Button } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useGetFillialeByIdQuery } from '../../slices/fillialesApiSlice';

const AdminFillialeDetails = () => {
  const { id: fillialeId } = useParams();
  const { data: filliale, error, isLoading } = useGetFillialeByIdQuery(fillialeId);

  if (isLoading) {
    return <Typography>Chargement...</Typography>;
  }

  if (error) {
    return <Typography>Erreur lors du chargement des détails de la filiale.</Typography>;
  }

  return (
    <Box sx={{ padding: 4 }}>
      <Card sx={{ display: 'flex', marginBottom: 4 }}>
        {filliale.logo && (
          <CardMedia
            component="img"
            sx={{ width: 160 }}
            image={filliale.logo}
            alt={`Logo de ${filliale.nom}`}
          />
        )}
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <CardContent>
            <Typography component="h5" variant="h5">
              {filliale.nom}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Acronyme : {filliale.acronyme}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Adresse : {filliale.adresse}
            </Typography>
            {filliale.website && (
              <Typography variant="subtitle1" color="text.secondary">
                Site web : <a href={filliale.website} target="_blank" rel="noopener noreferrer">{filliale.website}</a>
              </Typography>
            )}
            <Typography variant="subtitle1" color="text.secondary">
              Année fiscale : {filliale.debutAnneeFiscale} - {filliale.finAnneeFiscale}
            </Typography>
          </CardContent>
        </Box>
      </Card>
      <Grid container spacing={2}>
        <Grid item>
          <Button variant="contained" color="primary">
            Modifier
          </Button>
        </Grid>
        <Grid item>
          <Button variant="outlined" color="secondary">
            Supprimer
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminFillialeDetails;
