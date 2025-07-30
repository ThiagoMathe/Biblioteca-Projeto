import FeatureCard from "../components/ui/FeatureCard"
import { Link } from 'react-router-dom';

/* mudar isso */
const features = [
    {
        src: "bookIcon.png",
        title: "Extensive Library",
        text: "Browse a wide selection of books in both physical and digital formats.",
    },
    {
        src: "markedIcon.png",
        title: "Personalized Recommendations",
        text: "Receive tailored book suggestions based on your reading history.",
    },
    {
        src: "bookIcon2.png",
        title: "Seamless Online Reading",
        text: "Read your digital books instantly with our integrated online reader — no downloads needed.",
    },
    {
        src: "trackingIcon.png",
        title: "Reading Progress Tracking",
        text: "Keep track of your reading progress for digital books and view your borrowing history.",
    },
];

export default function LandingPage() {
    return (
        <div className="bg-[#f7fafc] min-h-[calc(100vh-42px)] flex items-center justify-center ">
            <div className="flex flex-col items-center w-full max-w-7xl mx-auto gap-10 px-4">
                <main className="flex items-center gap-4 w-full flex-col sm:flex-row">
                    <img
                        src="bookhaven-readers.png"
                        className="sm:w-[34%]"
                    />
                    <div className="flex flex-col gap-6 sm:w-[60%] md:w-full">
                        <h1 className="text-6xl font-bold">Welcome to the Digital Library</h1>
                        <p className="sm:w-[83%] w-full">
                            Explore a vast collection of books, available in both physical and digital
                            formats. Easily browse and filterby format to find your next read. Access
                            digital books With Our online reader,
                            reserve physical copies for borrowing. Track your reading progress and
                            manage your loans with ease. Join our community of passionate readers
                            today!
                        </p>
                        <Link to="/auth"
                            className="sm:w-[84%] w-full mt-2 p-[0.6rem] bg-[#02697b] rounded-lg text-white flex justify-center"
                        >
                            Enter the Digital Library
                        </Link>
                    </div>
                </main>

                <section className="flex flex-col self-start gap-2">
                    <h2 className="text-xl font-bold">Digital Library Resources</h2>
                    <p className="text-sm">
                        Discover everything our platform Offers to enhance your reading experience.
                    </p>
                </section>

                <section className="grid md:grid-cols-4 gap-2 grid-cols-1">
                    {features.map((info) => {
                        return (
                            <FeatureCard src={info.src} title={info.title} text={info.text} />
                        )
                    })}
                </section>

                <footer>
                    <p>@2024 Digitral Library. All rights reserved.</p>
                </footer>
            </div>
        </div>
    )
}