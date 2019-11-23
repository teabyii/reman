import React, { useContext } from 'react';
import todosContext from '../contexts/todos';
import { FilterType } from '../contexts/filter';
import Link from './Link';

interface Props {
  activeCount: number;
  completedCount: number;
}

const FILTER_TITLES = {
  [FilterType.SHOW_ALL]: 'All',
  [FilterType.SHOW_ACTIVE]: 'Active',
  [FilterType.SHOW_COMPLETED]: 'Completed'
} as Record<string, string>;

function Footer(props: Props) {
  const { activeCount, completedCount } = props
  const { dispatch } = useContext(todosContext);
  const itemWord = activeCount === 1 ? 'item' : 'items'

  return (
    <footer className="footer">
      <span className="todo-count">
        <strong>{activeCount || 'No'}</strong> {itemWord} left
      </span>
      <ul className="filters">
        {Object.keys(FILTER_TITLES).map(filter =>
          <li key={filter}>
            <Link filter={filter as FilterType}>
              {FILTER_TITLES[filter]}
            </Link>
          </li>
        )}
      </ul>
      {
        !!completedCount &&
        <button
          className="clear-completed"
          onClick={dispatch.clearCompleted}
        >Clear completed</button>
      }
    </footer>
  );
}

export default Footer;
