// Resources
import { ReactComponent as MenuToggleOpen } from "../svg/mono-icons/chevron-left.svg";
import { ReactComponent as MenuToggleClose } from "../svg/mono-icons/chevron-right.svg";

// Styling
import "../styles/SideMenu.scss";

export default function SideMenu({ menuOpenClass, handleMenuToggle }) {
  // state and logic

  return (
    <div className={`sm-menu sidemenu ${menuOpenClass}`}>
      {menuOpenClass == "open-menu" ? (
        <MenuToggleClose
          className="sidemenu__toggle"
          onClick={handleMenuToggle}
        />
      ) : (
        <MenuToggleOpen
          className="sidemenu__toggle"
          onClick={handleMenuToggle}
        />
      )}
    </div>
  );
}
