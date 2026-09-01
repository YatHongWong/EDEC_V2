export default function InfoBox({ content }: { content: React.ReactNode }) {
    return <div className="text-sm text-black mb-2 bg-blue-300 rounded-sm border-2 border-blue-600 p-1">{content}</div>
}
