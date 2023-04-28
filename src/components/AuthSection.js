import React from 'react';
import Link from 'next/link';
import Container from 'react-bootstrap/Container';
import Section from 'components/Section';
import SectionHeader from 'components/SectionHeader';
import Auth from 'components/Auth';
import AuthFooter from 'components/AuthFooter';
import Alert from 'react-bootstrap/Alert';

function AuthSection(props) {
  // Options by auth type
  const optionsByType = {
    signup: {
      // Top Title
      title: (
        <>
          <div>Create an Account</div>
          <Alert variant="success">
            <div style={{ fontSize: '16px' }}>
              If you are using this site for demo purposes, you may not want to
              create an account. Instead, you can{' '}
              <Link href="/auth/signin">
                click here to login with an existing demo account
              </Link>
              .
            </div>
          </Alert>
        </>
      ),
      // Button text
      buttonAction: 'Sign up',
      // Footer text and links
      showFooter: true,
      signinText: 'Already have an account?',
      signinAction: 'Sign in',
      signinPath: '/auth/signin',
      // Terms and privacy policy agreement
      showAgreement: true,
      termsPath: '/legal/terms-of-service',
      privacyPolicyPath: '/legal/privacy-policy',
    },
    signin: {
      title: (
        <>
          <div>Welcome Back</div>
          <Alert variant="danger" style={{ fontSize: '16px' }}>
            NOTE: This site is for informational and demonstration purposes
            only. You should not rely on the documents created by this site for
            legal purposes.
          </Alert>
          <Alert variant="success">
            <div style={{ fontSize: '16px' }}>
              <div>
                For demonstration purposes, you may use the following
                credentials to login:
              </div>
              <div>email: demo@estatedocs.com</div>
              <div>password: estate-docs-demo</div>
              <div style={{ marginTop: '20px' }}>
                Please be aware that if you use this site in demo mode, any
                information you enter will be visible by the next person who
                logs in using demo mode. For that reason, you may not want to
                enter your personal information in demo mode.
              </div>
            </div>
          </Alert>
        </>
      ),
      buttonAction: 'Sign in',
      showFooter: true,
      signupAction: 'Create an account',
      signupPath: '/auth/signup',
      forgotPassAction: 'Forgot Password?',
      forgotPassPath: '/auth/forgotpass',
    },
    forgotpass: {
      title: 'Get a new password',
      buttonAction: 'Reset password',
      showFooter: true,
      signinText: 'Remember it after all?',
      signinAction: 'Sign in',
      signinPath: '/auth/signin',
    },
    changepass: {
      title: 'Choose a new password',
      buttonAction: 'Change password',
    },
  };

  // Ensure we have a valid auth type
  const type = optionsByType[props.type] ? props.type : 'signup';

  // Get options object for current auth type
  const options = optionsByType[type];

  return (
    <Section
      bg={props.bg}
      textColor={props.textColor}
      size={props.size}
      bgImage={props.bgImage}
      bgImageOpacity={props.bgImageOpacity}
    >
      <Container
        style={{
          maxWidth: '450px',
        }}
      >
        <SectionHeader
          title={options.title}
          subtitle=""
          size={2}
          spaced={true}
          className="text-center"
        />
        <Auth
          type={type}
          buttonAction={options.buttonAction}
          providers={props.providers}
          afterAuthPath={props.afterAuthPath}
          key={type}
        />

        {options.showFooter && <AuthFooter type={type} {...options} />}
      </Container>
    </Section>
  );
}

export default AuthSection;
