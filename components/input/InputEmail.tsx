import { useState } from "react";

interface InputEmailProps {
  value: string;
  onChange: (email: string) => void;
  label?: string;
  placeholder?: string;
}

export default function InputEmail({
  value,
  onChange,
  label = "Email",
  placeholder = "example@example.com",
}: InputEmailProps) {
  const [email, setEmail] = useState(value);
  const [isValid, setIsValid] = useState(true);
  const [touched, setTouched] = useState(false);

  // Валидация email с помощью регулярного выражения
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    onChange(newEmail);

    // Проверка email на валидность
    setIsValid(emailRegex.test(newEmail));
  };

  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <div
        className={`flex items-center border rounded-xl px-3 py-2 transition focus-within:ring-2 ${
          !isValid && touched ? "border-red-500 ring-red-400" : "border-gray-300 ring-blue-500"
        }`}
      >
        <input
          type="email"
          className="flex-1 outline-none text-base"
          placeholder={placeholder}
          value={email}
          onChange={handleChange}
          onBlur={() => setTouched(true)}
        />
      </div>
      {!isValid && touched && (
        <p className="text-sm text-red-500">Некорректный email</p>
      )}
    </div>
  );
}
