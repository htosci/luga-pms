'use client'

import ModalWrapper from "@/components/ModalWrapper"
import { useState } from "react"
import { UniversalTable } from "@/components/UniversalTable"
import { useTableData } from "@/hooks/useTableData"
import { StrictMode } from "react"
import FormCreateUniversal from "@/components/input/FormCreateUniversal"

export default function indexPage() {
  const { data, loading, fetchData } = useTableData("posts")
  const [open, setOpen] = useState(false)
  return (
    <>
      <StrictMode>
        <UniversalTable data={data} loading={loading} />
        <ModalWrapper open={open} title='новая запись' onClose={() => setOpen(false)}>
          <FormCreateUniversal tableName="posts" 
            onSuccess={() => {
              fetchData();
              setOpen(false);
            }}/>
        </ModalWrapper>
        <button 
        className="bg-amber-400 rounded-xl p-2 m-2 shadow"
        onClick={() => setOpen(true)}
        >
          +
        </button>
      </StrictMode>
    </>
  )
}