import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-layer-control',
  templateUrl: './edit-layer-control.component.html',
  styleUrls: ['./edit-layer-control.component.scss']
})
export class EditLayerControlComponent implements OnInit {

  constructor(
    private router: Router
  ) {}

  ngOnInit() {
  }

  endEdit() {
    this.router.navigate(['map']);
  }
}
