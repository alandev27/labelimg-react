import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import Button from "./Button";
import {
    addImage,
    nextFile,
    prevFile,
    removeImage,
    setEditMode,
} from "../store/appSlice";
import { useEffect, useRef } from "react";
import { appToTxt } from "../utils/toTxt";

const fileToBase64 = (file: File) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
};

export default function Toolbar() {
    const canvas = useSelector((state: RootState) => state.app.canvas);
    const app = useSelector((state: RootState) => state.app);
    const dispatch = useDispatch();

    const openFile = useRef<HTMLInputElement>(null);
    const openFolder = useRef<HTMLInputElement>(null);

    // react doesn't let me do this sooo....
    useEffect(() => {
        if (openFolder.current?.getAttribute("webkitdirectory")) return;
        openFolder.current!.setAttribute("webkitdirectory", "");
        openFolder.current!.setAttribute("directory", "");
        openFolder.current!.setAttribute("mozdirectory", "");
    }, []);

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files![0];

        if (!file) return;

        fileToBase64(file).then((base64) => {
            dispatch(
                addImage({
                    name: file.name,
                    raw: base64,
                }),
            );
        });

        return e;
    };

    const handleFolder = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;

        if (!files) return;

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            fileToBase64(file).then((base64) => {
                dispatch(
                    addImage({
                        name: file.name,
                        raw: base64 as string,
                    }),
                );
            });
        }

        return e;
    };

    return (
        <div className="flex flex-col w-20 bg-white border border-gray-200 h-full pt-3 p-2">
            <div>
                <input
                    type="file"
                    className="hidden"
                    ref={openFile}
                    onChange={handleFile}
                />
                <Button onClick={() => openFile!.current!.click()}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-4"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                        />
                    </svg>
                    <span className="text-xs">Open</span>
                </Button>
            </div>
            <div>
                <input
                    type="file"
                    className="hidden"
                    ref={openFolder}
                    onChange={handleFolder}
                    multiple
                />
                <Button onClick={() => openFolder!.current!.click()}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-4"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                        />
                    </svg>
                    <span className="text-xs">Open Folder</span>
                </Button>
            </div>
            <Button onClick={() => dispatch(nextFile())}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-4"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                    />
                </svg>
                <span className="text-xs">Next</span>
            </Button>
            <Button onClick={() => dispatch(prevFile())}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-4"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
                    />
                </svg>
                <span className="text-xs">Prev</span>
            </Button>
            <Button
                className={canvas.action.editMode == 1 ? "bg-indigo-50" : ""}
                onClick={() => {
                    if (canvas.action.editMode == 1)
                        return dispatch(setEditMode(0));
                    dispatch(setEditMode(1));
                }}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-4"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                    />
                </svg>

                <span className="text-xs">Rectangle</span>
            </Button>
            <Button
                className={canvas.action.editMode == 2 ? "bg-indigo-50" : ""}
                onClick={() => {
                    if (canvas.action.editMode == 2)
                        return dispatch(setEditMode(0));
                    dispatch(setEditMode(2));
                }}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-4"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                    />
                </svg>

                <span className="text-xs">Polygon</span>
            </Button>
            <Button
                onClick={() => {
                    const files = appToTxt(app);

                    for (let i = 0; i < files.length; i++) {
                        const file = files[i];
                        const blob = new Blob([file.content], {
                            type: "text/plain",
                        });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement("a");
                        a.href = url;
                        a.download = `${file.name}.txt`;
                        document.body.appendChild(a);
                        a.click();
                        a.remove();
                    }
                }}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-4"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z"
                    />
                </svg>

                <span className="text-xs">Export</span>
            </Button>
            <div
                onClick={() => dispatch(removeImage(app.opened))}
                className="bg-red-100 hover:bg-red-500 duration-100 flex justify-center items-center rounded-md mt-auto"
            >
                <button className="p-4 hover:text-white text-gray-600 flex flex-col items-center space-y-1">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-4"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                        />
                    </svg>
                    <span className="text-xs">Delete</span>
                </button>
            </div>
        </div>
    );
}
