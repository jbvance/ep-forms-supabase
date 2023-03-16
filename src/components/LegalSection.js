import React from "react";
import Nav from "react-bootstrap/Nav";
import Link from "next/link";
import Container from "react-bootstrap/Container";
import Section from "components/Section";
import LegalTerms from "components/LegalTerms";
import LegalPrivacy from "components/LegalPrivacy";

function LegalSection(props) {
  const validSections = {
    "terms-of-service": true,
    "privacy-policy": true,
  };

  const section = validSections[props.section]
    ? props.section
    : "terms-of-service";

  const data = {
    domain: "company.com",
    companyName: "Company",
  };

  return (
    <Section
      bg={props.bg}
      textColor={props.textColor}
      size={props.size}
      bgImage={props.bgImage}
      bgImageOpacity={props.bgImageOpacity}
    >
      <Nav
        variant="pills"
        activeKey={section}
        className="justify-content-center"
      >
        <Nav.Item>
          <Link href="/legal/terms-of-service" passHref={true}>
            <Nav.Link eventKey="terms-of-service">Terms of Service</Nav.Link>
          </Link>
        </Nav.Item>
        <Nav.Item>
          <Link href="/legal/privacy-policy" passHref={true}>
            <Nav.Link eventKey="privacy-policy">Privacy Policy</Nav.Link>
          </Link>
        </Nav.Item>
      </Nav>
      <Container className="mt-5">
        {section === "terms-of-service" && <LegalTerms {...data} />}

        {section === "privacy-policy" && <LegalPrivacy {...data} />}
      </Container>
    </Section>
  );
}

export default LegalSection;
