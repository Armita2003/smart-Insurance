import useResponsive from "@/hooks/useResponsive";
import { Button, Container, Stack, Typography } from "@mui/material";

export default function HomePage() {
    const ExtraSmallScreen = useResponsive("down", "sm");

    return (
        <Container maxWidth="md" sx={{ py: 8 }}>
            <Stack spacing={4} alignItems="center">
                <Typography align="center " fontSize={ExtraSmallScreen ? 20 : 36}>
                    Insurance Application Portal
                </Typography>
                <Stack direction={"row"} spacing={3}>
                    <Button sx={{ textTransform: "none", textAlign: "center" }} href="/application-form" variant="contained" size="large">
                        New Application
                    </Button>
                    <Button sx={{ textTransform: "none", textAlign: "center" }} href="/applications" variant="outlined" size="large">
                        View Applications
                    </Button>
                </Stack>
            </Stack>
        </Container>
    );
}
