export default function ErrorMessage({ message }: { message: string }) {
    return (
        <p className={`text-red-500 text-sm transition-opacity duration-300 min-h-5 my-1 ${message && message.length > 0 ? "visible opacity-100" : "invisible opacity-0"}`}>{message}</p>
    )
}