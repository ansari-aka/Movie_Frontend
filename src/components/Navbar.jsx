import React, { useMemo, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Stack,
  Box,
  Chip,
  IconButton,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Divider,
  useMediaQuery,
  Tooltip,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { useTheme } from "@mui/material/styles";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [open, setOpen] = useState(false);

  const links = useMemo(() => {
    const base = [
      { label: "Home", to: "/" },
      { label: "Search", to: "/search" },
    ];

    const admin =
      user?.role === "admin"
        ? [
            { label: "Add Movie", to: "/admin/add" },
            { label: "Manage", to: "/admin/manage" },
          ]
        : [];

    const auth = !user
      ? [
          { label: "Login", to: "/login" },
          { label: "Sign Up", to: "/signup", variant: "outlined" },
        ]
      : [];

    return { base, admin, auth };
  }, [user]);

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const navBtnSx = (path) => ({
    textTransform: "none",
    fontWeight: isActive(path) ? 700 : 500,
    borderRadius: 2,
    px: 1.25,
    color: "text.primary",
    backgroundColor: isActive(path) ? "rgba(0,0,0,0.06)" : "transparent",
    "&:hover": { backgroundColor: "rgba(0,0,0,0.08)" },
  });

  const brandSx = {
    textDecoration: "none",
    color: "inherit",
    fontWeight: 800,
    letterSpacing: 0.4,
    display: "inline-flex",
    alignItems: "center",
    gap: 1,
    whiteSpace: "nowrap",
  };

  const handleNav = (to) => {
    navigate(to);
    setOpen(false);
  };

  const handleLogout = async () => {
    await logout?.();
    setOpen(false);
    navigate("/login");
  };

  return (
    <AppBar
      position="sticky"
      elevation={1}
      sx={{
        bgcolor: "background.paper",
        color: "text.primary",
        borderBottom: "1px solid",
        borderColor: "divider",
      }}
    >
      <Toolbar sx={{ px: { xs: 1.5, sm: 2, md: 3 }, py: 0.75 }}>
        {/* Left: Brand */}
        <Stack direction="row" alignItems="center" spacing={1} sx={{ flex: 1 }}>
          {isMobile && (
            <Tooltip title="Menu">
              <IconButton
                onClick={() => setOpen(true)}
                edge="start"
                aria-label="open menu"
              >
                <MenuIcon />
              </IconButton>
            </Tooltip>
          )}

          <Typography component={RouterLink} to="/" variant="h6" sx={brandSx}>
            🎬 <Box component="span">MovieApp</Box>
          </Typography>
        </Stack>

        {/* Right: Desktop Nav */}
        {!isMobile && (
          <Stack direction="row" spacing={0.75} alignItems="center">
            {links.base.map((l) => (
              <Button
                key={l.to}
                component={RouterLink}
                to={l.to}
                sx={navBtnSx(l.to)}
              >
                {l.label}
              </Button>
            ))}

            {links.admin.length ? (
              <>
                <Box sx={{ width: 8 }} />
                {links.admin.map((l) => (
                  <Button
                    key={l.to}
                    component={RouterLink}
                    to={l.to}
                    sx={navBtnSx(l.to)}
                  >
                    {l.label}
                  </Button>
                ))}
              </>
            ) : null}

            <Box sx={{ width: 12 }} />

            {!user ? (
              <>
                {links.auth.map((l) =>
                  l.variant === "outlined" ? (
                    <Button
                      key={l.to}
                      component={RouterLink}
                      to={l.to}
                      variant="outlined"
                      sx={{
                        textTransform: "none",
                        borderRadius: 2,
                        px: 1.25,
                      }}
                    >
                      {l.label}
                    </Button>
                  ) : (
                    <Button
                      key={l.to}
                      component={RouterLink}
                      to={l.to}
                      sx={navBtnSx(l.to)}
                    >
                      {l.label}
                    </Button>
                  ),
                )}
              </>
            ) : (
              <Stack direction="row" spacing={1} alignItems="center">
                <Chip
                  label={user.role?.toUpperCase?.() || "USER"}
                  size="small"
                  color={user.role === "admin" ? "secondary" : "default"}
                />
                <Button
                  onClick={handleLogout}
                  variant="outlined"
                  sx={{ textTransform: "none", borderRadius: 2 }}
                >
                  Logout
                </Button>
              </Stack>
            )}
          </Stack>
        )}

        {/* Mobile: quick actions (optional) */}
        {isMobile && (
          <Box>
            {user ? (
              <Chip
                label={user.role?.toUpperCase?.() || "USER"}
                size="small"
                color={user.role === "admin" ? "secondary" : "default"}
              />
            ) : null}
          </Box>
        )}
      </Toolbar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          sx: {
            width: 280,
            borderTopRightRadius: 16,
            borderBottomRightRadius: 16,
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography variant="subtitle1" fontWeight={800}>
              🎬 MovieApp
            </Typography>
            <IconButton onClick={() => setOpen(false)} aria-label="close menu">
              <CloseIcon />
            </IconButton>
          </Stack>

          <Box sx={{ mt: 1 }}>
            {user ? (
              <Stack direction="row" spacing={1} alignItems="center">
                <Chip
                  label={user.role?.toUpperCase?.() || "USER"}
                  size="small"
                  color={user.role === "admin" ? "secondary" : "default"}
                />
                <Typography variant="caption" color="text.secondary">
                  Logged in
                </Typography>
              </Stack>
            ) : (
              <Typography variant="caption" color="text.secondary">
                Not logged in
              </Typography>
            )}
          </Box>
        </Box>

        <Divider />

        <List sx={{ py: 1 }}>
          {[...links.base, ...links.admin].map((l) => (
            <ListItemButton
              key={l.to}
              selected={isActive(l.to)}
              onClick={() => handleNav(l.to)}
              sx={{ mx: 1, borderRadius: 2 }}
            >
              <ListItemText
                primary={l.label}
                primaryTypographyProps={{
                  fontWeight: isActive(l.to) ? 800 : 600,
                }}
              />
            </ListItemButton>
          ))}
        </List>

        <Divider />

        <Box sx={{ p: 2 }}>
          {!user ? (
            <Stack spacing={1}>
              <Button
                variant="outlined"
                onClick={() => handleNav("/login")}
                sx={{ borderRadius: 2 }}
              >
                Login
              </Button>
              <Button
                variant="contained"
                onClick={() => handleNav("/signup")}
                sx={{ borderRadius: 2 }}
              >
                Sign Up
              </Button>
            </Stack>
          ) : (
            <Button
              color="error"
              variant="contained"
              fullWidth
              onClick={handleLogout}
              sx={{ borderRadius: 2 }}
            >
              Logout
            </Button>
          )}
        </Box>
      </Drawer>
    </AppBar>
  );
}
