import { useState } from "react";

export default function ItemGroup({
    children,
    title,
}: Readonly<{
    children: React.ReactNode[];
    title: string;
}>) {
    const [opened, setOpened] = useState(false);

    return (
        <>
            <div
                className="hover:bg-gray-200 duration-100 px-4 py-3 flex flex-row justify-between items-center space-x-3"
                onClick={() => setOpened(!opened)}
            >
                <span>{title}</span>
                {opened ? (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-3"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m19.5 15.75-7.5-7.5-7.5 7.5"
                        />
                    </svg>
                ) : (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-3"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m19.5 8.25-7.5 7.5-7.5-7.5"
                        />
                    </svg>
                )}
            </div>
            <div className={`${!opened && "hidden"} m-0 p-3 flex flex-col`}>
                {children}
            </div>
        </>
    );
}
