import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { LeafletDrawModule } from '@asymmetrik/ngx-leaflet-draw';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { MapComponent } from './map/map.component';
import { EditComponent } from './edit/edit.component';

const appRoutes: Routes = [
  {
    path: 'map',
    component: MapComponent
  },
  {
    path: 'edit/:id',
    component: EditComponent
  },
  {
    path: '**',
    redirectTo: '/map',
    pathMatch: 'full'
  }
];


@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    EditComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(
      appRoutes,
      {
        useHash: true
      }
    ),
    HttpClientModule,
    LeafletModule.forRoot(),
    LeafletDrawModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
