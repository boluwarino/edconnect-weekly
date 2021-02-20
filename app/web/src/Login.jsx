import React, {useState} from 'react';
import {useHistory} from 'react-router-dom';
import {Form, Button, Alert} from 'react-bootstrap';
import Layout from './shared/Layout';

const Login = (props) => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [errAlerts, setErrAlerts] = useState([]);
  const history = useHistory();

  const handleChange = (evt) => {
    switch(evt.target.name){
      case 'email':
        setEmail(evt.target.value);
        break;
      case 'password':
        setPassword(evt.target.value);
        break;
      default:
    }
  }

  const handleSubmit = (evt) => {
    evt.preventDefault();
    evt.stopPropagation();
    fetch(`/api/login`, {
      method: 'POST',
      headers: {
        'Content-Type' : 'application/json'
    },
    body: JSON.stringify({email: email, password: password})
    }).then(async (response) => {
      let body = await response.json();
      if (response.status === 200){
        let key = 'uid';
        let val = encodeURIComponent(body.data.id);
          document.cookie = `${key}=${val};path=/;max-age=${60*60*24*30};`;
          history.push('/');
      } else {
          setErrAlerts(['Invalid email/password']);
      }
    })
  }

  return (
    <Layout>
      <>
        <h2 className="mt-4">Login</h2>
        <Form onSubmit={handleSubmit} id='loginForm'>
          {errAlerts.length?<Alert variant='danger' style={{whiteSpace: 'pre-wrap'}}>{errAlerts.join('\n')}</Alert>:null}
          <Form.Group>
            <Form.Label>Email Address</Form.Label>
            <Form.Control required type="email" name='email' placeholder="Enter email" onChange={handleChange}/>
            </Form.Group>
          <Form.Group>
            <Form.Label>Password</Form.Label>
            <Form.Control required type="password" name='password' placeholder="Enter password" onChange={handleChange}/>
          </Form.Group>
          <Button type='submit'>Login</Button>
        </Form>
      </>
    </Layout>
  );
}

export default Login;
