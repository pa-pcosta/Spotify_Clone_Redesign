import { Component, OnInit } from '@angular/core';
import { SpotifyService } from 'src/app/services/spotify.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private spotifyService: SpotifyService) { }

  ngOnInit(): void {

    this.verificaTokenUrlCallback();
  }

  aoClicarEmAbrirMeuSpotify() {
    
    //Redireciona para página de login do Spotify com base na URL fornecida
    //pela chamada do método implementado na classe de serviços injetada
    window.location.href = this.spotifyService.obterUrlAutenticacaoSpotify();
  }

  verificaTokenUrlCallback() {

    const token = this.spotifyService.obterTokenUrlCallBack();
    
    if (!!token){
      this.spotifyService.definirAccessToken(token);
    }
  }
}
