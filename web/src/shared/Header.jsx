import React, {useState,
        useEffect} from 'react';
import {useHistory} from 'react-router-dom';
import {
  Nav,
  Navbar,
  Form,
  FormControl,
  Button
} from 'react-bootstrap';

const Header = (props) => {
  const [userName, setUserName] = useState();
  const history = useHistory();

  useEffect(() => {
    if (document.cookie.includes('uid=')){
      const ck = document.cookie.split(';')
      .filter(cookie => cookie.trim().startsWith(`uid=`)) || [];
      const vals = ck[0].split('=') || [];
      if (vals[1]){
        fetch(`/api/users/${vals[1]}`).then(response => response.json())
        .then(data => { setUserName(data.firstname) });
      }
    }
  },[]);

  const handleLogout = () => {
    document.cookie = `uid=;path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT;`;
    setUserName(null);
    history.push('/');
  }

  return (
    <Navbar bg='primary' variant='dark' className='justify-content-between'>
      <Navbar.Brand href='/'>Project Explorer</Navbar.Brand>
      <Navbar.Toggle aria-controls='responsive-nav'/>
      <Navbar.Collapse id='responsive-nav' animation='false' className="d-lg-flex flex-lg-row justify-content-lg-between">
        <Form inline>
          <FormControl type='text' placeholder='Search Projects' className='mr-sm-2'/>
          <Button variant='outline-light' className='mr-sm-2'>Search</Button>
        </Form>
        <Nav>
          <Nav.Link href='/projects'>Projects</Nav.Link>
          <Nav.Link href='/projects/submit'>Submit</Nav.Link>
        </Nav>
          {userName?
          <Nav className='justify-content-end'>
            <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
            <Nav.Link id='username'>Hi {userName}</Nav.Link>
          </Nav> :
          <Nav className='justify-content-end'>
            <Nav.Link href='/signup'>Sign Up</Nav.Link>
            <Nav.Link href='/login'>Login</Nav.Link>
          </Nav>
          }
      </Navbar.Collapse>
    </Navbar>
  );
}

export default Header;
