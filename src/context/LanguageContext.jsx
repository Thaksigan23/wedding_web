import { createContext, useContext, useEffect } from 'react'

const LanguageContext = createContext(null)
const english = {
  lang: 'en',
  t: (field) => typeof field === 'string' ? field : field?.en ?? '',
}

export function LanguageProvider({ children }) {
  useEffect(() => {
    document.documentElement.lang = 'en'
  }, [])

  return (
    <LanguageContext.Provider value={english}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}
