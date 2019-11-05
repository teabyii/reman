import React, { useContext } from "react";
import Store from "../../store";

export default function Increase() {
  const { dispatch } = useContext(Store);

  return (
    <div>
      <button onClick={() => dispatch.increase()}>点击增加</button>
    </div>
  );
}
