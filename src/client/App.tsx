import * as Cinnabun from "cinnabun"
import { LandingPage } from "./lobby/landingPage"
import { GameScreen } from "./GameScreen"

export const App = () => {
  return (
    <>
      <GameScreen />
      <LandingPage />
    </>
  )
}
