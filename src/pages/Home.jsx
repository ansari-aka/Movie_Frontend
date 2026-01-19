import React, { useEffect, useState } from "react";
import { Container, Typography, Box, Fade, Alert } from "@mui/material";
import api from "../api/axios";
import MovieGrid from "../components/MovieGrid";
import PaginationBar from "../components/PaginationBar";
import SortSelect from "../components/SortSelect";
import MovieListSkeleton from "../components/MovieListSkeleton";

export default function Home() {
  const [data, setData] = useState({ items: [], total: 0, page: 1, limit: 12 });
  const [sort, setSort] = useState({ by: "title", order: "asc" });

  const [initialLoad, setInitialLoad] = useState(true);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [loadedOk, setLoadedOk] = useState(false); // ✅ did request succeed?

  const fetchMovies = async (page = 1) => {
    try {
      setErr("");
      if (initialLoad) setLoading(true);

      const res = await api.get("/movies/sorted", {
        params: { page, limit: 12, ...sort },
      });

      setData(res.data);
      setLoadedOk(true);
    } catch (e) {
      setLoadedOk(false);
      // show real reason (429/CORS/404/etc.)
      setErr(
        e?.response?.data?.message || e?.message || "Failed to load movies.",
      );
    } finally {
      setLoading(false);
      setInitialLoad(false);
    }
  };

  useEffect(() => {
    fetchMovies(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sort.by, sort.order]);

  const totalPages = Math.ceil((data.total || 0) / (data.limit || 12));

  return (
    <Box sx={{ bgcolor: "#f5f5f5", minHeight: "100vh", py: 4 }}>
      <Container maxWidth="lg">
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
          gap={2}
          flexWrap="wrap"
        >
          <Typography variant="h4" fontWeight={600}>
            🎬 All Movies
          </Typography>
          <SortSelect value={sort} onChange={setSort} />
        </Box>

        {err ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            {err}
          </Alert>
        ) : null}

        {initialLoad && loading ? (
          <MovieListSkeleton count={6} />
        ) : loadedOk && data.items.length === 0 ? (
          <Box sx={{ py: 8, textAlign: "center" }}>
            <Typography variant="h6" fontWeight={700}>
              No movies available
            </Typography>
          </Box>
        ) : (
          <Fade in timeout={250}>
            <Box>
              <MovieGrid movies={data.items} />
            </Box>
          </Fade>
        )}

        {loadedOk && totalPages > 1 && (
          <PaginationBar
            page={data.page}
            totalPages={totalPages}
            onChange={(p) => fetchMovies(p)}
          />
        )}
      </Container>
    </Box>
  );
}
