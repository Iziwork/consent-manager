import React, { PureComponent } from 'react'
import styled from 'react-emotion'
import fontStyles from './font-styles'

const Root = styled('div')<{ backgroundColor: string; textColor: string }>`
  ${fontStyles};
  position: relative;
  padding: 8px;
  padding-right: 40px;
  background: ${(props) => props.backgroundColor};
  color: ${(props) => props.textColor};
  text-align: center;
  font-size: 12px;
  line-height: 1.3;
`

const SmallContent = styled('div')``

const Content = styled('div')`
  a,
  button {
    display: inline;
    padding: 0;
    border: none;
    background: none;
    color: inherit;
    font: inherit;
    text-decoration: underline;
    cursor: pointer;
  }
`

const P = styled('p')`
  margin: 0;
  &:not(:last-child) {
    margin-bottom: 6px;
  }
`

const CloseButton = styled('button')`
  padding: 8px;
  border: none;
  background: none;
  color: inherit;
  font: inherit;
  cursor: pointer;
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
}

export default class Banner extends PureComponent<Props> {
  static displayName = 'Banner'

  render() {
    const {
      innerRef,
      onClose,
      lang,
      showBanner,
      onChangePreferences,
      backgroundColor,
      textColor,
    } = this.props

    return (
      <Root innerRef={innerRef} backgroundColor={backgroundColor} textColor={textColor}>
        {showBanner === true ? (
          <Content>
            {lang === 'it' ? (
              <P>
                Questo sito utilizza i cookies{' '}
                <span role="img" aria-label="cookie">
                  🍪
                </span>
                . I cookie di questo tipo sono necessari per il corretto funzionamento di alcune
                aree del sito e non possono essere rimossi durante la navigazione. Altri invece,
                possono essere impostati e gestiti secondo le proprie preferenze{' '}
                <button type="button" onClick={onChangePreferences}>
                  cliccando qui
                </button>
                . [
                <a href="/cookies" target="_blank" rel="noopener noreferrer">
                  Maggiori informazioni
                </a>
                ] | [
                <CloseButton type="button" onClick={onClose}>
                  Accettare
                </CloseButton>
                ]
              </P>
            ) : (
              <P>
                Notre site internet utilise des cookies{' '}
                <span role="img" aria-label="cookie">
                  🍪
                </span>
                . Certains ne peuvent être refusés pour le bon fonctionnement du site. Pour les
                autres, vous pouvez choisir de les paramétrer{' '}
                <button type="button" onClick={onChangePreferences}>
                  en cliquant ici
                </button>
                . [
                <a href="/cookies" target="_blank" rel="noopener noreferrer">
                  Plus d’informations
                </a>
                ] | [
                <CloseButton type="button" onClick={onClose}>
                  Accepter
                </CloseButton>
                ]
              </P>
            )}
          </Content>
        ) : (
          <SmallContent>
            {lang === 'it' ? (
              <P>
                <span role="img" aria-label="cookie">
                  🍪
                </span>{' '}
                <button type="button" onClick={onChangePreferences}>
                  cliccando qui
                </button>
              </P>
            ) : (
              <P>
                <span role="img" aria-label="cookie">
                  🍪
                </span>{' '}
                <button type="button" onClick={onChangePreferences}>
                  paramètres
                </button>
              </P>
            )}
          </SmallContent>
        )}
      </Root>
    )
  }
}
