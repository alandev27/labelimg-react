import { AppState, Image } from "../interfaces";

const fileExtensions = {
    image: ["jpg", "jpeg", "png", "gif", "bmp"],
};

const imgToTxt = (data: Image) => {
    let txt = "";
    for (const rect of data.canvas.rects) {
        console.log(rect);
        console.log(data.canvasDimensions);
        txt += `${rect.label} ${rect.start.x} ${rect.start.y} ${rect.end.x} ${rect.end.y}\n`;
    }
    for (const poly of data.canvas.poly) {
        txt += `${poly.label} `;
        for (const point of poly.points) {
            txt += `${point.x} ${point.y} `;
        }
        txt += "\n";
    }
    return txt;
};

export const appToTxt = (data: AppState) => {
    const files: {
        name: string;
        content: string;
    }[] = [];

    for (const image of data.images) {
        let name: string[] = [];
        if (
            fileExtensions.image.indexOf(
                image.name.split(".")[
                    image.name.split(".").length - 1
                ] as string,
            ) != -1
        ) {
            name = [...image.name.split(".")];
            name.splice(-1, 1);
        }
        files.push({
            name: name.join("."),
            content: imgToTxt(image),
        });
    }
    return files;
};
