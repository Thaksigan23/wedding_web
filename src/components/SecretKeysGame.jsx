import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { wedding } from '../data/wedding'
import { useLanguage } from '../context/LanguageContext'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import { ScrollReveal } from './ScrollReveal'
import { GoldDivider, InviteFrame } from './GoldDivider'

function shuffle(list) {
  const next = [...list]
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[next[i], next[j]] = [next[j], next[i]]
  }
  return next
}

function buildDeck(pairs) {
  const cards = pairs.flatMap((pair) => [
    { uid: `${pair.id}-a`, pairId: pair.id, src: pair.src, label: pair.label },
    { uid: `${pair.id}-b`, pairId: pair.id, src: pair.src, label: pair.label },
  ])
  return shuffle(cards)
}

function formatTime(totalSeconds) {
  const m = Math.floor(totalSeconds / 60)
  const s = totalSeconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

/**
 * Emerald + gold memory match — Secret Keys style.
 */
export function SecretKeysGame() {
  const { t, lang } = useLanguage()
  const reduced = usePrefersReducedMotion()
  const cfg = wedding.secretKeys

  const pairs = cfg?.pairs || []
  const pairCount = pairs.length

  const [deck, setDeck] = useState(() => buildDeck(pairs))
  const [flipped, setFlipped] = useState([])
  const [matched, setMatched] = useState(() => new Set())
  const [moves, setMoves] = useState(0)
  const [seconds, setSeconds] = useState(0)
  const [running, setRunning] = useState(false)
  const [locked, setLocked] = useState(false)
  const [won, setWon] = useState(false)
  const lockTimer = useRef(null)

  useEffect(() => () => clearTimeout(lockTimer.current), [])

  useEffect(() => {
    if (!running || won) return undefined
    const id = setInterval(() => setSeconds((s) => s + 1), 1000)
    return () => clearInterval(id)
  }, [running, won])

  const restart = useCallback(() => {
    clearTimeout(lockTimer.current)
    setDeck(buildDeck(pairs))
    setFlipped([])
    setMatched(new Set())
    setMoves(0)
    setSeconds(0)
    setRunning(false)
    setLocked(false)
    setWon(false)
  }, [pairs])

  const onFlip = (uid) => {
    if (locked || won) return
    if (flipped.includes(uid) || matched.has(deck.find((c) => c.uid === uid)?.pairId)) return

    if (!running) setRunning(true)

    const nextFlipped = [...flipped, uid]
    setFlipped(nextFlipped)

    if (nextFlipped.length < 2) return

    setMoves((m) => m + 1)
    setLocked(true)

    const [a, b] = nextFlipped
    const cardA = deck.find((c) => c.uid === a)
    const cardB = deck.find((c) => c.uid === b)

    if (cardA?.pairId && cardA.pairId === cardB?.pairId) {
      const nextMatched = new Set(matched)
      nextMatched.add(cardA.pairId)
      setMatched(nextMatched)
      setFlipped([])
      setLocked(false)
      if (nextMatched.size === pairCount) {
        setWon(true)
        setRunning(false)
      }
    } else {
      lockTimer.current = setTimeout(() => {
        setFlipped([])
        setLocked(false)
      }, reduced ? 280 : 720)
    }
  }

  const intro = useMemo(() => {
    const clean = (n) => String(n || '').replace(/^\[|\]$/g, '') || n
    return t(cfg.intro)
      .replace('{bride}', lang === 'ta' ? wedding.bride.name.ta : clean(wedding.bride.name.en))
      .replace('{groom}', lang === 'ta' ? wedding.groom.name.ta : clean(wedding.groom.name.en))
  }, [cfg.intro, lang, t])

  if (!cfg?.enabled || pairCount === 0) return null

  return (
    <section
      id="game"
      className="surface-maroon relative overflow-hidden px-[var(--section-pad-x)] py-[var(--section-pad-y)]"
      aria-labelledby="secret-keys-heading"
    >
      <div className="site-shell relative z-10">
        <ScrollReveal className="mx-auto max-w-3xl">
          <InviteFrame className="relative overflow-hidden">

            <div className="relative z-10 text-center">
              <p className="font-sans text-[0.62rem] tracking-[0.3em] text-gold uppercase">
                {t(cfg.eyebrow)}
              </p>
              <h2
                id="secret-keys-heading"
                className={`mt-3 text-gold-ink ${
                  lang === 'ta'
                    ? 'font-tamil text-[clamp(1.35rem,1.1rem+1.1vw,2rem)] leading-[1.65]'
                    : 'font-display text-[clamp(1.55rem,1.2rem+1.5vw,2.35rem)] font-light tracking-[0.12em] uppercase'
                }`}
              >
                {t(cfg.title)}
              </h2>
              <GoldDivider small className="mt-4" />
              <p
                className={`mx-auto mt-4 max-w-xl text-sm leading-relaxed text-ivory/75 ${
                  lang === 'ta' ? 'font-tamil leading-[1.75]' : 'font-display text-base'
                }`}
              >
                {intro}
              </p>

              {/* Stats */}
              <div className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-3 font-display text-gold sm:gap-x-8">
                <Stat label={t(cfg.moves)} value={String(moves)} />
                <Stat label={t(cfg.time)} value={formatTime(seconds)} />
                <Stat label={t(cfg.matched)} value={`${matched.size}/${pairCount}`} />
              </div>

              {/* Grid */}
              <ul
                className="mx-auto mt-8 grid max-w-lg list-none grid-cols-3 gap-2.5 p-0 sm:grid-cols-4 sm:gap-3 md:max-w-xl"
                role="list"
              >
                {deck.map((card) => {
                  const isMatched = matched.has(card.pairId)
                  const isFaceUp = isMatched || flipped.includes(card.uid)
                  return (
                    <li key={card.uid} className="aspect-square">
                      <MemoryCard
                        card={card}
                        faceUp={isFaceUp}
                        matched={isMatched}
                        reduced={reduced}
                        lang={lang}
                        disabled={locked || won || isFaceUp}
                        onFlip={() => onFlip(card.uid)}
                      />
                    </li>
                  )
                })}
              </ul>

              {/* Win banner */}
              <AnimatePresence>
                {won && (
                  <motion.div
                    className="mx-auto mt-8 max-w-md rounded-2xl border border-gold/40 bg-ivory/10 px-5 py-5 backdrop-blur-sm"
                    initial={reduced ? false : { opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    role="status"
                  >
                    <p
                      className={`text-gold ${
                        lang === 'ta'
                          ? 'font-tamil text-lg leading-[1.7]'
                          : 'font-script text-[1.85rem]'
                      }`}
                    >
                      {t(cfg.winTitle)}
                    </p>
                    <p
                      className={`mt-2 text-sm text-ivory/80 ${
                        lang === 'ta' ? 'font-tamil leading-[1.7]' : 'font-display'
                      }`}
                    >
                      {t(cfg.winMessage)}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.button
                type="button"
                onClick={restart}
                className="mt-8 inline-flex min-h-[48px] items-center gap-2 rounded-full border border-gold/55 bg-maroon-deep/60 px-6 font-sans text-[0.72rem] tracking-[0.2em] text-ivory uppercase transition hover:border-gold hover:bg-maroon-deep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
                whileTap={reduced ? undefined : { scale: 0.97 }}
              >
                <RestartIcon />
                {t(cfg.restart)}
              </motion.button>
            </div>
          </InviteFrame>
        </ScrollReveal>
      </div>
    </section>
  )
}

function Stat({ label, value }) {
  return (
    <div className="min-w-[3.5rem] text-center sm:min-w-[4.5rem]">
      <p className="font-sans text-[0.55rem] tracking-[0.12em] text-gold/70 uppercase sm:tracking-[0.22em]">{label}</p>
      <p className="mt-1 text-xl font-light tabular-nums tracking-wide md:text-2xl">{value}</p>
    </div>
  )
}

function MemoryCard({ card, faceUp, matched, reduced, lang, disabled, onFlip }) {
  return (
    <button
      type="button"
      onClick={onFlip}
      disabled={disabled}
      aria-label={
        faceUp
          ? lang === 'ta'
            ? card.label.ta
            : card.label.en
          : lang === 'ta'
            ? 'அட்டையைத் திருப்பு'
            : 'Flip card'
      }
      aria-pressed={faceUp}
      className="group relative h-full w-full min-h-[44px] [perspective:900px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold disabled:cursor-default"
    >
      <motion.div
        className="relative h-full w-full [transform-style:preserve-3d]"
        animate={{ rotateY: faceUp ? 180 : 0 }}
        transition={
          reduced
            ? { duration: 0.01 }
            : { duration: 0.55, ease: [0.16, 1, 0.3, 1] }
        }
      >
        {/* Back */}
        <div
          className="absolute inset-0 flex items-center justify-center rounded-[12px] border border-[#c9a24a]/35 shadow-md [backface-visibility:hidden]"
          style={{
            background: 'linear-gradient(160deg, #e0b84a 0%, #c9a24a 45%, #a88435 100%)',
          }}
        >
          <LockIcon className="h-6 w-6 text-maroon-deep/80 opacity-80 transition group-hover:opacity-100 sm:h-7 sm:w-7" />
        </div>

        {/* Front */}
        <div
          className={`absolute inset-0 overflow-hidden rounded-[12px] border bg-maroon-deep shadow-md [backface-visibility:hidden] [transform:rotateY(180deg)] ${
            matched ? 'border-gold ring-2 ring-gold/50' : 'border-gold/30'
          }`}
        >
          <img
            src={card.src}
            alt=""
            className="h-full w-full object-cover"
            draggable={false}
          />
          {matched && (
            <motion.div
              className="pointer-events-none absolute inset-0 bg-gold/15"
              initial={reduced ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            />
          )}
        </div>
      </motion.div>
    </button>
  )
}

function LockIcon({ className = '' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M12 2a5 5 0 00-5 5v2H6a2 2 0 00-2 2v9a2 2 0 002 2h12a2 2 0 002-2v-9a2 2 0 00-2-2h-1V7a5 5 0 00-5-5zm-3 7V7a3 3 0 116 0v2H9zm3 4a1.75 1.75 0 00-.75 3.33V18h1.5v-1.67A1.75 1.75 0 0012 13z" />
    </svg>
  )
}

function RestartIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4.5 12a7.5 7.5 0 0113.2-4.85M19.5 12a7.5 7.5 0 01-13.2 4.85"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path d="M17 3.5v4.2h-4.2M7 20.5v-4.2h4.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

