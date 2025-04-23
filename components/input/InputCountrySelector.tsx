import { useState, useEffect } from 'react'
import countries from 'i18n-iso-countries'
import ru from 'i18n-iso-countries/langs/ru.json'
import Flag from "react-world-flags";

interface InputCountrySelectorProps {
    value: string
    onChange: (val: string) => void
    label?: string;
  }

// Регистрируем русскую локаль
countries.registerLocale(ru)

export default function InputCountrySelector({value , onChange, label='Выберите страну:'}:InputCountrySelectorProps) {
  const [countryList, setCountryList] = useState<{ code: string; name: string }[]>([])
  const [countryCode, setCountryCode] = useState<string>(value)

  useEffect(() => {
    const names = countries.getNames('ru', { select: 'official' })
    const list = Object.entries(names).map(([code, name]) => ({ code, name }))
    setCountryList(list)
    onChange(countryCode)

  }, [])

  return (
    <div>
      <label className="block font-medium">
        {label}  <Flag code={countryCode} style={{ width: "24px", height: "16px", marginRight: "8px", display: 'inline' }} />
      </label>
      <select
        className="w-full flex items-center border rounded-xl px-3 py-2 transition focus-within:ring-2 border-gray-300"
        value={value}
        onChange={(e) => setCountryCode(String(e.target.value))}
      >
        {countryList.map(({ code, name }) => (
          <option key={code} value={code}>
            {name}
          </option>
        ))}
      </select>
    </div>
  )
}
