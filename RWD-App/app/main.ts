import { bootstrap }    from '@angular/platform-browser-dynamic';
import { AppComponent } from './app.component';
import { APP_ROUTER_PROVIDERS } from './app.routes';
import {HTTP_PROVIDERS} from '@angular/http';
import {JSONP_PROVIDERS} from '@angular/http';
import { provideForms } from '@angular/forms';

bootstrap(AppComponent, [
  APP_ROUTER_PROVIDERS, HTTP_PROVIDERS, JSONP_PROVIDERS, provideForms() 
]).catch((err: any) => console.error(err));
