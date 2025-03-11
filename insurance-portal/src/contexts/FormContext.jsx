import { fetchFormStructure } from "@/services/api";
import { createContext, useContext, useEffect, useState } from "react";

export const FormContext = createContext();

export const FormProvider = ({ children }) => {
    const [formConfig, setFormConfig] = useState(null);
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                const formData = await fetchFormStructure();

                const validatedData = {
                    fields: Array.isArray(formData) ? formData : formData?.fields || [],
                };

                setFormConfig(validatedData);
                setError(null);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    return <FormContext.Provider value={{ formConfig, submissions, loading, error }}>{children}</FormContext.Provider>;
};

export const useFormContext = () => {
    const context = useContext(FormContext);
    if (!context) {
        throw new Error("useFormContext must be used within a FormProvider");
    }
    return context;
};
