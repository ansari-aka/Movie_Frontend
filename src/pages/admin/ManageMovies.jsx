import React, { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Pagination,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useTheme } from "@mui/material/styles";
import api from "../../api/axios";

/* -------------------- Edit Dialog -------------------- */
function EditDialog({ open, movie, onClose, onSaved, setMsg, setErr }) {
  const [form, setForm] = useState(movie || {});
  const [saving, setSaving] = useState(false);

  useEffect(() => setForm(movie || {}), [movie]);

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const save = async () => {
    if (!movie?._id) return;

    setSaving(true);
    setErr("");
    setMsg("");

    try {
      await api.put(`/movies/${movie._id}`, {
        title: form.title?.trim() || "",
        description: form.description || "",
        rating: Number(form.rating) || 0,
        imdbRank: Number(form.imdbRank) || 0,
        releaseDate: form.releaseDate
          ? String(form.releaseDate).slice(0, 10)
          : undefined,
        durationMinutes: form.durationMinutes
          ? Number(form.durationMinutes)
          : undefined,
        posterUrl: form.posterUrl || "",
      });

      setMsg("Movie updated.");
      onSaved?.();
      onClose?.();
    } catch (e) {
      setErr(e?.response?.data?.message || "Update failed.");
    } finally {
      setSaving(false);
    }
  };

  if (!movie) return null;

  return (
    <Dialog
      open={open}
      onClose={saving ? undefined : onClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>Edit Movie</DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <Stack spacing={0.5}>
            <Typography variant="caption" fontWeight={500}>
              Title
            </Typography>
            <TextField
              placeholder="Title"
              value={form.title || ""}
              onChange={(e) => set("title", e.target.value)}
            />
          </Stack>
          <Stack spacing={0.5}>
            <Typography variant="caption" fontWeight={500}>
              Description
            </Typography>
            <TextField
              placeholder="Description"
              value={form.description || ""}
              onChange={(e) => set("description", e.target.value)}
              multiline
              minRows={3}
            />
          </Stack>
          <Stack spacing={0.5}>
            <Typography variant="caption" fontWeight={500}>
              Rating (0–10)
            </Typography>
            <TextField
              placeholder="Rating (0–10)"
              type="number"
              value={form.rating ?? ""}
              onChange={(e) => set("rating", e.target.value)}
            />
          </Stack>
          <Stack spacing={0.5}>
            <Typography variant="caption" fontWeight={500}>
              Rank
            </Typography>
            <TextField
              placeholder="Rank"
              type="number"
              value={form.imdbRank ?? ""}
              onChange={(e) => set("imdbRank", e.target.value)}
            />
          </Stack>
          <Stack spacing={0.5}>
            <Typography variant="caption" fontWeight={500}>
              Release Date
            </Typography>
            <TextField
              placeholder="YYYY-MM-DD"
              type="date"
              value={
                form.releaseDate
                  ? String(form.releaseDate).substring(0, 10)
                  : ""
              }
              onChange={(e) => set("releaseDate", e.target.value)}
            />
          </Stack>
          <Stack spacing={0.5}>
            <Typography variant="caption" fontWeight={500}>
              Duration Minutes
            </Typography>
            <TextField
              placeholder="Duration Minutes"
              type="number"
              value={form.durationMinutes ?? ""}
              onChange={(e) => set("durationMinutes", e.target.value)}
            />
          </Stack>
          <Stack spacing={0.5}>
            <Typography variant="caption" fontWeight={500}>
              Poster URL
            </Typography>
            <TextField
              placeholder="Poster URL"
              value={form.posterUrl || ""}
              onChange={(e) => set("posterUrl", e.target.value)}
            />
          </Stack>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={saving}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={save}
          disabled={saving || !String(form.title || "").trim()}
        >
          {saving ? "Saving..." : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

/* -------------------- Confirm Delete -------------------- */
function ConfirmDelete({ open, title, loading, onClose, onConfirm }) {
  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      fullWidth
      maxWidth="xs"
    >
      <DialogTitle>Delete movie?</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary">
          Are you sure you want to delete <b>{title}</b>? This cannot be undone.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          color="error"
          variant="contained"
          onClick={onConfirm}
          disabled={loading}
        >
          {loading ? "Deleting..." : "Delete"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

/* -------------------- Page -------------------- */
export default function ManageMovies() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [movies, setMovies] = useState([]);
  const [q, setQ] = useState("");

  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const [page, setPage] = useState(1);
  const limit = 10;
  const [total, setTotal] = useState(0);

  const [edit, setEdit] = useState(null);

  const [delTarget, setDelTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const totalPages = Math.ceil((total || 0) / limit);

  const load = async (p = page, query = q) => {
    setLoading(true);
    setErr("");
    try {
      // ✅ if your backend uses /movies not /movies/search, change here
      const res = await api.get("/movies/search", {
        params: { page: p, limit, q: query },
      });

      setMovies(res.data.items || []);
      setTotal(res.data.total || 0);
      setPage(res.data.page || p);
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to load movies.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(page, q);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  // debounce search
  useEffect(() => {
    const t = setTimeout(() => {
      setPage(1);
      load(1, q);
    }, 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  const remove = async (movie) => {
    if (!movie?._id) return;

    setDeleting(true);
    setErr("");
    setMsg("");

    try {
      await api.delete(`/movies/${movie._id}`);
      setMsg("Movie deleted.");

      // if last item deleted, go one page back
      const nextPage = page > 1 && movies.length === 1 ? page - 1 : page;
      setDelTarget(null);
      setPage(nextPage);
      load(nextPage, q);
    } catch (e) {
      setErr(e?.response?.data?.message || "Delete failed.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 3, md: 4 } }}>
      {/* Header */}
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={2}
        alignItems={{ xs: "stretch", md: "center" }}
        justifyContent="space-between"
        sx={{ mb: 2 }}
      >
        <Box>
          <Typography variant={isMobile ? "h5" : "h4"} fontWeight={800}>
            Manage Movies
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {loading ? "Loading..." : `Total: ${total}`}
          </Typography>
        </Box>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
          <TextField
            size="small"
            placeholder="Search title/description..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            fullWidth
            sx={{ minWidth: { xs: "100%", sm: 280 } }}
          />
          <IconButton
            onClick={() => load(page, q)}
            disabled={loading}
            sx={{
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2,
            }}
            aria-label="refresh"
          >
            <RefreshIcon />
          </IconButton>
        </Stack>
      </Stack>

      {/* Alerts */}
      {msg ? (
        <Alert sx={{ mb: 2 }} severity="success">
          {msg}
        </Alert>
      ) : null}
      {err ? (
        <Alert sx={{ mb: 2 }} severity="error">
          {err}
        </Alert>
      ) : null}

      {/* Body */}
      {loading ? (
        <Box sx={{ display: "grid", placeItems: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      ) : movies.length === 0 ? (
        <Box sx={{ py: 8, textAlign: "center" }}>
          <Typography variant="h6" fontWeight={900}>
            No movies found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Try another keyword or clear the search.
          </Typography>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1.5}
            justifyContent="center"
            sx={{ mt: 3 }}
          >
            <Button variant="outlined" onClick={() => setQ("")}>
              Clear search
            </Button>
            <Button variant="contained" onClick={() => load(1, "")}>
              Reload
            </Button>
          </Stack>
        </Box>
      ) : isMobile ? (
        <Stack spacing={1.5}>
          {movies.map((m) => (
            <Card key={m._id} variant="outlined" sx={{ borderRadius: 3 }}>
              <CardContent>
                <Typography fontWeight={900}>{m.title}</Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 0.5 }}
                >
                  Rating: {m.rating ?? 0} • Rank: {m.imdbRank ?? "-"}
                </Typography>
              </CardContent>

              <Divider />

              <CardActions
                sx={{ justifyContent: "flex-end", gap: 1, px: 2, py: 1.5 }}
              >
                <Button
                  startIcon={<EditOutlinedIcon />}
                  variant="outlined"
                  onClick={() => setEdit(m)}
                >
                  Edit
                </Button>
                <Button
                  startIcon={<DeleteOutlineIcon />}
                  color="error"
                  variant="outlined"
                  onClick={() => setDelTarget(m)}
                >
                  Delete
                </Button>
              </CardActions>
            </Card>
          ))}
        </Stack>
      ) : (
        <Box
          sx={{
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 3,
            overflow: "hidden",
          }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 900 }}>Title</TableCell>
                <TableCell sx={{ fontWeight: 900, width: 120 }}>
                  Rating
                </TableCell>
                <TableCell sx={{ fontWeight: 900, width: 120 }}>Rank</TableCell>
                <TableCell sx={{ fontWeight: 900, width: 220 }} align="right">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {movies.map((m) => (
                <TableRow key={m._id} hover>
                  <TableCell sx={{ fontWeight: 700 }}>{m.title}</TableCell>
                  <TableCell>{m.rating ?? 0}</TableCell>
                  <TableCell>{m.imdbRank ?? "-"}</TableCell>
                  <TableCell align="right">
                    <Stack
                      direction="row"
                      spacing={1}
                      justifyContent="flex-end"
                    >
                      <Button
                        size="small"
                        startIcon={<EditOutlinedIcon />}
                        variant="outlined"
                        onClick={() => setEdit(m)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="small"
                        startIcon={<DeleteOutlineIcon />}
                        color="error"
                        variant="outlined"
                        onClick={() => setDelTarget(m)}
                      >
                        Delete
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 ? (
        <Stack alignItems="center" sx={{ mt: 3 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, p) => setPage(p)}
            color="primary"
            shape="rounded"
          />
        </Stack>
      ) : null}

      {/* Dialogs */}
      <EditDialog
        open={!!edit}
        movie={edit}
        onClose={() => setEdit(null)}
        onSaved={() => load(page, q)}
        setMsg={setMsg}
        setErr={setErr}
      />

      <ConfirmDelete
        open={!!delTarget}
        title={delTarget?.title}
        loading={deleting}
        onClose={() => setDelTarget(null)}
        onConfirm={() => remove(delTarget)}
      />
    </Container>
  );
}
