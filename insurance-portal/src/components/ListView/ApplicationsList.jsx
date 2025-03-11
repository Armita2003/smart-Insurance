import useResponsive from "@/hooks/useResponsive";
import { FilterList, Search } from "@mui/icons-material";
import { Checkbox, IconButton, List, ListItem, ListItemButton, Popover, Stack, TextField, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useMemo, useState } from "react";

const ApplicationsList = ({ rows: initialRows, columns = [] }) => {
    const [visibleColumns, setVisibleColumns] = useState(columns?.map((col) => col.field) || []);
    const [rows, setRows] = useState(initialRows);
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearchVisible, setIsSearchVisible] = useState(false);
    const [filterAnchorEl, setFilterAnchorEl] = useState(null);
    const isSmallScreen = useResponsive("down", "md");

    // Filter rows based on search query
    const filteredRows = useMemo(() => {
        return rows.filter((row) => Object.values(row).some((value) => String(value).toLowerCase().includes(searchQuery.toLowerCase())));
    }, [rows, searchQuery]);

    // Toggle search bar visibility
    const toggleSearch = () => {
        setIsSearchVisible((prev) => !prev);
    };

    // Open filter dropdown
    const openFilter = (event) => {
        setFilterAnchorEl(event.currentTarget);
    };

    // Close filter dropdown
    const closeFilter = () => {
        setFilterAnchorEl(null);
    };

    // Handle column toggle for filter
    const handleColumnToggle = (field) => {
        const newColumns = visibleColumns.includes(field) ? visibleColumns.filter((f) => f !== field) : [...visibleColumns, field];
        setVisibleColumns(newColumns);
    };

    return (
        <Stack style={{ height: "100%", width: "100%", userSelect: "none", padding: isSmallScreen ? 10 : 0 }}>
            <Stack display="flex" justifyContent="space-between" direction="row" my={isSmallScreen ? 1 : 3} padding={0}>
                <Stack alignSelf="center">
                    <Typography fontSize={isSmallScreen ? 16 : 28} fontWeight={600}>
                        Submitted Applications
                    </Typography>
                </Stack>
                <Stack direction="row" gap={2}>
                    {isSearchVisible && !isSmallScreen && (
                        <TextField
                            label="Search"
                            variant="outlined"
                            margin="normal"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    )}
                    <Stack direction="row" alignItems="center">
                        <Stack>
                            <IconButton onClick={toggleSearch} sx={{ backgroundColor: isSearchVisible ? "gray" : "" }}>
                                <Search />
                            </IconButton>
                        </Stack>
                        <Stack>
                            <IconButton onClick={openFilter}>
                                <FilterList />
                            </IconButton>
                        </Stack>
                    </Stack>
                </Stack>
            </Stack>
            {isSearchVisible && isSmallScreen && (
                <TextField
                    label="Search"
                    variant="outlined"
                    margin="normal"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    sx={{ mb: 2, mt: 0 }}
                    size="small"
                />
            )}
            <Popover
                open={Boolean(filterAnchorEl)}
                anchorEl={filterAnchorEl}
                onClose={closeFilter}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                }}
            >
                <List sx={{ padding: 0 }}>
                    {columns.map((col) => (
                        <ListItem sx={{ padding: 0 }} key={col.field}>
                            <ListItemButton onClick={() => handleColumnToggle(col.field)}>
                                <Checkbox checked={visibleColumns.includes(col.field)} />
                                {col.headerName || col.field}
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Popover>
            <div style={{ width: "100%" }}>
                <DataGrid
                    rows={filteredRows}
                    columns={columns
                        .filter((c) => visibleColumns.includes(c.field))
                        .map((column) => ({
                            ...column,
                            minWidth: 160,
                        }))}
                    pageSize={0}
                    rowsPerPageOptions={2}
                    checkboxSelection
                    disableSelectionOnClick
                    sx={{
                        cursor: "pointer",
                        fontSize: isSmallScreen ? 12 : 15,
                        "& .MuiDataGrid-main": {
                            overflowX: "auto",
                        },
                    }}
                />
            </div>
        </Stack>
    );
};

export default ApplicationsList;
