import React, { useState, useContext } from "react";
import {
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Collapse,
} from "shards-react";
import Link from "next/link";

import logo from "../../assets/logo.svg";
import { UserSnip } from "../userSnippet/userSnippet";
import { AuthenticationContext } from "../contexts";
import { useLogout } from "../../hooks/useLogout";

export const NavigationBar = () => {
  const { isAuthenticated, profileImageUrl } = useContext(
    AuthenticationContext
  );
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const { performLogout } = useLogout();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const toggleUserDropdown = () => {
    setUserDropdownOpen(!userDropdownOpen);
  };

  const handleLogout = async () => {
    await performLogout();
  };

  return (
    <Navbar type="dark" expand="md" className="nb-2">
      <NavbarBrand href="/">
        <img src={logo} className="nb-2__ico" />
        <span className="nb-2__brand">Zerochass</span>
      </NavbarBrand>

      <NavbarToggler onClick={toggleMenu} />

      <Collapse open={menuOpen} navbar>
        <Nav navbar>
          <NavItem>
            <NavLink className="nb-2__link" href="/tutorials">
              Tutorials
            </NavLink>
          </NavItem>

          {/**
                    <Dropdown
                        open={dropdownOpen}
                        toggle={toggleDropdown}
                    >
                        <DropdownToggle className="nb-2__link" nav caret>
                            About
                        </DropdownToggle>

                        <DropdownMenu>
                            <DropdownItem>At Zerochass</DropdownItem>
                            <DropdownItem>Getting Started</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
            */}
        </Nav>

        {/** Only show the user dropdown when authenticated */}
        {isAuthenticated && (
          <Nav navbar className="ml-auto align-items-center">
            {/** Button link to the writing page */}
            <NavItem className="mr-auto">
              <NavLink className="nb-2__link" href="/write">
                Write
              </NavLink>
            </NavItem>

            {/** Button link to the dashboard page */}
            <NavItem className="mr-auto">
              <NavLink className="nb-2__link" href="/dashboard">
                Dashboard
              </NavLink>
            </NavItem>

            <Dropdown
              className="mr-auto ml-md-4"
              open={userDropdownOpen}
              toggle={toggleUserDropdown}
            >
              <DropdownToggle className="p-0" nav>
                <UserSnip
                  profileImageUrl={profileImageUrl}
                  usePadding={false}
                />
              </DropdownToggle>

              <DropdownMenu className="left">
                <DropdownItem>
                  <Link href="/planner">
                    <a className="main__link">Planner</a>
                  </Link>
                </DropdownItem>
                <DropdownItem>
                  <Link href="/profile">
                    <a className="main__link">Profile</a>
                  </Link>
                </DropdownItem>
                <DropdownItem>
                  <Link href="/account">
                    <a className="main__link">Account</a>
                  </Link>
                </DropdownItem>

                <hr />

                <DropdownItem onClick={handleLogout}>Log out</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </Nav>
        )}
      </Collapse>
    </Navbar>
  );
};
