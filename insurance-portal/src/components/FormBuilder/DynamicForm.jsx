import useResponsive from "@/hooks/useResponsive";
import { fetchFormStructure, fetchSubmissions, submitApplication } from "@/services/api";
import { Button, CircularProgress } from "@mui/material";
import { Form, Formik } from "formik";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import FormField from "./FormField";

const DynamicForm = () => {
    const router = useRouter();
    const [formStructures, setFormStructures] = useState([]);
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [fieldOptions, setFieldOptions] = useState({});
    const isSmallScreen = useResponsive("down", "md");

    const getFieldValidation = (field) => {
        let validation = Yup.mixed();

        switch (field.type) {
            case "text":
                validation = Yup.string();
                break;
            case "number":
                validation = Yup.number();
                if (field.validation?.min !== undefined) {
                    validation = validation.min(field.validation.min, `Must be at least ${field.validation.min}`);
                }
                if (field.validation?.max !== undefined) {
                    validation = validation.max(field.validation.max, `Must be at most ${field.validation.max}`);
                }
                break;
            case "date":
                validation = Yup.date().max(new Date(), "Date cannot be in the future");

                break;
            case "select":
            case "radio":
                validation = Yup.string();
                break;
            case "checkbox":
                validation = Yup.array().min(1, "At least one option must be selected");
                break;
            default:
                validation = Yup.mixed();
        }

        return validation;
    };

    const generateValidationSchema = (formStructure) => {
        const schema = {};

        const processFields = (fields) => {
            fields?.forEach((field) => {
                if (field.type === "group") {
                    processFields(field.fields);
                } else {
                    schema[field.id] = getFieldValidation(field);
                }
            });
        };

        processFields(formStructure.fields);

        return Yup.object().shape(schema);
    };

    const getInitialValues = (fields) => {
        const values = {};
        const processFields = (fields) => {
            fields?.forEach((field) => {
                if (field.type === "group") {
                    processFields(field.fields);
                } else {
                    values[field.id] = field.type === "checkbox" ? [] : "";
                }
            });
        };
        processFields(fields);
        return values;
    };

    const initialValues = formStructures.length > 0 ? getInitialValues(formStructures[0].fields) : {};
    const validationSchema = formStructures.length > 0 ? generateValidationSchema(formStructures[0]) : Yup.object({});

    useEffect(() => {
        fetchFormStructure()
            .then((data) => setFormStructures(data))
            .catch((err) => setError(err.message));

        fetchSubmissions()
            .then((data) => setSubmissions(data))
            .catch((err) => setError(err.message));
    }, []);

    const handleSubmit = async (values, { setSubmitting, resetForm, setErrors, setTouched }) => {
        setLoading(true);
        setError(null);
        setSuccessMessage(null);

        try {
            await validationSchema.validate(values, { abortEarly: false });
            const response = await submitApplication(values);
            setSuccessMessage("Form submitted successfully!");
            const updatedSubmissions = await fetchSubmissions();
            setSubmissions(updatedSubmissions);
            resetForm();
            router.push("/submit-success");
        } catch (err) {
            if (err.name === "ValidationError") {
                const touchedFields = {};
                const validationErrors = {};
                err.inner.forEach((error) => {
                    touchedFields[error.path] = true;
                    validationErrors[error.path] = error.message;
                });
                setTouched(touchedFields);
                setErrors(validationErrors);
            } else {
                setError(err.message || "An error occurred while submitting the form.");
            }
        } finally {
            setLoading(false);
            setSubmitting(false);
        }
    };

    if (formStructures.length === 0)
        return (
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
        );

    return (
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
            {({ isSubmitting, errors, touched }) => (
                <Form>
                    {formStructures?.map((formStructure) => (
                        <div key={formStructure.formId}>
                            <h2>{formStructure.title}</h2>
                            {formStructure.fields.map((field) =>
                                field.type === "group" ? (
                                    <div key={field.id}>
                                        <h4>{field.label}</h4>
                                        {field.fields.map((nestedField) => (
                                            <FormField
                                                key={nestedField.id}
                                                field={{ ...nestedField }}
                                                errors={errors}
                                                touched={touched}
                                                setFieldOptions={setFieldOptions}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <FormField key={field.id} field={field} errors={errors} touched={touched} setFieldOptions={setFieldOptions} />
                                )
                            )}
                        </div>
                    ))}
                    <Button variant="contained" type="submit" fullWidth disabled={isSubmitting}>
                        {isSubmitting ? "Submitting..." : "Submit"}
                    </Button>
                    {error && <div style={{ color: "red" }}>{error}</div>}
                </Form>
            )}
        </Formik>
    );
};

export default DynamicForm;
