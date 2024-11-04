import React from "react";
// import { FiHeart } from "lucide-react";
import {
  Card,
  CardContent,
  CardActions,
  CardMedia,
  Typography,
  IconButton,
  Container,
  Grid,
  Button,
} from "@mui/material";

const Favorites = () => {
  const favorites = [
    // { id: 1, name: "Product A", image: "/api/placeholder/300/200" },
    // { id: 2, name: "Product B", image: "/api/placeholder/300/200" },
    // { id: 3, name: "Product C", image: "/api/placeholder/300/200" },
    // { id: 4, name: "Product D", image: "/api/placeholder/300/200" },
    // { id: 5, name: "Product E", image: "/api/placeholder/300/200" },
    // { id: 6, name: "Product F", image: "/api/placeholder/300/200" },
  ];

  return (
    <Container sx={{ py: 4 }}>
      <Typography
        variant="h4"
        component="h1"
        align="center"
        color="primary"
        gutterBottom
      >
        {/* <FiHeart style={{ marginRight: "8px" }} /> */}
        Your Favorites
      </Typography>
      <Grid container spacing={4}>
        {favorites.map((favorite) => (
          <Grid item key={favorite.id} xs={12} sm={6} md={4} lg={3}>
            <Card
              sx={{
                backgroundColor: "#f2f2f2",
                "&:hover": { backgroundColor: "#e6e6e6" },
              }}
            >
              <CardMedia
                component="img"
                height="200"
                image={favorite.image}
                alt={favorite.name}
              />
              <CardContent>
                <Typography variant="h6" component="h2" color="primary">
                  {favorite.name}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{
                    backgroundColor: "#5d6544",
                    "&:hover": { backgroundColor: "#484c35" },
                  }}
                >
                  Remove from Favorites
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Favorites;
