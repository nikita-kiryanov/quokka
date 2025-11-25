export default function DismissableTag({ text, onDismiss }: DismissableTag) {
    return (
        <span className="inline-flex items-center px-2 py-1 mr-2 mb-2 bg-blue-500 text-white text-sm font-medium rounded">
          {text}
          <button type="button" onClick={() => onDismiss(text)} className="ml-2 text-white hover:text-gray-200">
            &times;
          </button>
        </span>
    )
}