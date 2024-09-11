import { NavLink } from 'react-router-dom';

export const Header = () => {
  return (
    <header>
      <div className="logo">Новости</div>
      <nav className="nav">
        <ul>
          <li>
            <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')}>
              Все новости
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin" className={({ isActive }) => (isActive ? 'active' : '')}>
              Создать новость
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
};
