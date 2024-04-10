export const getWpPosts = async () => {
    const res = await fetch("https://public-api.wordpress.com/rest/v1.1/sites/gerlachpool.wordpress.com/posts?category=gerlach-pool-league")
    const wpPostsResponse = await res.json()
    return wpPostsResponse?.posts ?? []
}

export const getWpPost = async (slug: string) => {
    const res = await fetch(`https://public-api.wordpress.com/rest/v1.1/sites/gerlachpool.wordpress.com/posts/slug:${slug}`)
    const wpPostsResponse = await res.json()
    return wpPostsResponse
}