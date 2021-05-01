import React, { useState } from 'react'
import { css } from '@emotion/css'
import backgroundTableImage from '../images/greenTable.jpg'

enum Status {
  NOT_STARTET = 'NOTSTARTET',
  STARTET = 'STARTET',
  PLAYER_BUST = 'PLAYER_BUST',
  PLAYER_WIN = 'PLAYERWIN',
  DEALER_BUST = 'DEALER_BUST',
  DEALER_WIN = 'DEALERWIN',
  GAME_PUSH = 'GAMEPUSH',
  ERROR = 'ERROR',
}

interface BjStates {
  deck: CardProps[]
  dealer: Dealer | null
  player: Player | null
  wallet: number
  currentBet: number
  gameOver: boolean
  status: Status
}

interface Player {
  cards: CardProps[]
  count: number
}

interface Dealer {
  cards: CardProps[]
  count: number
}

const initState = {
  deck: [],
  dealer: null,
  player: null,
  wallet: 100,
  currentBet: 5,
  gameOver: false,
  status: Status.NOT_STARTET,
}
export function BlackJackHome() {
  const [bjStates, setBjStates] = useState<BjStates>(initState)

  const startGame = () => {
    const deck = generateDeck()
    const playerCard1 = getRandomCard(deck)
    const dealerCard1 = getRandomCard(playerCard1.updatedDeck)
    const playerCard2 = getRandomCard(dealerCard1.updatedDeck)
    const playerStartHand = [playerCard1.randomCard, playerCard2.randomCard]
    const dealerStartHand = [dealerCard1.randomCard]
    const player = {
      cards: playerStartHand,
      count: getCount(playerStartHand),
    }
    const dealer = {
      cards: dealerStartHand,
      count: getCount(dealerStartHand),
    }

    setBjStates({
      ...bjStates,
      deck: playerCard2.updatedDeck,
      dealer,
      player,
      wallet: bjStates.wallet - bjStates.currentBet,
      status: Status.STARTET,
    })
  }
  const hit = () => {
    if (bjStates.player) {
      const { randomCard, updatedDeck } = getRandomCard(bjStates.deck)
      const { player } = bjStates
      player.cards.push(randomCard)
      player.count = getCount(player.cards)

      if (player.count > 21) {
        setBjStates({
          ...bjStates,
          player,
          status: Status.PLAYER_BUST,
        })
      } else {
        setBjStates({ ...bjStates, deck: updatedDeck, player })
      }
    } else {
      setBjStates({
        ...bjStates,
        status: Status.ERROR,
      })
    }
  }

  const dealerDraw = (dealer: Dealer, deck: CardProps[]) => {
    const { randomCard, updatedDeck } = getRandomCard(deck)
    dealer.cards.push(randomCard)
    dealer.count = getCount(dealer.cards)
    return { dealer, updatedDeck }
  }

  const stand = () => {
    if (bjStates.dealer && bjStates.player) {
      const randomCard = getRandomCard(bjStates.deck)
      let deck = randomCard.updatedDeck
      let { dealer } = bjStates
      dealer.cards.push(randomCard.randomCard)
      dealer.count = getCount(dealer.cards)

      while (dealer.count < 17) {
        const draw = dealerDraw(dealer, deck)
        dealer = draw.dealer
        deck = draw.updatedDeck
      }

      if (dealer.count > 21) {
        setBjStates({
          ...bjStates,
          deck,
          dealer,
          wallet: bjStates.wallet + 10,
          status: Status.DEALER_BUST,
        })
      } else {
        const winner = getWinner(dealer.count, bjStates.player?.count)
        let { wallet, status } = bjStates

        if (winner === 'dealer') {
          status = Status.DEALER_WIN
        } else if (winner === 'player') {
          wallet += 10
          status = Status.PLAYER_WIN
        } else {
          wallet += 5
          status = Status.GAME_PUSH
        }

        setBjStates({
          ...bjStates,
          deck,
          dealer,
          wallet,
          gameOver: true,
          status,
        })
      }
    } else {
      setBjStates({
        ...bjStates,
        status: Status.ERROR,
      })
    }
  }

  return (
    <div
      className={css({
        backgroundImage: `url(${backgroundTableImage})`,
        fontFamily: 'Helvetica Neue',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        fontSize: '16px',
        fontWeight: 'bolder',
        padding: '25px ',
        height: '100vh',
      })}
    >
      <h1
        className={css({
          fontSize: '50px',
          letterSpacing: '1px',
          color: 'black',
        })}
      >
        BlackJack
      </h1>
      <p>{getStatusMessage(bjStates.status)}</p>
      <div
        className={css({
          border: '2px solid green',
          borderRadius: '10px',
          width: '150px',
          textAlign: 'center',
        })}
      >
        Wallet: ${bjStates.wallet}
        <br />
        Bet: {bjStates.currentBet}
      </div>
      {bjStates.status === Status.NOT_STARTET && (
        <ButtonContainer>
          <Button name="Start Game" onClick={startGame} />
        </ButtonContainer>
      )}
      {bjStates.status === Status.STARTET && (
        <ButtonContainer>
          <Button name="Hit" onClick={hit} /> <Button name="Stand" onClick={stand} />
        </ButtonContainer>
      )}
      {(bjStates.status === Status.PLAYER_BUST ||
        bjStates.status === Status.PLAYER_WIN ||
        bjStates.status === Status.DEALER_WIN ||
        bjStates.status === Status.DEALER_BUST) && (
        <ButtonContainer>
          <Button name="Set Again" onClick={startGame} />{' '}
          <Button name=" Restart Game" onClick={() => setBjStates(initState)} />{' '}
        </ButtonContainer>
      )}
      {bjStates.player && (
        <div
          className={css({
            marginTop: '10px',
            textAlign: 'center',
          })}
        >
          <div
            className={css({
              padding: '10px',
            })}
          >
            <h5>Your Hand</h5>
            <h6>Count: {bjStates.player.count}</h6>
            <table
              className={css({
                margin: '0 auto',
              })}
            >
              <tr>
                {bjStates.player?.cards.map((card, i) => (
                  <Card key={i} number={card.number} suit={card.suit} />
                ))}
              </tr>
            </table>
          </div>
        </div>
      )}
      {bjStates.dealer && (
        <div
          className={css({
            marginTop: '10px',
            textAlign: 'center',
          })}
        >
          <div
            className={css({
              padding: '10px',
            })}
          >
            <h5>Dealer Hand</h5>
            <h6>Count: {bjStates.dealer.count}</h6>
            <table
              className={css({
                margin: '0 auto',
              })}
            >
              <tr>
                {bjStates.dealer?.cards.map((card, i) => (
                  <Card key={i} number={card.number} suit={card.suit} />
                ))}
              </tr>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

function getStatusMessage(status: Status) {
  switch (status) {
    case Status.STARTET:
      return 'Hit or stand? '
    case Status.NOT_STARTET:
      return 'Good luck and have fun!'
    case Status.PLAYER_WIN:
      return 'You win!'
    case Status.PLAYER_BUST:
      return 'Sorry, you bust! The dealer wins!'
    case Status.DEALER_WIN:
      return 'The dealer wins!'
    case Status.DEALER_BUST:
      return 'Dealer bust, you win!'
    case Status.ERROR:
      return 'Error Please reload the page'
    default:
      return ''
  }
}

function getCount(cards: CardProps[]) {
  const rearranged: CardProps[] = []
  cards.forEach((card) => {
    if (card.number === 'A') {
      rearranged.push(card)
    } else if (card.number) {
      rearranged.unshift(card)
    }
  })

  return rearranged.reduce((total, card) => {
    if (card.number === 'J' || card.number === 'Q' || card.number === 'K') {
      return total + 10
    }
    if (typeof card.number === 'number') {
      return total + card.number
    }

    return total + 11 <= 21 ? total + 11 : total + 1
  }, 0)
}

function getRandomCard(deck: CardProps[]) {
  const updatedDeck = deck
  const randomIndex = Math.floor(Math.random() * updatedDeck.length)
  const randomCard = updatedDeck[randomIndex]
  updatedDeck.splice(randomIndex, 1)
  return { randomCard, updatedDeck }
}

function generateDeck(): CardProps[] {
  const cards = [2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K', 'A']
  const suits = ['♦', '♣', '♥', '♠']
  const deck = []
  for (let i = 0; i < cards.length; i++) {
    for (let j = 0; j < suits.length; j++) {
      deck.push({ number: cards[i], suit: suits[j] })
    }
  }

  return deck
}

interface CardProps {
  number: number | string
  suit: string
}
function Card(p: CardProps) {
  const cardNumberSuitCombo = `${p.number}${p.suit}`
  const isSuitRed = p.suit === '♥' || p.suit === '♦'
  return (
    <td>
      <div
        className={css({
          height: '150px',
          width: '100px',
          color: isSuitRed ? 'red' : 'black',
          backgroundColor: 'white',
          borderRadius: '5px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: '35px',
        })}
      >
        {cardNumberSuitCombo}
      </div>
    </td>
  )
}

function getWinner(dealerCount: number, playerCount: number) {
  if (dealerCount > playerCount) {
    return 'dealer'
  }
  if (playerCount > dealerCount) {
    return 'player'
  }
  return 'push'
}

function ButtonContainer(p: { children: React.ReactNode }) {
  return <div className={css({ margin: '10px 0px' })}>{p.children}</div>
}

interface ButtonProps {
  name: string
  onClick: () => void
}

function Button(p: ButtonProps) {
  return (
    <button
      className={css({
        height: '35px',
        width: 'auto',
        borderRadius: '10px',
        border: 'none',
        boxShadow: '1px 1px 0px 2px rgba (0,0,0,0.3)',
        background: 'green',
        cursor: 'pointer',
      })}
      type="button"
      onClick={p.onClick}
    >
      {p.name}
    </button>
  )
}
