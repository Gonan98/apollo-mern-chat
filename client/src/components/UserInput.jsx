import { Button, Card, CardContent, Stack, TextField, Typography } from "@mui/material";
import React from "react";

export default function UserInput({ setLogged, setUserName }) {
  const handleClick = () => {
    setLogged(true);
  };

  return (
    <Card sx={{ maxWidth: 275 }}>
      <CardContent
        component={Stack}
        direction="column"
        sx={{ alignItems: "center" }}
      >
        <Typography variant="h5" sx={{ mb: 2 }}>Chat App</Typography>
        <TextField
          sx={{ mb: 2 }}
          variant="outlined"
          placeholder="Ingrese su nombre"
          onChange={({ target }) => setUserName(target.value)}
        />
        <Button variant="contained" onClick={handleClick}>
          Ingresar
        </Button>
      </CardContent>
    </Card>
  );
}
