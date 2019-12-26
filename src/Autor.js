import React, { Component } from 'react';
import $ from 'jquery';
import TratadorErros from './TratadorErros';
import InputCustomizado from './componentes/InputCustomizado';
import BotaoCustomizado from './componentes/BotaoCustomizado';
import PubSub from 'pubsub-js';

export class FormularioAutor extends Component {

  constructor() {
    super(); /* Mandatory if we want to use "this.state" */

    this.state = { lista: [] };

    /*
    this.state = {
      lista: [
        {
          nome: "Example",
          email: "example@example.com"
        },
        {
          nome: "Example 2",
          email: "example2@example.com"
        }
      ]
    }
    */

    this.enviaForm = this.enviaForm.bind(this);
    this.setNome = this.setNome.bind(this);
    this.setEmail = this.setEmail.bind(this);
    this.setSenha = this.setSenha.bind(this);

  }

  setNome(e) {
    this.setState( { nome: e.target.value } )
  }

  setEmail(e) {
    this.setState( { email: e.target.value } )
  }

  setSenha(e) {
    this.setState( { senha: e.target.value } )
  }


  enviaForm(e) {
    e.preventDefault();

    $.ajax({
      url: "http://cdc-react.herokuapp.com/api/autores",
      contentType: "application/json",
      dataType: "json",
      type: "post",
      data: JSON.stringify({ nome: this.state.nome, email: this.state.email, senha: this.state.senha }),
      success: function(res) {
        console.log("success");
        // Disparar aviso geral de nova listagem disponivel
        // PUBLISHER - PUB/SUB
        PubSub.publish('atualiza-lista-autores', res);
        this.setState({ nome: '', email: '', senha: '' });
      }.bind(this),
      error: function(res) {
        console.log("erro");
        if(res.status === 400){
          console.log("erro 200");
          new TratadorErros().publicaErros(res.responseJSON);
        }
      },
      beforeSend: function() {
        PubSub.publish('limpa-erros');
      }
    });
  }

  render() {
    return (
      <div>
        <div className="header">
          <h1>Cadastro de Autores</h1>
        </div>

        <div className="content" id="content">
          <div className="pure-form pure-form-aligned">
            <form className="pure-form pure-form-aligned" onSubmit={this.enviaForm} method="post">
              <InputCustomizado id="nome" type="text" name="nome" value={this.state.nome} onChange={this.setNome} label="Nome" />
              <InputCustomizado id="email" type="text" name="email" value={this.state.email} onChange={this.setEmail} label="Email" />
              <InputCustomizado id="senha" type="text" name="senha" value={this.state.senha} onChange={this.setSenha} label="Senha" />
              <BotaoCustomizado label="Gravar" />
            </form>
          </div>
        </div>
      </div>
    )
  }
}


export class TabelaAutores extends Component {
  render() {
    return (
      <div>
        <table className="pure-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>email</th>
            </tr>
          </thead>
          <tbody>
            {
              this.props.lista.map((item, index) => {
                return(
                  <tr key={index}>
                    <td>{item.nome}</td>
                    <td>{item.email}</td>
                  </tr>
                )
              })
            }
          </tbody>
        </table>
      </div>
      )
  }
}


export default class AutorBox extends Component {
  constructor() {
    super();
    this.state = { lista: []};
  }

  /*
   componentDidMount() - This is called AFTER the DOM is rendered.
   componentWillMount() - This is called BEFORE the DOM is rendered!
   */

  componentDidMount() {
    $.ajax({
      url: "http://cdc-react.herokuapp.com/api/autores",
      dataType: 'json',
      success: (res) => {
        this.setState({ lista: [...this.state.lista, ...res] }); /* This crazy ... concats data into the current state */
      }

      /*
       * Instead of arrow function "(res) => {" it could be also: "res => {" or
       *
       * success: function(res) {
       *
       * }.bind(this);
       *
       * ^ This will solve the issue where "setState" is not a function
       */
    })

    PubSub.subscribe('atualiza-lista-autores', function(topico, res){
      this.setState({lista: res});
    }.bind(this));
  }


  render() {
    return (
      <div>
        <FormularioAutor />
        <TabelaAutores lista={this.state.lista} />
      </div>
    )
  }
}
