import React from "react";
import {
  Box,
  Paper,
  Typography,
  Stack,
  IconButton,
  Button,
  Divider,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";

export default function MovieCard({ movie }) {
  console.log(movie);
  return (
    <Paper
      sx={{
        p: 2,
        borderRadius: 2,
        border: "1px solid #e0e0e0",
        display: "flex",
        gap: 2,
      }}
    >
      <Box
        sx={{
          width: 90,
          height: 130,
          borderRadius: 2,
          overflow: "hidden",
          position: "relative",
          flexShrink: 0,
          bgcolor: "#f0f0f0",
        }}
      >
        <Box
          component="img"
          src={
            movie.posterUrl ||
            "https://via.placeholder.com/300x450?text=No+Poster"
          }
          alt={movie.title}
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </Box>

      {/* Right Content */}
      <Box sx={{ flex: 1 }}>
        {/* Rank + Title */}
        <Stack direction="row" spacing={1} alignItems="center">
          <Box
            sx={{
              bgcolor: "#1976d2",
              color: "#fff",
              px: 1.2,
              py: 0.3,
              borderRadius: 1,
              fontSize: 13,
              fontWeight: 700,
            }}
          >
            #{movie.imdbRank}
          </Box>

          <Typography variant="h6" fontWeight={700}>
            {movie.title}
          </Typography>
        </Stack>

        {/* Meta */}
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          {movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : "-"}
          {" • "}
          {movie.durationMinutes ?? "-"} min
        </Typography>

        {/* Rating + Actions */}
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 1 }}>
          <Typography sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <span style={{ color: "#f5c518" }}>★</span>
            <strong>{movie.rating ?? "-"}</strong>
          </Typography>

          <Divider orientation="vertical" flexItem />
        </Stack>

        {/* Description */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mt: 1,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {movie.description || "No description available."}
        </Typography>
      </Box>
    </Paper>
  );
}
