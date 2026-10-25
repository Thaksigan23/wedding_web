import { AudioToggle } from './AudioToggle'
import { useIsMobile } from '../hooks/useMediaQuery'

/** Desktop music control; mobile music lives inside the bottom navigation. */
export function InviteControlsDock({ audioUnlocked }) {
  const isMobile = useIsMobile()
  if (isMobile) return null

  return (
    <div className="invite-controls-dock" role="toolbar" aria-label="Invitation controls">
      <span className="invite-controls-dock-audio">
        <AudioToggle className="invite-controls-dock-btn" unlocked={audioUnlocked} />
      </span>
    </div>
  )
}
