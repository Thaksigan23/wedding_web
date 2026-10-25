import { LanguageToggle } from './LanguageToggle'
import { AudioToggle } from './AudioToggle'

/**
 * After unlock: audio pill pinned bottom-left, language as a right-edge
 * vertical tab (same shape as the cover tag) so they sit on opposite sides.
 * On small screens the tab sits above the WhatsApp FAB.
 */
export function InviteControlsDock({ audioUnlocked }) {
  return (
    <div className="invite-controls-dock" role="toolbar" aria-label="Invitation controls">
      <span className="invite-controls-dock-audio">
        <AudioToggle className="invite-controls-dock-btn" unlocked={audioUnlocked} />
      </span>
      <LanguageToggle vertical compact className="invite-inner-lang" />
    </div>
  )
}
