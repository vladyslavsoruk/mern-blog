import { useState } from "react";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div>
        <h1 class="text-3xl font-extrabold text-red-500">Hello world!</h1>
      </div>
    </>
  );
}

export default App;
