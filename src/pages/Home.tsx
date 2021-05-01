import { css } from '@emotion/css'
import React from 'react'

export function Home() {
  return (
    <div
      className={css({
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      })}
    >
      <h2>Welcome</h2>
    </div>
  )
}
