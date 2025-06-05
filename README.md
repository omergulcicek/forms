# @omergulcicek/forms

React Hook Form ile gelişmiş input alanları için mask ve regex desteği sağlayan TypeScript hook paketi.

## Kurulum

```bash
npm install @omergulcicek/forms
```

### Peer Dependencies

Bu paket aşağıdaki paketlere ihtiyaç duyar:

```bash
npm install react react-hook-form use-mask-input
```

## Kullanım

```tsx
import { useForm } from "react-hook-form"
import { useHookFormMask } from "use-mask-input"
import { useFormFields } from "@omergulcicek/forms"
import { Input } from "@/components/ui/input" // shadcn/ui

export default function MyForm() {
  const { register, control } = useForm()
  const registerWithMask = useHookFormMask(register)

  const { cardNumber, tckn, email, phone } = useFormFields({
    fields: [
      { name: "cardNumber", type: "cardNumber" },
      { name: "tckn", type: "tckn" },
      { name: "email", type: "email" },
      { name: "phone", type: "phone" }
    ],
    registerWithMask
  })

  return (
    <form>
      <Input 
        {...register("cardNumber")} 
        {...cardNumber} 
        placeholder="Kart Numarası" 
      />
      <Input 
        {...register("tckn")} 
        {...tckn} 
        placeholder="TC Kimlik No" 
      />
      <Input 
        {...register("email")} 
        {...email} 
        placeholder="E-posta" 
      />
      <Input 
        {...register("phone")} 
        {...phone} 
        placeholder="Telefon" 
      />
    </form>
  )
}
```

## Desteklenen Input Tipleri

| Tip | Açıklama | Mask | Regex |
|-----|----------|------|-------|
| `alpha` | Sadece harfler | - | Türkçe karakterler dahil |
| `email` | E-posta | - | E-posta formatı |
| `password` | Şifre | - | Min 6 karakter |
| `phone` | Telefon | 9999999999 | 10 haneli numara |
| `tckn` | TC Kimlik No | 99999999999 | 11 haneli numara |
| `text` | Normal metin | - | - |
| `cardNumber` | Kart numarası | 9999 9999 9999 9999 | 16 haneli numara |
| `expiryDate` | Son kullanma | 99/99 | MMYY formatı |
| `cvv` | CVV kodu | 999 | 3 haneli numara |
| `url` | Web adresi | - | HTTP/HTTPS URL |

## TypeScript Desteği

```tsx
import { FieldType, UseFormFieldsProps } from "@omergulcicek/forms"

const fields: { name: string; type: FieldType }[] = [
  { name: "email", type: "email" }
]
```

## shadcn/ui Uyumluluğu

Bu paket shadcn/ui Input bileşeni ile tam uyumlu olarak tasarlanmıştır.

## Lisans

MIT