import React from "react";
import { Stack, Pagination } from "@mui/material";

export default function PaginationBar({ page, totalPages, onChange }) {
  if (!totalPages || totalPages <= 1) return null;

  return (
    <Stack alignItems="center" sx={{ mt: 4 }}>
      <Pagination
        page={page}
        count={totalPages}
        onChange={(_, p) => onChange(p)}
        color="primary"
        shape="rounded"
        size="large"
      />
    </Stack>
  );
}
