// © 2025 Ömer Gülçiçek – MIT License
// https://omergulcicek.com • https://github.com/omergulcicek

import { useMemo, useCallback } from "react";

const MASKS = {
  tckn: "99999999999",
  cardNumber: "9999 9999 9999 9999",
  expiryDate: "99/99",
  cvv: "999",
  phone: "(999) 999 99 99",
} as const;

const REGEX = {
  alpha: /^[a-zA-ZğüşıöçĞÜŞİÖÇ\s]+$/,
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  phone: /^\d{10}$/,
  tckn: /^\d{11}$/,
  cardNumber: /^\d{4} \d{4} \d{4} \d{4}$/,
  expiryDate: /^(0[1-9]|1[0-2])\/([0-9]{2})$/,
  cvv: /^\d{3}$/,
  url: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/i,
};

const NUMERIC_FIELD_CONFIGS = {
  tckn: { maxLength: MASKS.tckn.length, pattern: REGEX.tckn.source },
  cardNumber: {
    maxLength: MASKS.cardNumber.length,
    pattern: REGEX.cardNumber.source,
  },
  expiryDate: {
    maxLength: MASKS.expiryDate.length,
    pattern: REGEX.expiryDate.source,
  },
  cvv: { maxLength: MASKS.cvv.length, pattern: REGEX.cvv.source },
  phone: { maxLength: MASKS.phone.length },
} as const;

const TEXT_FIELD_CONFIGS = {
  email: { type: "email" as const, pattern: REGEX.email.source },
  password: { type: "password" as const, minLength: 6 },
  url: { type: "url" as const, pattern: REGEX.url.source },
} as const;

const COMMON_NUMERIC_PROPS = {
  type: "text" as const,
  inputMode: "numeric" as const,
};

const NAVIGATION_KEYS = [
  "Backspace",
  "Delete",
  "Tab",
  "ArrowLeft",
  "ArrowRight",
  "Home",
  "End",
];

const MASK_OPTIONS = {
  showMaskOnFocus: false,
  showMaskOnHover: false,
  autoUnmask: true,
  placeholder: "",
} as const;

const INPUT_TYPE_TEXT = "text" as const;

type FieldType =
  | keyof typeof NUMERIC_FIELD_CONFIGS
  | keyof typeof TEXT_FIELD_CONFIGS
  | "alpha"
  | "text";

interface FieldConfig {
  name: string;
  type: FieldType;
}

interface UseFormFieldsParams<T extends Record<string, any>> {
  fields: Array<{ name: keyof T; type: FieldType }>;
  registerWithMask: (
    name: keyof T,
    mask: string,
    options?: Record<string, unknown>
  ) => Record<string, unknown>;
  register: (name: keyof T) => Record<string, unknown>;
}

const handleAlphaKeyDown = (e: { key: string; preventDefault: () => void }) => {
  if (!REGEX.alpha.test(e.key) && !NAVIGATION_KEYS.includes(e.key)) {
    e.preventDefault();
  }
};

const handleNumericKeyDown = (e: {
  key: string;
  preventDefault: () => void;
}) => {
  if (!/\d/.test(e.key) && !NAVIGATION_KEYS.includes(e.key)) {
    e.preventDefault();
  }
};

const isNumericField = (
  type: FieldType
): type is keyof typeof NUMERIC_FIELD_CONFIGS => type in NUMERIC_FIELD_CONFIGS;

const isCommonTextField = (
  type: FieldType
): type is keyof typeof TEXT_FIELD_CONFIGS => type in TEXT_FIELD_CONFIGS;

const getNumericFieldProps = (type: keyof typeof NUMERIC_FIELD_CONFIGS) => ({
  ...COMMON_NUMERIC_PROPS,
  ...NUMERIC_FIELD_CONFIGS[type],
  onKeyDown: handleNumericKeyDown,
});

/**
 * Creates form field props with mask and validation
 * @param fields - Array of field configurations
 * @param registerWithMask - React Hook Form mask register function
 * @param register - React Hook Form register function
 * @returns Object with field names as keys and props as values
 */
export function useFormFields<T extends Record<string, any>>({
  fields,
  registerWithMask,
  register,
}: UseFormFieldsParams<T>) {
  const memoizedRegister = useCallback(register, [register]);
  const memoizedRegisterWithMask = useCallback(registerWithMask, [
    registerWithMask,
  ]);

  const result = useMemo(() => {
    const result: Record<string, Record<string, unknown>> = {};

    fields.forEach(({ name, type }) => {
      const baseRegisterProps = memoizedRegister(name as keyof T);

      if (isNumericField(type)) {
        const maskProps = memoizedRegisterWithMask(
          name as keyof T,
          MASKS[type],
          MASK_OPTIONS
        );

        result[String(name)] = {
          ...maskProps,
          ...getNumericFieldProps(type),
        };
      } else if (type === "alpha") {
        result[String(name)] = {
          ...baseRegisterProps,
          type: INPUT_TYPE_TEXT,
          pattern: REGEX.alpha.source,
          onKeyDown: handleAlphaKeyDown,
        };
      } else if (isCommonTextField(type)) {
        result[String(name)] = {
          ...baseRegisterProps,
          ...TEXT_FIELD_CONFIGS[type],
        };
      } else {
        result[String(name)] = {
          ...baseRegisterProps,
          type: INPUT_TYPE_TEXT,
        };
      }
    });

    return result;
  }, [fields, memoizedRegister, memoizedRegisterWithMask]);

  return result;
}

export type { FieldType };
