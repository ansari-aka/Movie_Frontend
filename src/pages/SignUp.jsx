import React, { useMemo, useState } from "react";
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
  Snackbar,
  CircularProgress,
  Link,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import api from "../api/axios";
import { useAuth } from "../auth/AuthContext.jsx";
import { useNavigate, Link as RouterLink } from "react-router-dom";

export default function Signup() {
  const { login } = useAuth();
  const nav = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const [snack, setSnack] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const openSnack = (message, severity = "success") =>
    setSnack({ open: true, message, severity });

  const closeSnack = (_, reason) => {
    if (reason === "clickaway") return;
    setSnack((s) => ({ ...s, open: false }));
  };

  // live validation helpers
  const passwordTooShort = useMemo(
    () => form.password.length > 0 && form.password.length < 8,
    [form.password],
  );

  const passwordsMismatch = useMemo(
    () => form.confirm.length > 0 && form.password !== form.confirm,
    [form.password, form.confirm],
  );

  const submit = async (e) => {
    e.preventDefault();
    setErr("");

    if (!form.name.trim()) {
      openSnack("Please enter your name.", "warning");
      return;
    }
    if (!form.email.trim()) {
      openSnack("Please enter your email.", "warning");
      return;
    }
    if (form.password.length < 8) {
      setErr("Password must be at least 8 characters");
      openSnack("Password must be at least 8 characters", "error");
      return;
    }
    if (form.password !== form.confirm) {
      setErr("Passwords do not match");
      openSnack("Passwords do not match", "error");
      return;
    }

    try {
      setLoading(true);
      const res = await api.post("/auth/signup", {
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
      });

      login(res.data);
      openSnack("Account created successfully ✅", "success");
      setTimeout(() => nav("/"), 400);
    } catch (e2) {
      const msg = e2?.response?.data?.message || "Signup failed";
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
          maxWidth: 520,
          p: 3,
          borderRadius: 3,
        }}
      >
        <Stack spacing={1} sx={{ mb: 2 }}>
          <Typography variant="h4" fontWeight={800}>
            Create your account
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Sign up to get started
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
              label="Full Name"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              required
              disabled={loading}
              fullWidth
            />

            <TextField
              label="Email"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              required
              type="email"
              autoComplete="email"
              disabled={loading}
              fullWidth
            />

            <TextField
              label="Password"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={(e) => set("password", e.target.value)}
              required
              disabled={loading}
              fullWidth
              error={passwordTooShort}
              helperText={passwordTooShort ? "Minimum 8 characters" : " "}
              autoComplete="new-password"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword((v) => !v)}
                      onMouseDown={(e) => e.preventDefault()}
                      edge="end"
                      aria-label="toggle password visibility"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              label="Confirm Password"
              type={showConfirmPassword ? "text" : "password"}
              value={form.confirm}
              onChange={(e) => set("confirm", e.target.value)}
              required
              disabled={loading}
              fullWidth
              error={passwordsMismatch}
              helperText={passwordsMismatch ? "Passwords do not match" : " "}
              autoComplete="new-password"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmPassword((v) => !v)}
                      onMouseDown={(e) => e.preventDefault()}
                      edge="end"
                      aria-label="toggle confirm password visibility"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

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
              {loading ? "Creating..." : "Create Account"}
            </Button>

            <Typography
              variant="body2"
              color="text.secondary"
              textAlign="center"
            >
              Already have an account?{" "}
              <Link component={RouterLink} to="/login" underline="hover">
                Login
              </Link>
            </Typography>
          </Stack>
        </form>

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
