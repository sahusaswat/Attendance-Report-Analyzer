import React from "react";

function Loader() {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-100">

      <div className="flex gap-2">

        <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce"></div>
        <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce delay-150"></div>
        <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce delay-300"></div>

      </div>

      <p className="mt-4 text-gray-600 font-medium">
        Loading...
      </p>

    </div>
  );
}

export default Loader;