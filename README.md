# @omergulcicek/forms

Smart masking and validation for React Hook Form with TypeScript support.

![npm](https://img.shields.io/npm/v/@omergulcicek/forms)
![bundlephobia](https://img.shields.io/bundlephobia/minzip/@omergulcicek/forms)
![types](https://img.shields.io/npm/types/@omergulcicek/forms)
![license](https://img.shields.io/npm/l/@omergulcicek/forms)
![npm downloads](https://img.shields.io/npm/dw/@omergulcicek/forms)

## 🚀 Live Demo

Try the interactive demo: **[omergulcicek-forms.vercel.app](https://omergulcicek-forms.vercel.app/)**

See all input types with real-time validation, masking, and shadcn/ui integration in action.

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

**Keyboard Input Validation**: Numeric fields only accept numbers  
**Smart Masking**: Automatic formatting for phone, card numbers, etc.  
**Pattern Validation**: Built-in regex validation  
**Value Access**: Get both masked and unmasked field values  
**TypeScript Support**: Full type safety  
**shadcn/ui Compatible**: Works seamlessly with shadcn/ui components  

## Usage

```tsx
import { useForm } from "react-hook-form"
import { useHookFormMask } from "use-mask-input"
import { useFormFields } from "@omergulcicek/forms"

export default function MyForm() {
  const form = useForm()
  const registerWithMask = useHookFormMask(form.register)

  const { cardNumber, expiryDate, cvv, tckn, phone, email, url, alpha, password, details } = useFormFields({
    fields: [
      // 💳 Payment Fields
      { name: "cardNumber", type: "cardNumber" },
      { name: "expiryDate", type: "expiryDate" },
      { name: "cvv", type: "cvv" },
      
      // 🇹🇷 Turkish Specific
      { name: "tckn", type: "tckn" },
      { name: "phone", type: "phone" },
      
      // 📧 Contact & Web
      { name: "email", type: "email" },
      { name: "url", type: "url" },
      
      // 📝 Text Fields
      { name: "alpha", type: "alpha" },
      { name: "password", type: "password" },
      { name: "details", type: "text" }
    ],
    registerWithMask,
    form
  })

  // Access field values
  console.log(cardNumber.value)      // "1234567890123456" (unmasked)
  console.log(cardNumber.maskedValue) // "1234 5678 9012 3456" (masked)

  return (
    <form onSubmit={form.handleSubmit(console.log)}>
      {/* Payment */}
      <input {...cardNumber} placeholder="**** **** **** ****" />
      <input {...expiryDate} placeholder="MM/YY" />
      <input {...cvv} placeholder="***" />
      
      {/* Turkish */}
      <input {...tckn} placeholder="12345678950" />
      <input {...phone} placeholder="(5xx) xxx xx xx" />
      
      {/* Contact */}
      <input {...email} placeholder="email@example.com" />
      <input {...url} placeholder="https://example.com/" />
      
      {/* Text */}
      <input {...alpha} placeholder="Ömer Gülçiçek" />
      <input {...password} placeholder="••••••••" />
      <input {...details} placeholder="Additional details..." />

      <button type="submit">Submit</button>
    </form>
  )
}
```

## 💡 Value Access

Each field object provides both masked and unmasked values:

```tsx
const { cardNumber, phone } = useFormFields({
  fields: [
    { name: "cardNumber", type: "cardNumber" },
    { name: "phone", type: "phone" }
  ],
  registerWithMask,
  form
})

// Unmasked values (clean)
console.log(cardNumber.value)  // "1234567890123456"
console.log(phone.value)       // "5551234567"

// Masked values (formatted)
console.log(cardNumber.maskedValue)  // "1234 5678 9012 3456"
console.log(phone.maskedValue)       // "(555) 123 45 67"

// Use in JSX
<div>
  <span>Clean: {cardNumber.value}</span>
  <span>Formatted: {cardNumber.maskedValue}</span>
</div>
```

## 🎨 shadcn/ui Integration

This package works seamlessly with [shadcn/ui](https://ui.shadcn.com) components. Here's how to use it:

### With shadcn Input Component

```tsx
import { useForm } from "react-hook-form"
import { useHookFormMask } from "use-mask-input"
import { useFormFields } from "@omergulcicek/forms"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export default function ShadcnForm() {
  const form = useForm()
  const registerWithMask = useHookFormMask(form.register)

  const { cardNumber, phone, email, tckn } = useFormFields({
    fields: [
      { name: "cardNumber", type: "cardNumber" },
      { name: "phone", type: "phone" },
      { name: "email", type: "email" },
      { name: "tckn", type: "tckn" }
    ],
    registerWithMask,
    form
  })

  return (
    <form onSubmit={form.handleSubmit(console.log)} className="space-y-4">
      <div>
        <Label htmlFor="cardNumber">Card Number</Label>
        <Input {...cardNumber} placeholder="**** **** **** ****" />
      </div>
      
      <div>
        <Label htmlFor="phone">Phone</Label>
        <Input {...phone} placeholder="(5xx) xxx xx xx" />
      </div>
      
      <div>
        <Label htmlFor="email">Email</Label>
        <Input {...email} placeholder="email@example.com" />
      </div>
      
      <div>
        <Label htmlFor="tckn">Turkish ID</Label>
        <Input {...tckn} placeholder="12345678950" />
      </div>

      <Button type="submit">Submit</Button>
    </form>
  )
}
```

### With shadcn Form Components (Advanced)

Use the basic example for quick setup, or go with the advanced version for full form control with validation, error handling, and accessibility via shadcn/ui form components.

```tsx
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useHookFormMask } from "use-mask-input"
import { useFormFields } from "@omergulcicek/forms"
import * as z from "zod"

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
import { Button } from "@/components/ui/button"

const formSchema = z.object({
  cardNumber: z.string().min(1, "Card number is required"),
  phone: z.string().min(1, "Phone is required"),
  email: z.string().email("Invalid email address"),
})

export default function AdvancedShadcnForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  const registerWithMask = useHookFormMask(form.register)
  
  const { cardNumber, phone, email } = useFormFields({
    fields: [
      { name: "cardNumber", type: "cardNumber" },
      { name: "phone", type: "phone" },
      { name: "email", type: "email" }
    ],
    registerWithMask,
    form
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(console.log)} className="space-y-6">
        <FormField
          control={form.control}
          name="cardNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Card Number</FormLabel>
              <FormControl>
                <Input {...field} {...cardNumber} placeholder="**** **** **** ****" />
              </FormControl>
              <FormDescription>Enter your 16-digit card number</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input {...field} {...phone} placeholder="(5xx) xxx xx xx" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} {...email} placeholder="email@example.com" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}
```

### Key Benefits with shadcn/ui

**Perfect Integration**: Works seamlessly with Input, Label, and Form components  
**Automatic Styling**: Inherits shadcn's beautiful design system  
**Validation Support**: Compatible with Zod and form validation  
**Accessibility**: Maintains shadcn's accessibility features  
**TypeScript First**: Full type safety with shadcn components  

> **Note**: All input types (cardNumber, phone, email, tckn, etc.) work perfectly with shadcn/ui components.

### Contributors

- [@omergulcicek](https://github.com/omergulcicek)

