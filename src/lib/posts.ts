import { getSanityPosts, getSanityPost } from "./sanity";
import { getWpPost, getWpPosts } from "./wordpress";

export const getPosts = async () => {
    const wpPosts = await getWpPosts()
    const sanityPosts = await getSanityPosts()
    return wpPosts.concat(sanityPosts)
}

export const getPost = async (slug: string) => {
    const sanityPost = await getSanityPost(slug)

    if (sanityPost) return sanityPost

    return getWpPost(slug)
}
