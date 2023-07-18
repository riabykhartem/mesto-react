import headerLogo from '../../images/header-logo.svg';

export default function Header() {
    return(
        <header className="header section">
        <img
        src={headerLogo}
        alt="лого"
        className="header__logo"
        />
        </header>
    )
}