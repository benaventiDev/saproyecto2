import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import jwt_decode from "jwt-decode";

class Landing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      role: null,
    };
  }

  componentDidMount() {
    const token = localStorage?.usertoken;
    try {
      console.log(token);
      const decoded = jwt_decode(token);
      this.setState({
        role: decoded.role,
      });
    } catch (error) {
      console.log(error);
    }
  }

  logOut(e) {
    e.preventDefault();
    localStorage.removeItem("usertoken");
    this.props.history.push(`/`);
  }

  render() {
    const loginRegLink = (
      <ul className='navbar-nav'>
        <li className='nav-item'>
          <Link to='/login' className='nav-link'>
            Login
          </Link>
        </li>
        <li className='nav-item'>
          <Link to='/register' className='nav-link'>
            Registro
          </Link>
        </li>
      </ul>
    );

    const userLink = (
      <ul className='navbar-nav'>
        <li className='nav-item'>
          <Link to='/addTicket' className='nav-link'>
            Crear Ticker
          </Link>
        </li>
        <li className='nav-item'>
          <Link to='/tickets' className='nav-link'>
            Tickets
          </Link>
        </li>
        <li className='nav-item'>
          <Link to='/userProfile' className='nav-link'>
            Perfil
          </Link>
        </li>
        <li>
          <Link to='/faq' className='nav-link'>
            FAQ
          </Link>
        </li>
        {this.state.role === 2 && (
          <>
            <li>
              <Link to='/reporte' className='nav-link'>
                Reporte
              </Link>
            </li>
          </>
        )}
        <li className='nav-item'>
          <a href='' onClick={this.logOut.bind(this)} className='nav-link'>
            Salir
          </a>
        </li>
      </ul>
    );

    return (
      <nav className='navbar navbar-expand-lg navbar-dark bg-dark rounded'>
        <button
          className='navbar-toggler'
          type='button'
          data-toggle='collapse'
          data-target='#navbarsExample10'
          aria-controls='navbarsExample10'
          aria-expanded='false'
          aria-label='Toggle navigation'
        >
          <span className='navbar-toggler-icon' />
        </button>

        <div
          className='collapse navbar-collapse justify-content-md-center'
          id='navbarsExample10'
        >
          <ul className='navbar-nav'>
            <li className='nav-item'>
              <Link to='/' className='nav-link'>
                Inicio
              </Link>
            </li>
          </ul>
          {localStorage.usertoken ? userLink : loginRegLink}
        </div>
      </nav>
    );
  }
}

export default withRouter(Landing);
