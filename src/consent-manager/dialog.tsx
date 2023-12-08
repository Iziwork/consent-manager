import React, { MouseEventHandler, FC, useEffect, useRef } from 'react'
import styled, { keyframes } from 'styled-components'
import { nanoid } from 'nanoid'
import fontStyles from './font-styles'
import { createPortal } from 'react-dom'

const ANIMATION_DURATION = '200ms'
const ANIMATION_EASING = 'cubic-bezier(0.0, 0.0, 0.2, 1)'

const Overlay = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(67, 90, 111, 0.699);
`

const openAnimation = keyframes`
  from {
    transform: scale(0.8);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
`

const Root = styled.section<{ width: number | string | undefined }>`
  ${fontStyles};
  display: flex;
  flex-direction: column;
  padding: 8px 0;
  max-width: calc(100vw - 16px);
  max-height: calc(100vh - 16px);
  width: ${(props) => props.width};
  margin: 8px;
  background: #fff;
  border-radius: 8px;
  animation: ${openAnimation} ${ANIMATION_DURATION} ${ANIMATION_EASING} both;
`

const Form = styled.form`
  margin-top: -20px;
  display: flex;
  flex-direction: column;
  min-height: 0;
  padding: 5px 10px;
`

const Header = styled.div`
  flex: 1 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 24px;
  border-bottom: 0;
`

const Title = styled.h2`
  position: relative;
  margin: 0;
  color: #031b4a;
  font-size: 18px;
  font-weight: 700;
  line-height: 24px;
`

const HeaderCancelButton = styled.button`
  padding: 8px 0;
  border: none;
  background: none;
  color: inherit;
  font: inherit;
  font-size: 12px;
  font-weight: 900;
  line-height: 1;
  cursor: pointer;
  color: #031b4a;
`

const Content = styled.div`
  -ms-overflow-style: none;
  overflow-y: auto;
  padding: 20px 16px 16px;
  padding-bottom: 0;
  min-height: 0;
  font-size: 12px;
  line-height: 1.2;
  p {
    margin: 0;
    &:not(:last-child) {
      margin-bottom: 0.7em;
    }
  }
  a {
    color: #47b881;
    &:hover {
      color: #64c395;
    }
    &:active {
      color: #248953;
    }
  }
`

const Buttons = styled.div`
  padding: 16px;
  text-align: right;
`

type Props = {
  children: React.ReactNode
  innerRef: (element: HTMLElement | null) => void
  onCancel?: () => void
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  title: React.ReactNode
  buttons: React.ReactNode
  width?: string
}

const Dialog: FC<Props> = ({
  onCancel = undefined,
  onSubmit,
  title,
  innerRef,
  children,
  buttons,
  width = '960px',
}) => {
  let container: HTMLDivElement | undefined
  const titleId = nanoid()
  const rootRef = useRef<HTMLDListElement>(null)
  let form: HTMLFormElement

  useEffect(() => {
    container = document.createElement('div')
  }, [])

  useEffect(() => {
    if (!container) return
    container.setAttribute('data-consent-manager-dialog', '')
    document.body.appendChild(container)
  }, [container])

  useEffect(() => {
    if (!container) return
    if (form) {
      const input: HTMLInputElement | null = form.querySelector('input,button')
      if (input) input.focus()
    }

    document.body.addEventListener('keydown', handleEsc, false)
    document.body.style.overflow = 'hidden'
    innerRef(container)

    return () => {
      document.body.removeEventListener('keydown', handleEsc, false)
      document.body.style.overflow = ''
      container && document.body.removeChild(container)
      innerRef(null)
    }
  }, [container])

  const handleFormRef = (node: HTMLFormElement) => {
    form = node
  }

  const handleOverlayClick: MouseEventHandler<HTMLDivElement> = (e) => {
    // Ignore propogated clicks from inside the dialog
    if (onCancel && rootRef && !rootRef.current?.contains(e.target as HTMLDivElement)) {
      onCancel()
    }
  }

  const handleEsc = (e: KeyboardEvent) => {
    // Esc key
    if (onCancel && e.keyCode === 27) {
      onCancel()
    }
  }

  const dialog = (
    <Overlay onClick={handleOverlayClick}>
      <Root ref={rootRef} role="dialog" aria-modal aria-labelledby={titleId} width={width}>
        <Header>
          <Title id={titleId}>{title}</Title>
          {onCancel && (
            <HeaderCancelButton onClick={onCancel} title="Cancel" aria-label="Cancel">
              ✕
            </HeaderCancelButton>
          )}
        </Header>

        <Form ref={handleFormRef} onSubmit={onSubmit}>
          <Content>{children}</Content>

          <Buttons>{buttons}</Buttons>
        </Form>
      </Root>
    </Overlay>
  )

  return container ? createPortal(dialog, container) : null
}

export default Dialog
