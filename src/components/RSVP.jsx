import { useId, useState } from 'react'
import { motion } from 'framer-motion'
import { wedding } from '../data/wedding'
import { useLanguage } from '../context/LanguageContext'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import { ScrollReveal } from './ScrollReveal'
import { SectionHeader } from './SectionHeader'
import { FloralCorners, InviteFrame } from './GoldDivider'

const emptyForm = {
  name: '',
  phone: '',
  guests: '1',
  attending: '',
  message: '',
  website: '',
}

export function RSVP() {
  const { t, lang } = useLanguage()
  const reduced = usePrefersReducedMotion()
  const endpoint = (wedding.rsvp.endpoint || '').trim()
  const hasEndpoint = Boolean(endpoint) && !endpoint.includes('YOUR_FORM')

  const formId = useId()
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')

  const onChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  const setAttending = (value) => {
    setForm((prev) => ({ ...prev, attending: value }))
    setErrors((prev) => ({ ...prev, attending: undefined }))
  }

  const validate = () => {
    const next = {}
    if (!form.name.trim()) next.name = t(wedding.rsvp.errors.nameRequired)
    if (!form.attending) next.attending = t(wedding.rsvp.errors.attendingRequired)
    const guests = Number(form.guests)
    if (!Number.isInteger(guests) || guests < 1 || guests > 6) {
      next.guests = t(wedding.rsvp.errors.guestsInvalid)
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    if (form.website) return
    if (!validate()) return

    setStatus('submitting')
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          name: form.name.trim(),
          phone: form.phone.trim() || undefined,
          guests: Number(form.guests),
          attending: form.attending,
          message: form.message.trim() || undefined,
          _subject: `Wedding RSVP - ${form.name.trim()}`,
        }),
      })
      if (!res.ok) throw new Error('submit failed')
      setStatus('success')
      setForm(emptyForm)
    } catch {
      setStatus('error')
    }
  }

  return (
    <section
      id="rsvp"
      className="surface-maroon section-pad relative overflow-hidden"
      aria-labelledby="rsvp-heading"
    >
      <FloralCorners variant="rsvp" />
      <div className="site-shell relative z-10">
        <SectionHeader
          eyebrowKey="rsvp"
          titleKey="rsvp"
          titleId="rsvp-heading"
          light
          className="!mb-8 md:!mb-10"
        />
        {wedding.rsvp.deadline && (
          <ScrollReveal className="-mt-6 mb-8 text-center md:-mt-8 md:mb-10">
            <p
              className={`text-sm text-ivory/55 ${
                lang === 'ta' ? 'font-tamil leading-[1.7]' : 'font-sans'
              }`}
            >
              {t(wedding.rsvp.deadline)}
            </p>
          </ScrollReveal>
        )}

        <ScrollReveal delay={0.08}>
          <InviteFrame className="mx-auto max-w-lg">
            {!hasEndpoint ? (
              <FallbackContacts t={t} lang={lang} />
            ) : status === 'success' ? (
              <SuccessState t={t} lang={lang} reduced={reduced} />
            ) : (
              <form onSubmit={onSubmit} noValidate className="space-y-5">
                <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
                  <label htmlFor={`${formId}-website`}>Website</label>
                  <input
                    id={`${formId}-website`}
                    name="website"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={form.website}
                    onChange={onChange}
                  />
                </div>

                <FloatingField
                  id={`${formId}-name`}
                  label={t(wedding.rsvp.labels.name)}
                  error={errors.name}
                >
                  <input
                    id={`${formId}-name`}
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    placeholder=" "
                    value={form.name}
                    onChange={onChange}
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? `${formId}-name-err` : undefined}
                    className={inputClass}
                  />
                </FloatingField>

                <FloatingField id={`${formId}-phone`} label={t(wedding.rsvp.labels.phone)}>
                  <input
                    id={`${formId}-phone`}
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    placeholder=" "
                    value={form.phone}
                    onChange={onChange}
                    className={inputClass}
                  />
                </FloatingField>

                <FloatingField
                  id={`${formId}-guests`}
                  label={t(wedding.rsvp.labels.guests)}
                  error={errors.guests}
                >
                  <select
                    id={`${formId}-guests`}
                    name="guests"
                    value={form.guests}
                    onChange={onChange}
                    aria-invalid={Boolean(errors.guests)}
                    className={`${inputClass} pt-5`}
                  >
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </FloatingField>

                <fieldset>
                  <legend
                    className={`mb-3 text-sm text-ivory/75 ${
                      lang === 'ta' ? 'font-tamil' : 'font-sans'
                    }`}
                  >
                    {t(wedding.rsvp.labels.attending)}
                  </legend>
                  <div
                    className="inline-flex rounded-full border border-gold/30 bg-maroon-deep/40 p-1"
                    role="group"
                  >
                    {['yes', 'no'].map((value) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setAttending(value)}
                        aria-pressed={form.attending === value}
                        className={`min-h-[44px] min-w-[88px] rounded-full px-5 font-sans text-sm transition ${
                          form.attending === value
                            ? 'bg-gold text-maroon-deep shadow-sm'
                            : 'text-ivory/65 hover:text-gold-ink'
                        }`}
                      >
                        {t(
                          value === 'yes'
                            ? wedding.rsvp.labels.attendingYes
                            : wedding.rsvp.labels.attendingNo,
                        )}
                      </button>
                    ))}
                  </div>
                  {errors.attending && (
                    <p className="mt-2 font-sans text-sm text-kumkum" role="alert">
                      {errors.attending}
                    </p>
                  )}
                </fieldset>

                <FloatingField id={`${formId}-message`} label={t(wedding.rsvp.labels.message)}>
                  <textarea
                    id={`${formId}-message`}
                    name="message"
                    rows={3}
                    placeholder=" "
                    value={form.message}
                    onChange={onChange}
                    className={`${inputClass} resize-y pt-6`}
                  />
                </FloatingField>

                {status === 'error' && (
                  <div
                    className="rounded-[12px] border border-kumkum/35 bg-kumkum/8 px-3 py-3 font-sans text-sm text-kumkum"
                    role="alert"
                  >
                    <p>{t(wedding.rsvp.error)}</p>
                    <button
                      type="button"
                      onClick={() => setStatus('idle')}
                      className="mt-1 min-h-[44px] underline underline-offset-2"
                    >
                      {t(wedding.rsvp.retry)}
                    </button>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="btn-pill btn-pill-gold flex w-full min-h-[48px] items-center justify-center gap-2 text-base disabled:cursor-wait disabled:opacity-70"
                >
                  {status === 'submitting' && <Spinner />}
                  {status === 'submitting'
                    ? t(wedding.rsvp.labels.submitting)
                    : t(wedding.rsvp.labels.submit)}
                </button>
              </form>
            )}
          </InviteFrame>
        </ScrollReveal>
      </div>
    </section>
  )
}

const inputClass =
  'invite-input peer px-3.5 pb-2.5 pt-5 font-sans'

function FloatingField({ id, label, error, children }) {
  return (
    <div className="relative">
      {children}
      <label
        htmlFor={id}
        className="pointer-events-none absolute top-2.5 left-3.5 origin-left font-sans text-[0.7rem] tracking-wide text-gold/70 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-placeholder-shown:text-ivory/40 peer-focus:top-2.5 peer-focus:text-[0.7rem] peer-focus:text-gold"
      >
        {label}
      </label>
      {error && (
        <p id={`${id}-err`} className="mt-1.5 font-sans text-sm text-kumkum" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

function SuccessState({ t, lang, reduced }) {
  return (
    <div className="flex flex-col items-center py-4 text-center" role="status">
      <motion.div
        animate={reduced ? undefined : { scale: [1, 1.06, 1] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        className="mb-4 text-gold"
      >
        <KuthuvilakkuMini />
      </motion.div>
      <p
        className={`text-lg text-gold-ink ${
          lang === 'ta' ? 'font-tamil leading-[1.7]' : 'font-display'
        }`}
      >
        {t(wedding.rsvp.success)}
      </p>
    </div>
  )
}

function FallbackContacts({ t, lang }) {
  const email = wedding.rsvp.fallbackEmailAddress
  const wa = wedding.rsvp.fallbackWhatsAppNumber
  const subject = encodeURIComponent('Wedding RSVP')
  const waText = encodeURIComponent(
    t({
      ta: 'வணக்கம், திருமண அழைப்பிதழுக்கான வருகை உறுதியைத் தெரிவிக்க விரும்புகிறேன்.',
      en: 'Hello, I would like to RSVP for the wedding invitation.',
    }),
  )
  const textFont = lang === 'ta' ? 'font-tamil leading-[1.7]' : 'font-sans'

  return (
    <div className="text-center">
      <p className={`mb-5 text-ivory/80 ${textFont}`}>{t(wedding.rsvp.fallbackTitle)}</p>
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
        {email && (
          <a href={`mailto:${email}?subject=${subject}`} className="btn-pill btn-pill-gold min-h-[44px]">
            {t(wedding.rsvp.fallbackEmail)}
          </a>
        )}
        {wa && (
          <a
            href={`https://wa.me/${wa}?text=${waText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-pill btn-pill-outline min-h-[44px]"
          >
            {t(wedding.rsvp.fallbackWhatsApp)}
          </a>
        )}
      </div>
    </div>
  )
}

function KuthuvilakkuMini() {
  return (
    <svg width="36" height="52" viewBox="0 0 40 64" fill="none" aria-hidden="true">
      <ellipse cx="20" cy="58" rx="12" ry="3" stroke="currentColor" strokeWidth="1.2" />
      <path d="M20 54 V36" stroke="currentColor" strokeWidth="1.2" />
      <path d="M10 34 Q10 26 20 24 Q30 26 30 34" stroke="currentColor" strokeWidth="1.2" />
      {[10, 15, 20, 25, 30].map((x) => (
        <g key={x}>
          <path d={`M${x} 24 V16`} stroke="currentColor" strokeWidth="1" />
          <ellipse cx={x} cy="12" rx="1.6" ry="3.2" fill="currentColor" opacity="0.85" />
        </g>
      ))}
    </svg>
  )
}

function Spinner() {
  return (
    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" opacity="0.25" />
      <path d="M21 12a9 9 0 00-9-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}
