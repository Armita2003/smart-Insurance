<!-- Setup Instructions -->

1.Clone the repository
2.Install the dependencies(npm install)
3.Start the development server(npm run dev)
4.Open the application

<!-- API Usage Details -->

1. Form Configuration API

Description: The API provides a JSON structure that defines the form fields, their types, validation rules, and dynamic behavior (e.g., visibility conditions, dynamic options).

2. Field Types and Properties
   The API supports the following field types and properties:

<!-- Supported Field Types: -->

text: A text input field.
date: A date picker field.
number: A numeric input field.
select: A dropdown field with predefined options.
radio: A radio button group.
checkbox: A checkbox group.
group: A group of fields (nested fields).

<!-- Common Field Properties: -->

id: A unique identifier for the field.
label: The display label for the field.
type: The type of the field (e.g., text, select, radio).
required: Whether the field is required (true or false).
options: A list of options for select, radio, or checkbox fields.
validation: Validation rules for the field (e.g., min, max, pattern).
visibility: Conditions to control the visibility of the field.
dynamicOptions: Fetches options dynamically based on another field's value.

3.Dynamic Behavior

The API supports dynamic behavior for fields, such as:

Dynamic Options: Fetch options for a select field based on the value of another field.
Visibility Conditions: Show or hide fields based on the value of another field.

4.Usage in the Project

The form configuration is fetched from the API and dynamically rendered in the application.

Each field type is mapped to a corresponding UI component (e.g., text → <TextField />, select → <Select />).

Dynamic behavior (e.g., visibility, dynamic options) is handled using React state and effects.

<!-- Dependencies: -->

The project uses Material-UI for styling and components.
The @mui/icons-material package is used for icons.

<!-- Assumptions -->

The following assumptions were made during the implementation of the form:

1.Dynamic Options:

The dynamicOptions property assumes that the API endpoint (/api/getStates) returns a list of options in the format

2.Visibility Conditions:

The visibility property assumes that the condition is evaluated based on the value of the dependsOn field.

3.Validation:

Validation rules (e.g., min, max, pattern) are enforced on the client side using form validation libraries or custom logic.

4.Field Types:

All field types (text, date, number, select, radio, checkbox, group) are supported and mapped to appropriate UI components.

5.API Response:

The API response is static and does not change during the lifecycle of the form. If the form configuration changes, the page must be reloaded.

Example Form Configurations

<!-- Health Insurance Application -->

{
"formId": "health_insurance_application",
"title": "Health Insurance Application",
"fields": [
{
"id": "personal_info",
"label": "Personal Information",
"type": "group",
"fields": [
{
"id": "first_name",
"label": "First Name",
"type": "text",
"required": true
},
{
"id": "last_name",
"label": "Last Name",
"type": "text",
"required": true
},
{
"id": "dob",
"label": "Date of Birth",
"type": "date",
"required": true
}
]
}
]
}

<!-- Home Insurance Application -->

{
"formId": "home_insurance_application",
"title": "Home Insurance Application",
"fields": [
{
"id": "home_owner",
"label": "Are you the homeowner?",
"type": "radio",
"options": [
"Yes",
"No"
],
"required": true
}
]
}

<!-- Car Insurance Application -->

{
"formId": "car_insurance_application",
"title": "Car Insurance Application",
"fields": [
{
"id": "car_owner",
"label": "Are you the primary car owner?",
"type": "radio",
"options": [
"Yes",
"No"
],
"required": true
}
]
}
