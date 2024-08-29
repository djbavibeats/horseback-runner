import { useRef, useState, useEffect, useReducer } from "react"
import { Stage, Container, TilingSprite, Sprite, useApp, AnimatedSprite, Text, useTick } from "@pixi/react"
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

import Saguaro from "../../public/saguaro.png"

const overallspeed = 2.0 
const BackgroundSprites = () => {
    const dirtground = useRef()
    const wirefence = useRef()
    const mountains1 = useRef()
    const mountains2 = useRef()
    const mountains3 = useRef()
    const mountains4 = useRef()

    useTick(delta => {
        dirtground.current.tilePosition.x -= 1.0 * overallspeed
        wirefence.current.tilePosition.x -= 1.0 * overallspeed
        mountains1.current.tilePosition.x -= 0.9 * overallspeed
        mountains2.current.tilePosition.x -= 0.8 * overallspeed
        mountains3.current.tilePosition.x -= 0.7 * overallspeed
        mountains4.current.tilePosition.x -= 0.6 * overallspeed
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

const CloudSprites = () => {
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
            cloud1.current.position.x += 0.210 * speedItUp * overallspeed
        }

        if (cloud2.current.position.x >= 768.0) {
            cloud2.current.position.x = -98.0 - loopOffset
        } else {
            cloud2.current.position.x += 0.125 * speedItUp * overallspeed
        }

        if (cloud3.current.position.x >= 768.0) {
            cloud3.current.position.x = -120.0 - loopOffset
        } else { 
            cloud3.current.position.x += 0.150 * speedItUp * overallspeed
        }

        if (cloud4.current.position.x >= 768.0) {
            cloud4.current.position.x = -118.0 - loopOffset
        } else {
            cloud4.current.position.x += 0.200 * speedItUp * overallspeed
        }

        if (cloud5.current.position.x >= 768.0) {
            cloud5.current.position.x = -96.0 - loopOffset
        } else {
            cloud5.current.position.x += 0.100 * speedItUp * overallspeed
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

const SaguaroSprite = ({ id, factor, position, saguaros, setSaguaros }) => {
    const saguaro = useRef() 
    const [ remove, setRemove ] = useState(false)
    
    useTick(delta => {
        saguaro.current.position.x -= 1.0 * overallspeed
        if (saguaro.current.position.x < -50.0) {
            setRemove(true)
        }
    })

    useEffect(() => {
        if (remove === true) {
            console.log('time to remove saguaro #' + id)
        } else {
            console.log(factor)
        }
    }, [ remove ])

    return (
        <Sprite 
            id={ id }
            ref={ saguaro }
            image={ Saguaro }
            x={ 768 }
            y={ Math.sin(factor) * 10.0 + 170 }
            scale={ 1.25 } 
        />
    )
}

let elapsedtime = 0
let last = 0
let num = 0
let speed = 15
const SaguaroSprites = () => {
    // const [ saguaros, dispatch ] = useReducer(saguarosReducer, initialSaguaros)
    const [ saguaros, setSaguaros ] = useState([])

    useTick(delta => {
        elapsedtime += delta / 10
        if (elapsedtime - last >= speed) {
            last = elapsedtime
            num++
            setSaguaros([
                ...saguaros,
                { id: num, factor: Math.random() * 3.0 }
            ])
            console.log(saguaros)
        }
    })

    return saguaros.map((saguaro, index) => {
        return <SaguaroSprite key={ index } id={ saguaro.id } factor={ saguaro.factor } saguaros={ saguaros } setSaguaros={ setSaguaros } />
    })
}

import Walk1 from "../../public/horse/walk/frame-1.png"
import Walk2 from "../../public/horse/walk/frame-2.png"
import Walk3 from "../../public/horse/walk/frame-3.png"
import Walk4 from "../../public/horse/walk/frame-4.png"
import Walk5 from "../../public/horse/walk/frame-5.png"
import Walk6 from "../../public/horse/walk/frame-6.png"





const Horse = ({ app }) => {
    const [ frames, setFrames ] = useState([])
 
    let walkFrames = [ Walk1, Walk2, Walk3, Walk4, Walk5, Walk6 ]
    let textureArray = []
    
    for (let i = 0; i < 6; i++) {
        let texture = PIXI.Texture.from(walkFrames[i])
        textureArray.push(texture)
    }

    useEffect(() => {
        console.log(app)
        
    }, [])

    return (<>
        <AnimatedSprite 
            animationSpeed={ 0.25 } 
            isPlaying={ true } 
            scale={ 0.65 }
            y={ 185 }
            x={ 10 }
            textures={ textureArray } 
        />
    </>)
}
const Game = () => {
    const app = useApp()

    return (<>
        <BackgroundSprites />
        <CloudSprites />
        <Horse app={ app } />
        <SaguaroSprites />
    </>)

}

const Experience = () => {
    const stage = useRef()   

    return (
        /* PIXI.Application object */
        <Stage 
            ref={ stage }
            width={ 768 } 
            height={ 256 } 
            options={{ backgroundColor: 0xafb9ca }}
        >
            <Game />

        </Stage>
    )
}

export default Experience