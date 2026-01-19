import React from "react";
import { Grid, Stack } from "@mui/material";
import MovieCard from "./MovieCard";

export default function MovieGrid({ movies }) {
  return (
    <Stack container spacing={2}>
      {movies.map((movie) => (
        <MovieCard key={movie._id} movie={movie}  />
      ))}
    </Stack>
  );
}
