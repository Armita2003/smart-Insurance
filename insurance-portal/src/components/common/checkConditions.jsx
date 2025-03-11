export const checkConditions = (visibility, values) => {
    if (!visibility) return true;
    const { dependsOn, condition, value } = visibility;
    const dependentValue = getNestedValue(values, dependsOn);

    switch (condition) {
        case "equals":
            return dependentValue === value;
        default:
            return true;
    }
};

const getNestedValue = (obj, path) => {
    return path.split(".").reduce((acc, part) => (acc && acc[part]) || null, obj);
};
