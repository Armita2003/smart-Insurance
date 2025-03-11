import Layout from "@/components/common/Layout";
import { FormProvider } from "@/contexts/FormContext";
import { ThemeProvider as CustomThemeProvider, useThemeContext } from "@/contexts/ThemeContext";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useMemo } from "react";

function ThemeWrapper({ children }) {
    const { darkMode } = useThemeContext();
    const theme = useMemo(
        () =>
            createTheme({
                palette: {
                    mode: darkMode ? "dark" : "light",
                },
            }),
        [darkMode]
    );

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            {children}
        </ThemeProvider>
    );
}

function MyApp({ Component, pageProps }) {
    return (
        <CustomThemeProvider>
            <FormProvider>
                <ThemeWrapper>
                    <Layout>
                        <Component {...pageProps} />
                    </Layout>
                </ThemeWrapper>
            </FormProvider>
        </CustomThemeProvider>
    );
}

export default MyApp;
