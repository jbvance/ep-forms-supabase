import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import ListGroup from 'react-bootstrap/ListGroup';
import Link from 'next/link';
import { apiRequest } from 'util/util';
import { Spinner } from 'react-bootstrap';
import supabase from 'util/supabase';
import { useAuth } from 'util/auth';

const UserFilesList = (props) => {
  const [isLoading, setIsLoading] = useState(true);
  const [files, setFiles] = useState([]);
  const [userDocs, setUserDocs] = useState([]);
  const [fetchError, setFetchError] = useState(null);
  const auth = useAuth();

  const filesAreEmpty = !files || files.length === 0;

  //Only show files that have been paid for
  const isFilePaidFor = (fileName) => {
    // first, strip out everything but the file name from the S3 Signed URL
    const fileNameToSearch = fileName.replace('.pdf', '').replace('.docx', '');
    const foundFile = userDocs.find(
      (ud) =>
        ud.paid === true && ud.document_types.file_name === fileNameToSearch
    );
    //console.log('FOUND FILE', foundFile);
    return foundFile;
  };

  useEffect(() => {
    const getUserFiles = async () => {
      try {
        setFetchError(null);
        const data = await apiRequest('get-user-files');
        console.log(data);
        setFiles(data);
      } catch (err) {
        setFetchError('Unable to retrieve your files at this time.');
        console.log('ERROR', err);
      } finally {
        setIsLoading(false);
      }
    };

    const getUserSupabaseDocs = async () => {
      const { data, error } = await supabase
        .from('user_docs')
        .select(
          `
          user_id,
          doc_type_id,
          paid,
          document_types (file_name)

        `
        )
        .eq('user_id', auth.user.id);
      if (error) {
        console.log('ERROR GETTING USER DOCUMENTS', err);
      }
      setUserDocs(data);

      console.log('NEW DATA', data);
    };
    getUserSupabaseDocs();
    getUserFiles();
  }, []);

  return (
    <React.Fragment>
      <Card>
        <Card.Header
          as="h5"
          className="d-flex justify-content-between align-items-center"
        >
          Your Files
        </Card.Header>
        <Card.Body>
          {(isLoading || filesAreEmpty) && (
            <div className="py-5 px-3 align-self-center">
              {isLoading && (
                <Spinner animation="border" variant="primary">
                  <span className="sr-only">Loading...</span>
                </Spinner>
              )}

              {!isLoading && filesAreEmpty && !fetchError && (
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

          {!isLoading && fetchError && <p>{fetchError}</p>}

          {!isLoading && files && files.length > 0 && (
            <ListGroup variant="flush">
              {files.map((file, index) => {
                if (isFilePaidFor(file.fileName)) {
                  return (
                    <ListGroup.Item
                      key={index}
                      className={`d-flex justify-content-between align-items-center`}
                    >
                      <a
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {file.fileName.replace(/_/g, ' ')}
                      </a>
                      (created {new Date(file.lastModified).toDateString()})
                    </ListGroup.Item>
                  );
                } else {
                  return null;
                }
              })}
            </ListGroup>
          )}
        </Card.Body>
      </Card>
    </React.Fragment>
  );
};

export default UserFilesList;
