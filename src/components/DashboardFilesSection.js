import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Section from 'components/Section';
import SectionHeader from 'components/SectionHeader';
import UserFilesList from './UserFilesList';
import { useAuth } from 'util/auth';

function DashboardSection(props) {
  const auth = useAuth();
  const router = useRouter();

  return (
    <Section
      bg={props.bg}
      textColor={props.textColor}
      size={props.size}
      bgImage={props.bgImage}
      bgImageOpacity={props.bgImageOpacity}
    >
      <Container>
        <SectionHeader
          title={props.title}
          subtitle={props.subtitle}
          size={1}
          spaced={true}
          className="text-center"
        />

        <Row>
          <Col lg={12}>
            <UserFilesList />
          </Col>
        </Row>
        <Row style={{ marginTop: '20px' }}>
          <Col md={12}>
            <Button
              style={{ width: '100%' }}
              onClick={() => router.push('/wizard')}
            >
              Click here to create new documents
            </Button>
          </Col>
        </Row>
        <Row className="WarningMessage" style={{ marginTop: '15px' }}>
          <Col>
            Please note that if you create a new version of a document you have
            previously created, the previous version will be overwritten and
            will no longer be available to download. So, before creating a new
            version of the same document type, you may want to download it.
          </Col>
        </Row>
      </Container>
    </Section>
  );
}

export default DashboardSection;
