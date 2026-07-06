import ImageLoader from "../../components/common/image-loader";
import hero from "../../assets/hero.png"

export default function Home() {
  return (
    <div>
      Home
      <ImageLoader src={hero} alt="hero" />
    </div>
  )
}