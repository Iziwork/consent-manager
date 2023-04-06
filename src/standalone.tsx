import React from 'react'
import ReactDOM from 'react-dom/client'
import inEU from '@segment/in-eu'
import inRegions from '@segment/in-regions'
import { ConsentManager, openConsentManager, doNotTrack } from '.'
import { ConsentManagerProps, WindowWithConsentManagerConfig, ConsentManagerInput } from './types'
import { CloseBehavior } from './consent-manager/container'
import * as preferences from './consent-manager-builder/preferences'

const typedInEU = inEU as  () => boolean;

export const version = process.env.VERSION
export { openConsentManager, doNotTrack, typedInEU as inEU, preferences }

let props: Partial<ConsentManagerInput> = {}
let containerRef: string | undefined

const localWindow = window as WindowWithConsentManagerConfig

if (localWindow.consentManagerConfig && typeof localWindow.consentManagerConfig === 'function') {
  props = localWindow.consentManagerConfig({
    React,
    version,
    openConsentManager,
    doNotTrack,
    inEU: typedInEU,
    preferences,
    inRegions,
  })
  containerRef = props.container
} else {
  throw new Error(`window.consentManagerConfig should be a function`)
}

if (!containerRef) {
  throw new Error('ConsentManager: container is required')
}

if (!props.writeKey) {
  throw new Error('ConsentManager: writeKey is required')
}

if (!props.lang) {
  throw new Error('ConsentManager: lang is required')
}

if (!props.bannerContent) {
  throw new Error('ConsentManager: bannerContent is required')
}

if (!props.preferencesDialogContent) {
  throw new Error('ConsentManager: preferencesDialogContent is required')
}

if (typeof props.implyConsentOnInteraction === 'string') {
  props.implyConsentOnInteraction = props.implyConsentOnInteraction === 'true'
}

if (props.closeBehavior !== undefined && typeof props.closeBehavior === 'string') {
  const options = [
    CloseBehavior.ACCEPT.toString(),
    CloseBehavior.DENY.toString(),
    CloseBehavior.DISMISS.toString(),
  ]

  if (!options.includes(props.closeBehavior)) {
    throw new Error(`ConsentManager: closeBehavior should be one of ${options.join(', ')}`)
  }
}

const container = document.querySelector(containerRef)
if (!container) {
  throw new Error('ConsentManager: container not found')
}

const root = ReactDOM.createRoot(container);
root.render(<ConsentManager {...(props as ConsentManagerProps)} />)
