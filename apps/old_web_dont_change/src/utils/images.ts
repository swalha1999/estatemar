import probe from "probe-image-size";

export async function getImageMetadata(fileUrl: string) {
    try {
        const result = await probe(fileUrl);

        return {
            ...result,
            url: fileUrl,
        };
    } catch (error) {
        console.error("Failed to get image metadata:", error);
        return null;
    }
}
