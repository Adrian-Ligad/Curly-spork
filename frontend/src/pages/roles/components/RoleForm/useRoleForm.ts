import { useState, ChangeEvent, FocusEvent, FormEvent } from "react";

interface RoleFormValues {
  name: string;
  description: string;
  wage: number;
}

interface FormErrors {
  name?: string;
  description?: string;
  wage?: string;
}

interface UseRoleFormProps {
  onSubmit: () => void;
  initialValues?: RoleFormValues;
}

export const useRoleForm = ({ onSubmit, initialValues }: UseRoleFormProps) => {
  const [values, setValues] = useState<RoleFormValues>({
    name: initialValues?.name || "",
    description: initialValues?.description || "",
    wage: initialValues?.wage || 0,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateField = (name: string, value: any): string => {
    switch (name) {
      case "name":
        return !value ? "Name is required" : "";
      case "wage":
        return !value
          ? "Wage is required"
          : value < 0
          ? "Wage must be greater than or equal to 0"
          : "";
      default:
        return "";
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));

    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const newErrors: FormErrors = {};
    Object.keys(values).forEach((key) => {
      const error = validateField(key, values[key as keyof typeof values]);
      if (error) {
        newErrors[key as keyof FormErrors] = error;
      }
    });

    setErrors(newErrors);
    setTouched({
      name: true,
      description: true,
      wage: true,
    });

    if (Object.keys(newErrors).length === 0) {
      console.log("Form values:", values);
      onSubmit();
    }
  };

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
  };
};
