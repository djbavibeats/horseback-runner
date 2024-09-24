import { useRef, useState, useEffect } from 'react'
import { Application, Assets, Texture, Sprite, TilingSprite, AnimatedSprite, Graphics } from 'pixi.js'

import JennaSpirte from '../../public/images/game/jenna-sprite.webp'

const responsiveFactor = 1.0
// Mobile
// const gameWidth = 317.59398
// const gameHeight = 256

// Tablet
// const gameWidth = 412.872174
// const gameHeight = 332.8

// Desktop
// const gameWidth = 476.39097
// const gameHeight = 384

let gameInProgress = false

function InstructionsPage() {  
    const [ instructionsStep, setInstructionsStep ] = useState(0)
    const domElement = useRef(null)
    const initialized = useRef(false)
    const [ app, setApp ] = useState( new Application() ) 
    const [ gameWidth, setGameWidth ] = useState(317.59398)
    const [ gameHeight, setGameHeight ] = useState(256)

    let mountains1 = useRef(null)
    let mountains2 = useRef(null)
    let mountains3 = useRef(null)
    let mountains4 = useRef(null)
    let cloud1 = useRef(null)
    let cloud2 = useRef(null)
    let cloud3 = useRef(null)
    let cloud4 = useRef(null)
    let cloud5 = useRef(null)
    let wireFence = useRef(null)
    let dirt = useRef(null)
    
    let horse = useRef(null)

    const init = async () => {
        // Initialize the application
        await app.init({ 
            background: 0x000000, 
            // Mobile
            width: gameWidth,
            height: gameHeight

            // width: 297,
            // height: 239.4

            // Tablet (x1.3)
            // width: 412.872174,
            // height: 332.8

            // Desktop (x1.5)
            // width: 476.39097,
            // height: 384
        })

        // Add the application canvas to the DOM element
        domElement.current.appendChild(app.canvas)

        // Load in assets
        Assets.add({ alias: 'Sunset', src: '/images/sprites/background.webp'})
        Assets.add({ alias: 'Dirt', src: '/images/sprites/dirt.webp' })
        Assets.add({ alias: 'WireFence', src: '/images/sprites/wire-fence.webp' })
        Assets.add({ alias: 'Mountains1', src: '/images/sprites/mountains-1.webp' })
        Assets.add({ alias: 'Mountains2', src: '/images/sprites/mountains-2.webp' })
        Assets.add({ alias: 'Mountains3', src: '/images/sprites/mountains-3.webp' })
        Assets.add({ alias: 'Mountains4', src: '/images/sprites/mountains-4.webp' })
        Assets.add({ alias: 'Cloud1', src: '/images/sprites/cloud-1.webp' })
        Assets.add({ alias: 'Cloud2', src: '/images/sprites/cloud-2.webp' })
        Assets.add({ alias: 'Cloud3', src: '/images/sprites/cloud-3.webp' })
        Assets.add({ alias: 'Cloud4', src: '/images/sprites/cloud-4.webp' })
        Assets.add({ alias: 'Cloud5', src: '/images/sprites/cloud-5.webp' })        

        // Horse
        Assets.add({ alias: 'WalkFrame1', src: '/images/sprites/horse/walk/frame-1.webp' })
        Assets.add({ alias: 'WalkFrame2', src: '/images/sprites/horse/walk/frame-2.webp' })
        Assets.add({ alias: 'WalkFrame3', src: '/images/sprites/horse/walk/frame-3.webp' })
        Assets.add({ alias: 'WalkFrame4', src: '/images/sprites/horse/walk/frame-4.webp' })
        Assets.add({ alias: 'WalkFrame5', src: '/images/sprites/horse/walk/frame-5.webp' })
        Assets.add({ alias: 'WalkFrame6', src: '/images/sprites/horse/walk/frame-6.webp' })

        const texturesPromise = Assets.load([
            'Sunset',
            'Dirt',
            'WireFence',
            'Mountains1', 'Mountains2', 'Mountains3', 'Mountains4',
            'Cloud1', 'Cloud2', 'Cloud3', 'Cloud4', 'Cloud5',
            'WalkFrame1', 'WalkFrame2', 'WalkFrame3', 'WalkFrame4', 'WalkFrame5', 'WalkFrame6', 
        ])

        texturesPromise.then((textures) => {
            // Sunset
            const sunset = new Sprite({
                texture: textures.Sunset,
                height: 256 * responsiveFactor,
                width: 1024 * responsiveFactor
            })
            app.stage.addChild(sunset)
            
            // Mountains
            mountains1.current = new TilingSprite({ texture: textures.Mountains1, height: 256, width: 1024 })
            mountains2.current = new TilingSprite({ texture: textures.Mountains2, height: 256, width: 1024 })
            mountains3.current = new TilingSprite({ texture: textures.Mountains3, height: 256, width: 1024 })
            mountains4.current = new TilingSprite({ texture: textures.Mountains4, height: 256, width: 1024 })

            app.stage.addChild(mountains4.current)
            app.stage.addChild(mountains3.current)
            app.stage.addChild(mountains2.current)
            app.stage.addChild(mountains1.current)

            // Clouds
            let cloudXOffset = gameWidth
            cloud1.current = new Sprite({ 
                texture: textures.Cloud1, 
                x: 0 - cloudXOffset, 
                y: 40 
            })
            cloud2.current = new Sprite({ 
                texture: textures.Cloud2, 
                x: 256 - cloudXOffset, 
                y: 80 
            })
            cloud3.current = new Sprite({ 
                texture: textures.Cloud3, 
                x: 512 - cloudXOffset, 
                y: 50 
            })
            cloud4.current = new Sprite({ 
                texture: textures.Cloud4, 
                x: 640 - cloudXOffset, 
                y: 30 
            })
            cloud5.current = new Sprite({ 
                texture: textures.Cloud5, 
                x: 768 - cloudXOffset, 
                y: 100 
            })

            app.stage.addChild(cloud1.current)
            app.stage.addChild(cloud2.current)
            app.stage.addChild(cloud3.current)
            app.stage.addChild(cloud4.current)
            app.stage.addChild(cloud5.current)

            // Wire Fence
            wireFence.current = new TilingSprite({
                texture: textures.WireFence,
                height: 256 * responsiveFactor,
                width: 1024 * responsiveFactor
            })
            app.stage.addChild(wireFence.current)

            // Dirt Ground
            dirt.current = new TilingSprite({
                texture: textures.Dirt,
                height: 256 * responsiveFactor,
                width: 1024 * responsiveFactor
            })
            app.stage.addChild(dirt.current)

            // Horse
            const walkFrames = [
                '/images/sprites/horse/walk/frame-1.webp', '/images/sprites/horse/walk/frame-2.webp', '/images/sprites/horse/walk/frame-3.webp',
                '/images/sprites/horse/walk/frame-4.webp', '/images/sprites/horse/walk/frame-5.webp', '/images/sprites/horse/walk/frame-6.webp'
            ]
            let textureArray = []
            for (const frame of walkFrames) {
                const texture = Texture.from(frame)
                textureArray.push(texture)
            }

            const animatedSprite = new AnimatedSprite(textureArray)
            animatedSprite.animationSpeed = 0.25
            animatedSprite.position.y = 190
            animatedSprite.position.x = (gameWidth / 2) - 32
            animatedSprite.scale = 0.5
            animatedSprite.play()

            horse.current = animatedSprite
            horse.current.jumpState = 'idle'

            app.stage.addChild(horse.current)  

            
        }).then(() => {
            console.log('loaded!')
            app.ticker.add((delta) => {
                // Initialize game animations
                gameLoop()

            })
        })
    }

    let count = 0
    let time = Date.now()
    let baseSpeed = 2.5
    let cloudSpeed = 1.15
    let cloudLoopOffset = 100.0  

    // Horse Stuff
    let ascendTimer = 0.0
    let descendTimer = 0.0
    let floatTimer = 0.0
    let jumpHeight = 4.0
    let jumpDuration = 2.0
    let floatDuration = 1.25

    const gameLoop = () => {
        const currentTime = Date.now()
        const deltaTime = currentTime - time
        time = currentTime

        mountains1.current.tilePosition.x -= 0.225 * baseSpeed
        mountains2.current.tilePosition.x -= 0.200 * baseSpeed
        mountains3.current.tilePosition.x -= 0.175 * baseSpeed
        mountains4.current.tilePosition.x -= 0.150 * baseSpeed

        wireFence.current.tilePosition.x -= 1.0 * baseSpeed
        dirt.current.tilePosition.x -= 1.0 * baseSpeed

        cloud1.current.position.y = Math.sin(deltaTime * 0.0025) * 10 + 40
        cloud1.current.position.x >= gameWidth 
            ? cloud1.current.position.x = -120.0 - cloudLoopOffset
            : cloud1.current.position.x += 0.210 * cloudSpeed

        cloud2.current.position.y = Math.sin(deltaTime * 0.0025) * 5 + 80
        cloud2.current.position.x >= gameWidth 
            ? cloud2.current.position.x = -98.0 - cloudLoopOffset
            : cloud2.current.position.x += 0.125 * cloudSpeed

        cloud3.current.position.y = Math.sin(deltaTime * 0.0025) * 7.5 + 50
        cloud3.current.position.x >= gameWidth 
            ? cloud3.current.position.x = -120.0 - cloudLoopOffset
            : cloud3.current.position.x += 0.150 * cloudSpeed

        cloud4.current.position.y = Math.sin(deltaTime * 0.0025) * 6 + 10
        cloud4.current.position.x >= gameWidth 
            ? cloud4.current.position.x = -118.0 - cloudLoopOffset
            : cloud4.current.position.x += 0.200 * cloudSpeed

        cloud5.current.position.y = Math.sin(deltaTime * 0.0025) * 9 + 100
        cloud5.current.position.x >= gameWidth 
            ? cloud5.current.position.x = -96.0 - cloudLoopOffset
            : cloud5.current.position.x += 0.100 * cloudSpeed


        if (gameInProgress == true) {
            if (horse.current.position.x >= 10) {
                horse.current.position.x -= 1.0
            } else {
                // Horse in in position and the game is ready to be played
                if (horse.current.jumpState === 'ascend') {
                    ascendTimer += 0.1
                    horse.current.position.y -= jumpHeight
                    if (ascendTimer >= jumpDuration) {
                        horse.current.jumpState = 'float'
                        ascendTimer = 0.0
                    }
                }
                if (horse.current.jumpState === 'descend') {
                    descendTimer += 0.1
                    horse.current.position.y += jumpHeight
                    if (descendTimer >= jumpDuration) {
                        horse.current.jumpState = 'idle'
                        descendTimer = 0.0
                    }
                }
                if (horse.current.jumpState === 'float') {
                    floatTimer += 0.1
                    if (floatTimer >= floatDuration) {
                        horse.current.jumpState = 'descend'
                        floatTimer = 0.0
                    }
                }
            }
        }
    }

    useEffect(() => {
        if (!initialized.current) {
            initialized.current = true

            init()
                .then(() => {
                    console.log('App initialized')
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
                toStartingPositions()
                break
            default:
                break
        }
    }

    const jump = () => {
        console.log('jump!')
        if (horse.current.jumpState === 'idle') {
            horse.current.jumpState = 'ascend'
        }

    }

    const toStartingPositions = () => {
        gameInProgress = true
    }

    return (
        <>
        <div className="relative flex flex-col items-center gap-2">
            <div className="absolute game-border" />
            <div className="game" ref={ domElement } />
            {/* <TheGame gameInProgress={ gameInProgress } setGameInProgress={ setGameInProgress } /> */}
            { instructionsStep !== 2 && <>
            
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
            </> }
            { instructionsStep === 2 && <>
            <div className="min-h-[191.62px]">
                <div className="special-button w-[200px] mt-8" onClick={ () => jump() }>
                    <p className="font-snide-asides text-4xl">Jump!</p>
                </div>
            </div>
            </> }
        </div>
        </>
    )
}

export default InstructionsPage
