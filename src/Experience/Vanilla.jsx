import React, { useRef, useEffect } from 'react'
import { Application, Assets, Texture, Sprite, TilingSprite, AnimatedSprite } from 'pixi.js'

const Vanilla = () => {
    const domElement = useRef(null)
    const initialized = useRef(false)
    
    const init = async (app) => {
        // Initialize the application
        await app.init({ 
            background: 0x1099bb, 
            width: 768,
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
            const mountains1 = new TilingSprite({ texture: textures.Mountains1, height: 256, width: 1024 })
            const mountains2 = new TilingSprite({ texture: textures.Mountains2, height: 256, width: 1024 })
            const mountains3 = new TilingSprite({ texture: textures.Mountains3, height: 256, width: 1024 })
            const mountains4 = new TilingSprite({ texture: textures.Mountains4, height: 256, width: 1024 })
            
            app.stage.addChild(mountains4)
            app.stage.addChild(mountains3)
            app.stage.addChild(mountains2)
            app.stage.addChild(mountains1)

            // Clouds
            let cloudXOffset = 768.0
            const cloud1 = new Sprite({ 
                texture: textures.Cloud1, 
                x: 0 - cloudXOffset, 
                y: 40 
            })
            const cloud2 = new Sprite({ 
                texture: textures.Cloud2, 
                x: 256 - cloudXOffset, 
                y: 80 
            })
            const cloud3 = new Sprite({ 
                texture: textures.Cloud3, 
                x: 512 - cloudXOffset, 
                y: 50 
            })
            const cloud4 = new Sprite({ 
                texture: textures.Cloud4, 
                x: 640 - cloudXOffset, 
                y: 30 
            })
            const cloud5 = new Sprite({ 
                texture: textures.Cloud5, 
                x: 768 - cloudXOffset, 
                y: 100 
            })

            app.stage.addChild(cloud1)
            app.stage.addChild(cloud2)
            app.stage.addChild(cloud3)
            app.stage.addChild(cloud4)
            app.stage.addChild(cloud5)

            // Dirt Ground
            const dirt = new TilingSprite({
                texture: textures.Dirt,
                height: 256,
                width: 1024
            })
            
            app.stage.addChild(dirt)

            // Animate everything
            let count = 0
            let time = Date.now()
            let cloudLoopOffset = 100.0

            app.ticker.add(() => {
                const currentTime = Date.now()
                const deltaTime = currentTime - time
                time = currentTime

                dirt.tilePosition.x -= 1.0

                mountains1.tilePosition.x -= 0.9
                mountains2.tilePosition.x -= 0.8
                mountains3.tilePosition.x -= 0.7
                mountains4.tilePosition.x -= 0.6

                cloud1.position.y = Math.sin(deltaTime * 0.0025) * 10 + 40
                cloud1.position.x >= 768.0 
                    ? cloud1.position.x = -120.0 - cloudLoopOffset
                    : cloud1.position.x += 0.210

                cloud2.position.y = Math.sin(deltaTime * 0.0025) * 5 + 80
                cloud2.position.x >= 768.0 
                    ? cloud2.position.x = -98.0 - cloudLoopOffset
                    : cloud2.position.x += 0.125

                cloud3.position.y = Math.sin(deltaTime * 0.0025) * 7.5 + 50
                cloud3.position.x >= 768.0 
                    ? cloud3.position.x = -120.0 - cloudLoopOffset
                    : cloud3.position.x += 0.150

                cloud4.position.y = Math.sin(deltaTime * 0.0025) * 6 + 10
                cloud4.position.x >= 768.0 
                    ? cloud4.position.x = -118.0 - cloudLoopOffset
                    : cloud4.position.x += 0.200

                cloud5.position.y = Math.sin(deltaTime * 0.0025) * 9 + 100
                cloud5.position.x >= 768.0 
                    ? cloud5.position.x = -96.0 - cloudLoopOffset
                    : cloud5.position.x += 0.100
                
            })
        })
    }

    const horse = async (app) => {
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
    
            app.stage.addChild(animatedSprite)
        })
    }

    useEffect(() => {
        if (!initialized.current) {
            initialized.current = true

            // Create a new application
            const app = new Application()     

            init(app)
                .then(() => {
                    console.log('App initialized')
                    horse(app)
                })
                .catch(console.error)
        }
    }, [])

    return <div ref={ domElement } />
}

export default Vanilla