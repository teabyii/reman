import React, { useContext } from "react";
import Store from "../../store";

export default function Input() {
  const { state, dispatch } = useContext(Store);

  return (
    <div>
      <input
        value={state.count}
        onChange={(event) => {
          const count = Number(event.target.value)
          if (!isNaN(count)) {
            dispatch.set({ count });
          }
        }}
      />
    </div>
  );
}
