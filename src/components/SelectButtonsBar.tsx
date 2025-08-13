function SelectButtonsBar() {
  return (
    <div className="flex w-80 h-9 border border-gray-400 rounded-lg bg-gray-300 shadow-md justify-end pr-2">
      <div className="inline-flex items-center flex  gap-2">
        <p className="text-center px-3 text-m"> Select </p>
        <button className="rounded-lg w-20 bg-gray-100 shadow-md border border-gray-400">
          {" "}
          Duplicate{" "}
        </button>
        <button className="rounded-lg w-17 bg-gray-100 shadow-md border border-gray-400">
          {" "}
          Delete{" "}
        </button>
        <button className="rounded-lg w-17 bg-gray-100 shadow-md border border-gray-400">
          {" "}
          Repeat{" "}
        </button>
      </div>
    </div>
  );
}

export default SelectButtonsBar;
