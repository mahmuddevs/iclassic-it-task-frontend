import ImageLoader from "../../components/common/image-loader";
import hero from "../../assets/hero.png"

export default function Home() {
  return (
    <div>
      <ImageLoader src={hero} alt="hero" />
    </div>
  )
}