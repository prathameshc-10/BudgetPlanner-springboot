import React from 'react';

function Header() {
  return (
    <header className="header">
      <div className="header__inner">
        <div className="header__logo">
          <span className="header__logo-icon">◈</span>
          <span className="header__logo-text">BudgetFlow</span>
        </div>
        <div className="header__tagline">Smart Budget Planner</div>
      </div>
    </header>
  );
}

export default Header;