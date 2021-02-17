import React, {useState, useEffect} from 'react';
import {useHistory} from 'react-router-dom';
import {Form, Button, Alert} from 'react-bootstrap';
import Layout from './shared/Layout';

const Signup = (props) => {
  const [validated, setValidated] = useState(false);
  const [credentials, setCredentials] = useState({firstname: null, lastname: null, email: null, password: null, matricNumber: null, program: null, graduationYear: null});
  const [errAlerts, setErrAlerts] = useState([]);
  const [programOpts, setProgramOpts] = useState([]);
  const [gradYearOpts, setGradYearOpts] = useState([]);
  const history = useHistory();

  useEffect(()=>{
    fetch(`/api/programs`)
    .then(response => response.json()).then(data => {setProgramOpts(data)});
    fetch(`/api/graduationYears`)
    .then(response => response.json()).then(data => {setGradYearOpts(data)});
  },[])

  const handleChange = (evt) => {
    const newCredentials = {...credentials};
    newCredentials[evt.target.name] = evt.target.value;
    setCredentials({...newCredentials});
  }

  const handleSubmit = (evt) => {
    evt.preventDefault();
    evt.stopPropagation();
    const form = evt.currentTarget;
    if (form.checkValidity()) {
      fetch(`/api/register`, {
        method: 'POST',
        headers: {
          'Content-Type' : 'application/json'
        },
        body: JSON.stringify(credentials)
      }).then(async (response) => {
        let body = await response.json();
        if (response.status === 200){
          let key = 'uid';
          let val = encodeURIComponent(body.data.id);
          document.cookie = `${key}=${val};path=/;max-age=${60*60*24*30};`;
          history.push('/');
        } else {
          setErrAlerts(body.errors);
        }
      })
    }
    setValidated(true);
  }

  return (
    <Layout>
      <>
        <h2 className="mt-4">Signup</h2>
        <Form noValidate validated={validated} onSubmit={handleSubmit} id='signupForm'>
          {errAlerts.map((err, index) => <Alert variant='danger' key={index}>{err}</Alert>)}
          <Form.Row>
            <Form.Group className='mx-1' controlId='validationCustom1'>
              <Form.Label>First name</Form.Label>
              <Form.Control required type="text" name='firstname' placeholder="First name" onChange={handleChange}/>
              <Form.Control.Feedback type='valid'>Looks good!</Form.Control.Feedback>
              <Form.Control.Feedback type='invalid'>Please enter a valid name</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className='mx-1' controlId='validationCustom2'>
              <Form.Label>Last name</Form.Label>
              <Form.Control required type="text" name='lastname' placeholder="Last name" onChange={handleChange}/>
              <Form.Control.Feedback type='valid'>Looks good!</Form.Control.Feedback>
              <Form.Control.Feedback type='invalid'>Please enter a valid name</Form.Control.Feedback>
            </Form.Group>
          </Form.Row>
          <Form.Row>
            <Form.Group className='mx-1' controlId='validationCustom3'>
              <Form.Label>Email Address</Form.Label>
              <Form.Control required type="email" name='email' placeholder="Your email address" onChange={handleChange}/>
              <Form.Control.Feedback type='valid'>Looks good!</Form.Control.Feedback>
              <Form.Control.Feedback type='invalid'>Please enter a valid email</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className='mx-1' controlId='validationCustom4'>
              <Form.Label>Password</Form.Label>
              <Form.Control required type="password" name='password' placeholder="Enter password" onChange={handleChange}/>
              <Form.Control.Feedback type='valid'>Looks good!</Form.Control.Feedback>
              <Form.Control.Feedback type='invalid'>Please enter a valid password</Form.Control.Feedback>
            </Form.Group>
          </Form.Row>
          <Form.Row>
            <Form.Group className='mx-1' controlId='validationCustom5'>
              <Form.Label>Program</Form.Label>
              <Form.Control required as='select' name='program' custom onChange={handleChange}>
                <option value=''>Choose...</option>
                {programOpts.map((program, idx) => <option key={idx} value={program}>{program}</option>)}
              </Form.Control>
              <Form.Control.Feedback type='invalid'>Please select an option</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className='mx-1' controlId='validationCustom6'>
              <Form.Label>Matric Number</Form.Label>
              <Form.Control required type="text" name='matricNumber' placeholder="00/0000" onChange={handleChange}/>
              <Form.Control.Feedback type='valid'>Looks good!</Form.Control.Feedback>
              <Form.Control.Feedback type='invalid'>Please enter a valid matric number</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className='mx-1' controlId='validationCustom7'>
              <Form.Label>Graduation year</Form.Label>
              <Form.Control required as='select' name='graduationYear' custom onChange={handleChange}>
                <option value=''>Choose...</option>
                {gradYearOpts.map((year, idx) => <option key={idx} value={year}>{year}</option>)}
              </Form.Control>
              <Form.Control.Feedback type='invalid'>Please select an option</Form.Control.Feedback>
            </Form.Group>
          </Form.Row>
          <Button type='submit'>Sign Up</Button>
        </Form>
      </>
    </Layout>
  );
}

export default Signup;
