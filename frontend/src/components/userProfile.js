import React, { Component } from 'react'
import jwt_decode from 'jwt-decode'

class userProfile extends Component {
  constructor() {
    super()
    this.state = {
      first_name: '',
      last_name: '',
      email: '',
      role:'',
      errors: {}
    }
  }

  componentDidMount() {
    const token = localStorage.usertoken
    const decoded = jwt_decode(token)
    console.log(decoded)
    this.setState({
      first_name: decoded.first_name,
      last_name: decoded.last_name,
      email: decoded.email,
      role:decoded.role
    })
  }

  render() {
    return (
      <div className="container">
        <div className="jumbotron mt-5">
          <div className="col-sm-8 mx-auto">
            <h1 className="text-center">Perfil</h1>
          </div>
          <table className="table col-md-6 mx-auto">
            <tbody>
              <tr>
                <td>Nombre</td>
                <td>{this.state.first_name}</td>
              </tr>
              <tr>
                <td>Apellido</td>
                <td>{this.state.last_name}</td>
              </tr>
              <tr>
                <td>Email</td>
                <td>{this.state.email}</td>
              </tr>
              <tr>
                <td>Tipo Rol</td>
                <td>{this.state.role}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    )
  }
}

export default userProfile