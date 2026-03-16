export default function ErrorMessage({ message = "Something went wrong." }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-red-50 border border-red-100">
      <svg className="w-5 h-5 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <p className="text-[13px] text-red-600 font-medium">{message}</p>
    </div>
  )
}