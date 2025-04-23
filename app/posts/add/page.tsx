'use client'; 

import { useState, FormEvent, ChangeEvent } from 'react'
import { createClient } from '@/utils/supabase/client'

interface FormData {
    name: string
    content: string
  }

export default function AddPage() {
  const [formData, setFormData] = useState({
    name: '',   
    content: ''
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string>('')
  const supabase = createClient()

  const handleSubmit = async (e: FormEvent) => {
    
    e.preventDefault()
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('posts')
        .insert([formData])
        .select()

      if (error) throw error
      setMessage('Данные успешно добавлены!')
      setFormData({ name: '', content: ''})
    } catch (error) {
      setMessage(`Ошибка: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="container">
      <h1>Добавить запись</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Имя:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        
        <div>
          <label>Content:</label>
          <input
            type="text"
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Отправка...' : 'Добавить'}
        </button>
        
        {message && <p>{message}</p>}
      </form>

      <style jsx>{`
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        form div {
          margin-bottom: 15px;
        }
        label {
          display: block;
          margin-bottom: 5px;
        }
        input {
          width: 100%;
          padding: 8px;
          font-size: 16px;
          background: #dddddd;
        }
        button {
          background: #0070f3;
          color: white;
          border: none;
          padding: 10px 20px;
          cursor: pointer;
        }
        button:disabled {
          background: #ccc;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  )
}