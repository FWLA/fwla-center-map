import { HttpClientModule } from '@angular/common/http';
import { Injector, NgModule } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { LeafletDrawModule } from '@asymmetrik/ngx-leaflet-draw';
import { AppComponent } from './app.component';
import { EditLayerControlComponent } from './edit-layer-control/edit-layer-control.component';
import { EditComponent } from './edit/edit.component';
import { LayerControlComponent } from './layer-control/layer-control.component';
import { MapComponent } from './map/map.component';

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
    EditComponent,
    LayerControlComponent,
    EditLayerControlComponent
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
  bootstrap: [AppComponent],
  entryComponents: [
    LayerControlComponent,
    EditLayerControlComponent
  ]
})
export class AppModule {
  constructor(private injector: Injector) {
    // LayerControl
    var el = createCustomElement(LayerControlComponent, { injector: this.injector });
    customElements.define('layer-control', el);

    // EditLayerControl
    el = createCustomElement(EditLayerControlComponent, { injector: this.injector });
    customElements.define('edit-layer-control', el);
  }
}
