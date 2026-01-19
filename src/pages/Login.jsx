import React, { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Alert,
  Stack,
  InputAdornment,
  IconButton,
  Paper,
  Divider,
  Link,
  Snackbar,
  CircularProgress,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import api from "../api/axios";
import { useAuth } from "../auth/AuthContext.jsx";
import { useNavigate, Link as RouterLink } from "react-router-dom";

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [err, setErr] = useState("");

  // Snackbar notification
  const [snack, setSnack] = useState({
    open: false,
    message: "",
    severity: "success", // "success" | "error" | "info" | "warning"
  });

  const openSnack = (message, severity = "success") =>
    setSnack({ open: true, message, severity });

  const closeSnack = (_, reason) => {
    if (reason === "clickaway") return;
    setSnack((s) => ({ ...s, open: false }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setErr("");

    if (!email.trim() || !password) {
      openSnack("Please enter email and password.", "warning");
      return;
    }

    try {
      setLoading(true);
      const res = await api.post("/auth/login", { email, password });

      login(res.data);
      openSnack("Logged in successfully ✅", "success");

      setTimeout(() => nav("/"), 400);
    } catch (e2) {
      const msg = e2?.response?.data?.message || "Login failed";
      setErr(msg);
      openSnack(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      sx={{
        minHeight: "80vh",
        display: "grid",
        placeItems: "center",
        py: 4,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          width: "100%",
          maxWidth: 460,
          p: 3,
          borderRadius: 3,
        }}
      >
        <Stack spacing={1} sx={{ mb: 2 }}>
          <Typography variant="h4" fontWeight={700}>
            Welcome back
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Login to continue
          </Typography>
        </Stack>

        <Divider sx={{ mb: 2 }} />

        {err ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            {err}
          </Alert>
        ) : null}

        <form onSubmit={submit}>
          <Stack spacing={2}>
            <TextField
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              type="email"
              disabled={loading}
              fullWidth
            />

            <TextField
              label="Password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              disabled={loading}
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword((v) => !v)}
                      onMouseDown={(e) => e.preventDefault()} // keep cursor
                      edge="end"
                      aria-label="toggle password visibility"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Stack
              direction="row"
              justifyContent="space-evenly"
              alignItems="center"
            >
              <Link component={RouterLink} to="/signup" underline="hover">
                Create account
              </Link>
            </Stack>

            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
              fullWidth
              sx={{ py: 1.2, borderRadius: 2 }}
              startIcon={
                loading ? <CircularProgress size={18} color="inherit" /> : null
              }
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </Stack>
        </form>

        {/* Snackbar Notification */}
        <Snackbar
          open={snack.open}
          autoHideDuration={2500}
          onClose={closeSnack}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={closeSnack}
            severity={snack.severity}
            variant="filled"
          >
            {snack.message}
          </Alert>
        </Snackbar>
      </Paper>
    </Container>
  );
}
