# @omergulcicek/forms

Advanced input fields with mask and regex support for React Hook Form - TypeScript hook package.

## Installation

```bash
npm install @omergulcicek/forms
```

### Peer Dependencies

This package requires the following dependencies:

```bash
npm install react react-hook-form use-mask-input
```

## Features

✅ **Keyboard Input Validation**: Numeric fields only accept numbers  
✅ **Smart Masking**: Automatic formatting for phone, card numbers, etc.  
✅ **Pattern Validation**: Built-in regex validation  
✅ **TypeScript Support**: Full type safety  
✅ **shadcn/ui Compatible**: Works seamlessly with shadcn/ui components  

## Usage

```tsx
import { useForm, FieldValues } from "react-hook-form"
import { useHookFormMask } from "use-mask-input"

import { useFormFields } from "@omergulcicek/forms"

export default function MyForm() {
  const form = useForm()
  const registerWithMask = useHookFormMask(form.register)

  const { cardNumber, cvv, tckn, email, phone, password, url, alpha, expiryDate, details } = useFormFields({
    fields: [
      { name: "cardNumber", type: "cardNumber" },
      { name: "cvv", type: "cvv" },
      { name: "tckn", type: "tckn" },
      { name: "email", type: "email" },
      { name: "phone", type: "phone" },
      { name: "password", type: "password" },
      { name: "url", type: "url" },
      { name: "alpha", type: "alpha" },
      { name: "expiryDate", type: "expiryDate" },
      { name: "details", type: "text" }
    ],
    registerWithMask,
    register: form.register
  })

  function onSubmit(data: FieldValues) {
    console.log(data)
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <label>
        <span>Card Number</span>
        <input {...cardNumber} placeholder="**** **** **** ****" />
      </label>
      <label>
        <span>Expiry Date</span>
        <input {...expiryDate} placeholder="MM/YY" />
      </label>
      <label>
        <span>CVV</span>
        <input {...cvv} placeholder="CVV" />
      </label>
      <label>
        <span>Turkish ID Number</span>
        <input {...tckn} placeholder="Turkish ID Number" />
      </label>
      <label>
        <span>Email</span>
        <input {...email} placeholder="Email" />
      </label>
      <label>
        <span>Phone</span>
        <input {...phone} placeholder="Phone" />
      </label>
      <label>
        <span>Password</span>
        <input {...password} placeholder="Password" />
      </label>
      <label>
        <span>Website</span>
        <input {...url} placeholder="https://example.com" />
      </label>
      <label>
        <span>Name (Letters Only)</span>
        <input {...alpha} placeholder="Full Name" />
      </label>
      <label>
        <span>Details</span>
        <input {...details} placeholder="Description" />
      </label>
      <button type="submit">Submit</button>
    </form>
  )
}
```

## Supported Input Types

| Type | Description | Mask | Keyboard Restriction | Validation |
|------|-------------|------|---------------------|------------|
| `alpha` | Letters only | - | Letters + Turkish chars + Space | Regex pattern |
| `email` | Email address | - | All chars | Email format |
| `password` | Password | - | All chars | Min 6 chars |
| `phone` | Phone number | (999) 999 99 99 | **Numbers only** | Mask validation |
| `tckn` | Turkish ID Number | 99999999999 | **Numbers only** | 11-digit + Pattern |
| `text` | Plain text | - | All chars | None |
| `cardNumber` | Credit card | 9999 9999 9999 9999 | **Numbers only** | 16-digit + Pattern |
| `expiryDate` | Expiry date | 99/99 | **Numbers only** | MM/YY format |
| `cvv` | CVV code | 999 | **Numbers only** | 3-digit + Pattern |
| `url` | Web address | - | All chars | HTTP/HTTPS URL |

## shadcn/ui Compatibility

This package is designed to be fully compatible with [shadcn/ui](https://ui.shadcn.com/docs/components/input?ref=omergulcicek/forms) input component.

```tsx
import { Input } from "@/components/ui/input"

const { alpha } = useFormFields<FormData>({
  fields: [{ name: "alpha", type: "alpha" }],
  registerWithMask,
  register: form.register
})

<Input {...alpha} />
```


```tsx
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const { alpha } = useFormFields<FormData>({
  fields: [{ name: "alpha", type: "alpha" }],
  registerWithMask,
  register: form.register,
  shadcn: true // Enable shadcn/ui compatibility (default=false)
})

<FormField
  control={form.control}
  name="alpha"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Your name</FormLabel>
      <FormControl>
        <Input
          {...field}
          {...alpha}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

## License

MIT
