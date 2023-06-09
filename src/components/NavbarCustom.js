import React from 'react';
import { useRouter } from 'next/router';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Link from 'next/link';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { useAuth } from 'util/auth';

function NavbarCustom(props) {
  const auth = useAuth();
  const router = useRouter();

  return (
    <Navbar bg={props.bg} variant={props.variant} expand={props.expand}>
      <Container>
        <Link href="/" passHref={true}>
          <Navbar.Brand>
            <img
              className="d-inline-block align-top"
              src="/images/logo-main-1.jpg"
              alt="Logo"
              height="50"
            />
          </Navbar.Brand>
        </Link>
        <Navbar.Toggle aria-controls="navbar-nav" className="border-0" />
        <Navbar.Collapse id="navbar-nav" className="justify-content-end">
          {auth.user && (
            <div className="logged-in">Logged in as: {auth.user.email}</div>
          )}
          <Nav>
            {auth.user && (
              <NavDropdown id="dropdown" title="Account" alignRight={true}>
                <Link href="/dashboard-files" passHref={true}>
                  <NavDropdown.Item active={false}>
                    View/Download Documents
                  </NavDropdown.Item>
                </Link>
                <Link href="/wizard" passHref={true}>
                  <NavDropdown.Item active={false}>
                    Create New Documents
                  </NavDropdown.Item>
                </Link>
                {/********** Don't show settings for demo purposes */}
                {/* <Link href="/settings/general" passHref={true}>
                  <NavDropdown.Item active={false}>Settings</NavDropdown.Item>
                </Link>
            <Dropdown.Divider /> */}
                <Link href="/auth/signout" passHref={true}>
                  <NavDropdown.Item
                    active={false}
                    onClick={(e) => {
                      e.preventDefault();
                      auth.signout();
                    }}
                  >
                    Sign out
                  </NavDropdown.Item>
                </Link>
              </NavDropdown>
            )}

            {!auth.user && (
              <Nav.Item>
                <Link href="/auth/signin" passHref={true}>
                  <Nav.Link active={false}>Sign in</Nav.Link>
                </Link>
              </Nav.Item>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavbarCustom;
