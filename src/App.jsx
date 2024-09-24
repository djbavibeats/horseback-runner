// import Experience from "./Experience/Experience"
import { useEffect, useState } from 'react'

import Vanilla from "./Experience/Vanilla.jsx"

import Navbar from "./Navbar.jsx"
import Footer from "./Footer.jsx"

import SplashPage from "./Scenes/SplashPage.jsx"
import InstructionsPage from "./Scenes/InstructionsPage.jsx"

import GameLogo from "../public/images/sitewide/game-logo.webp"
function App() {
  const [ activeScreen, setActiveScreen ] = useState('splash')
  useEffect(() => {

  }, [ activeScreen ])
  return (
    <>
      <div className="w-full h-screen flex flex-col items-center justify-center m-auto experience-wrapper">
        <Navbar />
        {/* <Experience /> */}
        {/* <Vanilla /> */}
        { activeScreen === 'splash' &&
          <SplashPage setActiveScreen={ setActiveScreen } />
        }
        { activeScreen === 'instructions' &&
          <div className="relative flex flex-col w-full h-full items-center justify-center gap-4">  
            <img className="w-[80%] mt-[-1rem]" src={ GameLogo } />
            <InstructionsPage setActiveScreen={ setActiveScreen } />
          </div> 
        }

        <Footer />
      </div>
    </>
  )
}

export default App
