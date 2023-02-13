import React, { FC } from 'react'
import styled from 'styled-components'
import fontStyles from './font-styles'

const Root = styled.div<{ backgroundColor: string; textColor: string }>`
  ${fontStyles};
  position: relative;
  padding: 8px;
  background: ${({backgroundColor}) => backgroundColor};
  color: ${({textColor}) => textColor};
  text-align: center;
  font-size: 12px;
  line-height: 1.3;
`

const Content = styled.div`
  .link {
    text-decoration: underline;
    cursor: pointer;
  }
  .button {
    position: relative;
    margin-left: 14px;
    padding: 0 14px;
    border: none;
    background: #4fb767;
    color: white;
    border-radius: 8px;
    font: inherit;
    height: 30px;
    line-height: 30px;
    font-weight: 700;
    text-align: center;
    display: inline-block;
    outline: 0;
    user-select: none;
    text-decoration: none;
    transition: all 0.4s ease;
    cursor: pointer;
    &:hover {
      color: white;
      background: #068c5a;
      text-decoration: none;
    }
    &.personnalize {
      color: #031b4a;
      background-color: #f7f9fa;
      &:hover {
        background-color: #f2f4f6;
      }
      &:focus {
        background-color: #f2f4f6;
      }
      &:active {
        background-color: #f2f4f6;
      }
    }
  }
`

const P = styled.p`
  margin: 0;
  strong {
    font-size: 14px;
  }
  a {
    color: white;
    font-size: 12px;
    text-decoration: underline;
  }
`

interface Props {
  innerRef: (node: HTMLElement | null) => void
  onClose: () => void
  onChangePreferences: () => void
  content: React.ReactNode
  subContent: React.ReactNode
  backgroundColor: string
  textColor: string
  showBanner: boolean
  lang: string
  allowSmallBannerOnClose: boolean
}

const Banner: FC<Props> = ({
  innerRef,
  onClose,
  lang,
  showBanner,
  allowSmallBannerOnClose,
  onChangePreferences,
  backgroundColor,
  textColor,
}) => {
  return showBanner === true ? (
    <Root
      className={lang}
      ref={innerRef}
      backgroundColor={backgroundColor}
      textColor={textColor}
    >
      <Content>
        {lang === 'it' ? (
          <P>
            <strong>Informativa</strong>
            <br />
            Il presente sito web utilizza cookie tecnici e, previo Suo consenso, cookie di
            profilazione e analitici per inviare messaggi pubblicitari in linea con le preferenze
            manifestate nell’ambito dell’utilizzo delle funzionalità e della navigazione in rete e
            allo scopo di effettuare analisi e monitoraggio dei comportamenti dei visitatori.
            Ulteriori informazioni sono disponibili{' '}
            <a
              className="link"
              href="https://www.iziwork.com/it/informativa-sulla-privacy/"
              target="_blank"
              rel="noopener noreferrer"
            >
              qui
            </a>
            . Per impostare le Sue preferenze{' '}
            <a className="link" onClick={onChangePreferences}>
              clicchi qui
            </a>
            . Cliccando su “Accetto” acconsente all’installazione di tutti i cookie.
            <button type="button" className="button personnalize" onClick={onChangePreferences}>
              Scegli e personalizza
            </button>
            <button type="button" className="button" id="accept" onClick={onClose}>
              Accetto
            </button>
          </P>
        ) : (
          <P>
            <strong>Votre vie privée 🍪</strong>
            <br />
            Nous utilisons des cookies et d'autres technologies similaires afin de personnaliser
            notre contenu, mesurer l'efficacité de nos publicités et améliorer leur pertinence,
            ainsi que proposer une meilleure expérience. En cliquant sur OK ou en activant une
            option dans Préférences de cookies, vous acceptez les conditions énoncées dans notre{' '}
            <a
              className="link"
              href="https://www.iziwork.com/fr/charte-de-confidentialite/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Politique en matière de cookies
            </a>
            . Pour modifier vos préférences ou retirer votre consentement, vous devez mettre à
            jour vos Préférences de cookies.{' '}
            <button type="button" className="button personnalize" onClick={onChangePreferences}>
              Préférences de cookies
            </button>
            <button type="button" className="button" id="accept" onClick={onClose}>
              Ok
            </button>
          </P>
        )}
      </Content>
    </Root>
  ) : (
    (showBanner === false && allowSmallBannerOnClose === true) ? (
      <Root
        className={`${lang} small-banner`}
        ref={innerRef}
        backgroundColor={backgroundColor}
        textColor={textColor}
      >
        {lang === 'it' ? (
          <P>
            Il presente sito web utilizza cookie tecnici 🍪.{' '}
            <a type="button" className="link" onClick={onChangePreferences}>
              Preferenze
            </a>
          </P>
        ) : (
          <P>
            Notre site internet utilise des cookies 🍪.{' '}
            <a type="button" className="link" onClick={onChangePreferences}>
              Paramètres
            </a>
          </P>
        )}
      </Root>
    ) : null
  )
}

export default Banner;
