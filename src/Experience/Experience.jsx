import { useRef, useEffect } from "react"
import { Stage, Container, TilingSprite, Sprite, Text, useTick } from "@pixi/react"
import * as PIXI from "pixi.js"

// Load in background textures
// Assign the textures to sprites
// Add the sprite to the stage

import Background from "../../public/background.png"
import WireFence from "../../public/wire-fence.png"
import Mountains1 from "../../public/mountains-1.png"
import Mountains2 from "../../public/mountains-2.png"
import Mountains3 from "../../public/mountains-3.png"
import Mountains4 from "../../public/mountains-4.png"
import DirtGround from "../../public/dirt-ground.png"

import Cloud1 from "../../public/cloud-1.png"
import Cloud2 from "../../public/cloud-2.png"
import Cloud3 from "../../public/cloud-3.png"
import Cloud4 from "../../public/cloud-4.png"
import Cloud5 from "../../public/cloud-5.png"

const BackgroundSprites = () => {
    const dirtground = useRef()
    const wirefence = useRef()
    const mountains1 = useRef()
    const mountains2 = useRef()
    const mountains3 = useRef()
    const mountains4 = useRef()

    useTick(delta => {
        dirtground.current.tilePosition.x -= 1.0
        wirefence.current.tilePosition.x -= 1.0
        mountains1.current.tilePosition.x -= 0.9
        mountains2.current.tilePosition.x -= 0.8
        mountains3.current.tilePosition.x -= 0.7
        mountains4.current.tilePosition.x -= 0.6
    })

    return (<>
        {/* PIXI.Container object */}
        <TilingSprite image={ Background } width={ 1024 } height={ 256 } x={ 0 } y={ 0 } scale={ 1 } />
        
        <TilingSprite 
            ref={ mountains4 }
            image={ Mountains4 } 
            width={ 1024 } 
            height={ 256 } 
            tilePosition={{ x: 0, y: 0 }}
        />

        <TilingSprite 
            ref={ mountains3 }
            image={ Mountains3 } 
            width={ 1024 } 
            height={ 256 } 
            tilePosition={{ x: 0, y: 0 }}
        />

        <TilingSprite 
            ref={ mountains2 }
            image={ Mountains2 } 
            width={ 1024 } 
            height={ 256 } 
            tilePosition={{ x: 0, y: 0 }}
        />     

        <TilingSprite 
            ref={ mountains1 }
            image={ Mountains1 } 
            width={ 1024 } 
            height={ 256 } 
            tilePosition={{ x: 0, y: 0 }}
        />
        
        <TilingSprite 
            ref={ wirefence }
            image={ WireFence } 
            width={ 1024 } 
            height={ 256 } 
            tilePosition={{ x: 0, y: 0 }} 
        />

        <TilingSprite 
            ref={ dirtground } 
            image={ DirtGround } 
            width={ 1024 } 
            height={ 256 } 
            tilePosition={{ x: 0, y: 0 }}
        />
    </>)
}

let i = 0
let xOffset = 768
let speedItUp = 1.0
let loopOffset = 100.0

const Clouds = () => {
    const cloud1 = useRef()
    const cloud2 = useRef()
    const cloud3 = useRef()
    const cloud4 = useRef()
    const cloud5 = useRef()

    useTick(delta => {
        i += delta

        cloud1.current.position.y = Math.sin(i * 0.0125) * 10 + 40
        cloud2.current.position.y = Math.sin(i * 0.0125) * 5 + 80
        cloud3.current.position.y = Math.sin(i * 0.0125) * 7.5 + 50
        cloud4.current.position.y = Math.sin(i * 0.0125) * 6 + 10
        cloud5.current.position.y = Math.sin(i * 0.0125) * 9 + 100

        if (cloud1.current.position.x >= 768.0) {
            cloud1.current.position.x = -120.0 - loopOffset
        } else {
            cloud1.current.position.x += 0.210 * speedItUp
        }

        if (cloud2.current.position.x >= 768.0) {
            cloud2.current.position.x = -98.0 - loopOffset
        } else {
            cloud2.current.position.x += 0.125 * speedItUp
        }

        if (cloud3.current.position.x >= 768.0) {
            cloud3.current.position.x = -120.0 - loopOffset
        } else { 
            cloud3.current.position.x += 0.150 * speedItUp
        }

        if (cloud4.current.position.x >= 768.0) {
            cloud4.current.position.x = -118.0 - loopOffset
        } else {
            cloud4.current.position.x += 0.200 * speedItUp
        }

        if (cloud5.current.position.x >= 768.0) {
            cloud5.current.position.x = -96.0 - loopOffset
        } else {
            cloud5.current.position.x += 0.100 * speedItUp
        }

    })

    return (<>
        <Sprite 
            ref={ cloud1 }
            image={ Cloud1 }
            x={ 0 - xOffset }
            y={ 40 } 
        />
        <Sprite 
            ref={ cloud2 }
            image={ Cloud2 }
            x={ 256 - xOffset }
            y={ 80 }
        />
        <Sprite 
            ref={ cloud3 }
            image={ Cloud3 }
            x={ 512 - xOffset }
            y={ 50 }
        />
        <Sprite 
            ref={ cloud4 }
            image={ Cloud4 }
            x={ 640 - xOffset }
            y={ 30 }
        />
        <Sprite 
            ref={ cloud5 }
            image={ Cloud5 }
            x={ 768 - xOffset }
            y={ 100 }
        />
    </>)

}
const Experience = () => {
    const stage = useRef()
    // const container = useRef()

    useEffect(() => {
        console.log(stage.current)
        console.log(PIXI)
    }, [])

    return (

        /* PIXI.Application object */
        <Stage 
            ref={ stage }
            width={ 768 } 
            height={ 256 } 
            options={{ backgroundColor: 0xafb9ca }}
        >
            <BackgroundSprites />
            <Clouds />
            {/* <Container ref={ container }>

            </Container> */}

        </Stage>
    )
}

export default Experience