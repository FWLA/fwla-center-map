import { IconOptions, Icon } from 'leaflet';
import * as L from 'leaflet';

export interface FontAwesomeOptions extends IconOptions {
  iconClasses?: string;
  iconColor?: string;
  iconXOffset?: number;
  iconYOffset?: number;
}

export class FontAwesomeIcon extends Icon {
  options: FontAwesomeOptions;

  constructor(options: IconOptions) {
    super(options);
  }

  createIcon() {
    const img = super.createIcon();

    const iconDiv = L.DomUtil.create('div');
    iconDiv.className = 'leaflet-fa-markers';

    const iconElem = document.createElement('i');
    iconElem.className = this.options.iconClasses;
    if (this.options.iconColor) {
      iconElem.style.color = this.options.iconColor;
    } else {
      iconElem.style.color = 'white';
    }

    iconDiv.append(iconElem);
    iconDiv.append(img);
    return iconDiv;
  }
}
