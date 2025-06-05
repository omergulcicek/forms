type FieldType = "alpha" | "email" | "password" | "phone" | "tckn" | "text" | "cardNumber" | "expiryDate" | "cvv" | "url";
type UseFormFieldsProps = {
    fields: {
        name: string;
        type: FieldType;
    }[];
    registerWithMask: (name: string, mask: string, options?: Record<string, unknown>) => Record<string, unknown>;
};
type InputProps = Record<string, unknown>;
type UseFormFieldsReturn = {
    [key: string]: InputProps;
};
declare function useFormFields({ fields, registerWithMask, register, }: {
    fields: Array<{
        name: string;
        type: string;
    }>;
    registerWithMask: (name: string, mask: string, options: object) => object;
    register: (name: string) => object;
}): Record<string, object>;
export type { FieldType, UseFormFieldsProps, UseFormFieldsReturn };
export { useFormFields };
