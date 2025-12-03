export default function Toast({ toast }) {
  if (!toast) return null;

  return (
    <div className={`fixed bottom-6 right-6 px-6 py-4 rounded-lg shadow-lg text-white ${
      toast.type === "success" ? "bg-green-500" : "bg-red-500"
    }`}>
      {toast.message}
    </div>
  );
}
