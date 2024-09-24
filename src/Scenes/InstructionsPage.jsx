import { useRef, useState, useEffect } from 'react'
import { Application, Assets, Texture, Sprite, TilingSprite, AnimatedSprite, Graphics } from 'pixi.js'
import { Howl } from 'howler'

import JennaSpirte from '../../public/images/game/jenna-sprite.webp'

function keyboard(value) {
    const key = {}
    key.value = value
    key.isDown = false
    key.isUp = true
    key.press = undefined
    key.release = undefined

    key.downHandler = (event) => {
        if (event.key === key.value) {
            if (key.isUp && key.press) {
                key.press()
            }
            key.isDown = true
            key.isUp = false
            event.preventDefault()
        }
    }

    key.upHandler = (event) => {
        if (event.key === key.value) {
            if (key.isDown && key.release) {
            key.release()
            }
            key.isDown = false
            key.isUp = true
            event.preventDefault()
        }
    }

    const downListener = key.downHandler.bind(key)
    const upListener = key.upHandler.bind(key)
    
    window.addEventListener("keydown", downListener, false)
    window.addEventListener("keyup", upListener, false)
    
    // Detach event listeners
    key.unsubscribe = () => {
        window.removeEventListener("keydown", downListener)
        window.removeEventListener("keyup", upListener)
    }
    
    return key
}

let gameInProgress = false

function InstructionsPage({ responsiveFactor }) {  
    const [ instructionsStep, setInstructionsStep ] = useState(0)
    const domElement = useRef(null)
    const initialized = useRef(false)
    const [ app, setApp ] = useState( new Application() ) 
    const [ gameWidth, setGameWidth ] = useState(317.59398 * responsiveFactor)
    const [ gameHeight, setGameHeight ] = useState(256 * responsiveFactor)

    const sound = useRef(new Howl({
        src: [ '/audio/horseback-jenna-paulette.mp3' ]
    }))

    let sunset = useRef(null)
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
            width: gameWidth,
            height: gameHeight
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
            sunset.current = new Sprite({
                texture: textures.Sunset,
                height: 256 * 1.3,
                width: 1024 * 1.3
            })
            app.stage.addChild(sunset.current)

            
            // Mountains
            mountains1.current = new TilingSprite({ texture: textures.Mountains1, height: 256 * responsiveFactor, width: 1024 * responsiveFactor, tileScale: responsiveFactor })
            mountains2.current = new TilingSprite({ texture: textures.Mountains2, height: 256 * responsiveFactor, width: 1024 * responsiveFactor, tileScale: responsiveFactor })
            mountains3.current = new TilingSprite({ texture: textures.Mountains3, height: 256 * responsiveFactor, width: 1024 * responsiveFactor, tileScale: responsiveFactor })
            mountains4.current = new TilingSprite({ texture: textures.Mountains4, height: 256 * responsiveFactor, width: 1024 * responsiveFactor, tileScale: responsiveFactor })

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
                width: 1024 * responsiveFactor,
                tileScale: responsiveFactor
            })
            app.stage.addChild(wireFence.current)

            // Dirt Ground
            dirt.current = new TilingSprite({
                texture: textures.Dirt,
                height: 256 * responsiveFactor,
                width: 1024 * responsiveFactor,
                tileScale: responsiveFactor
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
            animatedSprite.position.y = 190 * responsiveFactor
            animatedSprite.position.x = (gameWidth / 2) - 32
            animatedSprite.scale = 0.5 * responsiveFactor
            animatedSprite.play()

            horse.current = animatedSprite
            horse.current.jumpState = 'idle'

            app.stage.addChild(horse.current)  

            // Setup Keyboard
            const space = keyboard(" ")
            space.press = () => {
                if (horse.current.jumpState === 'idle') {
                    horse.current.jumpState = 'ascend'
                }
            }
            space.release = () => {
                
            }
            
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
                horse.current.position.x -= (1.0 * responsiveFactor)
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
                sound.current.play()
                toStartingPositions()
                break
            default:
                break
        }
    }

    const jump = () => {
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
                        <p className="mt-4">Hit the spacebar or jump button to control the horse. Turn up the volume, watch out for cactus and grab as many coins as you can. Have fun!</p>
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
