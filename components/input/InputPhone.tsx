import { useState, useEffect } from "react";
import { parsePhoneNumberFromString, AsYouType } from "libphonenumber-js";
import Flag from "react-world-flags";

interface PhoneData {
  national: string;
  international: string;
  country: string | undefined;
  isValid: boolean;
  number: number ;
}

interface PhoneInputProps {
  value: string;
  onChange: (val: PhoneData) => void;
  label?: string;
  placeholder?: string;
  defaultCountry?: string;
}

export default function PhoneInput({
  value,
  onChange,
  label = "Телефон",
  placeholder = "+48 123 456 789",
  defaultCountry = "PL",
}: PhoneInputProps) {
  const [inputValue, setInputValue] = useState(value);
  const [touched, setTouched] = useState(false);
  const [isValid, setIsValid] = useState(true);
  const [countryCode, setCountryCode] = useState<string | undefined>(defaultCountry);

  useEffect(() => {
    const parsed = parsePhoneNumberFromString(inputValue || "");
    const valid = parsed ? parsed.isValid() : false;
    setIsValid(valid);
    setCountryCode(parsed?.country || defaultCountry);

    const numberOnlyDigits = parsed?.number.replace(/\D/g, "") || null;

    onChange({
      national: parsed?.formatNational() || inputValue,
      international: parsed?.formatInternational() || inputValue,
      country: parsed?.country,
      isValid: valid,
      number: numberOnlyDigits ? parseInt(numberOnlyDigits) : 0,
    });
  }, [inputValue]);

  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <div className={`flex items-center border rounded-xl px-3 py-2 transition focus-within:ring-2 ${!isValid && touched ? "border-red-500 ring-red-400" : "border-gray-300 ring-blue-500"}`}>
        {countryCode ? (
          <>
            <Flag code={countryCode} style={{ width: "24px", height: "16px", marginRight: "8px" }} />
            {countryCode}
          </>
        ) : (
          <div className="w-6 h-4 bg-gray-200 mr-2" />
        )}
        <input
          type="tel"
          className="flex-1 outline-none text-base"
          placeholder={placeholder}
          value={inputValue}
          onChange={(e) => setInputValue(new AsYouType().input(e.target.value))}
          onBlur={() => setTouched(true)}
        />
      </div>
      {!isValid && touched && (
        <p className="text-sm text-red-500">Некорректный номер</p>
      )}
    </div>
  );
}
