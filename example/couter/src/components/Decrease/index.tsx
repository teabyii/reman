import React, { useContext } from "react";
import Store from "../../store";

export default function Decrease() {
  const { dispatch } = useContext(Store);

  return (
    <div>
      <button onClick={() => dispatch.decrease()}>点击减少</button>
    </div>
  );
}
