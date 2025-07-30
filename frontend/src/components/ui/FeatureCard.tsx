type FeatureCardProps = {
    src: string,
    title: string,
    text: string
}

export default function FeatureCard({ src, title, text }: FeatureCardProps) {
    return (
        <article className="border-2 border-[#e6ecf0] flex flex-col gap-1 p-4 pb-16 rounded-md">
            <img src={src} className="mb-2 w-5"/>
            <h3 className="font-semibold">{title}</h3>
            <p className=" text-sm text-[#819fa8]">
                {text}
            </p>
        </article>
    )
}