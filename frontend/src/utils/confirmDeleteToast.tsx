// utils/confirmDeleteToast.tsx
import toast from "react-hot-toast";

export const confirmDeleteToast = (onConfirm: () => void) => {
  toast(
    (t) => (
      <div className=" text-gray-800 ">
        <p className="text-md font-semibold mb-4">
          Are you sure you want to delete this ?
          <br />
          <span className="text-red-400 text-xs">
            This action cannot be undone.
          </span>
        </p>

        <div className="flex justify-end gap-2">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1 text-sm text-white rounded-md bg-gray-700 hover:bg-gray-600"
          >
            Cancel
          </button>

          <button
            onClick={() => {
              toast.dismiss(t.id);
              onConfirm();
            }}
            className="px-3 py-1 text-sm text-white rounded-md bg-red-600 hover:bg-red-500"
          >
            Delete
          </button>
        </div>
      </div>
    ),
    { duration: Infinity }
  );
};