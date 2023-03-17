import React from 'react';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import Section from 'components/Section';
import SectionHeader from 'components/SectionHeader';
import AspectRatio from 'components/AspectRatio';

function FeaturesSection(props) {
  const items = [
    {
      title: 'Financial Power of Attorney',
      body: 'Appoint someone you trust to make financial decisions on your behalf.',
      image: '/images/dpoa-card.jpg',
    },
    {
      title: 'Medical Power of Attorney',
      body: "Appoint a friend or loved one to make healthcare decisions on your behalf if you can't",
      image: '/images/mpoa-card.jpg',
    },
    {
      title: 'Appointment of Guardian for Children',
      body: 'Appoint someone to care for your children if you die or are unable to care for them',
      image: '/images/guardian-card.jpg',
    },
    {
      title: 'Living Will',
      body: 'Make your last wishes known',
      image: '/images/directive-card.jpg',
    },
  ];

  return (
    <Section
      bg={props.bg}
      textColor={props.textColor}
      size={props.size}
      bgImage={props.bgImage}
      bgImageOpacity={props.bgImageOpacity}
    >
      <Container className="text-center">
        <SectionHeader
          title={props.title}
          subtitle={props.subtitle}
          size={2}
          spaced={true}
        />
        <Card>
          <Row className="no-gutters overflow-hidden">
            {items.map((item, index) => (
              <Col
                xs={12}
                lg={6}
                style={{
                  display: 'flex',
                  alignItems: 'stretch',
                  justifyContent: 'center',
                  boxShadow: '1px 1px 0 0 #efefef',
                }}
                key={index}
              >
                <div className="FeaturesSection__item has-text-centered">
                  <div className="FeaturesSection__image-container">
                    <AspectRatio ratio={4 / 3}>
                      <Image src={item.image} alt={item.title} fluid={true} />
                    </AspectRatio>
                  </div>
                  <h4>{item.title}</h4>
                  <p>{item.body}</p>
                </div>
              </Col>
            ))}
          </Row>
        </Card>
      </Container>
    </Section>
  );
}

export default FeaturesSection;
