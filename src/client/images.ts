import { images } from "./state"

export const imageRefs = [
  {
    image: "ZombieSheet.png",
    name: "zombie",
  },
] as const
let imagesLoaded = 0

export const loadImages = (cb: { (): void }) => {
  imageRefs.forEach((imgRef) => {
    const image = new Image()
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
    })
  })
}
