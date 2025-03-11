import { useThemeContext } from "@/contexts/ThemeContext";
import useResponsive from "@/hooks/useResponsive";
import MenuIcon from "@mui/icons-material/Menu"; // Import the hamburger menu icon
import { AppBar, Button, Drawer, IconButton, List, ListItem, Stack, Switch, Toolbar, Typography } from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import Link from "next/link";
import { useState } from "react";

const Layout = ({ children }) => {
    const { darkMode, toggleDarkMode } = useThemeContext();
    const theme = useTheme();
    const isSmallScreen = useResponsive("down", "md");
    const [isDrawerOpen, setIsDrawerOpen] = useState(false); // State for sidebar drawer

    // Open sidebar drawer
    const handleDrawerOpen = () => {
        setIsDrawerOpen(true);
    };

    // Close sidebar drawer
    const handleDrawerClose = () => {
        setIsDrawerOpen(false);
    };

    return (
        <Stack
            style={{
                backgroundColor: theme.palette.background.default,
            }}
        >
            <AppBar position="static" color="primary">
                <Toolbar>
                    <Stack width="100%" display="flex" direction="row" justifyContent="space-between" alignItems="center">
                        <Stack>
                            <Typography sx={{ fontSize: isSmallScreen ? 12 : 22 }}>Insurance Portal</Typography>
                        </Stack>
                        <Stack direction="row" alignItems="center">
                            <Switch size={isSmallScreen ? "small" : "medium"} checked={darkMode} onChange={toggleDarkMode} color="primary" />

                            {isSmallScreen && (
                                <IconButton color="inherit" onClick={handleDrawerOpen}>
                                    <MenuIcon />
                                </IconButton>
                            )}

                            {!isSmallScreen && (
                                <>
                                    <Link href="/" passHref>
                                        <Button sx={{ ":hover": { background: "none" } }}>
                                            <LinkTexts>Home</LinkTexts>
                                        </Button>
                                    </Link>
                                    <Link href="/application-form" passHref>
                                        <Button sx={{ ":hover": { background: "none" } }}>
                                            <LinkTexts>Apply</LinkTexts>
                                        </Button>
                                    </Link>
                                    <Link href="/applications" passHref>
                                        <Button sx={{ ":hover": { background: "none" } }}>
                                            <LinkTexts>Applications</LinkTexts>
                                        </Button>
                                    </Link>
                                </>
                            )}
                        </Stack>
                    </Stack>
                </Toolbar>
            </AppBar>

            <Drawer
                anchor="right"
                open={isDrawerOpen}
                onClose={handleDrawerClose}
                sx={{
                    "& .MuiDrawer-paper": {
                        width: 200,
                    },
                }}
            >
                <List sx={{ my: 5, width: "100%" }}>
                    <ListItem sx={{ ":hover": { background: { opacity: 0.6 } } }} button onClick={handleDrawerClose}>
                        <Link style={{ textDecoration: "none" }} href="/" passHref>
                            <LinkTexts sx={{ color: darkMode ? "white" : "black" }} darkMode>
                                Home
                            </LinkTexts>
                        </Link>
                    </ListItem>
                    <ListItem button onClick={handleDrawerClose}>
                        <Link style={{ textDecoration: "none" }} href="/application-form" passHref>
                            <LinkTexts sx={{ color: darkMode ? "white" : "black" }}>Apply</LinkTexts>
                        </Link>
                    </ListItem>
                    <ListItem button onClick={handleDrawerClose}>
                        <Link style={{ textDecoration: "none" }} href="/applications" passHref>
                            <LinkTexts sx={{ color: darkMode ? "white" : "black" }}>Applications</LinkTexts>
                        </Link>
                    </ListItem>
                </List>
            </Drawer>

            <main style={{ padding: isSmallScreen ? 5 : "20px" }}>{children}</main>
        </Stack>
    );
};

export default Layout;

const LinkTexts = styled(Typography)(({ theme }) => ({
    fontWeight: 500,
    fontSize: 16,
    opacity: 0.7,
    ":hover": {
        opacity: 1,
    },
    color: "white",
    textDecoration: "none",
    textTransform: "none",
    [theme.breakpoints.down("md")]: {
        fontWeight: 500,
        fontSize: 17,
        opacity: 1,
        ":hover": {
            opacity: 0.7,
        },
    },
}));
