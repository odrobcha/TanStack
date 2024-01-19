import {useIsFetching} from '@tanstack/react-query';

export default function Header({ children }) {
    const fetching = useIsFetching();  //get 0 if not fething data OR anoyher number if fecthing datasomewhere in App
  return (
    <>

      <div id="main-header-loading">
          {fetching>0 && <progress/>}

      </div>
      <header id="main-header">
        <div id="header-title">
          <h1>React Events</h1>
        </div>
        <nav>{children}</nav>
      </header>
    </>
  );
}
