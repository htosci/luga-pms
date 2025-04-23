interface Props {
    value: string
    label?: string
    placeholder?: string
    onChange: (text:string) => void 
}

export default function InputText({value, label, placeholder, onChange}:Props){
    return (
        <div className="flex flex-col gap-1">
            <label className="block text-sm font-medium text-gray-700">{label}</label>
            <textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full flex items-center border rounded-xl px-3 py-2 transition focus-within:ring-2 border-gray-300"
            />
        </div>
    )
}