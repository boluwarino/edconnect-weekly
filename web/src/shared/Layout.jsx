import React from 'react';
import Header from './Header';
import Footer from './Footer';

const Layout = (props) => {
  return (
    <>
      <Header/>
      <main className="p-5 container-fluid">
      {props.children}
      </main>
      <Footer/>
    </>
  )
}

export default Layout;
