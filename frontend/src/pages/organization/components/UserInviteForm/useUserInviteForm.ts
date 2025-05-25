import { useState } from "react";
import { useMutation, useQuery, gql } from "@apollo/client";
import { useAuth } from "../../../../contexts/AuthContext";

const INVITE_USER = gql`
  mutation InviteUser($input: RegisterUserInput!) {
    registerUser(input: $input) {
      id
      email
      firstName
      lastName
      role {
        id
        name
      }
    }
  }
`;

const GET_ORGANIZATION_ROLES = gql`
  query GetOrganizationRoles {
    organization {
      roles {
        id
        name
      }
    }
  }
`;

interface FormValues {
  email: string;
  firstName: string;
  lastName: string;
  roleId: string;
}

interface FormErrors {
  email?: string;
  firstName?: string;
  lastName?: string;
  roleId?: string;
}

interface Role {
  id: string;
  name: string;
}

export const useUserInviteForm = () => {
  const { user } = useAuth();
  const [inviteUser] = useMutation(INVITE_USER);
  const { data: rolesData } = useQuery(GET_ORGANIZATION_ROLES);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [values, setValues] = useState<FormValues>({
    email: "",
    firstName: "",
    lastName: "",
    roleId: "",
  });

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<FormErrors>({});

  const roles: Role[] = rolesData?.organization?.roles || [];

  const validateField = (name: string, value: string): string | undefined => {
    switch (name) {
      case "email":
        return !value
          ? "Email is required"
          : !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)
          ? "Invalid email address"
          : undefined;
      case "firstName":
        return !value ? "First name is required" : undefined;
      case "lastName":
        return !value ? "Last name is required" : undefined;
      case "roleId":
        return !value ? "Role is required" : undefined;
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | { name: string; value: unknown }>
  ) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    const error = validateField(name, value as string);
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
        await inviteUser({
          variables: {
            input: {
              ...values,
              orgId: user?.orgId,
              password: Math.random().toString(36).slice(-8),
            },
          },
        });

        setValues({
          email: "",
          firstName: "",
          lastName: "",
          roleId: "",
        });
        setTouched({});
        setErrors({});
      } catch (error) {
        console.error("Failed to invite user:", error);
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
    roles,
  };
};
