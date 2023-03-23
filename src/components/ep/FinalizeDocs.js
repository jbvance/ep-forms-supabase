import React, { Fragment, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import Container from 'react-bootstrap/Container';
import Spinner from 'react-bootstrap/Spinner';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Alert from 'react-bootstrap/Alert';
import FormAlert from 'components/FormAlert';
import { useSelector, useDispatch } from 'react-redux';
import supabase from 'util/supabase';
import { apiRequestFile } from 'util/util';
import { selectedProductsActions } from 'store/productsSlice';
import { useAuth } from 'util/auth';

const FinalizeDocs = (props) => {
  const [responseError, setResponseError] = useState(null);
  const [isSaving, setIsSaving] = useState(null);
  const [createStatus, setCreateStatus] = useState(null);
  const [productsInfo, setProductsInfo] = useState([]);
  const docsToCreate = useSelector((state) => state.selectedProducts.products);
  const dispatch = useDispatch();
  const router = useRouter();
  const auth = useAuth();
  //console.log('CREATING', docsToCreate);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const { data: products, error } = await supabase
          .from('document_types')
          .select();
        if (products) {
          setProductsInfo(products);
        }
      } catch (err) {
        console.log('ERR', err);
      }
    };

    getProducts();
    //Scroll to top of screen
    window.scrollTo(0, 0);
  }, []);

  const callApi = async (values, type) => {
    console.log('TYPE', type);
    console.log('VALUES', values);
    const typeWithoutState = type.includes('-') ? type.split('-')[1] : type;
    try {
      let response;
      response = await apiRequestFile(`/docx/${type}`, 'POST', {
        ...values.clientInfo,
        ...values[typeWithoutState],
      });
      //}
      console.log('CREATE DOC RESPONSE', response);
      if (response.status !== 'success') {
        throw new Error(`Unable to create ${type}`);
      }

      // const docTypeId = await handleAddOrUpdateUserDoc(
      //   type,
      //   auth.user.id,
      //   productsInfo.find((prod) => prod.type === type).id
      // );
    } catch (err) {
      console.log('ERROR CREATING DOCMENTS', err);
      throw new Error(err.message);
    }
  };
  const wizardState = useSelector((state) => state);
  //console.log(wizardState);

  // const handleAddOrUpdateUserDoc = async (docType, userId, docTypeId) => {
  //   const userDocData = await addOrUpdateUserDoc(
  //     auth.user.id,
  //     productsInfo.find((prod) => prod.type === docType)
  //   )
  //     .then((data) => {
  //       //console.log('USER DOC DATA', data);
  //     })
  //     .catch((err) => {
  //       console.log('ERROR IN HAOUUD');
  //       throw err;
  //     });
  // };

  const submitForm = async (e) => {
    e.preventDefault();
    //console.log(wizardState);
    try {
      setResponseError(null);
      setCreateStatus(null);
      setIsSaving(true);
      const createDocPromises = docsToCreate.map(async (doc) => {
        return await callApi(wizardState, doc.type);
      });

      await Promise.all(createDocPromises);
      // Remove all products from selected so if user goes to start wizard again, nothing is selected
      // docsToCreate.forEach((doc) =>
      //   dispatch(selectedProductsActions.removeProduct(doc))
      // );
      setCreateStatus('success');
      router.push('/checkout?status=success');
    } catch (err) {
      console.log('ERROR', err);
      setResponseError(
        'Unable to create your documents. Please try again. If the problem persists, please wait a few minutes between attempts.'
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (!productsInfo || productsInfo.length === 0) {
    return <Spinner />;
  }

  return (
    <Fragment>
      <Container>
        <h2 className="Header">Finalize Your Documents</h2>
        {!isSaving && createStatus !== 'success' && (
          <Fragment>
            <Row>
              <Col>
                <h4>
                  You are almost done. Click 'Submit' to create your documents!
                </h4>
              </Col>
            </Row>
            <Row>
              <Col style={{ fontWeight: 800, marginBottom: '10px' }}>
                The following document{docsToCreate.length === 1 ? '' : 's'}{' '}
                will be created:
              </Col>
            </Row>
            <Row>
              <Col lg={12}>
                <ListGroup className="DocSummaryList">
                  {docsToCreate.map((doc, i) => (
                    <ListGroup.Item key={doc.type}>
                      {
                        productsInfo.find((prod) => prod.type === doc.type)[
                          'title'
                        ]
                      }
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Col>
            </Row>
          </Fragment>
        )}

        {isSaving && (
          <Fragment>
            <Row>
              <Col>
                <Alert variant="warning">
                  <Spinner
                    animation="border"
                    role="status"
                    aria-hidden={true}
                    className="ml-2"
                    style={{ marginRight: '15px' }}
                  >
                    <span className="sr-only">Loading...</span>
                  </Spinner>
                  Creating your documents. Please do not navigate away from this
                  page until the process is complete.
                </Alert>
              </Col>
            </Row>
            <Row></Row>
          </Fragment>
        )}

        {!isSaving && responseError && (
          <Row>
            {responseError && (
              <FormAlert type="error" message={responseError} />
            )}
          </Row>
        )}

        {createStatus === 'success' && (
          <Fragment>
            <Row>
              <Col>
                <FormAlert
                  variant="success"
                  message="Your document(s) have been created successfully!"
                ></FormAlert>
              </Col>
            </Row>
            <Row>
              <Col>
                <Link href="/dashboard-files" passHref={true}>
                  <Button variant="success">
                    Click here to view/download your documents.
                  </Button>
                </Link>
              </Col>
            </Row>
          </Fragment>
        )}
      </Container>

      {createStatus !== 'success' && (
        <Form id={props.id} onSubmit={submitForm}></Form>
      )}
    </Fragment>
  );
};

export default FinalizeDocs;
