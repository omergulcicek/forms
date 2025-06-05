type FieldType =
  | "alpha"
  | "email"
  | "password"
  | "phone"
  | "tckn"
  | "text"
  | "cardNumber"
  | "expiryDate"
  | "cvv"
  | "url";

type UseFormFieldsProps = {
  fields: { name: string; type: FieldType }[];
  registerWithMask: (
    name: string,
    mask: string,
    options?: Record<string, unknown>
  ) => Record<string, unknown>;
};

type InputProps = Record<string, unknown>;
type UseFormFieldsReturn = { [key: string]: InputProps };

const MASKS = {
  tckn: "99999999999",
  cardNumber: "9999 9999 9999 9999",
  expiryDate: "99/99",
  cvv: "999",
  phone: "(999) 999 99 99",
};

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

function useFormFields({
  fields,
  registerWithMask,
  register,
}: {
  fields: Array<{ name: string; type: string }>;
  registerWithMask: (name: string, mask: string, options: object) => object;
  register: (name: string) => object;
}) {
  const result: Record<string, object> = {};

  fields.forEach(({ name, type }) => {
    let inputProps = {};

    if (
      type === "tckn" ||
      type === "cardNumber" ||
      type === "expiryDate" ||
      type === "cvv" ||
      type === "phone"
    ) {
      const maskProps = registerWithMask(name, MASKS[type], {
        showMaskOnFocus: false,
        showMaskOnHover: false,
        autoUnmask: true,
        placeholder: "",
      });

      if (type === "cardNumber") {
        inputProps = {
          ...maskProps,
          maxLength: 19,
          type: "text",
          inputMode: "numeric",
        };
      } else if (type === "expiryDate") {
        inputProps = {
          ...maskProps,
          maxLength: 5,
          type: "text",
          inputMode: "numeric",
        };
      } else if (type === "phone") {
        inputProps = {
          ...maskProps,
          type: "text",
          inputMode: "numeric",
        };
      } else {
        inputProps = {
          ...maskProps,
          maxLength: MASKS[type].replace(/[^9]/g, "").length,
          type: type === "tckn" ? "tel" : "text",
          inputMode: "numeric",
        };
      }
    } else if (type === "email") {
      inputProps = {
        ...register(name),
        type: "email",
        pattern: REGEX.email.source,
      };
    } else if (type === "password") {
      inputProps = {
        ...register(name),
        type: "password",
        minLength: 6,
      };
    } else if (type === "url") {
      inputProps = {
        ...register(name),
        type: "url",
        pattern: REGEX.url.source,
      };
    } else if (type === "alpha") {
      inputProps = {
        ...register(name),
        type: "text",
        pattern: REGEX.alpha.source,
        onKeyDown: (e: KeyboardEvent) => {
          if (!REGEX.alpha.test(e.key)) {
            e.preventDefault();
          }
        },
      };
    } else {
      inputProps = {
        ...register(name),
        type: "text",
      };
    }

    result[name] = inputProps;
  });

  return result;
}

export type { FieldType, UseFormFieldsProps, UseFormFieldsReturn };
export { useFormFields };
