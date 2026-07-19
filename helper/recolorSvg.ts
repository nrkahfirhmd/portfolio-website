type SvgColorMap = Record<string, string>;

export function recolorSvg(svg: string, colors: SvgColorMap): string {
    let result = svg;

    for (const [from, to] of Object.entries(colors)) {
        const regex = new RegExp(from.replace("#", "\\#"), "gi");
        result = result.replace(regex, to);
    }

    return result;
}