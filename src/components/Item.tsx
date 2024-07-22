import { useState } from "react";

export default function Item({
    children,
    index,
    onRemove,
    onEdit,
    onOpen,
    active,
}: Readonly<{
    children: string;
    index: number;
    onRemove: (index: number) => void;
    onEdit: (index: number, value: string) => void;
    onOpen: (index: number) => void;
    active: boolean;
}>) {
    const [editing, setEditing] = useState(false);

    return (
        <div
            className={`${active ? "bg-indigo-50 hover:bg-indigo-100" : "hover:bg-gray-200"} duration-100 px-3 py-2 rounded-md flex flex-row justify-between items-center space-x-3`}
            onClick={() => onOpen(index)}
        >
            {editing ? (
                <input
                    type="text"
                    className="bg-transparent text-black focus:border-b-2 focus:border-gray-300 outline-none"
                    value={children}
                    onChange={(e) => onEdit(index, e.currentTarget.value)}
                    onBlur={() => setEditing(false)}
                />
            ) : (
                <span className="overflow-scroll whitespace-nowrap w-[5rem]">
                    {children}
                </span>
            )}
            <div className="flex space-x-3">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-3 text-gray-500 hover:text-black"
                    onClick={() => setEditing(true)}
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                    />
                </svg>

                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-3 text-gray-500 hover:text-black"
                    onClick={() => onRemove(index)}
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18 18 6M6 6l12 12"
                    />
                </svg>
            </div>
        </div>
    );
}
