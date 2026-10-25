/**
 * All editable wedding content lives here.
 * Update names, dates, venues, contacts, and toggle ceremony events on/off.
 */

export const wedding = {
  // The invitation is displayed in English.
  defaultLang: 'en',

  // Optional full-bleed hero photo (soft invite card uses mandap art instead)
  heroPhoto: '/images/invite-mandap.jpg',

  // Couple
  bride: {
    name: {
      ta: 'பிரதீபா',
      en: 'Pradeepa',
    },
    parents: {
      ta: 'திரு. ராஜரத்தினம் & திருமதி. சீதாலட்சுமி அவர்களின் மகள்',
      en: 'Daughter of Mr. Rajarathnam & Mrs. SeethaLetchumi',
    },
    hometown: {
      ta: '',
      en: '',
    },
    photo: '/images/Maroon%20and%20Gold%20Bridal%20Portrait.png',
  },

  groom: {
    name: {
      ta: 'விக்னேஸ்வரன்',
      en: 'Vickneshwaran',
    },
    parents: {
      ta: 'திரு. சுப்பையா & திருமதி. பரஞ்சோதி அவர்களின் மகன்',
      en: 'Son of Mr. Suppaiha & Mrs. Paranjothi',
    },
    hometown: {
      ta: '',
      en: '',
    },
    photo: '/images/Maroon%20and%20Gold%20Groom%20Portrait.jpg',
  },

  // Families line under names
  togetherWith: {
    ta: 'குடும்பத்தினருடன் இணைந்து',
    en: 'Together with their families',
  },

  // Hero titles
  invitationTitle: {
    ta: 'திருமணப் பதிவு அழைப்பிதழ்',
    en: 'Wedding Registration Invitation',
  },

  // Soft invitation-card hero (script title + lead line)
  ceremonyLabel: {
    ta: 'திருமணப் பதிவு',
    en: 'Wedding Registration',
  },
  inviteLead: {
    ta: 'எங்கள் திருமணப் பதிவு விழாவுக்கு உங்களை அன்புடன் அழைக்கிறோம்',
    en: 'We joyfully invite you to our wedding registration',
  },

  // Traditional invocation
  invocation: {
    pillaiyar: {
      ta: 'பிள்ளையார் துணை',
      en: 'With the blessings of Pillaiyar',
    },
    murugan: {
      ta: 'முருகன் துணை',
      en: 'With the blessings of Murugan',
    },
  },

  // Blessing / invitation note
  blessingNote: {
    title: {
      ta: 'அன்புடன் அழைக்கிறோம்',
      en: 'With love, we invite you',
    },
    body: {
      ta: 'எங்கள் குடும்பத்தின் மகிழ்ச்சியான தருணத்தில் நீங்கள் வந்து ஆசீர்வதிக்குமாறு அன்புடன் அழைக்கிறோம். உங்கள் வருகையும் ஆசீர்வாதமும் எங்களுக்கு மிகுந்த மகிழ்ச்சி தரும்.',
      en: 'We warmly invite you to bless the couple and share in our families’ joyous celebration. Your presence and blessings mean the world to us.',
    },
  },

  // Section headings
  sectionTitles: {
    couple: {
      ta: 'மணமக்கள்',
      en: 'The Couple',
    },
    timeline: {
      ta: 'திருமண நிகழ்வுகள்',
      en: 'Ceremony Timeline',
    },
    countdown: {
      ta: 'திருமணப் பதிவு வரை',
      en: 'Countdown to the Day',
    },
    venue: {
      ta: 'நிகழ்விடம்',
      en: 'Venue',
    },
    gallery: {
      ta: 'நினைவுப் படங்கள்',
      en: 'Photo Gallery',
    },
    rsvp: {
      ta: 'வருகை உறுதி',
      en: 'RSVP',
    },
  },

  // Sticky nav labels (short)
  nav: {
    story: { ta: 'மணமக்கள்', en: 'Couple' },
    events: { ta: 'நாள் கணக்கு', en: 'Countdown' },
    venue: { ta: 'நிகழ்விடம்', en: 'Venue' },
    gallery: { ta: 'படங்கள்', en: 'Gallery' },
    rsvp: { ta: 'RSVP', en: 'RSVP' },
    menu: { ta: 'பட்டி', en: 'Menu' },
    close: { ta: 'மூடு', en: 'Close' },
  },

  // Optional section eyebrows (English small-caps + Tamil)
  sectionEyebrows: {
    blessing: { ta: 'அழைப்பு', en: 'The Invitation' },
    couple: { ta: 'மணமக்கள்', en: 'The Couple' },
    timeline: { ta: 'திருமண நிகழ்வுகள்', en: 'The Ceremony' },
    countdown: { ta: 'நாள் கணக்கு', en: 'Counting Down' },
    venue: { ta: 'நிகழ்விடம்', en: 'Where to Find Us' },
    gallery: { ta: 'நினைவுகள்', en: 'Moments' },
    rsvp: { ta: 'வருகை உறுதி', en: 'Kindly Reply' },
  },

  // Main event — Wedding Registration
  // Use ISO 8601 with Sri Lanka offset (+05:30) so countdown is timezone-correct worldwide
  muhurtham: {
    datetime: '2026-11-15T10:00:00+05:30',
    endDatetime: '2026-11-15T14:00:00+05:30',
    dateDisplay: {
      ta: 'ஞாயிறு, நவம்பர் 15, 2026',
      en: 'Sunday, November 15, 2026',
    },
    nallaNeram: {
      ta: 'காலை 10:00 முதல்',
      en: '10:00 AM onwards',
    },
    calendarTitle: {
      ta: 'திருமணப் பதிவு - விக்னேஸ்வரன் & பிரதீபா',
      en: 'Wedding Registration - Vickneshwaran & Pradeepa',
    },
    calendarDescription: {
      ta: 'திருமணப் பதிவு விழா · Glen Rest, அத்திதியா, தெஹிவளை. உங்கள் வருகையும் ஆசீர்வாதமும் வரவேற்கப்படுகிறது.',
      en: 'Wedding Registration at Glen Rest, Attidiya, Dehiwala. Your presence and blessings are warmly welcome.',
    },
  },

  // Countdown unit labels + “today” message
  countdown: {
    days: { ta: 'நாட்கள்', en: 'Days' },
    hours: { ta: 'மணி', en: 'Hours' },
    minutes: { ta: 'நிமிடம்', en: 'Minutes' },
    seconds: { ta: 'வினாடி', en: 'Seconds' },
    todayMessage: {
      ta: 'இன்று திருமணப் பதிவு!',
      en: 'Today is the day!',
    },
  },

  // Venues — add one entry for ceremony, another for reception if they differ
  // Set enabled: false to hide. mapsEmbedUrl = Google Maps → Share → Embed a map → src URL
  venues: [
    {
      id: 'ceremony',
      enabled: true,
      label: {
        ta: 'திருமணப் பதிவு',
        en: 'Wedding Registration',
      },
      name: {
        ta: 'Glen Rest',
        en: 'Glen Rest',
      },
      address: {
        ta: 'அத்திதியா, தெஹிவளை',
        en: 'Attidiya, Dehiwala',
      },
      travelNotes: {
        ta: 'வாகன நிறுத்துமிடம் உள்ளது. விழா தொடங்கும் முன் 30 நிமிடம் வருக.',
        en: 'Parking available. Please arrive 30 minutes before the ceremony begins.',
      },
      mapsEmbedUrl:
        'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3961.5!2d79.875!3d6.84!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwNTAnMjQuMCJOIDc5wrA1MiczMC4wIkU!5e0!3m2!1sen!2slk!4v1700000000000',
      mapsLink: 'https://share.google/9H83HTt2c7fGxCpib',
    },
    {
      id: 'reception',
      enabled: false,
      label: {
        ta: 'வரவேற்பு / விருந்து',
        en: 'Reception',
      },
      name: {
        ta: 'Glen Rest',
        en: 'Glen Rest',
      },
      address: {
        ta: 'அத்திதியா, தெஹிவளை',
        en: 'Attidiya, Dehiwala',
      },
      travelNotes: {
        ta: '',
        en: '',
      },
      mapsEmbedUrl: '',
      mapsLink: 'https://share.google/9H83HTt2c7fGxCpib',
    },
  ],

  // Share & calendar actions
  share: {
    whatsappMessage: {
      ta: 'திருமணப் பதிவு அழைப்பிதழ் · விக்னேஸ்வரன் & பிரதீபா · ஞாயிறு, நவம்பர் 15, 2026 · Glen Rest, அத்திதியா, தெஹிவளை. அன்புடன் அழைக்கிறோம்:',
      en: 'Wedding Registration Invitation · Vickneshwaran & Pradeepa · Sunday, Nov 15, 2026 · Glen Rest, Attidiya, Dehiwala. You are warmly invited:',
    },
    addToCalendar: {
      ta: 'நாட்காட்டியில் சேர்',
      en: 'Add to Calendar',
    },
    googleCalendar: {
      ta: 'Google Calendar',
      en: 'Google Calendar',
    },
    shareWhatsApp: {
      ta: 'WhatsApp-இல் பகிர்',
      en: 'Share on WhatsApp',
    },
    getDirections: {
      ta: 'வழிகாட்டி',
      en: 'Get Directions',
    },
  },

  // Ceremony timeline — set enabled: false to hide an event
  timeline: [
    {
      id: 'porutham',
      enabled: false,
      icon: 'ring',
      title: {
        ta: 'பொருத்தம் / நிச்சயதார்த்தம்',
        en: 'Porutham / Nichayathartham',
      },
      subtitle: {
        ta: 'நிச்சயதார்த்த விழா',
        en: 'Engagement ceremony',
      },
      date: {
        ta: '[தேதி]',
        en: '[Date]',
      },
      time: {
        ta: '[நேரம்]',
        en: '[Time]',
      },
      venue: {
        ta: '[இடம்]',
        en: '[Venue]',
      },
    },
    {
      id: 'nalangu',
      enabled: false,
      icon: 'turmeric',
      title: {
        ta: 'நலங்கு / மஞ்சள் நீராட்டு',
        en: 'Nalangu / Manjal Neeratu',
      },
      subtitle: {
        ta: 'மஞ்சள் விழா',
        en: 'Turmeric ceremony',
      },
      date: {
        ta: '[தேதி]',
        en: '[Date]',
      },
      time: {
        ta: '[நேரம்]',
        en: '[Time]',
      },
      venue: {
        ta: '[இடம்]',
        en: '[Venue]',
      },
    },
    {
      id: 'mappillai',
      enabled: false,
      icon: 'procession',
      title: {
        ta: 'மாப்பிள்ளை அழைப்பு',
        en: 'Mappillai Azhaippu',
      },
      subtitle: {
        ta: 'மணமகன் வரவேற்பு',
        en: "Groom's welcome procession",
      },
      date: {
        ta: '[தேதி]',
        en: '[Date]',
      },
      time: {
        ta: '[நேரம்]',
        en: '[Time]',
      },
      venue: {
        ta: '[இடம்]',
        en: '[Venue]',
      },
    },
    {
      id: 'pillaiyar',
      enabled: false,
      icon: 'kumbam',
      title: {
        ta: 'பிள்ளையார் பூஜை & ஹோமம்',
        en: 'Pillaiyar Pooja and Homam',
      },
      subtitle: {
        ta: 'விநாயகர் வழிபாடு',
        en: 'Ganesha worship & sacred fire',
      },
      date: {
        ta: '[தேதி]',
        en: '[Date]',
      },
      time: {
        ta: '[நேரம்]',
        en: '[Time]',
      },
      venue: {
        ta: '[இடம்]',
        en: '[Venue]',
      },
    },
    {
      id: 'thaali',
      enabled: true,
      icon: 'thaali',
      title: {
        ta: 'திருமணப் பதிவு',
        en: 'Wedding Registration',
      },
      subtitle: {
        ta: 'பதிவு விழா · Glen Rest',
        en: 'Registration ceremony · Glen Rest',
      },
      date: {
        ta: 'ஞாயிறு, நவம்பர் 15, 2026',
        en: 'Sunday, November 15, 2026',
      },
      time: {
        ta: 'காலை 10:00 முதல்',
        en: '10:00 AM onwards',
      },
      venue: {
        ta: 'Glen Rest, அத்திதியா, தெஹிவளை',
        en: 'Glen Rest, Attidiya, Dehiwala',
      },
    },
    {
      id: 'oonjal',
      enabled: false,
      icon: 'swing',
      title: {
        ta: 'ஊஞ்சல் & பால் பழம்',
        en: 'Oonjal and Paal Pazham',
      },
      subtitle: {
        ta: 'ஊஞ்சல் சடங்கு',
        en: 'Swing ceremony',
      },
      date: {
        ta: '[தேதி]',
        en: '[Date]',
      },
      time: {
        ta: '[நேரம்]',
        en: '[Time]',
      },
      venue: {
        ta: '[இடம்]',
        en: '[Venue]',
      },
    },
    {
      id: 'mangala',
      enabled: false,
      icon: 'blessing',
      title: {
        ta: 'மங்கள வாழ்த்து & அம்மி மிதித்தல்',
        en: 'Mangala Vaazhthu and Ammi Mithithal',
      },
      subtitle: {
        ta: 'வாழ்த்துச் சடங்குகள்',
        en: 'Blessing rites',
      },
      date: {
        ta: '[தேதி]',
        en: '[Date]',
      },
      time: {
        ta: '[நேரம்]',
        en: '[Time]',
      },
      venue: {
        ta: '[இடம்]',
        en: '[Venue]',
      },
    },
    {
      id: 'reception',
      enabled: false,
      icon: 'feast',
      title: {
        ta: 'வரவேற்பு / வாழ்த்து விருந்து',
        en: 'Reception / Vaazhthu Virunthu',
      },
      subtitle: {
        ta: 'விருந்து & கொண்டாட்டம்',
        en: 'Feast & celebration',
      },
      date: {
        ta: 'ஞாயிறு, நவம்பர் 15, 2026',
        en: 'Sunday, November 15, 2026',
      },
      time: {
        ta: '',
        en: '',
      },
      venue: {
        ta: 'Glen Rest, அத்திதியா, தெஹிவளை',
        en: 'Glen Rest, Attidiya, Dehiwala',
      },
    },
  ],

  // Secret Keys memory game (6 pairs)
  secretKeys: {
    enabled: true,
    eyebrow: { ta: 'சிறிது விளையாட்டு', en: 'A Little Fun' },
    title: { ta: 'ரகசிய சாவிகள் விளையாட்டு', en: 'The Secret Keys Game' },
    intro: {
      ta: 'அட்டைகளைத் திருப்பி புனித அடையாளங்களைப் பொருத்தி மணமக்களுக்கு ஆசீர்வாதத்தைத் திறக்கவும்!',
      en: 'Flip the cards and match the sacred symbols to unlock a blessing for {groom} & {bride}!',
    },
    moves: { ta: 'நகர்வுகள்', en: 'Moves' },
    time: { ta: 'நேரம்', en: 'Time' },
    matched: { ta: 'பொருத்தம்', en: 'Matched' },
    restart: { ta: 'மீண்டும் விளையாடு', en: 'Restart Game' },
    winTitle: { ta: 'ஆசீர்வாதம் திறக்கப்பட்டது!', en: 'Blessing unlocked!' },
    winMessage: {
      ta: 'உங்கள் அன்பும் ஆசீர்வாதமும் மணமக்களுடன் இருக்கட்டும்.',
      en: 'May your love and blessings stay with the couple always.',
    },
    pairs: [
      { id: 'rings', src: '/images/icon-rings.jpg', label: { ta: 'மோதிரங்கள்', en: 'Rings' } },
      { id: 'thaali', src: '/images/icon-thaali.jpg', label: { ta: 'தாலி', en: 'Thaali' } },
      { id: 'lantern', src: '/images/icon-lantern.jpg', label: { ta: 'விளக்கு', en: 'Lantern' } },
      { id: 'kumbam', src: '/images/icon-kumbam.jpg', label: { ta: 'கும்பம்', en: 'Kumbam' } },
      { id: 'bell', src: '/images/icon-bell.jpg', label: { ta: 'மணி', en: 'Bell' } },
      { id: 'lotus', src: '/images/icon-lotus.jpg', label: { ta: 'தாமரை', en: 'Lotus' } },
    ],
  },

  // Gallery — one published photo; more after the event (typography, not extra frames)
  galleryComingSoon: {
    kicker: { ta: 'விரைவில்', en: 'Coming soon' },
    message: {
      ta: 'நிகழ்வுக்குப் பிறகு மேலும் நினைவுப் படங்கள் வெளியிடுவோம்',
      en: 'More photographs will follow after the ceremony',
    },
  },
  gallery: [
    {
      src: '/images/wedding-registration-banner.jpg',
      alt: {
        ta: 'விக்னேஸ்வரன் மற்றும் பிரதீபா - திருமணப் பதிவு',
        en: 'Vickneshwaran and Pradeepa - Wedding Registration',
      },
    },
    {
      src: '/images/Romantic%20Maroon%20and%20Gold%20Wedding%20Portrait.png',
      alt: {
        ta: 'விக்னேஸ்வரன் மற்றும் பிரதீபா',
        en: 'Vickneshwaran and Pradeepa',
      },
    },
  ],

  // RSVP — set endpoint to your Formspree URL, or leave '' for mailto/WhatsApp fallback
  rsvp: {
    endpoint: '', // e.g. 'https://formspree.io/f/xxxxxxxx'
    deadline: {
      ta: 'தயவுசெய்து நவம்பர் 1, 2026க்குள் பதிலளிக்கவும்',
      en: 'Please reply by November 1, 2026',
    },
    labels: {
      name: { ta: 'பெயர்', en: 'Name' },
      phone: { ta: 'தொலைபேசி (விரும்பினால்)', en: 'Phone (optional)' },
      guests: { ta: 'விருந்தினர் எண்ணிக்கை', en: 'Number of guests' },
      attending: { ta: 'வருகிறீர்களா?', en: 'Will you attend?' },
      attendingYes: { ta: 'ஆம்', en: 'Yes' },
      attendingNo: { ta: 'இல்லை', en: 'No' },
      message: { ta: 'செய்தி (விரும்பினால்)', en: 'Message (optional)' },
      submit: { ta: 'அனுப்பு', en: 'Send RSVP' },
      submitting: { ta: 'அனுப்புகிறது…', en: 'Sending…' },
    },
    errors: {
      nameRequired: { ta: 'பெயர் தேவை', en: 'Name is required' },
      attendingRequired: { ta: 'வருகையைத் தேர்ந்தெடுக்கவும்', en: 'Please select whether you will attend' },
      guestsInvalid: { ta: 'விருந்தினர் எண்ணிக்கை 1 முதல் 6 வரை', en: 'Guests must be between 1 and 6' },
    },
    success: {
      ta: 'நன்றி! உங்கள் வருகையை எதிர்பார்க்கிறோம்',
      en: 'Thank you, we look forward to seeing you',
    },
    error: {
      ta: 'அனுப்ப முடியவில்லை. மீண்டும் முயலவும்.',
      en: 'Something went wrong. Please try again.',
    },
    retry: { ta: 'மீண்டும் முயலவும்', en: 'Try again' },
    fallbackTitle: {
      ta: 'படிவம் தயாராகவில்லை - நேரடியாக தொடர்புகொள்ளுங்கள்',
      en: 'Form not set up yet - reach us directly',
    },
    fallbackWhatsApp: {
      ta: 'WhatsApp அனுப்பு',
      en: 'Message on WhatsApp',
    },
    fallbackEmail: {
      ta: 'மின்னஞ்சல் அனுப்பு',
      en: 'Send email',
    },
    // Used when endpoint is empty
    fallbackEmailAddress: 'family@example.com',
    fallbackWhatsAppNumber: '94703237827', // country code, no + or spaces
  },

  // Contacts (footer tap-to-call)
  contacts: [
    {
      id: 'groom',
      label: { ta: 'மணமகன் குடும்பம்', en: "Groom's family" },
      phone: '+94 76 138 8527',
      display: '+94 76 138 8527',
    },
    {
      id: 'bride',
      label: { ta: 'மணமகள் குடும்பம்', en: "Bride's family" },
      phone: '+94 70 323 7827',
      display: '+94 70 323 7827',
    },
  ],

  // Footer
  footer: {
    blessing: {
      ta: 'வாழ்த்துங்கள் வாழ்க வளமுடன்',
      en: 'Bless us - may you live and prosper',
    },
    families: {
      ta: 'சுப்பையா குடும்பம் & ராஜரத்தினம் குடும்பம்',
      en: 'The Suppaiha & Rajarathnam families',
    },
    madeWithLove: {
      ta: 'அன்புடன் உருவாக்கியது',
      en: 'Made with love by',
    },
    creditUrl: 'https://techloom.ai',
    creditLogo: '/images/techloom-mark.svg',
    creditName: 'techloom.ai',
  },

  // Open Graph / WhatsApp share preview
  // ogImage path is relative; absolute URL is built as meta.siteUrl + ogImage
  meta: {
    title: {
      ta: 'விக்னேஸ்வரன் & பிரதீபா - திருமணப் பதிவு அழைப்பிதழ்',
      en: 'Vickneshwaran & Pradeepa · Wedding Registration',
    },
    description: {
      ta: 'நவம்பர் 15, 2026 · Glen Rest, அத்திதியா, தெஹிவளை - திருமணப் பதிவுக்கு அன்புடன் அழைக்கிறோம்.',
      en: 'Sunday, November 15, 2026 · Glen Rest, Attidiya, Dehiwala - you are warmly invited to our wedding registration.',
    },
    ogImage: '/vickneshwaran-pradeepa-banner.jpg', // 1200×630, keep under 300KB
    siteUrl: 'https://vicknesh-weds-pradeepa-weddingregistration.techloom.ai',
  },

  // Audio (muted by default) — toggle hides itself if the file is missing
  audio: {
    // Royalty-free Pixabay nadaswaram instrumental (Tamil wedding mangala isai)
    src: '/audio/dheeni-premantara.mp3',
    mutedByDefault: false,
    autoplayOnOpen: true,
    targetVolume: 0.28,
    labels: {
      muted: { ta: 'இசை', en: 'Music' },
      playing: { ta: 'இயங்குகிறது', en: 'Playing' },
      unmute: { ta: 'இசையை இயக்கு', en: 'Play music' },
      mute: { ta: 'இசையை நிறுத்து', en: 'Mute music' },
    },
  },
}

export default wedding
