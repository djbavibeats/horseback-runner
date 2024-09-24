import JennaPauletteStackedLogo from "../../public/images/splash-page/jenna-paulette-stacked-logo.webp"
import JustinBootsLogo from "../../public/images/splash-page/justin-boots-logo.webp"
import HorsebackLogo from "../../public/images/splash-page/horseback-logo.webp"

function SplashPage({ setActiveScreen }) {
    return (
        <>
        <div className="relative flex flex-col items-center gap-2 mt-[-2rem]">
            <img className="w-[80%]" src={ JennaPauletteStackedLogo } />
            <p className="font-snide-asides text-2xl">And</p>
            <img className="w-[80%]" src={ JustinBootsLogo } />
            <p className="font-snide-asides text-2xl">Present</p>
            <img className="w-[80%]" src={ HorsebackLogo } />
            <div className="special-button w-[170px] mt-2 animate-bounce" onClick={ () => setActiveScreen('instructions')}>
                <p className="font-snide-asides text-2xl">Click To Begin</p>
            </div>
        </div>
        </>
    )
}

export default SplashPage
