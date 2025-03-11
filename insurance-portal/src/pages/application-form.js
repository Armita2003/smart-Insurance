import DynamicForm from "@/components/FormBuilder/DynamicForm";
import { Box, Container } from "@mui/material";

const ApplicationFormPage = () => {
    return (
        <Container maxWidth="md">
            <Box sx={{ my: 4 }}>
                <DynamicForm />
            </Box>
        </Container>
    );
};

export default ApplicationFormPage;
