/* 
  A loading icon that appears if it is told to show by parent.
    > prop: (bool) show -> if the loader should display or not  
*/

import "../styles/Loader.scss";
export default function Loader({ show }) {
  return show ? (
    <div class="spinner">
      <div class="double-bounce1"></div>
      <div class="double-bounce2"></div>
    </div>
  ) : null;
}
