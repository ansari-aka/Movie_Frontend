import React from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
} from "@mui/material";

export default function SortSelect({ value, onChange }) {
  return (
    <Stack direction="row" spacing={1}>
      <FormControl size="small" sx={{ minWidth: 160 }}>
        <InputLabel>Sort By</InputLabel>
        <Select
          label="Sort By"
          value={value.by}
          onChange={(e) => onChange({ ...value, by: e.target.value })}
        >
          <MenuItem value="title">Name</MenuItem>
          <MenuItem value="rating">Rating</MenuItem>
          <MenuItem value="releaseDate">Release Date</MenuItem>
          <MenuItem value="durationMinutes">Duration</MenuItem>
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ minWidth: 120 }}>
        <InputLabel>Order</InputLabel>
        <Select
          label="Order"
          value={value.order}
          onChange={(e) => onChange({ ...value, order: e.target.value })}
        >
          <MenuItem value="asc">ASC</MenuItem>
          <MenuItem value="desc">DESC</MenuItem>
        </Select>
      </FormControl>
    </Stack>
  );
}
