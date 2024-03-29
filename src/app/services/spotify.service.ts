import { Injectable } from '@angular/core';
import { SpotifyConfiguration } from 'src/environments/environment';
import SpotifyWebApi from 'spotify-web-api-js';
import { IUsuario } from '../Interfaces/IUsuario';
import { SpotifyUserParaUsuario } from '../Commom/spotifyHelper';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {

  spotifyApi: SpotifyWebApi.SpotifyWebApiJs = null;
  usuario: IUsuario;

  constructor() {
    this.spotifyApi = new SpotifyWebApi();
  }

  async inicializarUsuario() {
    
    if (!!this.usuario){
      return true
    }

    const token = localStorage.getItem('token')

    if (!token){
      return false;
    }

    try {
      
      this.definirAccessToken(token);
      await this.obterSpotifyUsuario();

      return !!this.usuario;
    }
    catch (ex){
      return false;
    }
  }

  async obterSpotifyUsuario (){
    
    const userInfo = await this.spotifyApi.getMe();
    this.usuario = SpotifyUserParaUsuario(userInfo)
  }

  obterUrlAutenticacaoSpotify() {
    //Concatena variáveis de ambiente em uma string única que será retornada como URL

    const authEndpoint = `${SpotifyConfiguration.authEndpoint}?`;
    const clientId = `client_id=${SpotifyConfiguration.clientId}&`;
    const redirectUrl = `redirect_uri=${SpotifyConfiguration.redirectUrl}&`;
    const scopes = `scope=${SpotifyConfiguration.scopes.join('%20')}&`;
    const responseType = `response_type=token&shoe_dialog=true`;

    return authEndpoint + clientId + redirectUrl + scopes + responseType;
  }

  obterTokenUrlCallBack() {
    if (!window.location.hash){
      return '';
    }

    //Substrai '#' da string hash com os parâmetros retornados pela API,
    //separa esses valores e os armazena em um vetor de strings
    const parametros = window.location.hash.substring(1).split('&');
    ;
    return parametros[0].split('=')[1];
  }

  definirAccessToken (token: string){

    this.spotifyApi.setAccessToken(token);

    //Guarda token na memória para evitar autenticação a cada refresh de página
    localStorage.setItem('token', token);
  }
}
