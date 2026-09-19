import { AnimatePresence, motion } from 'motion/react'
import { X } from 'lucide-react'
import { SidebarContent } from './Sidebar'

export function MobileNav({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-ink/40 backdrop-blur-sm lg:hidden"
            aria-hidden
          />
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 380, damping: 36 }}
            className="fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] overflow-hidden border-r border-stone-200/70 bg-white shadow-2xl lg:hidden"
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute right-3 top-4 z-10 flex size-9 items-center justify-center rounded-xl text-stone-400 hover:bg-stone-100 hover:text-ink"
              aria-label="Close menu"
            >
              <X className="size-5" />
            </button>
            <div className="h-full">
              <SidebarContent onNavigate={onClose} />
            </div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  )
}