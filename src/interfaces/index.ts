export interface Point {
    x: number;
    y: number;
}

export interface Line {
    from: Point;
    to: Point;
}

export interface Rect {
    label: string;
    start: Point;
    end: Point;
}

export interface Poly {
    label: string;
    lines: Line[];
    points: Point[];
}

export interface Canvas {
    rects: Rect[];
    poly: Poly[];
    action: {
        rectCreate: boolean;
        editMode: number;
        multistepEditing: boolean;
        editLock: number;
        resizing: number;
        poly: {
            lines: Line[];
            points: Point[];
            vpoint: Point;
        };
        rect: {
            start: Point;
            end: Point;
        };
    };
}

export interface Image {
    name: string;
    raw: string;
    canvasDimensions: {
        width: number;
        height: number;
    };
    originalDimensions: {
        width: number;
        height: number;
    };
    canvas: Canvas;
}

export interface AppState {
    opened: number;
    images: Image[];
    canvas: Canvas;
}
