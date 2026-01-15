import imageUrlBuilder from '@sanity/image-url'
import { sanityClient } from './client'

const builder = imageUrlBuilder(sanityClient)

export const urlFor = (source: any) => {
    return builder.image(source)
}
