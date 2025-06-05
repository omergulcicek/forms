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

const FIELD_CONFIGS = {
  tckn: { maxLength: 11, pattern: REGEX.tckn.source },
  cardNumber: { maxLength: 19, pattern: REGEX.cardNumber.source },
  expiryDate: { maxLength: 5, pattern: REGEX.expiryDate.source },
  cvv: { maxLength: 3, pattern: REGEX.cvv.source },
  phone: { maxLength: 15 },
} as const;

const COMMON_NUMERIC_PROPS = {
  type: "text" as const,
  inputMode: "numeric" as const,
};

const COMMON_TEXT_FIELDS = {
  email: { type: "email" as const, pattern: REGEX.email.source },
  password: { type: "password" as const, minLength: 6 },
  url: { type: "url" as const, pattern: REGEX.url.source },
} as const;

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
  | keyof typeof FIELD_CONFIGS
  | keyof typeof COMMON_TEXT_FIELDS
  | "alpha"
  | "text";

interface FieldConfig {
  name: string;
  type: FieldType;
}

interface UseFormFieldsParams<T = Record<string, unknown>> {
  fields: FieldConfig[];
  registerWithMask: (
    name: keyof T,
    mask: string,
    options?: Record<string, unknown>
  ) => Record<string, unknown>;
  register: (name: keyof T) => Record<string, unknown>;
  shadcn?: boolean;
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

const isNumericField = (type: FieldType): type is keyof typeof FIELD_CONFIGS =>
  type in FIELD_CONFIGS;

const isCommonTextField = (
  type: FieldType
): type is keyof typeof COMMON_TEXT_FIELDS => type in COMMON_TEXT_FIELDS;

const getNumericFieldProps = (type: keyof typeof FIELD_CONFIGS) => ({
  ...COMMON_NUMERIC_PROPS,
  ...FIELD_CONFIGS[type],
  onKeyDown: handleNumericKeyDown,
});

const getShadcnMaskProps = (maskProps: Record<string, unknown>) => {
  const { onChange, onBlur, name, ref, ...rest } = maskProps;
  return rest;
};

export function useFormFields<T = Record<string, unknown>>({
  fields,
  registerWithMask,
  register,
  shadcn = false,
}: UseFormFieldsParams<T>) {
  const result: Record<string, Record<string, unknown>> = {};

  fields.forEach(({ name, type }) => {
    const baseRegisterProps = shadcn ? {} : register(name as keyof T);

    if (isNumericField(type)) {
      const maskProps = registerWithMask(
        name as keyof T,
        MASKS[type],
        MASK_OPTIONS
      );
      const baseMaskProps = shadcn ? getShadcnMaskProps(maskProps) : maskProps;

      result[name] = {
        ...baseMaskProps,
        ...getNumericFieldProps(type),
      };
    } else if (type === "alpha") {
      result[name] = {
        ...baseRegisterProps,
        type: INPUT_TYPE_TEXT,
        pattern: REGEX.alpha.source,
        onKeyDown: handleAlphaKeyDown,
      };
    } else if (isCommonTextField(type)) {
      result[name] = {
        ...baseRegisterProps,
        ...COMMON_TEXT_FIELDS[type],
      };
    } else {
      result[name] = {
        ...baseRegisterProps,
        type: INPUT_TYPE_TEXT,
      };
    }
  });

  return result;
}

export type { FieldType };
