import JennaPauletteStackedLogo from "../../public/images/splash-page/jenna-paulette-stacked-logo.webp"
import JustinBootsLogo from "../../public/images/splash-page/justin-boots-logo.webp"
import HorsebackLogo from "../../public/images/splash-page/horseback-logo.webp"

function SplashPage({ setActiveScreen }) {
    return (
        <>
        <div className="relative flex flex-col w-full h-full items-center justify-center gap-4">
            <img className="w-[70%]" src={ JennaPauletteStackedLogo } />
            <p className="font-snide-asides text-2xl">And</p>
            <img className="w-[70%]" src={ JustinBootsLogo } />
            <p className="font-snide-asides text-2xl">Present</p>
            <img className="w-[70%]" src={ HorsebackLogo } />
            <div className="special-button w-[170px] mt-2 animate-bounce" onClick={ () => setActiveScreen('instructions')}>
                <p className="font-snide-asides text-2xl">Click To Begin</p>
            </div>
        </div>
        </>
    )
}

export default SplashPage
