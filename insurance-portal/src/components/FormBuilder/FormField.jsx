import {
    Checkbox,
    FormControl,
    FormControlLabel,
    FormLabel,
    InputLabel,
    MenuItem,
    FormGroup as MuiFormGroup,
    Radio,
    RadioGroup,
    Select,
    TextField,
} from "@mui/material";
import { useFormikContext } from "formik";
import _ from "lodash";
import { useEffect, useState } from "react";
import { checkConditions } from "../common/checkConditions";

const FormField = ({ field, setFieldOptions, errors, touched }) => {
    const formik = useFormikContext();
    const [optionsMap, setOptionsMap] = useState({});
    const [loading, setLoading] = useState(false);
    const isVisible = checkConditions(field?.visibility, formik.values);
    const country = _.get(formik.values, field.dynamicOptions, "");

    useEffect(() => {
        if (field.dynamicOptions) {
            const { dependsOn, endpoint } = field.dynamicOptions;
            const dependentValue = _.get(formik.values, dependsOn, "");

            if (dependentValue) {
                setLoading(true);
                fetch(`https://assignment.devotel.io${endpoint}?country=${dependentValue}`)
                    .then((res) => res.json())
                    .then((data) => {
                        setOptionsMap((prev) => ({ ...prev, [field.id]: data.states || [] }));
                        setFieldOptions((prev) => ({ ...prev, [field.id]: data.states || [] }));
                        setLoading(false);
                    })
                    .catch((error) => {
                        console.error("Error fetching states:", error);
                        setLoading(false);
                    });
            } else {
                setOptionsMap((prev) => ({ ...prev, [field.id]: [] }));
            }
        }
    }, [formik.values, field.dynamicOptions]);

    useEffect(() => {
        if (field.dynamicOptions && country) {
            const { endpoint } = field.dynamicOptions;
            setLoading(true);
            fetch(`https://assignment.devotel.io${endpoint}?country=${country}`)
                .then((res) => res.json())
                .then((data) => {
                    setOptionsMap((prev) => ({ ...prev, [field.id]: data.states || [] }));
                    setLoading(false);
                })
                .catch((error) => {
                    console.error("Error fetching states:", error);
                    setLoading(false);
                });
        }
    }, [country, field.dynamicOptions]);

    if (!isVisible || !formik) return null;

    const error = _.get(errors, field.id, "");
    const isTouched = _.get(touched, field.id, false);

    switch (field.type) {
        case "select":
            return (
                <FormControl fullWidth sx={{ my: 2 }} error={isTouched && !!error}>
                    <InputLabel>{field.label}</InputLabel>
                    <Select
                        name={field.id}
                        value={formik.values[field.id] || ""}
                        onChange={(event) => formik.setFieldValue(field.id, event.target.value)}
                        onBlur={formik.handleBlur}
                        label={field.label}
                        disabled={loading}
                        required
                    >
                        {loading && <MenuItem>Loading...</MenuItem>}
                        {(optionsMap[field.id] || field.options)?.map((option) => (
                            <MenuItem key={option} value={option}>
                                {option}
                            </MenuItem>
                        ))}
                    </Select>
                    {isTouched && error && <div style={{ color: "red", fontSize: "0.75rem" }}>{error}</div>}
                </FormControl>
            );
        case "radio":
            return (
                <FormControl component="fieldset" sx={{ my: 2 }} fullWidth error={isTouched && !!error}>
                    <FormLabel component="legend">{field.label}</FormLabel>
                    <RadioGroup name={field.id} value={formik.values[field.id] || ""} onChange={formik.handleChange}>
                        {field.options?.map((option) => (
                            <FormControlLabel key={option} value={option} control={<Radio />} label={option} />
                        ))}
                    </RadioGroup>
                    {isTouched && error && <div style={{ color: "red", fontSize: "0.75rem" }}>{error}</div>}
                </FormControl>
            );
        case "checkbox":
            const handleCheckboxChange = (event) => {
                const value = event.target.value;
                const current = formik.values[field.id] || [];
                const newValues = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
                formik.setFieldValue(field.id, newValues);
            };
            return (
                <FormControl component="fieldset" sx={{ my: 2 }} fullWidth error={isTouched && !!error}>
                    <FormLabel component="legend">{field.label}</FormLabel>
                    <MuiFormGroup>
                        {field.options?.map((option) => (
                            <FormControlLabel
                                key={option}
                                control={
                                    <Checkbox
                                        checked={(formik.values[field.id] || []).includes(option)}
                                        onChange={handleCheckboxChange}
                                        value={option}
                                    />
                                }
                                label={option}
                            />
                        ))}
                    </MuiFormGroup>
                    {isTouched && error && <div style={{ color: "red", fontSize: "0.75rem" }}>{error}</div>}
                </FormControl>
            );
        case "date":
            return (
                <TextField
                    name={field.id}
                    label={field.label}
                    type="date"
                    required
                    InputLabelProps={{ shrink: true }}
                    value={formik.values[field.id] || ""}
                    onChange={(event) => {
                        const value = event.target.value;
                        formik.setFieldValue(field.id, value);
                        formik.setFieldTouched(field.id, true);
                    }}
                    onBlur={formik.handleBlur}
                    error={isTouched && !!error}
                    helperText={isTouched && error}
                    fullWidth
                    sx={{ my: 2 }}
                />
            );
        case "number":
            return (
                <FormControl component="fieldset" sx={{ my: 2 }} fullWidth error={isTouched && !!error}>
                    <TextField
                        name={field.id}
                        label={field.label}
                        type="number"
                        required
                        value={formik.values[field.id] || ""}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        inputProps={{ min: field.validation?.min, max: field.validation?.max }}
                        error={isTouched && !!error}
                        helperText={isTouched && error}
                        fullWidth
                    />
                    {isTouched && error && <div style={{ color: "red", fontSize: "0.75rem" }}>{error}</div>}
                </FormControl>
            );
        default:
            return (
                <TextField
                    name={field.id}
                    required
                    label={field.label}
                    value={formik.values[field.id] || ""}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={isTouched && !!error}
                    helperText={isTouched && error}
                    fullWidth
                    sx={{ my: 2 }}
                />
            );
    }
};

export default FormField;
