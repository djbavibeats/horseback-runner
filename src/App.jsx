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
  const [ responsiveFactor, setResponsiveFactor ] = useState()
  
  useEffect(() => {
    const handleResize = () => {
        if (window.innerWidth >= 1024) {
            setResponsiveFactor(1.5)
        } else if (window.innerWidth >= 768 && window.innerWidth < 1023) {
            setResponsiveFactor(1.3)
        } else {
            setResponsiveFactor(1.0)
        }
    }
    window.addEventListener('resize', handleResize)
    handleResize()
    return () => {
        window.removeEventListener('resize', handleResize)
    }
  }, [])

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
            <img className="w-[90%]" src={ GameLogo } />
            <InstructionsPage setActiveScreen={ setActiveScreen } responsiveFactor={ responsiveFactor } />
          </div> 
        }

        <Footer />
      </div>
    </>
  )
}

export default App
