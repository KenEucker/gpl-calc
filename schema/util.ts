export const slugifySource = (s) => s
    .toLowerCase()
    //Remove spaces
    .replace(/\s+/g, "_")
    //Remove special characters
    .replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, "")