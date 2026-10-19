import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { wedding } from '../data/wedding'

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(wedding.defaultLang)

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  const t = useCallback(
    (field) => {
      if (!field) return ''
      if (typeof field === 'string') return field
      return field[lang] ?? field.ta ?? field.en ?? ''
    },
    [lang],
  )

  const toggleLang = useCallback(() => {
    setLang((prev) => (prev === 'ta' ? 'en' : 'ta'))
  }, [])

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}
