export const slugifySource = (s: string) => s
    .toLowerCase()
    //Remove spaces
    .replace(/\s+/g, "_")
    //Remove special characters
    .replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, "")