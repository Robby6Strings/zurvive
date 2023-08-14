import { images } from "./state"

export const imageRefs = [
  {
    image: "ZombieSheet.png",
    name: "zombie",
    reverse: false,
  },
  {
    image: "PlayerSheet.png",
    name: "player",
    reverse: false,
  },
  {
    image: "PlayerSheet.png",
    name: "player_reverse",
    reverse: true,
  },
] as const
let imagesLoaded = 0

export const loadImages = (cb: { (): void }) => {
  imageRefs.forEach((imgRef) => {
    const image = new Image()
    if (imgRef.reverse) {
      image.style.transform = "scaleX(-1)"
    }
    image.src = `/static/assets/${imgRef.image}`
    image.onload = () => {
      imagesLoaded++
      if (imagesLoaded === imageRefs.length) {
        cb()
      }
    }
    images.value.push({
      image,
      name: imgRef.name,
      reverse: imgRef.reverse,
    })
  })
}
