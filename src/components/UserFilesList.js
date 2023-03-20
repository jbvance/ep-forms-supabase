import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Link from 'next/link';
import { apiRequest } from 'util/util';
import { Spinner } from 'react-bootstrap';

const UserFilesList = (props) => {
  const [isLoading, setIsLoading] = useState(true);
  const [files, setFiles] = useState([]);

  const filesAreEmpty = !files || files.length === 0;

  useEffect(() => {
    console.log('USE EFFECT');
    const getUserFiles = async () => {
      try {
        const data = await apiRequest('get-user-files');
        console.log(data);
        setFiles(data);
      } catch (err) {
        console.log('ERROR', err);
      } finally {
        setIsLoading(false);
      }
    };

    getUserFiles();
  }, []);

  return (
    <React.Fragment>
      <div className="DashboardItems__card-items-wrapper">
        <Card className="card-items">
          <Card.Header
            as="h5"
            className="d-flex justify-content-between align-items-center"
          >
            Your Files
          </Card.Header>
          {(isLoading || filesAreEmpty) && (
            <div className="py-5 px-3 align-self-center">
              {isLoading && (
                <Spinner animation="border" variant="primary">
                  <span className="sr-only">Loading...</span>
                </Spinner>
              )}

              {!isLoading && filesAreEmpty && (
                <>
                  <div>You haven't created any files yet</div>
                  <div>
                    <Link href="/wizard">
                      <a>Click here to get started</a>
                    </Link>
                  </div>
                </>
              )}
            </div>
          )}

          {!isLoading && files && files.length > 0 && (
            <ListGroup variant="flush">
              {files.map((file, index) => (
                <ListGroup.Item
                  key={index}
                  className={`d-flex justify-content-between align-items-center`}
                >
                  <a href={file.url} target="_blank" rel="noopener noreferrer">
                    {file.fileName.replace(/_/g, ' ')}
                  </a>
                  <div></div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Card>
      </div>
    </React.Fragment>
  );
};

export default UserFilesList;
