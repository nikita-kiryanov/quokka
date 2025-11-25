/** Page header that optionally displays a dismissable subtitle. */
export default function DynamicHeader({ title, dynamic, onCancel }: DynamicHeader) {
    return (
        <header className="col-span-2">
          <h1 className="text-2xl font-bold text-center">
            {title} {(dynamic) ? ' - ' : ''}{(dynamic) && (
              <span className="inline-flex text-red-600 py-0.5">
                {dynamic}
                <button onClick={onCancel} className="ml-1 text-gray-500 hover:text-gray-700 focus:outline-none">
                  ✕
                </button>
              </span>
            )}
          </h1>
        </header>
    );
}