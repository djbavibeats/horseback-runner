import MenuIcon from "../public/images/navbar/MenuIcon.webp"
import ShareIcon from "../public/images/navbar/ShareIcon.webp"

function Navbar () {
    async function share() {
        const shareData = {
            title: "Jenna Paulette - Horseback",
            text: "Jump over some stuff and collect some coins and you might be lucky enough to ride away with a free pair of Justin Boots!",
            url: "https://horseback-runner.netlify.app/",
        }

        if (navigator.share && navigator.canShare(shareData)) {
            try {
                await navigator.share(shareData);
                console.log("Shared successfully")
            } catch (err) {
                console.log(`Error: ${err}`)
            }
        } else {
            // do something else like copying the data to the clipboard
            console.log(`Can't share in this browser`)
            alert("Sharing is not enabled in this browser")
        }
    }

    function openMenu() {
        window.open('https://jennapaulette.komi.io', '_blank')
    }

    return (
        <div className="absolute h-12 flex items-center justify-between bg-none w-full top-0 left-0 right-0 px-2 z-20">
            {/* Share Icon */}
            <div className="text-center">
                <img src={ ShareIcon } className="w-6 h-6 hover:cursor-pointer" onClick={ share } />
            </div>

            {/* Menu Icon */}
            <div className="text-center">
                <img src={ MenuIcon } className="w-6 h-6 hover:cursor-pointer" onClick={ openMenu } />
            </div>
        </div>
    )
}

export default Navbar
