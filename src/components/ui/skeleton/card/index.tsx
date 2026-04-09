import React from "react";
import { Card, CardContent, Skeleton, Grid, Box } from "@mui/material";

type CardSkeletonProps = {
  columns?: number;
  rows?: number;
};

const CardsSkeleton: React.FC<CardSkeletonProps> = ({
  columns = 1,
  rows = 2,
}) => {
  const total = columns * rows;

  return (
    <Grid container spacing={2}>
      {[...Array(total)].map((_, index) => (
        <Grid item xs={12 / columns} key={index}>
          <Card sx={{ borderRadius: 2 }}>
            <Skeleton variant="rectangular" height={140} animation="wave" />

            <CardContent>
              <Skeleton variant="text" width="70%" height={30} />
              <Skeleton variant="text" width="50%" height={20} />

              <Box mt={1}>
                <Skeleton variant="text" />
                <Skeleton variant="text" width="80%" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default CardsSkeleton;
