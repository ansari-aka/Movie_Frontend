import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Container,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useTheme } from "@mui/material/styles";

import api from "../api/axios";
import MovieGrid from "../components/MovieGrid";
import PaginationBar from "../components/PaginationBar";
import SortSelect from "../components/SortSelect";
import MovieListSkeleton from "../components/MovieListSkeleton";

export default function Search() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [q, setQ] = useState("");
  const [data, setData] = useState({ items: [], total: 0, page: 1, limit: 12 });
  const [sort, setSort] = useState({ by: "title", order: "asc" });

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  // debounce timer
  const tRef = useRef(null);

  const fetchSearch = async (page = 1, query = q) => {
    setErr("");
    setLoading(true);
    try {
      const res = await api.get("/movies/search", {
        params: { q: query, page, limit: 12 },
      });
      setData(res.data);
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to search movies.");
    } finally {
      setLoading(false);
    }
  };

  // Debounced search on q change
  useEffect(() => {
    // clear previous timer
    if (tRef.current) clearTimeout(tRef.current);

    // if empty, still fetch first page (shows all or empty depending on backend)
    tRef.current = setTimeout(() => {
      fetchSearch(1, q);
    }, 350);

    return () => {
      if (tRef.current) clearTimeout(tRef.current);
    };
  }, [q]);

  const totalPages = Math.ceil((data.total || 0) / (data.limit || 12));

  const sortedItems = useMemo(() => {
    const items = [...(data.items || [])];
    const dir = sort.order === "desc" ? -1 : 1;

    return items.sort((a, b) => {
      if (sort.by === "rating")
        return dir * ((a.rating || 0) - (b.rating || 0));
      if (sort.by === "durationMinutes")
        return dir * ((a.durationMinutes || 0) - (b.durationMinutes || 0));
      if (sort.by === "releaseDate")
        return (
          dir * (new Date(a.releaseDate || 0) - new Date(b.releaseDate || 0))
        );
      return dir * String(a.title || "").localeCompare(String(b.title || ""));
    });
  }, [data.items, sort.by, sort.order]);

  const handleSubmit = () => fetchSearch(1, q);

  const clearSearch = () => {
    setQ("");
    // fetchSearch(1, ""); // optional: immediate reset; debounce will also do it
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 3, md: 4 } }}>
      {/* Sticky header */}
      <Stack
        direction={{ xs: "column", md: "row" }}
        alignItems={{ xs: "stretch", md: "center" }}
        justifyContent="space-between"
        spacing={2}
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 5,
          bgcolor: "background.default",
          pt: 1,
          pb: 1,
          mb: 2,
        }}
      >
        <Box>
          <Typography variant={isMobile ? "h5" : "h4"} fontWeight={800}>
            Search Movies
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {loading ? "Searching..." : `${data.total || 0} results`}
          </Typography>
        </Box>

        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          justifyContent="flex-end"
        >
          <SortSelect value={sort} onChange={setSort} />
          <IconButton
            onClick={() => fetchSearch(data.page || 1, q)}
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

      {err ? (
        <Alert severity="error" sx={{ mb: 2 }}>
          {err}
        </Alert>
      ) : null}

      {/* Search bar */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={1.5}
        sx={{ mb: 3 }}
      >
        <TextField
          fullWidth
          placeholder="Search by name or description"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: q ? (
              <InputAdornment position="end">
                <IconButton
                  onClick={clearSearch}
                  edge="end"
                  aria-label="clear search"
                >
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            ) : null,
          }}
        />

        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
          sx={{ minWidth: { xs: "100%", sm: 140 }, borderRadius: 2 }}
        >
          Search
        </Button>
      </Stack>

      {/* Results */}
      {loading ? (
        <MovieListSkeleton count={isMobile ? 4 : 6} />
      ) : sortedItems.length === 0 ? (
        <Box sx={{ py: 6, textAlign: "center" }}>
          <Typography variant="h6" fontWeight={800}>
            No movies found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Try a different keyword like title, actor, or description.
          </Typography>

          <Button sx={{ mt: 2 }} variant="outlined" onClick={clearSearch}>
            Clear search
          </Button>
        </Box>
      ) : (
        <MovieGrid movies={sortedItems} />
      )}

      {/* Pagination */}
      {totalPages > 1 ? (
        <Box sx={{ mt: 2 }}>
          <PaginationBar
            page={data.page}
            totalPages={totalPages}
            onChange={(p) => fetchSearch(p, q)}
          />
        </Box>
      ) : null}
    </Container>
  );
}
