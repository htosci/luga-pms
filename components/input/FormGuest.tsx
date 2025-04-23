'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import InputName from './InputName'
import InputNumber from './InputNumber'
import InputCountrySelector from './InputCountrySelector'
import PhoneInput from './InputPhone'
import InputEmail from './InputEmail'
import InputText from './InputText'

type FormGuestData = {
    name: string
    age: number
    country: string // ISO-код
    phone: number
    email: string
    comment: string
  }

export default function FormGuest() {
  const [form, setForm] = useState<FormGuestData>({
    name: '',
    age: 0,
    country: '',
    phone: 0,
    email: '',
    comment: ''
  })

  const updateField = <K extends keyof FormGuestData>(key: K, value: FormGuestData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    console.log(form)
    //const { error } = await supabase.from('guests').insert([form])

    //if (error) alert('Ошибка: ' + error.message)
    //else alert('Успешно добавлено!')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-max m-5">
      <InputName value={form.name} onChange={(val) => updateField('name', val)} label='Имя' />
      <InputNumber value={form.age} onChange={(val) => updateField('age', val)} label='возраст' />
      <InputCountrySelector value={form.country} onChange={(val) => updateField('country', val)} />
      <PhoneInput value={form.country} onChange={(val) => updateField('phone', val.number)} />
      <InputEmail value={form.email} onChange={(val) => updateField('email', val)} />
      <InputText value={form.comment} label='Комментарий' placeholder='тут ваш текст' onChange={(val) => updateField('comment', val)} />

      <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
        Отправить
      </button>
    </form>
  )
}