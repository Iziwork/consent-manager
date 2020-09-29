import React, { PureComponent } from 'react'
import styled from 'react-emotion'
import fontStyles from './font-styles'

const Root = styled('div')<{ backgroundColor: string; textColor: string }>`
  ${fontStyles};
  position: relative;
  padding: 8px;
  background: ${(props) => props.backgroundColor};
  color: ${(props) => props.textColor};
  text-align: center;
  padding: 24px;
  background: white;
  color: #031b4a;
  text-align: left;
  font-size: 12px;
  line-height: 1.6;
  border-radius: 8px;
  box-shadow: 0 8px 12px 0 rgba(0, 0, 0, 0.1);
`

const SmallContent = styled('div')`
  .link {
    background: transparent;
    border: 0;
    padding: 0;
    color: white;
    font-size: 12px;
    text-decoration: underline;
    cursor: pointer;
  }
`

const Content = styled('div')`
  .link {
    background: transparent;
    border: 0;
  p {
    width: calc(100% - 60px);
  }
  .link {
    padding: 0;
    color: white;
    font-size: 12px;
    text-decoration: underline;
    cursor: pointer;
  }
  .button {
    position: relative;
    margin-left: 15px;
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
    font-size: 12px;
    text-decoration: underline;
    cursor: pointer;
    &:hover {
      color: white;
      background: #068c5a;
      text-decoration: none;
    }
  }
  .button {
    position: absolute;
    top: 24px;
    right: 24px;
    min-width: 50px;
    padding: 0 14px;
    border: none;
    background: #4fb767;
    color: white;
    border-radius: 8px;
    color: white;
    font: inherit;
    height: 48px;
    line-height: 48px;
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
  }
`

const P = styled('p')`
  margin: 0;
`

const CloseButton = styled('button')`
  float: right;
  padding: 0 14px;
  border: none;
  background: #4fb767;
  border-radius: 8px;
  height: 48px;
  line-height: 48px;
  color: white;
  font: inherit;
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

  render() {
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
      <Root innerRef={innerRef} backgroundColor={backgroundColor} textColor={textColor}>
        <Content>
          {lang === 'it' ? (
            <P>
              Questo sito utilizza i cookies 🍪. I cookie di questo tipo sono necessari per il
              corretto funzionamento di alcune aree del sito e non possono essere rimossi durante la
              navigazione. Altri invece, possono essere impostati e gestiti secondo le proprie
              preferenze{' '}
              <button type="button" className="link" onClick={onChangePreferences}>
                cliccando qui
              </button>
              .
              <CloseButton type="button" className="button" onClick={onClose}>
                Ok
              </CloseButton>
            </P>
          ) : (
            <P>
              Notre site internet utilise des cookies 🍪. Certains ne peuvent être refusés pour le
              bon fonctionnement du site. Pour les autres, vous pouvez choisir de les paramétrer{' '}
              <button type="button" className="link" onClick={onChangePreferences}>
                en cliquant ici
              </button>
              .
              <CloseButton type="button" className="button" onClick={onClose}>
                Ok
              </CloseButton>
            </P>
          )}
          <P>
            Notre site internet utilise des cookies 🍪. Certains ne peuvent être refusés pour le bon
            fonctionnement du site. Pour les autres, vous pouvez choisir de les paramétrer{' '}
            <span className="link" onClick={onChangePreferences}>
              {' '}
              en cliquant ici
            </span>
            .
          </P>
          <CloseButton type="button" className="button" onClick={onClose}>
            Ok
          </CloseButton>
        </Content>
      </Root>
    ) : (
      showBanner === false && allowSmallBannerOnClose === true && (
        <Root innerRef={innerRef} backgroundColor={backgroundColor} textColor={textColor}>
          <SmallContent>
            {lang === 'it' ? (
              <P>
                Questo sito utilizza i cookies 🍪.{' '}
                <button type="button" className="link" onClick={onChangePreferences}>
                  preferenze
                </button>
              </P>
            ) : (
              <P>
                Notre site internet utilise des cookies 🍪.{' '}
                <button type="button" className="link" onClick={onChangePreferences}>
                  paramètres
                </button>
              </P>
            )}
          </SmallContent>
        </Root>
      )
    )
  }
}
