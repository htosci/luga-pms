interface InputNameProps {
    value: string
    onChange: (val: string) => void
    label?: string
  }
  
  export default function InputName({ value, onChange, label = 'name' }: InputNameProps) {
    return (
      <div>
        <label className="block font-medium">{label}:</label>
        <input
          type="text"
          className="w-full flex items-center border rounded-xl px-3 py-2 transition focus-within:ring-2 border-gray-300"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    )
  }