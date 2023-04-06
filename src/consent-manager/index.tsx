import React, { FC } from 'react'
import ConsentManagerBuilder from '../consent-manager-builder'
import Container from './container'
import { ADVERTISING_CATEGORIES, FUNCTIONAL_CATEGORIES } from './categories'
import { CategoryPreferences, Destination, ConsentManagerProps } from '../types'

const zeroValuePreferences: CategoryPreferences = {
  marketingAndAnalytics: false,
  advertising: false,
  functional: false,
}

const DEFAULT_IMPLY_CONTENT_ON_INTERACTION = false;
const DEFAULT_BANNER_TEXT_COLOR = 'white';
const DEFAULT_BANNER_BACKGROUND_COLOR = '#031b4a';

const ConsentManager: FC<ConsentManagerProps> = ({
  writeKey,
  lang = 'fr',
  allowSmallBannerOnClose = false,
  otherWriteKeys = [],
  shouldRequireConsent = () => true,
  implyConsentOnInteraction = DEFAULT_IMPLY_CONTENT_ON_INTERACTION,
  cookieDomain = undefined,
  bannerContent,
  bannerSubContent = 'Vous pouvez modifier vos préférences à tout moment.',
  bannerTextColor = DEFAULT_BANNER_TEXT_COLOR,
  bannerBackgroundColor = DEFAULT_BANNER_BACKGROUND_COLOR,
  preferencesDialogTitle = 'Gérer mes préférences',
  preferencesDialogContent,
  customCategories = undefined,
  initialPreferences,
  closeBehavior,
  onError = undefined,
})  => {
    const getInitialPreferences = () => {
      if (initialPreferences) {
        return initialPreferences
      }

      if (!customCategories) {
        return zeroValuePreferences
      }

      const initialCustomPreferences = {}
      Object.keys(customCategories).forEach((category) => {
        initialCustomPreferences[category] = null
      })

      return initialCustomPreferences
    }

    const handleMapCustomPreferences = (destinations: Destination[], preferences: CategoryPreferences) => {
      const destinationPreferences: Record<string, boolean | null | undefined> = {}
      const customPreferences: Record<string, boolean> = {}

      if (customCategories) {
        for (const preferenceName of Object.keys(customCategories)) {
          const value = preferences[preferenceName]
          if (typeof value === 'boolean') {
            customPreferences[preferenceName] = value
          } else {
            customPreferences[preferenceName] = true
          }
        }

        destinations.forEach((destination) => {
          // Mark custom categories
          Object.entries(customCategories).forEach(([categoryName, { integrations }]) => {
            const consentAlreadySetToFalse = destinationPreferences[destination.id] === false
            const shouldSetConsent = integrations.includes(destination.id)
            if (shouldSetConsent && !consentAlreadySetToFalse) {
              destinationPreferences[destination.id] = customPreferences[categoryName]
            }
          })
        })

        return { destinationPreferences, customPreferences }
      }

      // Default unset preferences to true (for implicit consent)
      for (const preferenceName of Object.keys(preferences)) {
        const value = preferences[preferenceName]
        if (typeof value === 'boolean') {
          customPreferences[preferenceName] = value
        } else {
          customPreferences[preferenceName] = true
        }
      }

      const customPrefs = customPreferences as CategoryPreferences

      for (const destination of destinations) {
        // Mark advertising destinations
        if (
          ADVERTISING_CATEGORIES.find((c) => c === destination.category) &&
          destinationPreferences[destination.id] !== false
        ) {
          destinationPreferences[destination.id] = customPrefs.advertising
        }

        // Mark function destinations
        if (
          FUNCTIONAL_CATEGORIES.find((c) => c === destination.category) &&
          destinationPreferences[destination.id] !== false
        ) {
          destinationPreferences[destination.id] = customPrefs.functional
        }

        // Fallback to marketing
        if (!(destination.id in destinationPreferences)) {
          destinationPreferences[destination.id] = customPrefs.marketingAndAnalytics
        }
      }

      return { destinationPreferences, customPreferences }
    }

    return (
      <ConsentManagerBuilder
        onError={onError}
        writeKey={writeKey}
        otherWriteKeys={otherWriteKeys}
        shouldRequireConsent={shouldRequireConsent}
        cookieDomain={cookieDomain}
        initialPreferences={getInitialPreferences()}
        mapCustomPreferences={handleMapCustomPreferences}
        customCategories={customCategories}
      >
        {({
          destinations,
          customCategories,
          newDestinations,
          preferences,
          isConsentRequired,
          setPreferences,
          resetPreferences,
          saveConsent,
        }) => {
          return (
            <Container
              customCategories={customCategories}
              destinations={destinations}
              newDestinations={newDestinations}
              preferences={preferences}
              isConsentRequired={isConsentRequired}
              setPreferences={setPreferences}
              resetPreferences={resetPreferences}
              saveConsent={saveConsent}
              closeBehavior={closeBehavior}
              implyConsentOnInteraction={
                implyConsentOnInteraction ?? DEFAULT_IMPLY_CONTENT_ON_INTERACTION
              }
              bannerContent={bannerContent}
              bannerSubContent={bannerSubContent}
              bannerTextColor={bannerTextColor || DEFAULT_BANNER_TEXT_COLOR}
              bannerBackgroundColor={
                bannerBackgroundColor || DEFAULT_BANNER_BACKGROUND_COLOR
              }
              preferencesDialogTitle={preferencesDialogTitle}
              preferencesDialogContent={preferencesDialogContent}
              lang={lang}
              allowSmallBannerOnClose={allowSmallBannerOnClose}
            />
          )
        }}
      </ConsentManagerBuilder>
    )
  }

  export default ConsentManager;
