'use client'

import { createContext, useContext, useState, ReactNode, HTMLAttributes, forwardRef } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

// Context for Tabs
interface TabsContextType {
  activeTab: string
  setActiveTab: (id: string) => void
  variant: 'default' | 'pills' | 'underline' | 'cards'
}

const TabsContext = createContext<TabsContextType | undefined>(undefined)

const useTabsContext = () => {
  const context = useContext(TabsContext)
  if (!context) {
    throw new Error('Tabs components must be used within a Tabs provider')
  }
  return context
}

// Main Tabs component
interface TabsProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  defaultTab: string
  variant?: 'default' | 'pills' | 'underline' | 'cards'
  onTabChange?: (tabId: string) => void
}

const Tabs = forwardRef<HTMLDivElement, TabsProps>(
  ({ children, defaultTab, variant = 'default', onTabChange, className, ...props }, ref) => {
    const [activeTab, setActiveTabState] = useState(defaultTab)

    const setActiveTab = (id: string) => {
      setActiveTabState(id)
      onTabChange?.(id)
    }

    return (
      <TabsContext.Provider value={{ activeTab, setActiveTab, variant }}>
        <div ref={ref} className={cn('w-full', className)} {...props}>
          {children}
        </div>
      </TabsContext.Provider>
    )
  }
)

Tabs.displayName = 'Tabs'

// Tab List
interface TabListProps extends HTMLAttributes<HTMLDivElement> {
  fullWidth?: boolean
}

const TabList = forwardRef<HTMLDivElement, TabListProps>(
  ({ children, fullWidth = false, className, ...props }, ref) => {
    const { variant } = useTabsContext()

    const listStyles = {
      default: 'bg-slate-100 dark:bg-slate-800 rounded-xl p-1',
      pills: 'gap-2',
      underline: 'border-b-2 border-slate-200 dark:border-slate-700',
      cards: 'gap-2',
    }

    return (
      <div
        ref={ref}
        role="tablist"
        className={cn(
          'flex items-center',
          fullWidth ? 'w-full' : 'w-fit',
          listStyles[variant],
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

TabList.displayName = 'TabList'

// Individual Tab
interface TabProps extends HTMLAttributes<HTMLButtonElement> {
  id: string
  icon?: ReactNode
  badge?: ReactNode
  disabled?: boolean
}

const Tab = forwardRef<HTMLButtonElement, TabProps>(
  ({ id, icon, badge, disabled = false, children, className, ...props }, ref) => {
    const { activeTab, setActiveTab, variant } = useTabsContext()
    const isActive = activeTab === id

    const baseStyles = `
      relative flex items-center gap-2 font-semibold transition-all duration-200
      disabled:opacity-50 disabled:cursor-not-allowed
      focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:ring-offset-2
    `

    const variantStyles = {
      default: cn(
        'px-4 py-2 rounded-lg text-sm',
        isActive
          ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
      ),
      pills: cn(
        'px-4 py-2 rounded-full text-sm',
        isActive
          ? 'bg-red-500 text-white shadow-lg shadow-red-500/25'
          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
      ),
      underline: cn(
        'px-4 py-3 text-sm -mb-[2px]',
        isActive
          ? 'text-red-600 dark:text-red-500 border-b-2 border-red-600 dark:border-red-500'
          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border-b-2 border-transparent'
      ),
      cards: cn(
        'px-5 py-3 rounded-xl text-sm border-2',
        isActive
          ? 'bg-white dark:bg-slate-900 border-red-500 text-red-600 dark:text-red-500 shadow-lg'
          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600'
      ),
    }

    return (
      <button
        ref={ref}
        type="button"
        role="tab"
        aria-selected={isActive}
        aria-controls={`panel-${id}`}
        disabled={disabled}
        onClick={() => !disabled && setActiveTab(id)}
        className={cn(baseStyles, variantStyles[variant], className)}
        {...props}
      >
        {icon && <span className="flex-shrink-0">{icon}</span>}
        {children}
        {badge && <span className="flex-shrink-0">{badge}</span>}

        {/* Active indicator for default variant */}
        {variant === 'default' && isActive && (
          <motion.div
            layoutId="activeTab"
            className="absolute inset-0 bg-white dark:bg-slate-900 rounded-lg shadow-sm -z-10"
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          />
        )}
      </button>
    )
  }
)

Tab.displayName = 'Tab'

// Tab Panels Container
const TabPanels = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ children, className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('mt-4', className)} {...props}>
        {children}
      </div>
    )
  }
)

TabPanels.displayName = 'TabPanels'

// Individual Tab Panel
interface TabPanelProps {
  id: string
  unmountOnHide?: boolean
  children?: ReactNode
  className?: string
}

const TabPanel = forwardRef<HTMLDivElement, TabPanelProps>(
  ({ id, unmountOnHide = false, children, className }, ref) => {
    const { activeTab } = useTabsContext()
    const isActive = activeTab === id

    if (unmountOnHide && !isActive) {
      return null
    }

    return (
      <motion.div
        ref={ref}
        role="tabpanel"
        id={`panel-${id}`}
        aria-labelledby={id}
        hidden={!isActive}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 10 }}
        transition={{ duration: 0.2 }}
        className={cn(isActive ? 'block' : 'hidden', className)}
      >
        {children}
      </motion.div>
    )
  }
)

TabPanel.displayName = 'TabPanel'

// Simple Tabs component for quick use
interface SimpleTabsProps {
  tabs: Array<{
    id: string
    label: string
    icon?: ReactNode
    content: ReactNode
    disabled?: boolean
  }>
  defaultTab?: string
  variant?: 'default' | 'pills' | 'underline' | 'cards'
  fullWidth?: boolean
  className?: string
  onTabChange?: (tabId: string) => void
}

export const SimpleTabs = ({
  tabs,
  defaultTab,
  variant = 'default',
  fullWidth = false,
  className,
  onTabChange,
}: SimpleTabsProps) => {
  return (
    <Tabs
      defaultTab={defaultTab || tabs[0]?.id || ''}
      variant={variant}
      onTabChange={onTabChange}
      className={className}
    >
      <TabList fullWidth={fullWidth}>
        {tabs.map((tab) => (
          <Tab key={tab.id} id={tab.id} icon={tab.icon} disabled={tab.disabled}>
            {tab.label}
          </Tab>
        ))}
      </TabList>
      <TabPanels>
        {tabs.map((tab) => (
          <TabPanel key={tab.id} id={tab.id}>
            {tab.content}
          </TabPanel>
        ))}
      </TabPanels>
    </Tabs>
  )
}

export { Tabs, TabList, Tab, TabPanels, TabPanel }
export default Tabs
