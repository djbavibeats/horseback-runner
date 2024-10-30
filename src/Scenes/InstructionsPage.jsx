import { useRef, useState, useEffect, useCallback } from 'react'
import { Application, Assets, Texture, Sprite, TilingSprite, AnimatedSprite, Container } from 'pixi.js'
import { Howl } from 'howler'

// Firebase
import { db } from '../utils/firebase-configuration'
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc } from '@firebase/firestore'

import JennaSpirte from '../../public/images/game/jenna-sprite.webp'
import LifeCounterSprite from '../../public/images/sprites/lifecounter.webp'
import LoadingIcon from '../../public/images/splash-page/loading-icon.webp'

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
    const [ leaderboardStep, setLeaderboardStep ] = useState(0)
    const domElement = useRef(null)
    const initialized = useRef(false)
    const [ app, setApp ] = useState( new Application() ) 
    const [ gameWidth, setGameWidth ] = useState(317.59398 * responsiveFactor)
    const [ gameHeight, setGameHeight ] = useState(256 * responsiveFactor)
    const [ scorePoints, setScorePoints ] = useState(0)
    const [ scoreTime, setScoreTime ] = useState(0.0)
    const [ lives, setLives ] = useState(3.0)
    const [ gameLoading, setGameLoading ] = useState(false)

    const sound = useRef(new Howl({
        src: [ '/audio/horseback-jenna-paulette.mp3' ]
    }))

    const [ formFields, setFormFields ] = useState({
        "initials"  : "",
        "email"     : "",
        "optin"     :  false
    })
    const [ formLoading, setFormLoading ] = useState(false)
    const [ formError, setFormError ] = useState(false)
    const [ formErrorText, setFormErrorText ] = useState("")
    const [ highScores, setHighScores ] = useState([])
    const ScoresCollectionRef = collection(db, "scores")
    const [ winner, setWinner ] = useState(false)

    const getScoresData = async (scoreId) => {
        if (scoreId !== null) {
        }
        const data = await getDocs(ScoresCollectionRef)
        var sortedScores = data.docs.map((elem) => ({
            id: elem.id,
            ...elem.data()
        }))
        sortedScores.sort((a, b) => {
            return b.score - a.score
        })

        // Do I need this set state?
        setHighScores(sortedScores)

        return sortedScores
    }

    useEffect(() => {
        getScoresData(null)
    }, [])

    const createScoreAndSort = async (formFields) => {
        let scoreId
        return await addDoc(ScoresCollectionRef, { 
            email: formFields.email,
            initials: formFields.initials,
            score: formFields.score,
            optin: formFields.optin
        })
            .then(async (resp) => {
                scoreId = resp.id
                return await getScoresData(scoreId)
                    .then((sortedScores) => {
                        return { 
                            sortedScores: sortedScores,
                            scoreId: scoreId
                        }
                    })
            })
    }

    const checkWinners = async (scoreId) => {
        let topFive = highScores.slice(0, 5)
        const isWinner = topFive.filter(score => {
            score.id === scoreId
        })
    }

    const submitForm = () => {
        if (!formFields.initials || !formFields.email) {
            alert("Please fill in all fields!")
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(formFields.email)) {
            alert("How to trigger")
        } else {
            setFormFields({ ...formFields, score: scorePoints })
            let entry = {
                email: formFields.email,
                score: scorePoints,
                initials: formFields.initials,
                optin: formFields.optin
            }
            setFormLoading(true)

            // Create a new score
            return createScoreAndSort(entry)
                .then(( response ) => {
                    let sortedScores = response.sortedScores
                    let yourScoreId = response.scoreId
                    let topFive = sortedScores.slice(0, 5)
                
                    const isWinner = topFive.filter(score => {
                        return score.id === yourScoreId
                    })
                    if (isWinner.length > 0) {
                        setWinner(true)
                    } else {
                        setWinner(false)
                    }
                    setHighScores(topFive)
                    setFormLoading(false)
                    setLeaderboardStep(1)
                })
        }
    }

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

    let coinTexture = useRef(null)
    let coinContainer = useRef(null)
    
    let horse = useRef(null)    
    let walkSprite = useRef(null)
    let jumpSprite = useRef(null)
    let walkTexturesRef = useRef(null)
    let jumpTexturesRef = useRef(null)
    let space = useRef(null)

    let birdSprite = useRef(null)
    let littleBirdSprite = useRef(null)

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

    const createCoin = async () => {
        coinContainer.current = new Container()
        var random = Math.random()
        for (var i = 0; i < 50; ++i) {
            var coin = new Sprite({
                texture: coinTexture.current,
                scale: 0.07
            })
            coin.position.set(
                gameWidth + 50,
                (gameHeight / 2) + (random * 40.0)
            )
            coin.moving = false
            coin.collected = false
            coinContainer.current.addChild(coin)
        }
        app.stage.addChild(coinContainer.current)
    }

    const init = async () => {
        setGameLoading(true)
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
        Assets.add({ alias: 'WalkFrame1', src: '/images/sprites/horse/walkv2/frame-1.png' })
        Assets.add({ alias: 'WalkFrame2', src: '/images/sprites/horse/walkv2/frame-2.png' })
        Assets.add({ alias: 'WalkFrame3', src: '/images/sprites/horse/walkv2/frame-3.png' })
        Assets.add({ alias: 'WalkFrame4', src: '/images/sprites/horse/walkv2/frame-4.png' })
        Assets.add({ alias: 'WalkFrame5', src: '/images/sprites/horse/walkv2/frame-5.png' })
        Assets.add({ alias: 'WalkFrame6', src: '/images/sprites/horse/walkv2/frame-6.png' })

        
        Assets.add({ alias: 'JumpFrame1', src: '/images/sprites/horse/jump/jump-frame-1.png' })
        Assets.add({ alias: 'JumpFrame2', src: '/images/sprites/horse/jump/jump-frame-2.png' })
        Assets.add({ alias: 'JumpFrame3', src: '/images/sprites/horse/jump/jump-frame-3.png' })
        Assets.add({ alias: 'JumpFrame4', src: '/images/sprites/horse/jump/jump-frame-4.png' })
        Assets.add({ alias: 'JumpFrame5', src: '/images/sprites/horse/jump/jump-frame-5.png' })
        Assets.add({ alias: 'JumpFrame6', src: '/images/sprites/horse/jump/jump-frame-6.png' })

        // Bird
        Assets.add({ alias: 'BirdFrame1', src: '/images/sprites/bird/bird-1.png' })
        Assets.add({ alias: 'BirdFrame2', src: '/images/sprites/bird/bird-2.png' })
        Assets.add({ alias: 'BirdFrame3', src: '/images/sprites/bird/bird-3.png' })
        Assets.add({ alias: 'BirdFrame4', src: '/images/sprites/bird/bird-4.png' })

        // Little Bird
        Assets.add({ alias: 'LittleBirdFrame1', src: '/images/sprites/little-bird/little-bird-1.png' })
        Assets.add({ alias: 'LittleBirdFrame2', src: '/images/sprites/little-bird/little-bird-2.png' })
        Assets.add({ alias: 'LittleBirdFrame3', src: '/images/sprites/little-bird/little-bird-3.png' })
        Assets.add({ alias: 'LittleBirdFrame4', src: '/images/sprites/little-bird/little-bird-4.png' })

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
            'JumpFrame1', 'JumpFrame2', 'JumpFrame3', 'JumpFrame4', 'JumpFrame5', 'JumpFrame6',
            'BirdFrame1', 'BirdFrame2', 'BirdFrame3', 'BirdFrame4', 
            'LittleBirdFrame1', 'LittleBirdFrame2', 'LittleBirdFrame3', 'LittleBirdFrame4', 
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
                x: cloudXOffset, 
                y: 40 * responsiveFactor,
                scale: 0.75 * responsiveFactor 
            })
            cloud2.current = new Sprite({ 
                texture: textures.Cloud2, 
                x: cloudXOffset + 64, 
                y: 80 * responsiveFactor,
                scale: 0.75 * responsiveFactor
            })
            cloud3.current = new Sprite({ 
                texture: textures.Cloud3, 
                x: cloudXOffset + 128, 
                y: 50 * responsiveFactor,
                scale: 0.75 * responsiveFactor 
            })
            cloud4.current = new Sprite({ 
                texture: textures.Cloud4, 
                x: cloudXOffset + 256, 
                y: 30 * responsiveFactor,
                scale: 0.75 * responsiveFactor 
            })
            cloud5.current = new Sprite({ 
                texture: textures.Cloud5, 
                x: cloudXOffset + 324, 
                y: 100 * responsiveFactor,
                scale: 0.75 * responsiveFactor 
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
                tileScale: responsiveFactor,
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
                '/images/sprites/horse/walkv2/frame-1.png', '/images/sprites/horse/walkv2/frame-2.png', '/images/sprites/horse/walkv2/frame-3.png',
                '/images/sprites/horse/walkv2/frame-4.png', '/images/sprites/horse/walkv2/frame-5.png', '/images/sprites/horse/walkv2/frame-6.png'
            ]
            const jumpFrames = [
                '/images/sprites/horse/jump/jump-frame-1.png', '/images/sprites/horse/jump/jump-frame-2.png', '/images/sprites/horse/jump/jump-frame-3.png',
                '/images/sprites/horse/jump/jump-frame-4.png', '/images/sprites/horse/jump/jump-frame-5.png', '/images/sprites/horse/jump/jump-frame-6.png'
            ]
            let textureArray = []
            for (const frame of walkFrames) {
                const texture = Texture.from(frame)
                textureArray.push(texture)
            }
            walkTexturesRef.current = textureArray

            let jumpTextureArray = []
            for (const jumpFrame of jumpFrames) {
                const jumpTexture = Texture.from(jumpFrame)
                jumpTextureArray.push(jumpTexture)
            }
            jumpTexturesRef.current = jumpTextureArray

            walkSprite.current = new AnimatedSprite(walkTexturesRef.current)
            jumpSprite.current = new AnimatedSprite(jumpTexturesRef.current)

            const horseSprite = new AnimatedSprite(walkSprite.current.textures)
            horseSprite.animationSpeed = 0.25
            horseSprite.position.y = 195 * responsiveFactor
            horseSprite.position.x = (gameWidth / 2) - 32
            horseSprite.scale = 0.5 * responsiveFactor
            horseSprite.play()

            horse.current = horseSprite
            horse.current.jumpState = 'idle'

            app.stage.addChild(horse.current)  
            
            const birdFrames = [
                '/images/sprites/bird/bird-1.png', '/images/sprites/bird/bird-2.png', '/images/sprites/bird/bird-3.png',
                '/images/sprites/bird/bird-4.png'
            ]
            let birdTexturesArray = []
            for (const birdFrame of birdFrames) {
                const birdTexture = Texture.from(birdFrame)
                birdTexturesArray.push(birdTexture)
            }
            
            birdSprite.current = new AnimatedSprite(birdTexturesArray)
            birdSprite.current.animationSpeed = 0.15
            birdSprite.current.scale = 0.45 * responsiveFactor
            // birdSprite.current.position.y = gameHeight / 2
            birdSprite.current.position.x = -350.0
            birdSprite.current.play()

            app.stage.addChild(birdSprite.current)

            const littleBirdFrames = [
                '/images/sprites/little-bird/little-bird-1.png', '/images/sprites/little-bird/little-bird-2.png', '/images/sprites/little-bird/little-bird-3.png',
                '/images/sprites/little-bird/little-bird-4.png'
            ]
            let littleBirdTexturesArray = []
            for (const littleBirdFrame of littleBirdFrames) {
                const littleBirdTexture = Texture.from(littleBirdFrame)
                littleBirdTexturesArray.push(littleBirdTexture)
            }
            
            littleBirdSprite.current = new AnimatedSprite(littleBirdTexturesArray)
            littleBirdSprite.current.animationSpeed = 0.15
            littleBirdSprite.current.scale = 0.45 * responsiveFactor
            littleBirdSprite.current.position.x = -600.0
            littleBirdSprite.current.play()

            app.stage.addChild(littleBirdSprite.current)

            cactusTexture.current = textures.Cactus
            pricklyTexture.current = textures.Prickly
            createCactus()

            coinTexture.current = textures.Coin
            createCoin()
           
        }).then(() => {
            setGameLoading(false)
            app.ticker.add((delta) => {
                // Initialize game animations
                gameLoop()

            })
        })
    }

    let count = 0
    let time = Date.now()
    let baseSpeed = 4.9 * responsiveFactor
    let cloudSpeed = 0.75
    let cloudLoopOffset = 100.0  
    let timer = 0


    // Horse Stuff
    // Mobile
    let floatDuration, maxHeight, baseHeight
    let counter = 0.0
    if (responsiveFactor === 1.0) {
        baseSpeed = 3.8
        floatDuration = 13.0
        maxHeight = 110.0
        baseHeight = 195.0
    } else if (responsiveFactor === 1.5) {
        baseSpeed = 3.8 * responsiveFactor
        floatDuration = 13.0 / responsiveFactor
        maxHeight = 110.0 * responsiveFactor
        baseHeight = 195.0 * responsiveFactor
    } else if (responsiveFactor === 1.3) {
        baseSpeed = 3.8 * responsiveFactor
        floatDuration = 13.0 / responsiveFactor
        maxHeight = 110.0 * responsiveFactor
        baseHeight = 195.0 * responsiveFactor
    }

    // Scoreboard
    let lifeCounter = 3.0
    let scoreCounter = 0.0
    let intervalCount = 0.0
    let currentInterval = 0.0
    let previousInterval = 0.0
    let cactusInterval = 2000.0
    let cactusCount = 0
    let coinCount = 0
    let blah = 0

    let flickerTint = true
    let flickerLength = 30.0
    let flickerLengthCounter = 0.0
    let flickerRate = 20.0
    let flickerRateCounter = 0.0

    let birdRandomFactor = 0.0
    let littleBirdRandomFactor = 0.0

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

        // Mountains Animation
        mountains1.current.tilePosition.x -= 0.0300 * baseSpeed
        mountains2.current.tilePosition.x -= 0.0200 * baseSpeed
        mountains3.current.tilePosition.x -= 0.0175 * baseSpeed
        mountains4.current.tilePosition.x -= 0.0100 * baseSpeed

        // Wirefence Animation
        wireFence.current.tilePosition.x -= 1.0 * baseSpeed

        // Dirt Animation
        dirt.current.tilePosition.x -= 1.0 * baseSpeed

        // Bird Animation
        birdSprite.current.position.y = (Math.sin(time * 0.0025) * 3 * responsiveFactor) + (70 * responsiveFactor) + birdRandomFactor
        birdSprite.current.position.x += 0.28
        if (birdSprite.current.position.x >= gameWidth + 50.0) {
            birdSprite.current.position.x = -700.0 * responsiveFactor
            birdRandomFactor = Math.random() * 50
        }

        littleBirdSprite.current.position.y = (Math.sin(time * 0.0025) * 7 * responsiveFactor) + (100 * responsiveFactor) + littleBirdRandomFactor
        littleBirdSprite.current.position.x += 0.19
        if (littleBirdSprite.current.position.x >= gameWidth + 50.0) {
            littleBirdSprite.current.position.x = -550.0 * responsiveFactor
            littleBirdRandomFactor = Math.random() * 50
        }

        // Clouds Animation
        cloud1.current.position.y = Math.sin(time * 0.00025) + (responsiveFactor * 40)
        cloud1.current.position.x <= 0.0 - 200.0
            ? cloud1.current.position.x = gameWidth
            : cloud1.current.position.x -= 0.210 * cloudSpeed

        cloud2.current.position.y = Math.sin(time * 0.00025) * 2 + (responsiveFactor * 80)
        cloud2.current.position.x <= 0.0 - 150.0 
            ? cloud2.current.position.x = gameWidth + 98.0
            : cloud2.current.position.x -= 0.125 * cloudSpeed

        cloud3.current.position.y = Math.sin(time * 0.00075) + (responsiveFactor * 50)
        cloud3.current.position.x <= 0.0 - 250.0
            ? cloud3.current.position.x = gameWidth + 120.0
            : cloud3.current.position.x -= 0.150 * cloudSpeed

        cloud4.current.position.y = Math.sin(time * 0.00075) * 2 + (responsiveFactor * 10)
        cloud4.current.position.x <= 0.0 - 100.0
            ? cloud4.current.position.x = gameWidth + 118.0
            : cloud4.current.position.x -= 0.200 * cloudSpeed

        cloud5.current.position.y = Math.sin(time * 0.0005) + (responsiveFactor * 100)
        cloud5.current.position.x <= 0.0 - 300.0
            ? cloud5.current.position.x = gameWidth + 96.0 + cloudLoopOffset
            : cloud5.current.position.x -= 0.100 * cloudSpeed

        // Coin Hover Animation
        for (let j = 0; j < coinContainer.current.children.length; j++) {
            coinContainer.current.children[j].position.y -= Math.sin(time * 0.005) * 0.125
        }

        if (horse.current.jumpState === 'idle') {
            // horse.current.textures = walkTexturesRef.current
            // horse.current.animationSpeed = 0.25
            // horse.current.play()
        }
        // Check if player has pressed "Start"
        if (gameInProgress == true) {
            // Setup Keyboard
            space.current = keyboard(" ")
            space.current.press = () => {
                if (horse.current.jumpState === 'idle') {
                    horse.current.jumpState = 'ascend'
                    horse.current.gotoAndStop(5)
                    horse.current.textures = jumpSprite.current.textures
                    horse.current.animationSpeed = 0.155
                    horse.current.loop = false
                    horse.current.play()
                }
            }

            // Move horse from center to starting position
            if (horse.current.position.x >= 10) {
                horse.current.position.x -= (1.0 * responsiveFactor)
                horse.current.position.y = 195 * responsiveFactor
            } else {

                // If the horse is in the Ascent state
                if (horse.current.jumpState === 'ascend') {

                    // If the horse has not reached its max height, keep going up
                    var incrementer = 0.1
                    if (horse.current.position.y > maxHeight) {
                        // Decrease this number to speed up the ascent
                        incrementer += (0.035 / responsiveFactor)
                        horse.current.position.y -= (1.0 / incrementer)

                    // If the horse has reached its max height, briefly pause, then go down
                    } else {
                        counter += 1.0
                        if (counter > floatDuration) {
                            counter = 0.0
                            incrementer = 0.1
                            horse.current.jumpState = 'descend'
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
                        horse.current.position.y += Math.pow((3.55 * responsiveFactor), decrementer)

                    // If the horse has reached its base height, stay idle
                    } else {
                        decrementer = 0.1
                        horse.current.jumpState = 'idle'
                        horse.current.textures = walkTexturesRef.current
                        horse.current.animationSpeed = 0.25
                        horse.current.play()
                        horse.current.loop = true
                    } 
                }

                // Ensure the horse is on the ground when not jumping. Prevent clipping.
                if (horse.current.jumpState === 'idle') {
                    horse.current.position.y = 195 * responsiveFactor
                }

                // Cactus Sending Logic
                intervalCount = Math.floor((blah += app.ticker.elapsedMS) / cactusInterval)
                if (intervalCount === currentInterval) {
                    // No need to change the interval now
                }
                if (intervalCount !== currentInterval) {
                    previousInterval = currentInterval
                    currentInterval = intervalCount 
                    if (cactusCount > 0 && cactusCount % 10 === 0) {
                        intervalCount = 0
                        blah = 0
                        cactusCount += 1
                        cactusContainer.current.children[cactusCount].skip = true
                        cactusInterval -= 75.0
                        coinContainer.current.children[coinCount].moving = true
                        coinCount += 1
                    } else {
                        cactusContainer.current.children[cactusCount].moving = true
                        cactusCount += 1
                    }
                }

                for (let c = 0; c < cactusContainer.current.children.length; c++) {
                    if (cactusContainer.current.children[c].moving === true && cactusContainer.current.children[c].skip !== true) {
                        cactusContainer.current.children[c].position.x -= 1.0 * baseSpeed
                    }
                    
                    if (checkBounds(cactusContainer.current.children[c], horse.current) && cactusContainer.current.children[c].passed === false) {
                        cactusContainer.current.children[c].passed = true
                        lifeCounter -= 1.0
                        setLives(lives => lives -= 1.0)
                        if (scoreCounter > 0.0) {
                            scoreCounter -= 10.0
                            setScorePoints(scorePoints => scorePoints - 10.0)
                        }
                        horse.current.flickering = true
                    }

                    if (cactusContainer.current.children[c].position.x < 0.0 && cactusContainer.current.children[c].passed === false) {
                        cactusContainer.current.children[c].passed = true
                        scoreCounter += 10.0
                        setScorePoints(scorePoints => scorePoints + 10.0)
                    }
                }
                // End Cactus Sending Logic

                // Coin sending logic
                for (let h = 0; h < coinContainer.current.children.length; h++) {
                    if (coinContainer.current.children[h].moving === true) {
                        coinContainer.current.children[h].position.x -= 1.0 * baseSpeed
                    }
                    if (checkBounds(coinContainer.current.children[h], horse.current)) {
                        coinContainer.current.children[h].collected = true
                        coinContainer.current.children[h].destroy()
                        setScorePoints(scorePoints => scorePoints + 50.0)
                    }
                }

                
                if (horse.current.flickering === true) {
                    if (flickerLengthCounter < flickerLength) {
                        if (flickerRateCounter < 4.0) {
                            horse.current.tint = 0xff0000
                            flickerRateCounter += 1.0
                        } else if (flickerRateCounter >= 4.0 && flickerRateCounter < 8.0) {
                            horse.current.tint = 0xffffff
                            flickerRateCounter += 1.0
                        } else {
                            flickerRateCounter = 0.0
                        }
                        flickerLengthCounter += 1.0
                    } else {
                        horse.current.flickering = false
                        flickerLengthCounter = 0.0
                        flickerRateCounter = 0.0
                        horse.current.tint = 0xffffff
                    }
                }
                if (lifeCounter === 0.0) {
                    app.stop()
                    setInstructionsStep(3)
                }
            }
        } else {
            horse.current.flickering = false
            flickerLengthCounter = 0.0
            flickerRateCounter = 0.0
            lifeCounter = 3.0
            scoreCounter = 0.0
            cactusInterval = 2000.0
            cactusCount = 0.0
            horse.current.tint = 0xffffff
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
                gameInProgress = true
                break
            case 3:
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
            gameInProgress = false
            setInstructionsStep(3)
        }
    }, [scoreTime ])

    const jump = () => {
        if (horse.current.jumpState === 'idle') {
            horse.current.jumpState = 'ascend'
            horse.current.gotoAndStop(5)
            horse.current.textures = jumpSprite.current.textures
            horse.current.animationSpeed = 0.155
            horse.current.loop = false
            horse.current.play()
        }
    }

    const restartGame = () => {
        sound.current.stop()
        setInstructionsStep(0)
        setLeaderboardStep(0)

        // Set horse back to starting position
        horse.current.position.x = (gameWidth / 2) - 32
        horse.current.position.y = 195 * responsiveFactor

        // Set score and time to zero
        setScoreTime(0)
        setScorePoints(0)
        gameInProgress = false

        // Destroy old cactus container, and create a new one
        cactusContainer.current.destroy()
        cactusInterval = 2000.0
        createCactus()

        // Reset lives
        lifeCounter = 3.0
        setLives(3.0)

        space.current = null
        

        app.start()
        setInstructionsStep(2)
        setTimeout(() => {
            gameInProgress = true
            sound.current.play()
        }, 250)
        // sound.current.play()
    }

    const streamLink = () => {
        alert("Stream")
    }

    const mergeImageURIs = async (images) => {
        return new Promise((resolve, reject) => {
            var canvas = document.createElement('canvas')
            canvas.width = 540
            canvas.height = 960
            Promise.all(images.map((imageObj, index) => add2Canvas(canvas, imageObj)))
                .then(() => {
                    resolve(canvas.toDataURL('image/png'), reject)
                })
        })
    }

    const add2Canvas = (canvas, imageObj) => {
        return new Promise((resolve, reject) => {
            if (!imageObj || typeof imageObj != 'object') return reject()
            var x = imageObj.x && canvas.width ? (imageObj.x >= 0 ? imageObj.x : canvas.width + imageObj.x) : 0
            var y = imageObj.y && canvas.height ? (imageObj.y >= 0 ? imageObj.y : canvas.height + imageObj.y) : 0
            var image = new Image()
            image.onload = function() {
                canvas.getContext('2d').drawImage(this, x, y, imageObj.width, imageObj.height)

                canvas.getContext('2d').font = "32px Snide Asides"
                canvas.getContext('2d').textAlign = 'center'
                canvas.getContext('2d').fillText(`${formFields.initials.toUpperCase()}`, 265, 455)

                canvas.getContext('2d').font = "32px Snide Asides"
                canvas.getContext('2d').fillText(`${scorePoints}`, 265, 530)

                resolve()
            }
            image.src = imageObj.src
        })
    }

    function dataURLtoFile(dataurl, filename) {
        var arr = dataurl.split(","),
            mimeType = arr[0].match(/:(.*?);/)[1],
            decodedData = atob(arr[1]),
            lengthOfDecodedData = decodedData.length,
            u8array = new Uint8Array(lengthOfDecodedData)
        while (lengthOfDecodedData--) {
            u8array[lengthOfDecodedData] = decodedData.charCodeAt(lengthOfDecodedData)
        }
        return new File([u8array], filename, { type: mimeType })
    }


    const shareLink = async () => {
        var scoreTemplate = new Image()
        scoreTemplate.src = '/horseback-scorecard.webp'

        var images = [
            { src: scoreTemplate.src, x: 0, y: 0, width: 540, height: 960 }
        ]

        mergeImageURIs(images)
            .then(async resp => {
                const shareImage = new Image
                shareImage.src = resp

                const file = [ dataURLtoFile(shareImage.src, `horseback-scorecard.png`) ]
                const shareData = {
                    title: "Jenna Paulette - Horseback",
                    text: "Jump over some stuff and collect some coins and you might be lucky enough to ride away with a free pair of Justin Boots!",
                    url: "https://horseback-runner.netlify.app/",
                    files: file
                }
        
                if (navigator.share && navigator.canShare(shareData)) {
                    try {
                        await navigator.share(shareData)
                    } catch (err) {
                        console.log(`Error: ${err}`)
                    }
                } else {
                    // do something else like copying the data to the clipboard
                    alert("Sharing is not enabled in this browser")
                }
            })
        
        

    }

    const Life = ({ index }) => {
        return <img className="w-6" src={ LifeCounterSprite } />
    }

    const LivesCounter = ({ count }) => {
        return Array.from({ length: count }).map((_item, index) => <Life key={ index } />)
    }

    const ScoreRow = ({ rank, initials, score }) => {
        return (<>
            <div className="col-span-1 text-left">
                <p className="font-snide-asides text-lg md:text-xl">{ rank }</p>
            </div>
            <div className="col-span-1 text-center">
                <p className="font-snide-asides text-lg uppercase md:text-xl">{ initials }</p>
            </div>
            <div className="col-span-1 text-right">
                <p className="font-snide-asides text-lg md:text-xl">{ score }</p>
            </div>
        </>)
    }
    const renderScores = () => {
        if (highScores.length > 0) {
            return highScores.slice(0, 5).map((_item, index) => <ScoreRow key={ index } rank={ index + 1 } initials={ _item.initials } score={ _item.score } />)
        }
    }

    return (
        <>
        <div className={`relative ${ gameLoading ? 'hidden' : 'flex' } flex-col items-center gap-2`}>
            <div className="absolute game-border" />
            <div className="absolute lifecounter top-4 left-4 w-[80px]">
                <div className="flex justify-start gap-2">
                    <LivesCounter count={ lives } />
                </div>
            </div>
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
                    <p>Jenna Paulette here! Do you want a free pair of Justin Boots? Jump over some stuff and collect some coins and you might be lucky to ride away with a pair!</p>
                </> }
                { instructionsStep === 1 && <>
                    <p className="mt-4">Hit the spacebar or jump button to control the horse. Turn up the volume, watch out for cacti and grab as many coins as you can. Have fun!</p>
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
                    { leaderboardStep === 0 && <>
                        <p className="font-snide-asides text-lg md:text-xl">Thanks for playing!</p>
                        <form id="form-container" className="flex flex-col items-center">
                            <div className="flex flex-col items-center mb-0 md:mb-2">
                                <p className="font-snide-asides text-lg md:text-xl">Score</p>
                                <p className="font-snide-asides text-lg md:text-xl">{ scorePoints }</p>
                            </div>
                            <div className="flex flex-col items-center mb-0 md:mb-2">
                                <p className="font-snide-asides text-lg md:text-xl">Initials</p>
                                <input 
                                    required
                                    name="initials"
                                    type="text"
                                    value={ formFields.initials }
                                    onChange={ (e) => setFormFields({ ...formFields, initials: e.target.value })}
                                    placeholder="ABC" 
                                    maxLength="3"
                                    className="font-snide-asides text-black bg-transparent text-center text-lg md:text-xl tracking-[0.125rem] uppercase" 
                                />
                            </div>
                            <div className="flex flex-col items-center mb-0 md:mb-2">
                                <p className="font-snide-asides text-lg md:text-xl">Email</p>
                                <input 
                                    required
                                    name="email"
                                    type="email"
                                    value={ formFields.email }
                                    onChange={ (e) => setFormFields({ ...formFields, email: e.target.value }) }
                                    placeholder="your@email.com" 
                                    className="font-snide-asides text-black bg-transparent text-center text-lg md:text-xl" 
                                />
                            </div>
                            <div className="flex gap-2 items-center">
                                <p className="font-snide-asides text-sm md:text-xl">Subscribe to Jenna Paulette's Newsletter</p>
                                <input 
                                    name="consent"
                                    value={ formFields.optin }
                                    checked={ formFields.optin }
                                    type="checkbox"
                                    className="w-6 h-6 border-2 outline-4 bg-red-500"
                                    onChange={ (e) => {
                                        setFormFields({ ...formFields, optin: !formFields.optin})
                                    }}
                                />
                            </div>
                            <div className="special-button w-[140px] mt-0" onClick={ submitForm }>
                                <p className="font-snide-asides text-lg">View Leaderboard</p>
                            </div>
                        </form>
                    </> }
                    { leaderboardStep === 1 && <>
                        <p className="font-snide-asides text-lg md:text-xl mb-2">{
                            winner ? `Congrats! You made the top 5!`
                            : `You didn't make the leaderboard`
                        }</p>
                        <div className="grid grid-cols-3 w-[90%]">
                            <div className="col-span-1 text-left">
                                <p className="font-snide-asides text-lg md:text-xl">Rank</p>
                            </div>
                            <div className="col-span-1 text-center">
                                <p className="font-snide-asides text-lg md:text-xl">Initials</p>
                            </div>
                            <div className="col-span-1 text-right">
                                <p className="font-snide-asides text-lg md:text-xl">Score</p>
                            </div>
                            { renderScores() }
                        </div>
                            <div className="special-button w-[140px] mt-2" onClick={ () => restartGame() }>
                                <p className="font-snide-asides text-lg">Try again?</p>
                            </div>
                    </> }
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
        { gameLoading === true &&
        <div className="absolute w-full h-full flex items-center flex-col justify-center mt-52">
            <img className="w-8 animate-spin" src={ LoadingIcon } />
            <p className="font-snide-asides text-2xl mt-4">Loading...</p>
        </div>
        }
        </>
    )
}

export default InstructionsPage
