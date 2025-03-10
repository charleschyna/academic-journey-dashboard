
import * as React from "react"
import { FormControl, FormDescription, FormItem, FormLabel, FormMessage } from "./form"
import { Input } from "./input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select"
import { Textarea } from "./textarea"

interface FormFieldProps {
  type: "text" | "number" | "select" | "textarea"
  name: string
  label: string
  description?: string
  placeholder?: string
  options?: { value: string; label: string }[]
  value: string | number
  onChange: (value: string) => void
  disabled?: boolean
  required?: boolean
  min?: number
  max?: number
}

export function FormField({
  type,
  name,
  label,
  description,
  placeholder,
  options,
  value,
  onChange,
  disabled,
  required,
  min,
  max,
}: FormFieldProps) {
  const id = React.useId()
  
  return (
    <FormItem className="space-y-2">
      <FormLabel htmlFor={id}>{label}</FormLabel>
      <FormControl>
        {type === "select" ? (
          <Select
            value={String(value)}
            onValueChange={onChange}
            disabled={disabled}
          >
            <SelectTrigger id={id}>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : type === "textarea" ? (
          <Textarea
            id={id}
            name={name}
            value={String(value)}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
          />
        ) : (
          <Input
            id={id}
            name={name}
            type={type}
            value={String(value)}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            min={min}
            max={max}
          />
        )}
      </FormControl>
      {description && <FormDescription>{description}</FormDescription>}
      <FormMessage />
    </FormItem>
  )
}
