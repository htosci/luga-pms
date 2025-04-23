// numInput.tsx
interface InputNumberProps {
  value: number
  onChange: (val: number) => void
  label?: string
  placeholder?: string
}

export default function InputNumber({ value, onChange, label, placeholder}: InputNumberProps) {
  return (
    <div>
      <label className="block font-medium">{label}:</label>
      <input
        type="number"
        className="w-full flex items-center border rounded-xl px-3 py-2 transition focus-within:ring-2 border-gray-300"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        placeholder={placeholder}
      />
    </div>
  )
}