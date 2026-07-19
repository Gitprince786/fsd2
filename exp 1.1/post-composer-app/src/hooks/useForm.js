import { useState, useCallback, useEffect } from 'react';

/**
 * Custom form hook for managing post composer state and dynamic validation.
 * @param {Object} initialValues - The initial form values.
 * @param {Function} validateFn - The strategy pattern validation function.
 */
export function useForm(initialValues, validateFn) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({ content: null });
  const [isValid, setIsValid] = useState(true);

  // Validate the inputs and update error state
  const runValidation = useCallback((platform, content) => {
    if (!validateFn) return;
    const result = validateFn(platform, content);
    setErrors({ content: result.error });
    setIsValid(result.isValid);
  }, [validateFn]);

  // Handle standard field updates
  const handleChange = useCallback((field, value) => {
    setValues((prev) => {
      const nextValues = { ...prev, [field]: value };
      // Run validation with the updated values
      runValidation(nextValues.platform, nextValues.content);
      return nextValues;
    });
  }, [runValidation]);

  // Set values manually (e.g. loading a draft)
  const setFormValues = useCallback((newValues) => {
    setValues(newValues);
    runValidation(newValues.platform, newValues.content);
  }, [runValidation]);

  // Reset form
  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({ content: null });
    setIsValid(true);
  }, [initialValues]);

  // Re-run validation if platform changes externally
  useEffect(() => {
    runValidation(values.platform, values.content);
  }, [values.platform, runValidation]);

  return {
    values,
    errors,
    isValid,
    handleChange,
    setFormValues,
    reset
  };
}
