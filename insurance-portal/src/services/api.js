const BASE_URL = "https://assignment.devotel.io/api/insurance/forms";

const handleResponse = async (response) => {
    if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
    }
    return response.json();
};

export const fetchFormStructure = async () => {
    const response = await fetch(`${BASE_URL}`);
    return handleResponse(response);
};

export const submitApplication = async (data) => {
    console.log("Submitting data to API:", JSON.stringify(data, null, 2)); // Log the data being sent
    const response = await fetch("https://assignment.devotel.io/api/insurance/forms/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    const result = await handleResponse(response);
    console.log("API response:", result); // Log the API response
    return result;
};

export const fetchSubmissions = async () => {
    const response = await fetch(`${BASE_URL}/submissions`);
    return handleResponse(response);
};
