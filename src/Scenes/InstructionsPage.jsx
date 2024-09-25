import { useRef, useState, useEffect, useCallback } from 'react'
import { Application, Assets, Texture, Sprite, TilingSprite, AnimatedSprite, Container } from 'pixi.js'
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
    const [ scorePoints, setScorePoints ] = useState(0)
    const [ scoreTime, setScoreTime ] = useState(0.0)

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

    let cactusTexture = useRef(null)
    let pricklyTexture = useRef(null)

    let cactusContainer = useRef(null)
    
    let horse = useRef(null)    
    let space = useRef(null)

    const createCactus = async () => {
        cactusContainer.current = new Container()
        var random

        for (var i = 0; i < 200; ++i) {
            random = Math.round(Math.random())
            var cactus = new Sprite({
                texture: random === 0 ? cactusTexture.current : pricklyTexture.current,
                scale: random === 0 ? 0.0825 * responsiveFactor : 0.08 * responsiveFactor
            })
            cactus.position.set(
                gameWidth + 50, 
                random === 0 ? 192 * responsiveFactor : 204 * responsiveFactor
            )
            cactus.moving = false
            cactus.passed = false
            cactusContainer.current.addChild(cactus)
        }
        app.stage.addChild(cactusContainer.current)
    }

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

        // Cactus
        Assets.add({ alias: 'Cactus', src: '/images/sprites/cactus.webp' })
        Assets.add({ alias: 'Prickly', src: '/images/sprites/prickly.webp' })

        // Coin
        Assets.add({ alias: 'Coin', src: '/images/sprites/coin.webp' })

        const texturesPromise = Assets.load([
            'Sunset',
            'Dirt',
            'WireFence',
            'Mountains1', 'Mountains2', 'Mountains3', 'Mountains4',
            'Cloud1', 'Cloud2', 'Cloud3', 'Cloud4', 'Cloud5',
            'WalkFrame1', 'WalkFrame2', 'WalkFrame3', 'WalkFrame4', 'WalkFrame5', 'WalkFrame6', 
            'Cactus', 'Prickly',
            'Coin'
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

            cactusTexture.current = textures.Cactus
            pricklyTexture.current = textures.Prickly

            createCactus()
            
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
    let baseSpeed = 4.9 * responsiveFactor
    let cloudSpeed = 1.15
    let cloudLoopOffset = 100.0  
    let timer = 0

    // Horse Stuff
    let ascendTimer = 0.0
    let descendTimer = 0.0
    let floatTimer = 0.0
    let jumpHeight = 7.0
    if (responsiveFactor === 1) {
        jumpHeight = 5.0
    } else if (responsiveFactor === 1.3) {
        console.log(responsiveFactor)
        jumpHeight = 6.5
    } else if (responsiveFactor === 1.5) {
        jumpHeight = 7.5
    }
    let jumpDuration = 2.0
    // let floatDuration = 0.25

    // Mobile
    let floatDuration, maxHeight, baseHeight
    let counter = 0.0
    if (responsiveFactor === 1.0) {
        baseSpeed = 3.8
        floatDuration = 14.0
        maxHeight = 100.0
        baseHeight = 190.0
    } else if (responsiveFactor === 1.5) {
        baseSpeed = 3.8 * responsiveFactor
        floatDuration = 14.0 / responsiveFactor
        maxHeight = 100.0 * responsiveFactor
        baseHeight = 190.0 * responsiveFactor
    } else if (responsiveFactor === 1.3) {
        baseSpeed = 3.8 * responsiveFactor
        floatDuration = 14.0 / responsiveFactor
        maxHeight = 100.0 * responsiveFactor
        baseHeight = 190.0 * responsiveFactor
    }


    // Scoreboard
    let intervalCount = 0.0
    let currentInterval = 0.0
    let previousInterval = 0.0
    let cactusInterval = 2000.0
    let cactusCount = 0
    let blah = 0

    
    const checkBounds = (object1, object2) => {
        const bounds1 = object1.getBounds()
        const bounds2 = object2.getBounds()

        return (
            bounds1.x < bounds2.x + bounds2.width
            && bounds1.x + bounds1.width > bounds2.x
            && bounds1.y < bounds2.y + bounds2.height
            && bounds1.y + bounds1.height > bounds2.y
        )
    }

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
            // Horse Jumping Logic
            if (horse.current.position.x >= 10) {
                horse.current.position.x -= (1.0 * responsiveFactor)
                horse.current.position.y = 190 * responsiveFactor
            } else {
                // Horse in in position and the game is ready to be played

                // If the horse is in the Ascent state
                if (horse.current.jumpState === 'ascend') {

                    // If the horse has not reached its max height, keep going up
                    var incrementer = 0.1
                    if (horse.current.position.y > maxHeight) {
                        // Decrease this number to speed up the ascent
                        incrementer += (0.03 / responsiveFactor)
                        // incrementer += 0.1
                        horse.current.position.y -= (1.0 / incrementer)

                    // If the horse has reached its max height, briefly pause, then go down
                    } else {
                        counter += 1.0
                        if (counter > floatDuration) {
                            counter = 0.0
                            incrementer = 0.1
                            horse.current.jumpState = 'descend'
                        } else {
                            console.log('floating')
                        }
                    }
                }

                // If the horse in in the Descent state
                if (horse.current.jumpState === 'descend') {
                    
                    // If the horse has not reached its base height, keep going down
                    var decrementer = 0.1
                    if (horse.current.position.y < baseHeight) {
                        decrementer += 1.0
                        // Increase first parameter of Math.pow to speed up descent
                        horse.current.position.y += Math.pow((3.5 * responsiveFactor), decrementer)

                    // If the horse has reached its base height, stay idle
                    } else {
                        decrementer = 0.1
                        horse.current.jumpState = 'idle'
                    } 
                }

                if (horse.current.jumpState === 'idle') {
                    horse.current.position.y = 190 * responsiveFactor
                }

                // Setup Keyboard
                space.current = keyboard(" ")
                space.current.press = () => {
                    if (horse.current.jumpState === 'idle') {
                        horse.current.jumpState = 'ascend'
                    }
                }
                space.current.release = () => {
                    
                }

                // Cactus Sending Logic
                intervalCount = Math.floor((blah += app.ticker.elapsedMS) / cactusInterval)
                if (intervalCount === currentInterval) {
                    // No need to change the interval now
                }
                if (intervalCount !== currentInterval) {
                    previousInterval = currentInterval
                    currentInterval = intervalCount 
                    // Phase One @ 2000
                    if (cactusCount < 7) {
                        cactusContainer.current.children[cactusCount].moving = true
                        cactusCount += 1
                    } else if (cactusCount === 7) {
                        intervalCount = 0
                        blah = 0
                        cactusCount += 1
                        cactusInterval = 1875.0

                    // Phase Two @ 1875
                    } else if (cactusCount > 7 && cactusCount < 16) {
                        cactusContainer.current.children[cactusCount].moving = true
                        cactusCount += 1
                    } else if (cactusCount === 16) {
                        intervalCount = 0
                        blah = 0
                        cactusCount += 1
                        cactusInterval = 1750.0

                    // Phase Three @ 1750
                    } else if (cactusCount > 16 && cactusCount < 28) {
                        cactusContainer.current.children[cactusCount].moving = true
                        cactusCount += 1
                    } else if (cactusCount === 28) {
                        intervalCount = 0
                        blah = 0
                        cactusCount += 1
                        cactusInterval = 1625.0
                        // console.log("Speed up #1")
                        // baseSpeed *= 1.2

                    // Phase Four @ 1625
                    } else if (cactusCount > 28 && cactusCount < 43) {
                        cactusContainer.current.children[cactusCount].moving = true
                        cactusCount += 1
                    } else if (cactusCount === 43) {
                        intervalCount = 0
                        blah = 0
                        cactusCount += 1
                        cactusInterval = 1500.0

                    // Phase Five @ 1500
                    } else if (cactusCount > 43 && cactusCount < 60) {
                        cactusContainer.current.children[cactusCount].moving = true
                        cactusCount += 1
                    } else if (cactusCount === 60) {
                        intervalCount = 0
                        blah = 0
                        cactusCount += 1
                        cactusInterval = 1375.0

                    // Phase Six @ 1375
                    } else if (cactusCount > 60 && cactusCount < 82) {
                        cactusContainer.current.children[cactusCount].moving = true
                        cactusCount += 1
                    } else if (cactusCount === 82) {
                        intervalCount = 0
                        blah = 0
                        cactusCount += 1
                        cactusInterval = 1250.0
                        // console.log("Speed up #2")
                        // baseSpeed *= 1.2

                    // Phase Seven @ 1250
                    } else if (cactusCount > 82 && cactusCount < 109) {
                        cactusContainer.current.children[cactusCount].moving = true
                        cactusCount += 1
                    } else if (cactusCount === 109) {
                        intervalCount = 0
                        blah = 0
                        cactusCount += 1
                        cactusInterval = 1125.0

                    // Phase Eight @ 1125
                    } else if (cactusCount > 109 && cactusCount < 131) {
                        cactusContainer.current.children[cactusCount].moving = true
                        cactusCount += 1
                    } else if (cactusCount === 131) {
                        intervalCount = 0
                        blah = 0
                        cactusCount += 1
                        cactusInterval = 1000.0
                    
                    // Phase Nine @ 1000
                    } else if (cactusCount > 131 && cactusCount < 148) {
                        cactusContainer.current.children[cactusCount].moving = true
                        cactusCount += 1
                    } else if (cactusCount === 148) {
                        intervalCount = 0
                        blah = 0
                        cactusCount += 1
                        cactusInterval = 875.0
                        // console.log("Speed up #3")
                        // baseSpeed *= 1.2

                    // Phase Ten @ 875
                    } else if (cactusCount > 148 && cactusCount < 163) {
                        cactusContainer.current.children[cactusCount].moving = true
                        cactusCount += 1
                    } else if (cactusCount === 163) {
                        intervalCount = 0
                        blah = 0
                        // app.stop()
                    }
                }

                for (let c = 0; c < cactusContainer.current.children.length; c++) {
                    if (cactusContainer.current.children[c].moving === true) {
                        cactusContainer.current.children[c].position.x -= 1.0 * baseSpeed
                    }
                    
                    if (checkBounds(cactusContainer.current.children[c], horse.current)) {
                        sound.current.stop()
                        app.stop()

                        setInstructionsStep(3)
                    }

                    if (cactusContainer.current.children[c].position.x < 0.0 && cactusContainer.current.children[c].passed === false) {
                        console.log("Cactus passed")
                        cactusContainer.current.children[c].passed = true
                        setScorePoints(scorePoints => scorePoints + 10.0)
                    }
                }
                // End Cactus Sending Logic


            }
        }
    }

    useEffect(() => {
        if (!initialized.current) {
            console.log("here we go again")
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
                gameInProgress = true
                break
            case 3:
                console.log("my turn")
                break
            default:
                break
        }
    }

    const intervalRef = useRef()

    useEffect(() => {
        if (instructionsStep === 2) {
            const id = setInterval(() => {
                setScoreTime(st => st + 1)
            }, 1000)
            intervalRef.current = id

            return () => {
                clearInterval(intervalRef.current)
            }
        } else if (instructionsStep === 3) {
            clearInterval(intervalRef.current)
        }
    }, [ instructionsStep ])

    useEffect(() => {
        if (scoreTime === 212) {
            setInstructionsStep(3)
            console.log("You win!")
        }
    }, [scoreTime ])

    const jump = () => {
        if (horse.current.jumpState === 'idle') {
            horse.current.jumpState = 'ascend'
        }
    }

    const restartGame = () => {
        setInstructionsStep(0)

        // Set horse back to position 0
        horse.current.position.x = (gameWidth / 2) - 32
        horse.current.position.y = 190 * responsiveFactor
        setScoreTime(0)
        setScorePoints(0)
        gameInProgress = false
        cactusContainer.current.destroy()
        createCactus()
        space.current = null

        app.start()
    }

    const streamLink = () => {
        alert("Stream")
    }

    const shareLink = () => {
        alert("Share")
    }

    return (
        <>
        <div className="relative flex flex-col items-center gap-2">
            <div className="absolute game-border" />
            <div className="absolute scorebox top-4 right-4 w-[80px]">
                <div className="flex justify-between">
                    <p className="font-snide-asides text-xl">Time</p>
                    <p className="font-snide-asides text-xl">{ scoreTime }</p>
                </div>
                <div className="flex justify-between">
                    <p className="font-snide-asides text-xl">Points</p>
                    <p className="font-snide-asides text-xl">{ scorePoints }</p>
                </div>
            </div>
            <div className="game" ref={ domElement } />
            { instructionsStep < 2 && <>
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
                <div className="special-button w-[180px] mt-8" onClick={ () => jump() }>
                    <p className="font-snide-asides text-2xl">Jump!</p>
                </div>
            </div>
            </> }
            { instructionsStep === 3 && <>
            <div className={`absolute bg-white leaderboard-modal`}>
                <div className="leaderboard-modal-content">
                    <p className="font-snide-asides text-lg">Thanks for playing!</p>
                    <div className="flex flex-col items-center mb-2">
                        <p className="font-snide-asides text-lg">Score</p>
                        <p className="font-snide-asides text-lg">{ scorePoints }</p>
                    </div>
                    <div className="flex flex-col items-center mb-2">
                        <p className="font-snide-asides text-lg">Initials</p>
                        <p className="font-snide-asides text-lg">ABC</p>
                    </div>
                    <div className="flex flex-col items-center mb-0">
                        <p className="font-snide-asides text-lg">Email</p>
                        <p className="font-snide-asides text-lg">your@email.com</p>
                    </div>
                    <div className="special-button w-[140px] mt-2" onClick={ () => restartGame() }>
                        <p className="font-snide-asides text-md">View Leaderboard</p>
                    </div>
                </div>
            </div>
            <div className="min-h-[191.62px]">
                <div className="special-button w-[180px] mt-2" onClick={ () => streamLink() }>
                    <p className="font-snide-asides text-2xl">Stream Horseback</p>
                </div>
                <div className="special-button w-[180px] mt-2" onClick={ () => shareLink() }>
                    <p className="font-snide-asides text-2xl">Share</p>
                </div>
                <div className="special-button w-[180px] mt-2" onClick={ () => restartGame() }>
                    <p className="font-snide-asides text-2xl">Play Again?</p>
                </div>
            </div>
            </> }
        </div>
        </>
    )
}

export default InstructionsPage
