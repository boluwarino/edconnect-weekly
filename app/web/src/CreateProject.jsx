import React, {useState, useEffect} from 'react';
import {useHistory} from 'react-router-dom';
import {Form, Button, Alert} from 'react-bootstrap';
import Layout from './shared/Layout';

const CreateProject = (props) => {
  const [validated, setValidated] = useState(false);
  const [project, setProject] = useState({name: '', abstract: '', authors: null, tags: null, createdBy: null});
  const [errAlerts, setErrAlerts] = useState([]);
  const history = useHistory();

  useEffect(()=>{
    const ck = document.cookie.split(';')
    .filter(cookie => cookie.trim().startsWith(`uid=`));
    if(ck[0]){
      const uid = ck[0].split('=')[1];
      setProject({createdBy: uid})
    } else {
      history.push('/login') ;
    }
  }, [])

  const handleChange = (evt) => {
    const newProject = {...project};
    switch (evt.target.name) {
      case 'authors':
        newProject[evt.target.name] = evt.target.value.split(',').map(x => x.trim());
        break;
      case 'tags':
        newProject[evt.target.name] = evt.target.value.replaceAll(',','').split('#').filter(x => x.trim().length).map(x => '#' + x.trim());
        break;
      default:
        newProject[evt.target.name] = evt.target.value;
    }
    setProject({...newProject});
  }

  const handleSubmit = (evt) => {
    evt.preventDefault();
    evt.stopPropagation();
    const form = evt.currentTarget;
    if (form.checkValidity()) {
      fetch(`/api/projects`, {
        method: 'POST',
        headers: {
          'Content-Type' : 'application/json'
        },
        body: JSON.stringify(project)
      }).then(async (response) => {
        let body = await response.json();
        if (response.status === 200){
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
        <h2 className="mt-4">Create Project</h2>
        <Form noValidate validated={validated} onSubmit={handleSubmit} id='createProjectForm'>
          {errAlerts.map((err, index) => <Alert variant='danger' key={index}>{err}</Alert>)}
            <Form.Group className='mx-1' controlId='validationCustom1'>
              <Form.Label>Project Name</Form.Label>
              <Form.Control required type="text" name='name' placeholder="Project Title" onChange={handleChange}/>
              <Form.Control.Feedback type='valid'>Looks good!</Form.Control.Feedback>
              <Form.Control.Feedback type='invalid'>Please enter a valid title</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className='mx-1' controlId='validationCustom2'>
              <Form.Label>Project Abstract</Form.Label>
              <Form.Control required as='textarea' name='abstract' rows={8} onChange={handleChange}/>
              <Form.Control.Feedback type='valid'>Looks good!</Form.Control.Feedback>
              <Form.Control.Feedback type='invalid'>Please enter an abstract</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className='mx-1' controlId='validationCustom3'>
              <Form.Label>Author(s)</Form.Label>
              <Form.Control required type="text" name='authors' placeholder="Enter author names (separated by comma)" onChange={handleChange}/>
              <Form.Control.Feedback type='valid'>Looks good!</Form.Control.Feedback>
              <Form.Control.Feedback type='invalid'>Make sure you entered a comma separated list of names</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className='mx-1' controlId='validationCustom4'>
              <Form.Label>Tags</Form.Label>
              <Form.Control required type="text" name='tags' placeholder='#topic1 #topic2' onChange={handleChange}/>
              <Form.Control.Feedback type='valid'>Looks good!</Form.Control.Feedback>
              <Form.Control.Feedback type='invalid'>Make sure you entered a # prefixed list of tags</Form.Control.Feedback>
            </Form.Group>
          <Button type='submit'>Continue</Button>
        </Form>
      </>
    </Layout>
  );
}

export default CreateProject;
