'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import InputName from './InputName'
import InputNumber from './InputNumber'
import InputCountrySelector from './InputCountrySelector'
import PhoneInput from './InputPhone'
import InputEmail from './InputEmail'
import InputText from './InputText'

type ColumnInfo = {
  column_name: string
  data_type: string
  is_nullable: boolean
}

type FormData = Record<string, any >

interface FormCreateUniversalInterface {
  tableName: string
  onSuccess?: () => void
  onError?: (error: any) => void
}

export default function FormCreateUniversal({ tableName, onSuccess= ()=> {} , onError = ()=> {}}: FormCreateUniversalInterface) {
  const [columns, setColumns] = useState<ColumnInfo[]>([])
  const [form, setForm] = useState<FormData>({})
  const supabase = createClient()
  
  useEffect(() => {
    const fetchTableStructure = async () => {
      let { data, error } = await supabase.rpc('get_table_schema', {
        table_name: tableName,
        table_schema: 'public',
      })

      if (error) {
        console.error('Error fetching table structure:', error)
        return
      }

      if (data) {
        console.log('Грузим шапку : '+data)
        const HIDDEN_PATTERNS = [/^id$/, /_at$/, /^uuid$/, /_by$/]

        const isHiddenField = (name: string) =>
          HIDDEN_PATTERNS.some(pattern => pattern.test(name))

        data = (data as ColumnInfo[]).filter(
          val => !isHiddenField(val.column_name)
        )
        setColumns(data)
      }
    }

    fetchTableStructure()
  }, [tableName])
  
  const updateField = (columnName: string, value: string | number) => {
    setForm(prev => ({
      ...prev,
      [columnName]: value
    }))
  }


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    console.log(form)
    const { error } = await supabase.from(tableName).insert([form])

    if (error) onError(error)
    else {
      onSuccess()
      setForm({}) 
      console.log('Успех!')
    }
  }

  const getInputComponent = (column: ColumnInfo) => {
    const commonProps = {
      value: form[column.column_name] || '',
      onChange: (val: any) => updateField(column.column_name, val),
      label: column.column_name.replace(/_/g, ' '),
      required: column.is_nullable === false
    }

  // Определяем тип ввода на основе имени столбца
  switch (column.column_name.toLowerCase()) {
    case 'email':
      return <InputEmail key={column.column_name} {...commonProps} />
      
    case 'phone':
      return <PhoneInput key={column.column_name} {...commonProps}/>
      
    case 'country':
      return <InputCountrySelector key={column.column_name} {...commonProps} />

    case 'comment':
    case 'description':
      return <InputText key={column.column_name} {...commonProps} />
  }

  // Если не определено по имени, определяем по типу данных
  switch (column.data_type) {
    case 'integer':
    case 'numeric':
      return <InputNumber key={column.column_name} {...commonProps} />
      
    default:
      return <InputName key={column.column_name} {...commonProps} />
  }
}

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-max m-5">
      {columns.map(column => (
        getInputComponent(column)
      ))}
      <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
        Отправить
      </button>
    </form>
  )
}