import { useRouter } from "next/router";

export const HrefLocalReplace = (href) => {
    const router = useRouter();

    if (!href) {
        return;
    }

    const startringIndex = href?.indexOf("<a");
    const endingIndex = href?.indexOf(">", startringIndex);

    if (startringIndex === -1) return href;

    const oldLinkHtml = href?.substring(startringIndex, endingIndex);
    const linkHtml = href?.substring(startringIndex, endingIndex);

    if (!(linkHtml.includes("http://") || linkHtml.includes("https://"))) {
        const hrefPos = linkHtml.indexOf("href=");
        const hrefVal = hrefPos + 5;

        const dirPos = hrefVal;
        const dirEndPos = dirPos + 3;

        if (linkHtml.substring(dirPos, dirEndPos).includes("/")) {
            const newLinkHtml = linkHtml.replace("/", `/${router.locale}/`);
            return href.replace(oldLinkHtml, newLinkHtml);
        }
    }
};
