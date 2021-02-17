import React,
        {useState,
        useEffect} from 'react';
import {useHistory} from 'react-router-dom';
import {Jumbotron,
        Button,
        Card,
        Container} from 'react-bootstrap';
import Layout from './shared/Layout';

const ProjectCard = ({id, name, authors, abstract, tags}) => {
  const history = useHistory();
  return (
    <Card style={{ width: '18rem' }} className='mb-4 hoverable' onClick={() => history.push(`/project/${id}`)}>
      <Card.Body>
        <Card.Title className='text-primary'>{name}</Card.Title>
        <Card.Subtitle>{authors.join(', ')}</Card.Subtitle>
        <Card.Text className='mt-2'>{abstract.substring(0,50)}...</Card.Text>
      </Card.Body>
      <Card.Footer className='text-primary small font-weight-bold'>
        {tags.join(' ')}
      </Card.Footer>
    </Card>
  );
}

const Home = (props) => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetch('/api/projects')
    .then(response => response.json()).then(projects => {
      const show = projects.slice(0,4);
      setProjects(show);
    }).catch(e => console.log(e));
  }, [])

  return (
    <Layout>
      <>
        <Jumbotron>
          <h1>Welcome to Project Explorer</h1>
          <p>Project Explorer is a repository for final year projects across all departments at your institution. You can upload and search projects and learn from others.</p>
          <Button href="/signup" variant="primary" className='mr-2'>Get Started</Button>
          <Button href="/login" variant="secondary">Login</Button>
        </Jumbotron>
        <Container fluid bg='light' className='showcase d-flex flex-row flex-wrap justify-content-around'>
        {projects.map((project, index) => <ProjectCard key={index} {...project}/>)}
        </Container>
      </>
    </Layout>
  );
}

export default Home;
