import { Icon, icon, IconOptions, PointExpression } from 'leaflet';
import { FontAwesomeOptions, FontAwesomeIcon } from './fontAwesomeIcons';

const defaultIconSize: PointExpression = [25, 41];
const defaultIconAnchor: PointExpression = [12, 41];
const defaultPopupAnchor: PointExpression = [1, -34];
const defaultShadowSize: PointExpression = [41, 41];

const defaultIconOptions: IconOptions = {
  iconUrl: 'assets/markers/marker-icon-2x-blue.png',
  shadowUrl: 'assets/markers/marker-shadow.png',
  iconSize: defaultIconSize,
  iconAnchor: defaultIconAnchor,
  popupAnchor: defaultPopupAnchor,
  shadowSize: defaultShadowSize
};
export const DefaultIcon: Icon = icon(defaultIconOptions);

const blackIconOptions: IconOptions = {
  ...defaultIconOptions,
  iconUrl: 'assets/markers/marker-icon-2x-black.png'
};
export const BlackIcon: Icon = icon(blackIconOptions);

const blueIconOptions: IconOptions = {
  ...defaultIconOptions
};
export const BlueIcon: Icon = icon(blueIconOptions);

const greenIconOptions: IconOptions = {
  ...defaultIconOptions,
  iconUrl: 'assets/markers/marker-icon-2x-green.png'
};
export const GreenIcon: Icon = icon(greenIconOptions);

const greyIconOptions: IconOptions = {
  ...defaultIconOptions,
  iconUrl: 'assets/markers/marker-icon-2x-grey.png'
};
export const GreyIcon: Icon = icon(greyIconOptions);

const orangeIconOptions: IconOptions = {
  ...defaultIconOptions,
  iconUrl: 'assets/markers/marker-icon-2x-orange.png'
};
export const OrangeIcon: Icon = icon(orangeIconOptions);

const redIconOptions: IconOptions = {
  ...defaultIconOptions,
  iconUrl: 'assets/markers/marker-icon-2x-red.png'
};
export const RedIcon: Icon = icon(redIconOptions);

const violetIconOptions: IconOptions = {
  ...defaultIconOptions,
  iconUrl: 'assets/markers/marker-icon-2x-violet.png'
};
export const VioletIcon: Icon = icon(violetIconOptions);

const yellowIconOptions: IconOptions = {
  ...defaultIconOptions,
  iconUrl: 'assets/markers/marker-icon-2x-yellow.png'
};
export const YellowIcon: Icon = icon(yellowIconOptions);

const defaultFontAwesomeIconOptions: FontAwesomeOptions = {
  ...defaultIconOptions,
  iconUrl: 'assets/markers/marker-icon-blue-blank.png'
};

const homeIconOptions: FontAwesomeOptions = {
  ...defaultFontAwesomeIconOptions,
  iconClasses: 'fa fa-home'
};
export const HomeIcon: FontAwesomeIcon = new FontAwesomeIcon(homeIconOptions);

const realEstateIconOptions: FontAwesomeOptions = {
  ...defaultFontAwesomeIconOptions,
  iconClasses: 'fa fa-map-pin'
};
export const RealEstateIcon: FontAwesomeIcon = new FontAwesomeIcon(realEstateIconOptions);

export function coloredIcon(color: string): Icon {
  switch (color.toLowerCase()) {
    case 'black':
      return BlackIcon;
    case 'blue':
      return BlueIcon;
    case 'green':
      return GreenIcon;
    case 'grey':
      return GreyIcon;
    case 'orange':
      return OrangeIcon;
    case 'red':
      return RedIcon;
    case 'violet':
      return VioletIcon;
    case 'yellow':
      return YellowIcon;
    default:
      return BlueIcon;
  }
}
