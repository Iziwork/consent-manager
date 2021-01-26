import React, { PureComponent, ReactNode } from 'react'
import styled from 'react-emotion'
import fontStyles from './font-styles'

const Root = styled('div')<{ backgroundColor: string; textColor: string }>`
  ${fontStyles};
  position: relative;
  padding: 8px;
  background: ${(props) => props.backgroundColor};
  color: ${(props) => props.textColor};
  text-align: center;
  font-size: 12px;
  line-height: 1.3;
`

const Content = styled('div')`
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

const P = styled('p')`
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

export default class Banner extends PureComponent<Props> {
  static displayName = 'Banner'

  render(): ReactNode {
    const {
      innerRef,
      onClose,
      lang,
      showBanner,
      allowSmallBannerOnClose,
      onChangePreferences,
      backgroundColor,
      textColor,
    } = this.props

    return showBanner === true ? (
      <Root
        className={lang}
        innerRef={innerRef}
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
                Scegli e personnalizza
              </button>
              <button type="button" className="button" onClick={onClose}>
                Accetto
              </button>
            </P>
          ) : (
            <P>
              Notre site internet utilise des cookies 🍪. Certains ne peuvent être refusés pour le
              bon fonctionnement du site. Pour les autres, vous pouvez choisir de les paramétrer{' '}
              <a className="link" onClick={onChangePreferences}>
                en cliquant ici
              </a>
              .
              <button type="button" className="button" onClick={onClose}>
                Ok
              </button>
            </P>
          )}
        </Content>
      </Root>
    ) : (
      showBanner === false && allowSmallBannerOnClose === true && (
        <Root
          className={`${lang} ${' small-banner'}`}
          innerRef={innerRef}
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
      )
    )
  }
}
