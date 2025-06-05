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

## Usage

```tsx
import { useForm, FieldValues } from "react-hook-form"
import { useHookFormMask } from "use-mask-input"

import { Input } from "@/components/ui/input" // shadcn/ui
import { Button } from "@/components/ui/button" // shadcn/ui

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
    <form onSubmit={form.handleSubmit(onSubmit)} className="container flex flex-col gap-4 my-20 max-w-2xl">
      <label>
        <span>Card Number</span>
        <Input {...cardNumber} placeholder="**** **** **** ****" />
      </label>
      <label>
        <span>Expiry Date</span>
        <Input {...expiryDate} placeholder="MM/YY" />
      </label>
      <label>
        <span>CVV</span>
        <Input {...cvv} placeholder="CVV" />
      </label>
      <label>
        <span>Turkish ID Number</span>
        <Input {...tckn} placeholder="Turkish ID Number" />
      </label>
      <label>
        <span>Email</span>
        <Input {...email} placeholder="Email" />
      </label>
      <label>
        <span>Phone</span>
        <Input {...phone} placeholder="Phone" />
      </label>
      <label>
        <span>Password</span>
        <Input {...password} placeholder="Password" />
      </label>
      <label>
        <span>Website</span>
        <Input {...url} placeholder="https://example.com" />
      </label>
      <label>
        <span>Name (Letters Only)</span>
        <Input {...alpha} placeholder="Full Name" />
      </label>
      <label>
        <span>Details</span>
        <Input {...details} placeholder="Description" />
      </label>
      <Button type="submit">Submit</Button>
    </form>
  )
}
```

## Supported Input Types

| Type | Description | Mask | Regex |
|------|-------------|------|-------|
| `alpha` | Letters only (a-z, A-Z) | - | Free text input |
| `email` | Email address | - | Email format validation |
| `password` | Password | - | Minimum 6 characters |
| `phone` | Phone number | (999) 999 99 99 | 10-digit number |
| `tckn` | Turkish ID Number | 99999999999 | 11-digit number |
| `text` | Plain text | - | Free text input |
| `cardNumber` | Credit card number | 9999 9999 9999 9999 | 16-digit number |
| `expiryDate` | Expiry date | 99/99 | MMYY format |
| `cvv` | CVV code | 999 | 3-digit number |
| `url` | Web address | - | HTTP/HTTPS URL |

## shadcn/ui Compatibility

This package is designed to be fully compatible with shadcn/ui Input component.

## License

MIT
