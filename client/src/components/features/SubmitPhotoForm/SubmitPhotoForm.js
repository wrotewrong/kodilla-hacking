import { Link } from 'react-router-dom';

import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Row,
  Col,
  Alert,
  Spinner,
} from 'reactstrap';

import ImageUploader from 'react-images-upload';
import './SubmitPhotoForm.scss';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getRequest, addPhotoRequest, ADD_PHOTO } from '../../../redux/photosRedux';

const SubmitPhotoForm = () => {
  const dispatch = useDispatch();
  const request = useSelector(state => getRequest(state, ADD_PHOTO));
  const addPhoto = data => dispatch(addPhotoRequest(data));

  const [photo, setPhoto] = useState({
    file: null,
    email: '',
    title: '',
    author: ''
  });
  const [error, setError] = useState(null);

  const handlePhoto = (files) => {
    if(files) setPhoto({ ...photo, file: files[0] });
    else setPhoto({ ...photo, file: null });
  }

  const clearError = () => {
    setError(null);
  }

  const handleChange = ({ target }) => {
    const { value, name } = target;

    setPhoto({ ...photo, [name]: value });
  }

  const submitForm = (e) => {
    e.preventDefault();

    let error = null;

    if(!photo.file) error = 'You have to select an image';
    else if(!photo.title.length || !photo.author.length || !photo.email.length) error = `You can't leave title and author fields empty`;
    else if(photo.title.length > 50) error = `Title can't be longer than 25 characters`;

    if(!error) {
      const formData = new FormData();

      for(let key of ['email', 'author', 'title']) {
        formData.append(key, photo[key])
      }

      formData.append('file', photo.file)

      addPhoto(formData);
      setError(null);
    }
    else setError(error);
  }

  return (
    <Form onSubmit={submitForm} className="animated fadeInRight">
      { (request && request.success) && <Alert className="standard-box" color="success">Your photo has been successfully submitted!</Alert> }
      { (error) && <Alert className="standard-box" color="danger" toggle={clearError}>{ error }</Alert> }
      { (request && request.pending) && <Spinner color="primary" className="standard-box d-block mr-auto ml-auto" /> }
      { (!request || !request.success) &&
        (
          <Row>
            <Col xs="12" md="6" className="order-2 order-md-1">
              <FormGroup>
                <Label for="photoTitle">Photo title</Label>
                <Input id="photoTitle" type="text" maxLength="25" name="title" onChange={handleChange} placeholder="Type your title here" required />
              </FormGroup>
              <FormGroup>
                <Label for="photoAuthor">Author</Label>
                <Input id="photoAuthor" type="text" name="author" onChange={handleChange} placeholder="Type your title here" required />
              </FormGroup>
              <FormGroup>
                <Label for="authorEmail">Author e-mail</Label>
                <Input id="authorEmail" type="email" name="email" onChange={handleChange} placeholder="Type your email here" required />
              </FormGroup>
              <FormGroup check>
                <Label check>
                  <Input type="checkbox" required />
                  I agree with the <Link to="/terms-of-use">terms of use</Link>
                </Label>
              </FormGroup>
              <Button color="primary" size="lg" className="btn-pill mt-4">Submit your work!</Button>
            </Col>
            <Col xs="12" md="6" className="order-1 order-md-2">
              <ImageUploader
                withIcon={true}
                buttonText='Choose image'
                imgExtension={['.jpg', '.gif', '.png', '.gif']}
                maxFileSize={5242880}
                withPreview={true}
                onChange={handlePhoto}
                singleImage={true}
                className={(photo.file) ? 'hide' : 'animated fadeInUp'}
              />
            </Col>
          </Row>
        )}
    </Form>
  )
}

export default SubmitPhotoForm;
