import { createSlice } from "@reduxjs/toolkit";
import { AppState } from "../interfaces";

const initialState: AppState = {
    opened: -1,
    images: [],
    canvas: {
        rects: [],
        poly: [],
        action: {
            rectCreate: false,
            editMode: 0,
            multistepEditing: false,
            editLock: -1,
            resizing: -1,
            poly: {
                lines: [],
                points: [],
                vpoint: {
                    x: 0,
                    y: 0,
                },
            },
            rect: {
                start: {
                    x: 0,
                    y: 0,
                },
                end: {
                    x: 0,
                    y: 0,
                },
            },
        },
    },
};

// helper functions

function saveCanvasTo(state: AppState, action: { payload: number }): AppState {
    const id = action.payload;

    if (!state.images[id]) return state;

    state.images[id].canvas = state.canvas;

    return state;
}

function clearCanvas(state: AppState): AppState {
    state.canvas = initialState.canvas;

    return state;
}

function openCanvas(state: AppState, action: { payload: number }): AppState {
    const id = action.payload;

    if (!state.images[id]) return state;

    state.canvas = state.images[id].canvas;

    return state;
}

export const appSlice = createSlice({
    name: "app",
    initialState: initialState,
    reducers: {
        setRectCreate: (state, action) => {
            state.canvas.action.rectCreate = action.payload;
        },
        setEditLock: (state, action) => {
            state.canvas.action.editLock = action.payload;
        },
        setResizing: (state, action) => {
            if (action.payload == -1) {
                if (state.canvas.action.editMode == 1) {
                    const rect =
                        state.canvas.rects[state.canvas.action.editLock];

                    if (!rect || !rect.end || !rect.start) return;

                    if (
                        rect.end.x < rect.start.x &&
                        rect.end.y < rect.start.y
                    ) {
                        const start = { x: rect.end.x, y: rect.end.y };
                        const end = { x: rect.start.x, y: rect.start.y };
                        rect.start = start;
                        rect.end = end;
                    }
                    if (rect.end.x < rect.start.x) {
                        const start = { x: rect.end.x, y: rect.start.y };
                        const end = { x: rect.start.x, y: rect.end.y };
                        rect.start = start;
                        rect.end = end;
                    }
                    if (rect.end.y < rect.start.y) {
                        const start = { x: rect.start.x, y: rect.end.y };
                        const end = { x: rect.end.x, y: rect.start.y };
                        rect.start = start;
                        rect.end = end;
                    }

                    state.canvas.rects = [
                        ...state.canvas.rects.slice(
                            0,
                            state.canvas.action.editLock,
                        ),
                        rect,
                        ...state.canvas.rects.slice(
                            state.canvas.action.editLock + 1,
                        ),
                    ];
                }
            }
            state.canvas.action.resizing = action.payload;
        },
        setEditMode: (state, action) => {
            state.canvas.action.editMode = action.payload;
        },
        setRectStart: (state, action) => {
            state.canvas.action.rect.start = action.payload;
        },
        setRectEnd: (state, action) => {
            state.canvas.action.rect.end = action.payload;
        },
        addRect: (state, action) => {
            const index = action.payload.index;
            const rect = action.payload.rect;

            state.canvas.action.rect = {
                start: { x: 0, y: 0 },
                end: { x: 0, y: 0 },
            };

            if (rect.end.x < rect.start.x && rect.end.y < rect.start.y) {
                const start = { x: rect.end.x, y: rect.end.y };
                const end = { x: rect.start.x, y: rect.start.y };
                rect.start = start;
                rect.end = end;
            }
            if (rect.end.x < rect.start.x) {
                const start = { x: rect.end.x, y: rect.start.y };
                const end = { x: rect.start.x, y: rect.end.y };
                rect.start = start;
                rect.end = end;
            }
            if (rect.end.y < rect.start.y) {
                const start = { x: rect.start.x, y: rect.end.y };
                const end = { x: rect.end.x, y: rect.start.y };
                rect.start = start;
                rect.end = end;
            }

            state.canvas.rects = [
                ...state.canvas.rects.slice(0, index),
                {
                    label: "untitled",
                    ...rect,
                },
                ...state.canvas.rects.slice(index),
            ];
        },
        editRect: (state, action) => {
            const index = action.payload.index;
            const rect = action.payload.rect;

            state.canvas.rects = [
                ...state.canvas.rects.slice(0, index),
                {
                    ...state.canvas.rects[index],
                    ...rect,
                },
                ...state.canvas.rects.slice(index + 1),
            ];
        },
        removeRect: (state, action) => {
            const index = action.payload;
            state.canvas.rects = [
                ...state.canvas.rects.slice(0, index),
                ...state.canvas.rects.slice(index + 1),
            ];
        },
        labelRect: (state, action) => {
            const index = action.payload.index;
            const label = action.payload.label;

            state.canvas.rects = [
                ...state.canvas.rects.slice(0, index),
                {
                    ...state.canvas.rects[index],
                    label,
                },
                ...state.canvas.rects.slice(index + 1),
            ];
        },
        setVPoint: (state, action) => {
            state.canvas.action.poly.vpoint = action.payload;
        },
        addPoint: (state, action) => {
            state.canvas.action.poly.points = [
                ...state.canvas.action.poly.points,
                {
                    ...action.payload,
                },
            ];
        },
        addLine: (state, action) => {
            state.canvas.action.poly.lines = [
                ...state.canvas.action.poly.lines,
                action.payload,
            ];
        },
        polyShiftOut: (state) => {
            state.canvas.poly.push({
                label: "untitled",
                lines: [
                    ...state.canvas.action.poly.lines,
                    {
                        from: state.canvas.action.poly.points[
                            state.canvas.action.poly.points.length - 1
                        ],
                        to: state.canvas.action.poly.points[0],
                    },
                ],
                points: state.canvas.action.poly.points,
            });

            state.canvas.action.poly = {
                lines: [],
                points: [],
                vpoint: {
                    x: 0,
                    y: 0,
                },
            };
        },
        labelPoly: (state, action) => {
            const index = action.payload.index;
            const label = action.payload.label;

            state.canvas.poly = [
                ...state.canvas.poly.slice(0, index),
                {
                    ...state.canvas.poly[index],
                    label,
                },
                ...state.canvas.poly.slice(index + 1),
            ];
        },
        movePoint: (state, action) => {
            const parentIndex = action.payload.parentIndex;
            const pointIndex = action.payload.pointIndex;
            const point = action.payload.point;
            const oldPoint = state.canvas.poly[parentIndex].points[pointIndex];

            state.canvas.poly[parentIndex].lines.forEach((line) => {
                if (line.from.x == oldPoint.x && line.from.y == oldPoint.y) {
                    line.from = point;
                }

                if (line.to.x == oldPoint.x && line.to.y == oldPoint.y) {
                    line.to = point;
                }
            });

            state.canvas.poly[parentIndex].points = [
                ...state.canvas.poly[parentIndex].points.slice(0, pointIndex),
                point,
                ...state.canvas.poly[parentIndex].points.slice(pointIndex + 1),
            ];
        },
        setMultistepEditing: (state, action) => {
            state.canvas.action.multistepEditing = action.payload;
        },
        removePoly: (state, action) => {
            const index = action.payload;
            state.canvas.poly = [
                ...state.canvas.poly.slice(0, index),
                ...state.canvas.poly.slice(index + 1),
            ];
        },
        addImage: (state, action) => {
            const image = action.payload.raw; // base64
            const name = action.payload.name;

            state.images.push({
                name,
                raw: image,
                originalDimensions: {
                    width: 0,
                    height: 0,
                },
                canvasDimensions: {
                    height: 0,
                    width: 0,
                },
                canvas: initialState.canvas,
            });

            state = saveCanvasTo(state, { payload: state.opened });

            state = clearCanvas(state);

            state.opened = state.images.length - 1;

            state = openCanvas(state, { payload: state.opened });
        },
        setOriginalDimension: (state, action) => {
            const index = action.payload.index;
            const width = action.payload.width;
            const height = action.payload.height;

            state.images[index].originalDimensions = {
                width,
                height,
            };
        },
        setResizedDimension: (state, action) => {
            const index = action.payload.index;
            const width = action.payload.width;
            const height = action.payload.height;

            state.images[index].canvasDimensions = {
                width,
                height,
            };
        },
        removeImage: (state, action) => {
            const index = action.payload;

            if (state.images.length == 1) {
                state.opened = -1;
                return;
            }

            if (state.opened == index) {
                clearCanvas(state);
            }

            state.images = [
                ...state.images.slice(0, index),
                ...state.images.slice(index + 1),
            ];

            if (state.opened > index) {
                state.opened--;
            }

            if (state.opened > state.images.length - 1) {
                state.opened = state.images.length - 1;
            }

            if (state.opened != -1) {
                state = openCanvas(state, { payload: state.opened });
            }
        },
        openImage: (state, action) => {
            state = saveCanvasTo(state, { payload: state.opened });
            state = openCanvas(state, { payload: action.payload });

            state.opened = action.payload;
        },
        nameImage: (state, action) => {
            const index = action.payload.index;
            const name = action.payload.name;

            state.images = [
                ...state.images.slice(0, index),
                {
                    ...state.images[index],
                    name,
                },
                ...state.images.slice(index + 1),
            ];
        },
        nextFile: (state) => {
            if (state.opened == state.images.length - 1) {
                return;
            }
            state = saveCanvasTo(state, { payload: state.opened });
            state = openCanvas(state, { payload: state.opened + 1 });
            state.opened++;
        },
        prevFile: (state) => {
            if (state.opened == 0) {
                return;
            }

            state = saveCanvasTo(state, { payload: state.opened });
            state = openCanvas(state, { payload: state.opened - 1 });
            state.opened--;
        },
        saveCanvas: (state) => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            state = saveCanvasTo(state, { payload: state.opened });
        },
    },
});

export const {
    setRectCreate,
    setEditLock,
    setResizing,
    setEditMode,
    setRectEnd,
    setRectStart,
    addRect,
    editRect,
    removeRect,
    labelRect,
    setVPoint,
    addLine,
    addPoint,
    setMultistepEditing,
    movePoint,
    polyShiftOut,
    labelPoly,
    removePoly,
    addImage,
    nextFile,
    prevFile,
    openImage,
    removeImage,
    nameImage,
    setResizedDimension,
    setOriginalDimension,
    saveCanvas,
} = appSlice.actions;
export default appSlice.reducer;
