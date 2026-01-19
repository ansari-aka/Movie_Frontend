import React, { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Alert,
  Stack,
  Paper,
  Divider,
} from "@mui/material";
import api from "../../api/axios";

export default function AddMovie() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    rating: 0,
    releaseDate: "",
    durationMinutes: 120,
    posterUrl: "",
    imdbRank: 0,
  });
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    setMsg("");
    setErr("");
    try {
      await api.post("/movies", {
        ...form,
        rating: Number(form.rating),
        durationMinutes: Number(form.durationMinutes),
        releaseDate: form.releaseDate || undefined,
        imdbRank: parseInt(form.imdbRank, 10),
      });
      setMsg("Movie added!");
      setForm({
        title: "",
        description: "",
        rating: 0,
        releaseDate: "",
        durationMinutes: 120,
        posterUrl: "",
        imdbRank: 0,
      });
    } catch (e2) {
      setErr(e2?.response?.data?.message || "Failed to add movie");
    }
  };

  return (
    <Container
      sx={{
        py: 4,
        minHeight: "80vh",
        display: "grid",
        placeItems: "start center",
      }}
    >
      <Paper
        elevation={6}
        sx={{
          width: "100%",
          maxWidth: 900,
          p: { xs: 2, sm: 3 },
          borderRadius: 3,
        }}
      >
        {/* Header */}
        <Stack spacing={0.5} sx={{ mb: 2 }}>
          <Typography variant="h4" fontWeight={800}>
            Add Movie
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Enter movie details and save.
          </Typography>
        </Stack>

        <Divider sx={{ mb: 2 }} />
        {msg ? (
          <Alert severity="success" sx={{ mb: 2 }}>
            {msg}
          </Alert>
        ) : null}
        {err ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            {err}
          </Alert>
        ) : null}

        <form onSubmit={submit}>
          <Stack spacing={2}>
            <Stack spacing={0.5}>
              <Typography variant="caption" fontWeight={500}>
                Title
              </Typography>
              <TextField
                placeholder="Title"
                value={form.title}
                onChange={(e) => set("title", e.target.value)}
                required
              />
            </Stack>

            <Stack spacing={0.5}>
              <Typography variant="caption" fontWeight={500}>
                Description
              </Typography>
              <TextField
                placeholder="Description"
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                multiline
                minRows={3}
              />
            </Stack>

            <Stack spacing={0.5}>
              <Typography variant="caption" fontWeight={500}>
                Rating (0-10)
              </Typography>
              <TextField
                placeholder="Rating (0-10)"
                type="number"
                value={form.rating}
                onChange={(e) => set("rating", e.target.value)}
                required
              />
            </Stack>

            <Stack spacing={0.5}>
              <Typography variant="caption" fontWeight={500}>
                Rank
              </Typography>
              <TextField
                placeholder="Rank"
                type="number"
                value={form.imdbRank}
                onChange={(e) => set("imdbRank", e.target.value)}
                required
              />
            </Stack>

            <Stack spacing={0.5}>
              <Typography variant="caption" fontWeight={500}>
                Release Date
              </Typography>
              <TextField
                placeholder="Release Date"
                type="date"
                value={form.releaseDate}
                onChange={(e) => set("releaseDate", e.target.value)}
                required
              />
            </Stack>

            <Stack spacing={0.5}>
              <Typography variant="caption" fontWeight={500}>
                Duration Minutes
              </Typography>
              <TextField
                placeholder="Duration Minutes"
                type="number"
                value={form.durationMinutes}
                onChange={(e) => set("durationMinutes", e.target.value)}
                required
              />
            </Stack>

            <Stack spacing={0.5}>
              <Typography variant="caption" fontWeight={500}>
                Poster URL
              </Typography>
              <TextField
                placeholder="Poster URL"
                value={form.posterUrl}
                onChange={(e) => set("posterUrl", e.target.value)}
                required
              />
            </Stack>
            <Button type="submit" variant="contained">
              Add
            </Button>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}
