import React, { Component, useState } from 'react'
import jwt_decode from 'jwt-decode'
import axios from 'axios'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { Dropdown, Badge, Modal } from 'react-bootstrap';
import Paper from '@material-ui/core/Paper';
import { Button } from 'react-bootstrap';
const apiConfig = require('../apiConfig');
const { BACKEND_URL } = apiConfig;

class ShowTickets extends Component {
  constructor() {
    super()
    this.state = {
      data: [],
      show: false,
      message: '',
      id: '',
      search: '',

    }
    this.handleChange = this.handleChange.bind(this)
  }

  getTicket = test => {
    return axios
      .get(`${BACKEND_URL}/tickets/getTicketAll`, {

      })
      .then(response => {

        this.setState({
          data: response.data,

        })

        let names = []

        response.data.map((item) => {
          names.push(item.name)

        })
        this.setState({
          namesData: names
        })
        console.log(response.data)
        return response.data

      })
      .catch(err => {
        console.log(err)
      })
  }


  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value })
  }


  handleClose(id, messages) {

    this.setState({
      show: false,

    }

    );

  }

  editSearchTerm = (e) => {

    if (e.target.value) {
      this.setState({ search: e.target.value })

      const newData = this.state.data.filter((item) => {
        const itemData = `${item.name.toUpperCase()} ${item.name.toUpperCase()} ${item.name.toUpperCase()}`;
        const textData = e.target.value.toUpperCase();

        return itemData.indexOf(textData) > -1;
      });
      this.setState({
        data: newData,
      });
    }
    else {
      this.setState({
        search: '',
      });
      this.getTicket()
    }







  }

  handleAddMessage(id, messages) {

    this.addMessage(id, messages)

    this.setState({
      show: false,

    }

    );
    this.getTicket()

  }
  handleShow = (id) => this.setState({ show: true, id: id });


  componentDidMount() {


    const token = localStorage.usertoken
    const decoded = jwt_decode(token)

    this.getTicket()

    this.setState({
      role: decoded.role,
    })







  }

  changeStatus(id, status) {
    return axios
      .put('http://34.173.225.143:5000/tickets/changeStatus', {
        id,
        status

      })
      .then(response => {

        this.getTicket()
        return response.data

      })
      .catch(err => {

        console.log(err)
      })
  }
  statusFilter(status) {
    return axios
      .post('http://34.173.225.143:5000/tickets/filterStatus', {
        status
      })
      .then(response => {

        this.setState({
          data: response.data,

        })


        return response.data

      })
      .catch(err => {
        console.log(err)
      })
  }

  addMessage(id, messages) {
    return axios
      .post('http://34.173.225.143:5000/tickets/addMessages', {
        id, messages
      })
      .then(response => {


        this.setState({
          data: response.data,

        })

        return response.data

      })
      .catch(err => {
        console.log(err)
      })
  }




  statusName(status) {
    switch (status) {
      case 0:
        return <h5><Badge pill variant="primary">Abierto</Badge></h5>
      case 1:
        return <h5><Badge pill variant="danger">Espera</Badge></h5>
      case 2:
        return <h5><Badge pill variant="success">Cerrado</Badge></h5>
      default:
        return <h5><Badge pill variant="primary">Abierto</Badge></h5>
    }
  }

  MakeItem = function (X) {
    console.log(X)
    return <option>{X}</option>;
  };











  render() {

    return (
      <div className="container">
        {this.state.role === 1 ?
          <div className="jumbotron mt-5">
            <div className="col-sm-8 mx-auto">
              <h1 className="text-center">Administrador <br></br>TICKETS</h1>
            </div>

            <Button variant="primary" className="mx-1" onClick={() => this.statusFilter(0)}>Abierto</Button>
            <Button variant="danger" className="mx-1" onClick={() => this.statusFilter(1)}>Espera</Button>
            <Button variant="success" className="mx-1" onClick={() => this.statusFilter(2)}>Cerrado</Button>
            <Button variant="dark" className="mx-1" onClick={() => this.getTicket()}>Todos</Button>
            <input style={{ float: "right" }} value={this.state.search} placeholder="Search TicketName" type="text" onChange={this.editSearchTerm} />
            <TableContainer component={Paper}>

              <Table size="small" aria-label="a dense table">

                <TableHead>
                  <TableRow>

                    <TableCell>Nombre</TableCell>
                    <TableCell align="right">Contenido</TableCell>
                    <TableCell align="right">Imagen</TableCell>
                    <TableCell align="right">Historial</TableCell>
                    <TableCell align="right">Estado</TableCell>
                    <TableCell align="right">Cambiar Estado</TableCell>
                    <TableCell align="right" >Agregar notas</TableCell>

                  </TableRow>
                </TableHead>
                <TableBody>

                  {this.state.data.length > 0 && this.state.data.map((row, index) =>
                    <TableRow key={index}>
                      <TableCell component="th" scope="row">
                        {row.name}
                      </TableCell>
                      <TableCell align="right">{row.content}</TableCell>
                      <TableCell align="right"><a target="_parent" href={`http://localhost:5000/public/${row.img}`}><img width="100px" src={`http://localhost:5000/public/${row.img}`}></img></a></TableCell>

                      {row.messages.map((message) =>
                        <>
                          <span>{message.text}</span>
                          <br />
                        </>
                      )}
                      <TableCell align="right">{this.statusName(row.status)}</TableCell>

                      <TableCell align="right"><Dropdown>
                        <Dropdown.Toggle size="sm" variant="success" id="dropdown-basic">
                          Cambiar estado
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                          <Dropdown.Item onClick={() => this.changeStatus(row._id, 0)}>Abierto</Dropdown.Item>
                          <Dropdown.Item onClick={() => this.changeStatus(row._id, 1)}>Espera</Dropdown.Item>
                          <Dropdown.Item onClick={() => this.changeStatus(row._id, 2)}>Cerrado</Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown></TableCell>
                      <TableCell align="right">   <>
                        <Button name="addButton" size="sm" variant="primary" onClick={() => this.handleShow(row._id)}>

                          Agregar notas
                        </Button>



                        <Modal show={this.state.show} onHide={() => this.handleClose()}>
                          <Modal.Header closeButton>
                            <Modal.Title>Agregar notas</Modal.Title>
                          </Modal.Header>
                          <Modal.Body><form>
                            <label>
                              Mensaje :
                              <input type="text" name="message" value={this.state.message} onChange={this.handleChange} />
                            </label>
                          </form>
                          </Modal.Body>
                          <Modal.Footer>
                            <Button variant="secondary" onClick={() => this.handleClose()}>
                              Cerrar
                            </Button>

                            <Button variant="primary" onClick={() => this.handleAddMessage(this.state.id, this.state.message)}>
                              Agregar mensaje
                            </Button>
                          </Modal.Footer>
                        </Modal>
                      </>
                      </TableCell>

                    </TableRow>
                  )} </TableBody>
              </Table>
            </TableContainer>
          </div> :
          <div className="jumbotron mt-5">
            <div className="col-sm-8 mx-auto">
              <h1 className="text-center">Paginag Usuario<br></br>TICKETS</h1>
            </div>

            <TableContainer component={Paper}>
              <Table size="small" aria-label="a dense table">

                <TableHead>
                  <TableRow>

                    <TableCell>Nombre</TableCell>
                    <TableCell align="right">Contenido</TableCell>
                    <TableCell align="right">Imagen</TableCell>
                    <TableCell align="right">Mensaje</TableCell>
                    <TableCell align="right">Estado</TableCell>
                    <TableCell align="right" >Agregar nota</TableCell>

                  </TableRow>
                </TableHead>
                <TableBody>

                  {this.state.data.length > 0 && this.state.data.map((row, index) =>
                    <TableRow key={index}>
                      <TableCell component="th" scope="row">
                        {row.name}
                      </TableCell>
                      <TableCell align="right">{row.content}</TableCell>
                      <TableCell align="right"><a target="_parent" href={`http://localhost:5000/public/${row.img}`}><img width="100px" src={`http://localhost:5000/public/${row.img}`}></img></a></TableCell>
                      {row.messages.map((message) =>
                        <>
                          <span>{message.text}</span>

                          <br />
                        </>
                      )}
                      <TableCell align="right">{this.statusName(row.status)}</TableCell>

                      <TableCell align="right">   <>
                        <Button name="addButton" size="sm" variant="primary" onClick={() => this.handleShow(row._id)}>

                          Agregar mensaje
                        </Button>



                        <Modal show={this.state.show} onHide={() => this.handleClose()}>
                          <Modal.Header closeButton>
                            <Modal.Title>Agregar mensaje</Modal.Title>
                          </Modal.Header>
                          <Modal.Body><form>
                            <label>
                              Mensaje :
                              <input type="text" name="message" value={this.state.message} onChange={this.handleChange} />
                            </label>
                          </form>
                          </Modal.Body>
                          <Modal.Footer>
                            <Button variant="secondary" onClick={() => this.handleClose()}>
                              Cerrar
                            </Button>

                            <Button variant="primary" onClick={() => this.handleAddMessage(this.state.id, this.state.message)}>
                              Agregar mensaje
                            </Button>
                          </Modal.Footer>
                        </Modal>
                      </>
                      </TableCell>

                    </TableRow>
                  )} </TableBody>
              </Table>
            </TableContainer>
          </div>
        }
      </div>
    )
  }
}

export default ShowTickets