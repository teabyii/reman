import React, { useContext } from "react";
import Store from "../../store";

export default function Counter() {
  const { state } = useContext(Store);
  return <div>{state.count}</div>;
}
