import React from 'react'
import { Link } from 'react-router-dom'

function NavBar() {
    return (
        <>
        
            <nav className="navbar" role="navigation" aria-label="main navigation">
                <div className="navbar-brand">
                    <Link className="navbar-item" to="/">
                    BLOG
                    </Link>
                </div>

                <div id="navbarBasicExample" className="navbar-menu">
                    <div className="navbar-start">
                        <Link className="navbar-item" to="/">
                        Home
                        </Link>

                        <Link className="navbar-item" to="/category">
                        New Entry
                        </Link>

                        {/* <div className="navbar-item has-dropdown is-hoverable">
                            <a className="navbar-link">
                            More
                            </a>

                            <div className="navbar-dropdown">
                                <a className="navbar-item">
                                    About
                                </a>
                                <a className="navbar-item is-selected">
                                    Jobs
                                </a>
                                <a className="navbar-item">
                                    Contact
                                </a>
                                <hr className="navbar-divider" />
                                <a className="navbar-item">
                                    Report an issue
                                </a>
                            </div>
                        </div> */}
                    </div>

                    {/* <div className="navbar-end">
                        <div className="navbar-item">
                            <div className="buttons">
                                <a className="button is-primary">
                                    <strong>Sign up</strong>
                                </a>
                                <a className="button is-light">
                                    Log in
                                </a>
                            </div>
                        </div>
                    </div> */}
                </div>
            </nav>

        </>
    )
}

export default NavBar