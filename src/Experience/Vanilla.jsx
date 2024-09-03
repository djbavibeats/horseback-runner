import React, { useRef, useState, useEffect } from 'react'
import { Application, Assets, Texture, Sprite, TilingSprite, AnimatedSprite, Graphics } from 'pixi.js'

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

const Vanilla = () => {
    const domElement = useRef(null)
    const initialized = useRef(false)
    const [ app, setApp ] = useState( new Application() )
    let dirt = useRef(null)
    let mountains1 = useRef(null)
    let mountains2 = useRef(null)
    let mountains3 = useRef(null)
    let mountains4 = useRef(null)
    let cloud1 = useRef(null)
    let cloud2 = useRef(null)
    let cloud3 = useRef(null)
    let cloud4 = useRef(null)
    let cloud5 = useRef(null)

    const [ currentId, setCurrentId ] = useState(0)
    let player = useRef(null)
    const [ playerJumping, setPlayerJumping ] = useState('no')
    
    const [ isMobile, setIsMobile ] = useState()
    const [ gameWidth, setGameWidth ] = useState()
    const [ sizes, setSizes ] = useState({
        width: window.innerWidth,
        height: window.innerHeight
    })

    useEffect(() => {
        setSizes({
            width: window.innerWidth,
            height: window.innerHeight
        })
        if (sizes.width < 800) {
            setGameWidth(sizes.width - 50)
        } else {
            setGameWidth(768)
        }

        const onResize = () => {
            window.location.reload()
        }

        window.addEventListener('resize', onResize)

        return () => {
            window.removeEventListener('resize', onResize)
        }
    }, [])

    // Animate everything
    let count = 0
    let time = Date.now()
    let baseSpeed = 3.85
    let cloudSpeed = 1.15
    let cloudLoopOffset = 100.0
    const gameLoop = (delta) => {

        const currentTime = Date.now()
        const deltaTime = currentTime - time
        time = currentTime

        dirt.current.tilePosition.x -= 1.0 * baseSpeed

        mountains1.current.tilePosition.x -= 0.9 * baseSpeed
        mountains2.current.tilePosition.x -= 0.8 * baseSpeed
        mountains3.current.tilePosition.x -= 0.7 * baseSpeed
        mountains4.current.tilePosition.x -= 0.6 * baseSpeed

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

        if (player.current.jumping) {
            startJump = 0 
            player.current.position.y -= 10
        }
    }

    const init = async () => {
        // Initialize the application
        await app.init({ 
            background: 0x1099bb, 
            width: gameWidth,
            height: 256
        })

        // Add the application canvas to the DOM element
        domElement.current.appendChild(app.canvas)

        // Load in assets
        Assets.add({ alias: 'Sunset', src: '/game/background.png' })
        Assets.add({ alias: 'Dirt', src: '/game/dirt.png' })
        Assets.add({ alias: 'WireFence', src: '/game/wire-fence.png' })
        Assets.add({ alias: 'Mountains1', src: '/game/mountains/mountains-1.png' })
        Assets.add({ alias: 'Mountains2', src: '/game/mountains/mountains-2.png' })
        Assets.add({ alias: 'Mountains3', src: '/game/mountains/mountains-3.png' })
        Assets.add({ alias: 'Mountains4', src: '/game/mountains/mountains-4.png' })
        Assets.add({ alias: 'Cloud1', src: '/game/clouds/cloud-1.png' })
        Assets.add({ alias: 'Cloud2', src: '/game/clouds/cloud-2.png' })
        Assets.add({ alias: 'Cloud3', src: '/game/clouds/cloud-3.png' })
        Assets.add({ alias: 'Cloud4', src: '/game/clouds/cloud-4.png' })
        Assets.add({ alias: 'Cloud5', src: '/game/clouds/cloud-5.png' })

        const texturesPromise = Assets.load([ 
            'Sunset', 
            'Dirt',
            'WireFence', 
            'Mountains1', 'Mountains2', 'Mountains3', 'Mountains4',
            'Cloud1', 'Cloud2', 'Cloud3', 'Cloud4', 'Cloud5'
        ])

        texturesPromise.then((textures) => {
            // Sunset Background
            const sunset = new Sprite({
                texture: textures.Sunset,
                height: 256,
                width: 1024
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

            // Dirt Ground
            dirt.current = new TilingSprite({
                texture: textures.Dirt,
                height: 256,
                width: 1024
            })
            
            app.stage.addChild(dirt.current)
        }).then(() => {    

        })
    }

    const horse = async () => {
        Assets.add({ alias: 'WalkFrame1', src: '/game/horse/walk/frame-1.png' })
        Assets.add({ alias: 'WalkFrame2', src: '/game/horse/walk/frame-2.png' })
        Assets.add({ alias: 'WalkFrame3', src: '/game/horse/walk/frame-3.png' })
        Assets.add({ alias: 'WalkFrame4', src: '/game/horse/walk/frame-4.png' })
        Assets.add({ alias: 'WalkFrame5', src: '/game/horse/walk/frame-5.png' })
        Assets.add({ alias: 'WalkFrame6', src: '/game/horse/walk/frame-6.png' })
        
        const texturesPromise = Assets.load([ 
            'WalkFrame1', 'WalkFrame2', 'WalkFrame3',
            'WalkFrame4', 'WalkFrame5', 'WalkFrame6', 
        ])

        texturesPromise.then((textures) => {
            const walkFrames = [
                '/game/horse/walk/frame-1.png', '/game/horse/walk/frame-2.png', '/game/horse/walk/frame-3.png',
                '/game/horse/walk/frame-4.png', '/game/horse/walk/frame-5.png', '/game/horse/walk/frame-6.png'
            ]
    
            let textureArray = []
            for (const frame of walkFrames) {
                const texture = Texture.from(frame)
                textureArray.push(texture)
            }
    
            const animatedSprite = new AnimatedSprite(textureArray)
            animatedSprite.animationSpeed = 0.25
            animatedSprite.position.y = 190
            animatedSprite.position.x = 10
            animatedSprite.scale = 0.55
            animatedSprite.play()

            player.current = animatedSprite
            player.current.jumpState = 'idle'

            app.stage.addChild(player.current)  

            // Setup Keyboard
            const space = keyboard(" ")
            space.press = () => {
                if (player.current.jumpState === 'idle') {
                    player.current.jumpState = 'ascend'
                }
            }
            space.release = () => {
                console.log('spacebar released')
            }

            let ascendTimer = 0.0
            let descendTimer = 0.0
            let floatTimer = 0.0
            let jumpHeight = 4.0
            let jumpDuration = 2.0
            let floatDuration = 1.25
            app.ticker.add((delta) => {
                if (player.current.jumpState === 'ascend') {
                    ascendTimer += 0.1
                    player.current.position.y -= jumpHeight
                    if (ascendTimer >= jumpDuration) {
                        player.current.jumpState = 'float'
                        ascendTimer = 0.0
                    }
                }
                if (player.current.jumpState === 'descend') {
                    descendTimer += 0.1
                    player.current.position.y += jumpHeight
                    if (descendTimer >= jumpDuration) {
                        player.current.jumpState = 'idle'
                        descendTimer = 0.0
                    }
                }
                if (player.current.jumpState === 'float') {
                    floatTimer += 0.1
                    if (floatTimer >= floatDuration) {
                        player.current.jumpState = 'descend'
                        floatTimer = 0.0
                    }
                }
                gameLoop(delta)
            })
        })
    }

    const saguaro = () => {
        let myId = currentId
        let sprite
        let hit = false

        const init = () => {
            Assets.add({ alias: 'Saguaro', src: '/game/saguaro.png' })
            const texturesPromise = Assets.load([ 
                'Saguaro'
            ])
            texturesPromise.then(textures => {
                sprite = new Sprite({
                    texture: textures.Saguaro,
                    height: 50,
                    width: 32,
                    scale: .9
                })
                sprite.position.x = gameWidth + 50
                sprite.position.y = 190
                app.stage.addChild(sprite)
            
                app.ticker.add(() => {
                    sprite.position.x -= 1.0 * baseSpeed
                    if (checkBounds(sprite, player.current)) {
                        if (!hit) {
                            hit = true
                            console.log('Player hit by Saguaro #' + myId)
                        }
                    }
                })
            })

        }

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

        init()
    }

    useEffect(() => {
        if (gameWidth) {
            if (!initialized.current) {
                initialized.current = true
    
                init()
                    .then(() => {
                        console.log('App initialized')
                        horse()  
                        // setTimeout(() => {
                        //     boundsMarker()    
                        // }, 5000)
                    })
                    .catch(console.error)
            }
        }
    }, [ app, gameWidth ])

    const addSaguaro = () => {
        saguaro()
        setCurrentId(currentId + 1)
    }

    useEffect(() => {
        if (initialized.current) {
            const interval = setInterval(() => {
                saguaro()
                setCurrentId(currentId + 1)
            }, 3000)
            return () => clearInterval(interval)
        }
    })

    const jumpButton = () => {
        if (player.current.jumpState === 'idle') {
            player.current.jumpState = 'ascend'
        }
    }

    return (<>
    <div ref={ domElement } />
    <div className="bg-[#335c73] border-2 border-color-[#afb9ca] text-white w-32 m-auto mt-4 p-2 text-center rounded-lg hover:cursor-pointer font-press-start" onClick={ jumpButton }>
        Jump
    </div>
        {/* <div className="bg-black text-white p-2 rounded-lg hover:cursor-pointer" onClick={ addSaguaro }>
            Add Saguaro
        </div> */}
    </>)
}

export default Vanilla