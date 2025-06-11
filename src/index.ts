// © 2025 Ömer Gülçiçek – MIT License
// https://omergulcicek.com • https://github.com/omergulcicek

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
  password: { type: "password" as const },
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

interface FieldResult {
  value: string;
  maskedValue: string;
  [key: string]: any;
}

interface UseFormFieldsParams<T extends Record<string, any>> {
  fields: Array<{ name: keyof T; type: FieldType }>;
  registerWithMask: (
    name: keyof T,
    mask: string,
    options?: Record<string, unknown>
  ) => Record<string, unknown>;
  form: {
    register: (name: keyof T) => Record<string, unknown>;
    watch: (name?: keyof T) => any;
  };
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
 * @param form - React Hook Form instance
 * @returns Object with field names as keys and props as values
 */
export function useFormFields<T extends Record<string, any>>({
  fields,
  registerWithMask,
  form,
}: UseFormFieldsParams<T>): Record<string, FieldResult> {
  const result: Record<string, FieldResult> = {};

  fields.forEach(({ name, type }) => {
    const baseRegisterProps = form.register(name as keyof T);
    const watchedValue = form.watch(name as keyof T) || "";

    const getCleanValue = (value: string) => {
      if (isNumericField(type)) {
        return value.replace(/\D/g, "");
      }
      return value;
    };

    const getMaskedValue = (value: string): string => {
      if (!isNumericField(type) || !MASKS[type]) return value;

      const cleanValue = getCleanValue(value);
      const mask = MASKS[type];
      let valueIndex = 0;

      return [...mask].reduce((acc, char) => {
        if (valueIndex >= cleanValue.length) return acc;
        if (char === "9") {
          acc += cleanValue[valueIndex];
          valueIndex++;
        } else {
          acc += char;
        }
        return acc;
      }, "");
    };

    const baseResult = {
      value: getCleanValue(watchedValue),
      maskedValue: getMaskedValue(watchedValue),
    };

    if (isNumericField(type)) {
      const maskProps = registerWithMask(
        name as keyof T,
        MASKS[type],
        MASK_OPTIONS
      );

      result[String(name)] = {
        ...maskProps,
        ...getNumericFieldProps(type),
        ...baseResult,
      };
    } else if (type === "alpha") {
      result[String(name)] = {
        ...baseRegisterProps,
        type: INPUT_TYPE_TEXT,
        pattern: REGEX.alpha.source,
        onKeyDown: handleAlphaKeyDown,
        ...baseResult,
      };
    } else if (isCommonTextField(type)) {
      result[String(name)] = {
        ...baseRegisterProps,
        ...TEXT_FIELD_CONFIGS[type],
        ...baseResult,
      };
    } else {
      result[String(name)] = {
        ...baseRegisterProps,
        type: INPUT_TYPE_TEXT,
        ...baseResult,
      };
    }
  });

  return result;
}

export type { FieldType };
