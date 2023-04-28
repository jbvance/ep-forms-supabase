import React from 'react';
import Meta from 'components/Meta';
import HeroSection from 'components/HeroSection';
import FeaturesSection from 'components/FeaturesSection';
import ClientsSection from 'components/ClientsSection';
import TestimonialsSection from 'components/TestimonialsSection';
import NewsletterSection from 'components/NewsletterSection';
import CtaSection from 'components/CtaSection';

function IndexPage(props) {
  return (
    <>
      <Meta />
      <HeroSection
        bg="primary"
        textColor="light"
        size="lg"
        bgImage="/images/family-background.jpg"
        bgImageOpacity={0.3}
        title="Estate Dox"
        subtitle="The easiest way to prepare your Texas Powers of Attorney"
        buttonText="Get Started"
        buttonColor="light"
        buttonPath="/wizard"
      />
      <FeaturesSection
        bg="white"
        textColor="dark"
        size="md"
        bgImage=""
        bgImageOpacity={1}
        title="Prepare your Texas Power of Attorney Documents"
        subtitle="Protect your family by preparing"
      />
      {/*<ClientsSection
        bg="light"
        textColor="dark"
        size="sm"
        bgImage=""
        bgImageOpacity={1}
        title="You're in good company"
        subtitle=""
      />
      <TestimonialsSection
        bg="white"
        textColor="dark"
        size="md"
        bgImage=""
        bgImageOpacity={1}
        title="Here's what people are saying"
        subtitle=""
  />
      <NewsletterSection
        bg="light"
        textColor="dark"
        size="md"
        bgImage=""
        bgImageOpacity={1}
        title="Stay in the know"
        subtitle="Receive our latest articles and feature updates"
        buttonText="Subscribe"
        buttonColor="primary"
        inputPlaceholder="Enter your email"
        subscribedMessage="You are now subscribed!"
  />*/}
      <CtaSection
        bg="primary"
        textColor="light"
        size="sm"
        bgImage=""
        bgImageOpacity={1}
        title="Ready to get started?"
        subtitle=""
        buttonText="Get Started"
        buttonColor="light"
        buttonPath="/wizard"
      />
    </>
  );
}

export default IndexPage;
