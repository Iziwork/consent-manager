import EventEmitter from 'events'
import cookies from 'js-cookie'
import React from 'react'
import Banner from './banner'
import PreferenceDialog from './preference-dialog'
import { ADVERTISING_CATEGORIES, FUNCTIONAL_CATEGORIES } from './categories'
import { Destination, CategoryPreferences, CustomCategories } from '../types'

const emitter = new EventEmitter()
export function openDialog() {
  emitter.emit('openDialog')
}

export const enum CloseBehavior {
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
  showBanner: boolean
  lang: string
  allowSmallBannerOnClose: boolean
  cancelDialogTitle: React.ReactNode
  cancelDialogContent: React.ReactNode
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

const Container: React.FC<ContainerProps> = (props) => {
  const [isDialogOpen, toggleDialog] = React.useState(false)
  const [showBanner, toggleBanner] = React.useState(true)

  let banner = React.useRef<HTMLElement>(null)
  let preferenceDialog = React.useRef<HTMLElement>(null)

  const {
    marketingDestinations,
    advertisingDestinations,
    functionalDestinations,
  } = normalizeDestinations(props.destinations)

  const handleBodyClick = (e) => {
    // Do nothing if no new implicit consent needs to be saved
    if (
      !props.isConsentRequired ||
      !props.implyConsentOnInteraction ||
      props.newDestinations.length === 0
    ) {
      return
    }

    // Ignore propogated clicks from inside the consent manager
    if (
      (banner.current && banner.current.contains(e.target)) ||
      (preferenceDialog.current && preferenceDialog.current.contains(e.target))
    ) {
      return
    }

    props.saveConsent(undefined, false)
  }

  const showDialog = () => toggleDialog(true)

  React.useEffect(() => {
    // If get cookie Tracking preferences, and allowSmallBannerOnClose = true, so show the small banner
    const COOKIE_KEY = 'tracking-preferences'
    if (cookies.getJSON(COOKIE_KEY)) {
      toggleBanner(false)
    }

    emitter.on('openDialog', showDialog)
    if (props.isConsentRequired && props.implyConsentOnInteraction) {
      document.body.addEventListener('click', handleBodyClick, false)
    }

    return () => {
      emitter.removeListener('openDialog', showDialog)
      document.body.removeEventListener('click', handleBodyClick, false)
    }
  })

  const onClose = () => {
    if (props.closeBehavior === undefined || props.closeBehavior === CloseBehavior.DISMISS) {
      const truePreferences = Object.keys(props.preferences).reduce((acc, category) => {
        acc[category] = true
        return acc
      }, {})

      props.saveConsent(truePreferences, false)
      return toggleBanner(false)
    }

    if (props.closeBehavior === CloseBehavior.ACCEPT) {
      toggleBanner(false)
      return props.saveConsent()
    }

    if (props.closeBehavior === CloseBehavior.DENY) {
      const falsePreferences = Object.keys(props.preferences).reduce((acc, category) => {
        acc[category] = false
        return acc
      }, {})

      props.setPreferences(falsePreferences)
      return props.saveConsent()
    }

    // closeBehavior is a custom function
    const customClosePreferences = props.closeBehavior(props.preferences)
    props.setPreferences(customClosePreferences)
    props.saveConsent()
    return toggleBanner(false)
  }

  const handleCategoryChange = (category: string, value: boolean) => {
    props.setPreferences({
      [category]: value,
    })
  }

  const handleSave = () => {
    props.saveConsent()
    toggleDialog(false)
    toggleBanner(false)
  }

  const handleCancel = () => {
    toggleDialog(false)
    toggleBanner(true)
    // Only show the cancel confirmation if there's unconsented destinations
    props.resetPreferences()
  }

  return (
    <div>
      <Banner
        innerRef={(current) => (banner = { current })}
        onClose={onClose}
        onChangePreferences={() => toggleDialog(true)}
        content={props.bannerContent}
        subContent={props.bannerSubContent}
        textColor={props.bannerTextColor}
        backgroundColor={props.bannerBackgroundColor}
        showBanner={showBanner}
        lang={props.lang}
        allowSmallBannerOnClose={props.allowSmallBannerOnClose}
      />

      {isDialogOpen && (
        <PreferenceDialog
          customCategories={props.customCategories}
          destinations={props.destinations}
          preferences={props.preferences}
          innerRef={(current) => (preferenceDialog = { current })}
          onCancel={handleCancel}
          onSave={handleSave}
          onChange={handleCategoryChange}
          marketingDestinations={marketingDestinations}
          advertisingDestinations={advertisingDestinations}
          functionalDestinations={functionalDestinations}
          marketingAndAnalytics={props.preferences.marketingAndAnalytics}
          advertising={props.preferences.advertising}
          functional={props.preferences.functional}
          title={props.preferencesDialogTitle}
          content={props.preferencesDialogContent}
          lang={props.lang}
        />
      )}
    </div>
  )
}

export default Container
