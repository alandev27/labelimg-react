export default function Button({
    children,
    ...props
}: Readonly<{
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
}>) {
    return (
        <div
            {...props}
            className={`hover:bg-gray-200 duration-100 flex justify-center items-center rounded-md ${props.className ? props.className : ""}`}
        >
            <button className="p-4 text-gray-600 flex flex-col items-center space-y-1">
                {children}
            </button>
        </div>
    );
}
