import React from 'react';
import { NavLink as NavLinkRRD, Link } from 'react-router-dom';
import classnames from 'classnames';
import { PropTypes } from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';

import {
    Collapse,
    NavbarBrand,
    Navbar,
    NavItem,
    NavLink,
    Nav
} from 'reactstrap';

class Sidebar extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            collapseOpen: false,
            ...this.getCollapseStates(props.routes)
        };
    }

    activeRoute = routeName => {
        return this.props.location.pathname.indexOf(routeName) > -1 ? 'active' : '';
    };

    onMouseEnterSidenav = () => {
        if (!document.body.classList.contains('g-sidenave-pinned')) {
            document.body.classList.add('g-sidenav-show');
        }
    };

    onMouseLeaveSidenav = () => {
        if (!document.body.classList.contains('g-sidenave-pinned')) {
            document.body.classList.remove('g-sidenav-show');
        }
    };

    toggleCollapse = () => {
        this.setState({ collapseOpen: !this.state.collapseOpen });
    };

    closeCollapse = () => {
        this.setState({ collapseOpen: false });
    };

    getCollapseStates = routes => {
        let initialState = {};
        routes.map((p, key) => {
            if (p.collapse) {
                initialState = {
                    [p.state]: this.getCollapseInitialState(p.views),
                    ...this.getCollapseStates(p.views),
                    ...initialState
                };
            }
            return null;
        });
        return initialState;
    };

    getCollapseInitialState(routes) {
        for (let i = 0; i < routes.length; i++) {
            if (routes[i].collapse && this.getCollapseInitialState(routes[i].views)) {
                return true;
            } else if (window.location.href.indexOf(routes[i].path) !== -1) {
                return true;
            }
        }
        return false;
    }

    closeSidenav = () => {
        if (window.innerWidth < 1200) {
            this.props.toggleSidenav();
        }
    };

    createLinks = routes => {
        return routes.map((p, key) => {
            if (p.redirect) {
                return null;
            }
            if (p.collaps) {
                var st = {};
                st[p['state']] = !this.state[p.state];
                return (
                    <NavItem key={key}>
                        <NavLink
                            href='#lusk'
                            data-toggle='collapse'
                            aria-expanded={this.state[p.state]}
                            className={classnames({
                                active: this.getCollapseInitialState(p.views)
                            })}
                            onClick={e => {
                                e.preventDefault();
                                this.setState(st);
                            }}
                        >
                            {p.icon ? <i className={p.icon} /> : null}
                            <span className='nav-link-text' >{p.name}</span>
                        </NavLink>
                        <Collapse isOpen={this.state[p.state]}>
                            <Nav className='nav-sm flex-column'>
                                {this.createLinks(p.views)}
                            </Nav>
                        </Collapse>
                    </NavItem>
                );
            }
            return(
                <NavItem
                    className={this.activeRoute(p.layout + p.path)}
                    key={key}
                >
                    <NavLink
                        to={p.layout + p.path}
                        activeClassName=''
                        onClick={this.closeSidenav}
                        tag={NavLinkRRD}
                    >
                        {p.icon !== undefined ? (
                            <>
                                <i className={p.icon} />
                                <span className='nav-link-text'>{p.name}</span>
                            </>
                        ) : (
                            p.name
                        )}
                    </NavLink>
                </NavItem>
            );
        });
    };

    render() {
        const { routes, logo } = this.props;
        let navbarBrandProps;
        if (logo && logo.innerLink) {
            navbarBrandProps = {
                to: logo.innerLink,
                tag: Link
            };
        } else if (logo && logo.outterLink) {
            navbarBrandProps = {
                href: logo.outterLink,
                target: '_blank'
            };
        }

        const scrollBarInner = (
            <div className='scrollbar-inner'>
                <div className='sidenav-header d-flex align-items-center'>
                    {logo ? (
                        <NavbarBrand {...navbarBrandProps}>
                            <img
                                alt={logo.imgAlt}
                                className='navbar-brand-img'
                                src={logo.imgSrc}
                            />
                        </NavbarBrand>
                    ) : null}
                </div>
                <div className='ml-auto'>
                    <div
                        className={classnames('sidenav-toggler d-none d-xl-block', {
                            active: this.props.sidenavOpen
                        })}
                        onClick={this.props.toggleSidenav}
                    >
                        <div className='sidenav-toggler-inner'>
                            <i className='sidenav-toggler-line' />
                            <i className='sidenav-toggler-line' />
                            <i className='sidenav-toggler-line' />
                        </div>
                    </div>
                </div>
                <div className='navbar-inner'>
                    <Collapse navbar isOpen={true}>
                        <Nav navbar>{this.createLinks(routes)}</Nav>
                    </Collapse>
                </div>
            </div>
        );
        return(
            <Navbar
                className='sidenav navbar-vertical fixed-left navbar-expand-xs navbar-light bg-white'
                onMouseEnter={this.onMouseEnterSidenav}
                onMouseLeave={this.onMouseLeaveSidenav}
            >
                {navigator.platform.indexOf('Win') > -1 ? (
                    <PerfectScrollbar>{scrollBarInner}</PerfectScrollbar>
                ) : (
                    scrollBarInner
                )}
            </Navbar>
        )
    }
}

Sidebar.defaultProps = {
    routes: [{}],
    toggleSidenav: () => {},
    sidenavOpen: false
};

Sidebar.propTypes = {
    toggleSidenav: PropTypes.func,
    sidenavOpen: PropTypes.bool,
    routes: PropTypes.arrayOf(PropTypes.object),
    logo: PropTypes.shape({
        innerLink: PropTypes.string,
        outterLink: PropTypes.string,
        imgSrc: PropTypes.string.isRequired,
        imgAlt: PropTypes.string.isRequired
    })
};

export default Sidebar;