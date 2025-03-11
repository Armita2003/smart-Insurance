import ApplicationsList from "@/components/ListView/ApplicationsList";
import useResponsive from "@/hooks/useResponsive";
import { fetchSubmissions } from "@/services/api";
import { Alert, Box, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";

export default function ApplicationsPage() {
    const [data, setData] = useState([]);
    const [columns, setColumns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const isSmallScreen = useResponsive("down", "md");

    useEffect(() => {
        const loadData = async () => {
            try {
                const response = await fetchSubmissions();

                const formattedColumns = response.columns.map((column) => ({
                    field: column.toLowerCase().replace(/\s+/g, "_"),
                    headerName: column,
                    width: 150,
                    flex: 1,
                }));

                // Transform data with proper IDs
                const formattedData = response.data.map((item, index) => ({
                    id: item.id || index + 1,
                    ...Object.keys(item).reduce(
                        (acc, key) => ({
                            ...acc,
                            [key.toLowerCase().replace(/\s+/g, "_")]: item[key],
                        }),
                        {}
                    ),
                }));

                setColumns(formattedColumns);
                setData(formattedData);
            } catch (error) {
                console.error("Error loading submissions:", error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    return (
        <Box sx={{ p: isSmallScreen ? 0 : 4 }}>
            {error && <Alert severity="error">{error}</Alert>}
            {loading ? (
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100vh",
                    }}
                >
                    <CircularProgress size={isSmallScreen ? 60 : 80} />
                </div>
            ) : (
                <ApplicationsList
                    rows={data}
                    columns={columns}
                    sx={{
                        "& .MuiDataGrid-root": {
                            border: "none",
                        },
                        "& .MuiDataGrid-cell": {
                            borderBottom: "1px solid rgba(224, 224, 224, 0.5)",
                        },
                    }}
                />
            )}
        </Box>
    );
}
