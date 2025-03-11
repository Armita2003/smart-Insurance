import useResponsive from "@/hooks/useResponsive"; // Assuming you have a custom hook for responsive design
import { Button, Container, Stack, Typography } from "@mui/material";

const SuccessPage = () => {
    const ExtraSmallScreen = useResponsive("down", "sm");
    const message = "Form submitted successfully!";

    return (
        <Container maxWidth="md" sx={{ py: 8 }}>
            <Stack spacing={4} alignItems="center">
                <Typography align="center" fontSize={ExtraSmallScreen ? 20 : 36}>
                    {message}
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
};

export default SuccessPage;
