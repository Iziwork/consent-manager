import React, { PureComponent } from 'react'
import ConsentManagerBuilder from '../consent-manager-builder'
import Container from './container'
import { ADVERTISING_CATEGORIES, FUNCTIONAL_CATEGORIES } from './categories'
import { CategoryPreferences, Destination, ConsentManagerProps } from '../types'

const zeroValuePreferences: CategoryPreferences = {
  marketingAndAnalytics: false,
  advertising: false,
  functional: false,
}

export default class ConsentManager extends PureComponent<ConsentManagerProps, {}> {
  static displayName = 'ConsentManager'

  static defaultProps = {
    otherWriteKeys: [],
    shouldRequireConsent: () => true,
    implyConsentOnInteraction: false,
    allowSmallBannerOnClose: false,
    onError: undefined,
    cookieDomain: undefined,
    customCategories: undefined,
    bannerTextColor: 'white',
    bannerSubContent: 'Vous pouvez modifier vos préférences à tout moment.',
    bannerBackgroundColor: '#031b4a',
    preferencesDialogTitle: 'Gérer mes préférences',
    cancelDialogTitle: 'Etes-vous sûr de vouloir annuler ?',
  }

  render() {
    const {
      writeKey,
      allowSmallBannerOnClose,
      showBanner,
      otherWriteKeys,
      shouldRequireConsent,
      implyConsentOnInteraction,
      cookieDomain,
      bannerContent,
      bannerSubContent,
      bannerTextColor,
      bannerBackgroundColor,
      preferencesDialogTitle,
      preferencesDialogContent,
      cancelDialogTitle,
      cancelDialogContent,
      customCategories,
      onError,
    } = this.props

    let lang
    if (typeof window !== 'undefined') {
      if (window.location.href.indexOf('/it') > -1 || navigator.language === 'it-IT') {
        lang = 'it'
      } else if (window.location.href.indexOf('/fr') > -1 || navigator.language === 'fr-FR') {
        lang = 'fr'
      } else {
        lang = navigator.language
      }
    }

    return (
      <ConsentManagerBuilder
        onError={onError}
        writeKey={writeKey}
        otherWriteKeys={otherWriteKeys}
        shouldRequireConsent={shouldRequireConsent}
        cookieDomain={cookieDomain}
        initialPreferences={this.getInitialPreferences()}
        mapCustomPreferences={this.handleMapCustomPreferences}
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
              closeBehavior={this.props.closeBehavior}
              implyConsentOnInteraction={
                implyConsentOnInteraction ?? ConsentManager.defaultProps.implyConsentOnInteraction
              }
              bannerContent={bannerContent}
              bannerSubContent={bannerSubContent}
              bannerTextColor={bannerTextColor || ConsentManager.defaultProps.bannerTextColor}
              bannerBackgroundColor={
                bannerBackgroundColor || ConsentManager.defaultProps.bannerBackgroundColor
              }
              preferencesDialogTitle={preferencesDialogTitle}
              preferencesDialogContent={preferencesDialogContent}
              lang={lang}
              allowSmallBannerOnClose={allowSmallBannerOnClose}
              showBanner={showBanner}
              cancelDialogTitle={cancelDialogTitle}
              cancelDialogContent={cancelDialogContent}
            />
          )
        }}
      </ConsentManagerBuilder>
    )
  }

  getInitialPreferences = () => {
    const { initialPreferences, customCategories } = this.props
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

  handleMapCustomPreferences = (destinations: Destination[], preferences: CategoryPreferences) => {
    const { customCategories } = this.props
    const destinationPreferences = {}
    const customPreferences = {}

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
}
