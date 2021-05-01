import React from 'react'
import { Nav, Navbar } from 'react-bootstrap'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import './App.css'
import { Home } from './pages/Home'
import { BlackJackHome } from './pages/BlackJackHome'

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <NavigationBar />
        <Switch>
          <Route path="/blackjack">
            <BlackJackHome />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </div>
    </BrowserRouter>
  )
}

export default App

interface NavigationBarProps {}

function NavigationBar(props: NavigationBarProps) {
  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Navbar.Brand href="/">Games</Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link href="/blackjack">Black Jack</Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  )
}
