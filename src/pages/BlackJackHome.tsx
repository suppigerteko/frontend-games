import { css } from '@emotion/css'
import React from 'react'

export function BlackJackHome() {
  return (
    <div
      className={css({
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      })}
    >
      <h2>Welcome to BJ</h2>
    </div>
  )
}
