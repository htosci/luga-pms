import { createPortal } from 'react-dom'
import { useEffect, useState } from 'react'

interface ModalWrapperProps {
    open: boolean
    title?: string
    children?: React.ReactNode
    onClose: () => void
}

export default function ModalWrapper({open, title, children, onClose}: ModalWrapperProps){
    const [mounted, setMounted] = useState(false)
    const [show, setShow] = useState(false)
    
    useEffect(() => {
        if (open) {
            setShow(true)
            setTimeout(() => setMounted(true), 10)
        } else {
          setMounted(false) // триггерим анимацию закрытия
          const timeout = setTimeout(() => setShow(false), 300) // соответствие duration
          return () => clearTimeout(timeout)
        }
      }, [open])


    const modalContent = (
        <div className={
            `fixed flex inset-0 justify-center justify-items-center bg-black/50 transition-opacity duration-300
            ${mounted  ? 'opacity-100' : 'opacity-0 pointer-events-none'}`
            }
        >
            <div className={
                `m-5 bg-white rounded-4xl relative h-fit transition-transform duration-300
                ${mounted  ? 'translate-y-0': '-translate-y-full'}`
                }
            >
                <button 
                    onClick={onClose}
                    className="absolute top-5 right-5 bg-gray-400 w-10 h-10 rounded-full text-white hover:text-black"
                >X</button>
                <h2 className="block bg-gray-300 h-20 rounded-t-4xl p-5">{title}</h2>
                {children}
            </div>
        </div>
    )

    if (!show) return null

    return createPortal(modalContent, document.body)
}