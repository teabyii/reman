import React, { ReactNode, useContext } from 'react';
import classnames from 'classnames';
import filterContext, { FilterType } from '../contexts/filter';

interface Props {
  filter: FilterType,
  children?: ReactNode
}

function Link ({ filter, children }: Props) {
  const { state, dispatch } = useContext(filterContext)

  return (
    // eslint-disable-next-line jsx-a11y/anchor-is-valid
    <a
      className={classnames({ selected: state.filter === filter })}
      style={{ cursor: 'pointer' }}
      onClick={() => dispatch.set({ type: filter })}
    >
      {children}
    </a>
  );
}

export default Link;
