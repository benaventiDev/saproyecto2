import React, { Component } from 'react'
import axios from 'axios'
const apiConfig = require('../apiConfig');
const { BACKEND_URL } = apiConfig;

class Ticket extends Component {
  constructor() {
    super()
    this.state = {
      name: '',
      content: '',
      messages: '',
      status: '',
      img: '',
      file: '',
      imagePreviewUrl: '',
      errors: {}
    }

    this.onChange = this.onChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
  }
  onChange(e) {
    this.setState({ [e.target.name]: e.target.value })
  }

  _handleSubmit(e) {
    e.preventDefault();
    // TODO: do something with -> this.state.file

    console.log('handle uploading-', this.state.file);
    console.log('file burada');
  }

  _handleImageChange(e) {
    e.preventDefault();

    let reader = new FileReader();
    let file = e.target.files[0];

    reader.onloadend = () => {
      this.setState({
        file: file,
        imagePreviewUrl: reader.result
      });
    }

    reader.readAsDataURL(file)
  }

  onSubmit(e) {
    e.preventDefault()

    console.log("ONSUBMIT")

    let formData = new FormData()
    formData.append('img', this.state.file)
    formData.append('name', this.state.name)
    formData.append('content', this.state.content)
    formData.append('messages', this.state.messages)

    axios({
      method: 'post',
      url: `${BACKEND_URL}/tickets/addTickets`,
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' }
    })
      .then(function (response) {
        //handle success
        console.log(response);
      })
      .catch(function (response) {
        //handle error
        console.log(response);
      })

  }




  onChangeHandler = event => {

    console.log(event.target.files[0])

  }

  render() {
    let { imagePreviewUrl } = this.state;
    let $imagePreview = null;
    if (imagePreviewUrl) {
      $imagePreview = (<img src={imagePreviewUrl} />);
    } else {
      $imagePreview = (<div className="previewText">Selecione Imagen</div>);
    }




    return (

      <div className="container">

        <div className="jumbotron mt-5">
          <div className="col-sm-8 mx-auto">
            <h1 className="text-center">Enviar Ticket</h1>
          </div>
          <form encType="multipart/form-data" noValidate onSubmit={this.onSubmit} >
            <div>
              <label htmlFor="name" className="mx-3"><p>Nombre</p></label>
              <input type="text" id="name" className="mx-2" placeholder="nombre"
                value={this.state.name}
                onChange={this.onChange} name="name" required ></input>
            </div>
            <br></br>
            <div>

              <label htmlFor="content" className="mx-3"><p>Contenido</p></label>
              <textarea id="content" name="content" className="mx-4" rows="2" styles={{}}
                placeholder="contenido"
                value={this.state.content}
                onChange={this.onChange} required>
              </textarea>
            </div>
            <br></br>
            <div>
              <label htmlFor="content" className="mx-3">Problema</label>
              <textarea id="messages" className="mx-3" name="messages" rows="2"
                placeholder="describa"
                value={this.state.messages.text}
                onChange={this.onChange} required>
              </textarea>
            </div>
            <br></br>
            <div className="previewComponent">
              <form onSubmit={(e) => this._handleSubmit(e)}>
                <input className="fileInput"
                  type="file"
                  onChange={(e) => this._handleImageChange(e)} />
                <button className="submitButton"
                  type="submit"
                  onClick={(e) => this._handleSubmit(e)}>Subir Imagen</button>
              </form>

            </div>
            <br></br>
            <div>
              <button type="submit">Enviar</button>
            </div>
          </form>
        </div>
      </div>
    )
  }
}

export default Ticket