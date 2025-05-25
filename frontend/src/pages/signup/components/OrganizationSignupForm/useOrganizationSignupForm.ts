import { useState } from "react";
import { useMutation, gql } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../../contexts/AuthContext";

const CREATE_ORGANIZATION = gql`
  mutation CreateOrganization($input: CreateOrganizationInput!) {
    createOrganization(input: $input) {
      id
      name
      slug
    }
  }
`;

interface FormValues {
  name: string;
  adminEmail: string;
  adminPassword: string;
  adminFirstName: string;
  adminLastName: string;
}

interface FormErrors {
  name?: string;
  adminEmail?: string;
  adminPassword?: string;
  adminFirstName?: string;
  adminLastName?: string;
}

export const useOrganizationSignupForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [createOrganization] = useMutation(CREATE_ORGANIZATION);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [values, setValues] = useState<FormValues>({
    name: "",
    adminEmail: "",
    adminPassword: "",
    adminFirstName: "",
    adminLastName: "",
  });

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<FormErrors>({});

  const validateField = (name: string, value: string): string | undefined => {
    switch (name) {
      case "name":
        return !value ? "Organization name is required" : undefined;
      case "adminEmail":
        return !value
          ? "Email is required"
          : !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)
          ? "Invalid email address"
          : undefined;
      case "adminPassword":
        return !value
          ? "Password is required"
          : value.length < 8
          ? "Password should be at least 8 characters"
          : undefined;
      case "adminFirstName":
        return !value ? "First name is required" : undefined;
      case "adminLastName":
        return !value ? "Last name is required" : undefined;
      default:
        return undefined;
    }
  };

  const validateForm = (formValues: FormValues): FormErrors => {
    const newErrors: FormErrors = {};
    Object.keys(formValues).forEach((key) => {
      const error = validateField(key, formValues[key as keyof FormValues]);
      if (error) {
        newErrors[key as keyof FormErrors] = error;
      }
    });
    return newErrors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formErrors = validateForm(values);
    setErrors(formErrors);
    setTouched(
      Object.keys(values).reduce((acc, key) => ({ ...acc, [key]: true }), {})
    );

    if (Object.keys(formErrors).length === 0) {
      setIsSubmitting(true);
      try {
        await createOrganization({
          variables: {
            input: values,
          },
        });

        await login(values.adminEmail, values.adminPassword);
        navigate("/dashboard");
      } catch (error) {
        console.error("Failed to create organization:", error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitting,
  };
};
