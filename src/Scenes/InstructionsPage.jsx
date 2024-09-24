import { useRef, useState, useEffect } from 'react'
import { Application, Assets, Texture, Sprite, TilingSprite, AnimatedSprite, Graphics } from 'pixi.js'

import JennaSpirte from '../../public/images/game/jenna-sprite.webp'

function InstructionsPage() {  
    const domElement = useRef(null)
    const initialized = useRef(false)
    const [ app, setApp ] = useState( new Application() ) 
    const [ instructionsStep, setInstructionsStep ] = useState(0)
    
    const init = async () => {
        // Initialize the application
        await app.init({ 
            background: 0x000000, 
            // Mobile
            width: 330,
            height: 266

            // width: 297,
            // height: 239.4

            // Tablet
            // width: 429,
            // height: 345.8

            // Desktop
            // width: 495,
            // height: 399
        })

        // Add the application canvas to the DOM element
        domElement.current.appendChild(app.canvas)
    }

    useEffect(() => {
        if (!initialized.current) {
            initialized.current = true

            init()
                .then(() => {
                    console.log('App initialized')
                    // setTimeout(() => {
                    //     boundsMarker()    
                    // }, 5000)
                })
                .catch(console.error)
        }
    }, [ app ])

    const advanceStep = () => {
        switch (instructionsStep) {
            case 0:
                setInstructionsStep(1)
                break
            case 1:
                setInstructionsStep(2)
                break
            default:
                break
        }
    }

    return (
        <>
        <div className="relative flex flex-col items-center gap-2">
            <div className="absolute game-border" />
            <div className="game" ref={ domElement } />
            <div className="dialogue-box font-snide-asides">
                <img className="jenna-sprite" src={ JennaSpirte } />
                { instructionsStep === 0 && <>
                    <p className="mb-2">Hey y'all!</p>
                    <p>Country music's favorite cowgirl Jenna Paulette here. Jump over some stuff and win a pair of Justin Boots, ya hear? Make it to the end of my new single "Horseback" to be entered to win!</p>
                </> }
                { instructionsStep === 1 && <>
                    <p className="mt-4">Hit the spacebar or jump button to control the horse. Watch out for cactus and grab as many coins as you can. Have fun!</p>
                </> }
            </div>
            <div className="special-button w-[120px] mt-0 animate-bounce" onClick={ () => advanceStep() }>
                <p className="font-snide-asides text-2xl">{ instructionsStep === 0 ? 'Next' : 'Start!' }</p>
            </div>
        </div>
        </>
    )
}

export default InstructionsPage
