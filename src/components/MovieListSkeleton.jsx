import React from "react";
import { Box, Paper, Skeleton, Stack } from "@mui/material";

export default function MovieListSkeleton({ count = 6 }) {
  return (
    <Stack spacing={2}>
      {Array.from({ length: count }).map((_, idx) => (
        <Paper
          key={idx}
          sx={{
            p: 2,
            borderRadius: 2,
            border: "1px solid #e0e0e0",
            display: "flex",
            gap: 2,
          }}
        >
          {/* Poster Skeleton */}
          <Skeleton
            variant="rectangular"
            width={90}
            height={130}
            sx={{ borderRadius: 2 }}
          />

          {/* Right Content */}
          <Box sx={{ flex: 1 }}>
            {/* Title */}
            <Skeleton width="60%" height={28} />

            {/* Meta */}
            <Skeleton width="35%" height={18} />

            {/* Rating + Actions */}
            <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
              <Skeleton width={80} height={20} />
              <Skeleton width={60} height={20} />
              <Skeleton width={140} height={20} />
            </Stack>

            {/* Description */}
            <Skeleton width="95%" height={18} sx={{ mt: 1 }} />
            <Skeleton width="85%" height={18} />
          </Box>
        </Paper>
      ))}
    </Stack>
  );
}
