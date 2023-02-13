import { EventEmitter } from 'events'
import cookies from 'js-cookie'
import React, {useEffect, useRef, useState} from 'react'
import Banner from './banner'
import PreferenceDialog from './preference-dialog'
import { ADVERTISING_CATEGORIES, FUNCTIONAL_CATEGORIES } from './categories'
import { Destination, CategoryPreferences, CustomCategories } from '../types'

const emitter = new EventEmitter()
export function openDialog() {
  emitter.emit('openDialog')
}

export enum CloseBehavior {
  ACCEPT = 'accept',
  DENY = 'deny',
  DISMISS = 'dismiss',
}

export interface CloseBehaviorFunction {
  (categories: CategoryPreferences): CategoryPreferences
}

interface ContainerProps {
  setPreferences: (prefs: CategoryPreferences) => void
  saveConsent: (newPreferences?: CategoryPreferences, shouldReload?: boolean) => void
  resetPreferences: () => void
  closeBehavior?: CloseBehavior | CloseBehaviorFunction
  destinations: Destination[]
  customCategories?: CustomCategories | undefined
  newDestinations: Destination[]
  preferences: CategoryPreferences
  isConsentRequired: boolean
  implyConsentOnInteraction: boolean
  bannerContent: React.ReactNode
  bannerSubContent: React.ReactNode
  bannerTextColor: string
  bannerBackgroundColor: string
  preferencesDialogTitle: React.ReactNode
  preferencesDialogContent: React.ReactNode
  lang: string
  allowSmallBannerOnClose: boolean
}

function normalizeDestinations(destinations: Destination[]) {
  const marketingDestinations: Destination[] = []
  const advertisingDestinations: Destination[] = []
  const functionalDestinations: Destination[] = []

  for (const destination of destinations) {
    if (ADVERTISING_CATEGORIES.find((c) => c === destination.category)) {
      advertisingDestinations.push(destination)
    } else if (FUNCTIONAL_CATEGORIES.find((c) => c === destination.category)) {
      functionalDestinations.push(destination)
    } else {
      // Fallback to marketing
      marketingDestinations.push(destination)
    }
  }

  return { marketingDestinations, advertisingDestinations, functionalDestinations }
}

const Container: React.FC<ContainerProps> = ({
  allowSmallBannerOnClose,
  bannerContent,
  bannerSubContent,
  bannerTextColor,
  bannerBackgroundColor,
  customCategories,
  destinations,
  implyConsentOnInteraction,
  isConsentRequired,
  lang,
  newDestinations,
  preferences,
  preferencesDialogTitle,
  preferencesDialogContent,
  closeBehavior,
  saveConsent,
  setPreferences,
  resetPreferences
}) => {
  const [isDialogOpen, toggleDialog] = useState(false)
  const [showBanner, toggleBanner] = useState(true)

  let banner = useRef<HTMLElement>(null)
  let preferenceDialog = useRef<HTMLElement>(null)

  const { marketingDestinations, advertisingDestinations, functionalDestinations } =
    normalizeDestinations(destinations)

  const handleBodyClick = (e) => {
    // Do nothing if no new implicit consent needs to be saved
    if (!isConsentRequired || !implyConsentOnInteraction || newDestinations.length === 0 ) {
      return
    }

    // Ignore propogated clicks from inside the consent manager
    if (
      (banner.current && banner.current.contains(e.target)) ||
      (preferenceDialog.current && preferenceDialog.current.contains(e.target))
    ) {
      return
    }

    saveConsent(undefined, false)
  }

  const showDialog = () => toggleDialog(true)

  useEffect(() => {
    // If get cookie Tracking preferences, and allowSmallBannerOnClose = true, so show the small banner
    const COOKIE_KEY = 'tracking-preferences'
    if (cookies.get(COOKIE_KEY)) {
      toggleBanner(false)
    }

    emitter.on('openDialog', showDialog)
    if (isConsentRequired && implyConsentOnInteraction) {
      document.body.addEventListener('click', handleBodyClick, false)
    }

    return () => {
      emitter.removeListener('openDialog', showDialog)
      document.body.removeEventListener('click', handleBodyClick, false)
    }
  })

  const onClose = () => {
    if (closeBehavior === undefined || closeBehavior === CloseBehavior.DISMISS) {
      return toggleBanner(false)
    }

    if (closeBehavior === CloseBehavior.ACCEPT) {
      const truePreferences = Object.keys(preferences).reduce((acc, category) => {
        acc[category] = true
        return acc
      }, {})

      saveConsent(truePreferences, false)
      return toggleBanner(false)
    }

    if (closeBehavior === CloseBehavior.DENY) {
      const falsePreferences = Object.keys(preferences).reduce((acc, category) => {
        acc[category] = false
        return acc
      }, {})

      setPreferences(falsePreferences)
      return saveConsent()
    }

    // closeBehavior is a custom function
    const customClosePreferences = closeBehavior(preferences)
    setPreferences(customClosePreferences)
    saveConsent()
    return toggleBanner(false)
  }

  const handleCategoryChange = (category: string, value: boolean) => {
    setPreferences({
      [category]: value,
    })
  }

  const handleSave = () => {
    saveConsent()
    toggleDialog(false)
    toggleBanner(false)
  }

  const handleCancel = () => {
    toggleDialog(false)
    toggleBanner(true)
    // Only show the cancel confirmation if there's unconsented destinations
    resetPreferences()
  }

  return (
    <div>
      <Banner
        innerRef={(current) => (banner = { current })}
        onClose={onClose}
        onChangePreferences={() => toggleDialog(true)}
        content={bannerContent}
        subContent={bannerSubContent}
        textColor={bannerTextColor}
        backgroundColor={bannerBackgroundColor}
        showBanner={showBanner}
        lang={lang}
        allowSmallBannerOnClose={allowSmallBannerOnClose}
      />

      {isDialogOpen && (
        <PreferenceDialog
          customCategories={customCategories}
          destinations={destinations}
          preferences={preferences}
          innerRef={(current) => (preferenceDialog = { current })}
          onCancel={handleCancel}
          onSave={handleSave}
          onChange={handleCategoryChange}
          marketingDestinations={marketingDestinations}
          advertisingDestinations={advertisingDestinations}
          functionalDestinations={functionalDestinations}
          marketingAndAnalytics={preferences.marketingAndAnalytics}
          advertising={preferences.advertising}
          functional={preferences.functional}
          title={preferencesDialogTitle}
          content={preferencesDialogContent}
          lang={lang}
        />
      )}
    </div>
  )
}

export default Container
