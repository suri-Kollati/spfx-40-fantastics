/**
 * @file
 * Bing Map Web Part for SharePoint Framework SPFx
 *
 * Author: Olivier Carpentier
 * Copyright (c) 2016
 */
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneSlider,
  PropertyPaneDropdown,
  PropertyPaneToggle,
  PropertyPaneLink,
  IWebPartContext
} from '@microsoft/sp-webpart-base';
import { Version } from '@microsoft/sp-core-library';

import * as strings from 'BingMapStrings';
import { IBingMapWebPartProps } from './IBingMapWebPartProps';

//Imports the property pane custom fields
import { PropertyFieldMapPicker } from 'sp-client-custom-fields/lib/PropertyFieldMapPicker';
import { PropertyFieldDimensionPicker } from 'sp-client-custom-fields/lib/PropertyFieldDimensionPicker';

//Loads JQuery end Bingmap.js lib
import * as $ from 'jquery';
require('bingmap');

/**
 * @class
 * Bing Map Web Part
 */
export default class BingMapWebPart extends BaseClientSideWebPart<IBingMapWebPartProps> {

  private guid: string;

  /**
   * @function
   * Web part contructor.
   */
  public constructor(context?: IWebPartContext) {
    super();

    this.guid = this.getGuid();

    //Hack: to invoke correctly the onPropertyChange function outside this class
    //we need to bind this object on it first
    this.onPropertyPaneFieldChanged = this.onPropertyPaneFieldChanged.bind(this);
  }

  /**
   * @function
   * Gets WP data version
   */
  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  /**
   * @function
   * Renders HTML code
   */
  public render(): void {

    //Inits the main div container
    var html = '<div id="' + this.guid + '"></div>';
    this.domElement.innerHTML = html;

    var width: number = Number(this.properties.dimension.width.replace("px", "").replace("%", ""));
    var height: number = Number(this.properties.dimension.height.replace("px", "").replace("%", ""));

    //Calls the Bingmap.js JQuery plugin init method
    ($ as any)("#" + this.guid).BingMap({
        Height: height,
        Width: width,
        Latitude: this.properties.position != null ? this.properties.position.substr(this.properties.position.indexOf(",") + 1, this.properties.position.length - this.properties.position.indexOf(",")) : '0',
        Longitude: this.properties.position != null ? this.properties.position.substr(0, this.properties.position.indexOf(",")) : '0',
        Address: this.properties.address,
        Title: this.properties.title,
        Description: this.properties.description,
        APIKEY: this.properties.api,
        ZoomLevel: this.properties.zoomLevel,
        MapMode: this.properties.mapMode,
        MapStyle: this.properties.mapStyle,
        DashBoardStyle: this.properties.dashBoardStyle,
        AllowMouseWheelZoom: this.properties.allowMouseWheelZoom,
        PushPin: this.properties.pushPin,
        ShowDashBoard: this.properties.showDashBoard,
        ShowScaleBar: this.properties.showScaleBar
    });
  }

  /**
   * @function
   * Generates a GUID
   */
  private getGuid(): string {
    return this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' +
      this.s4() + '-' + this.s4() + this.s4() + this.s4();
  }

  /**
   * @function
   * Generates a GUID part
   */
  private s4(): string {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
  }

  /**
   * @function
   * PropertyPanel settings definition
   */
  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          displayGroupsAsAccordion: true,
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('api', {
                  label: strings.Api
                }),
                PropertyPaneLink('bingLink', {
                  text: strings.Register,
                  href: 'http://www.bingmapsportal.com/',
                  target: '_blank'
                })
              ]
            },
            {
              groupName: strings.LocationGroupName,
              groupFields: [
                PropertyPaneTextField('title', {
                  label: strings.Title
                }),
                PropertyPaneTextField('description', {
                  label: strings.Description
                }),
                PropertyPaneTextField('address', {
                  label: strings.Address
                }),
                PropertyFieldMapPicker('position', {
                  label: strings.Position,
                  longitude: this.properties.position != null ? this.properties.position.substr(0, this.properties.position.indexOf(",")) : '0',
                  latitude: this.properties.position != null ? this.properties.position.substr(this.properties.position.indexOf(",") + 1, this.properties.position.length - this.properties.position.indexOf(",")) : '0',
                  onPropertyChange: this.onPropertyPaneFieldChanged,
                  properties: this.properties,
                  key: "bingMapPositionField"
                })
              ]
            },
            {
              groupName: strings.MapGroupName,
              groupFields: [
                PropertyFieldDimensionPicker('dimension', {
                  label: strings.Dimension,
                  initialValue: this.properties.dimension,
                  preserveRatio: true,
                  preserveRatioEnabled: true,
                  onPropertyChange: this.onPropertyPaneFieldChanged,
                  properties: this.properties,
                  disabled: false,
                  onGetErrorMessage: null,
                  deferredValidationTime: 0,
                  key: 'bingMapDimensionFieldId'
                }),
                PropertyPaneSlider('zoomLevel', {
                  label: strings.ZoomLevel,
                  min: 1,
                  max: 19,
                  step: 1
                }),
                PropertyPaneDropdown('mapMode', {
                  label: strings.MapMode,
                  options: [
                    { key: '2D', text: '2D'},
                    { key: '3D', text: '3D'}
                  ]
                }),
                PropertyPaneDropdown('mapStyle', {
                  label: strings.MapStyle,
                  options: [
                    { key: 'Aerial', text: 'Aerial'},
                    { key: 'Birdseye', text: 'Birdseye'},
                    { key: 'Road', text: 'Road'},
                    { key: 'Hybrid', text: 'Hybrid'}
                  ]
                }),
                PropertyPaneToggle('pushPin', {
                  label: strings.PushPin
                }),
                PropertyPaneToggle('showDashBoard', {
                  label: strings.ShowDashBoard
                }),
                PropertyPaneDropdown('dashBoardStyle', {
                  label: strings.DashBoardStyle,
                  options: [
                    { key: 'Normal', text: 'Normal'},
                    { key: 'Small', text: 'Small'},
                    { key: 'Tiny', text: 'Tiny'}
                  ]
                }),
                PropertyPaneToggle('showScaleBar', {
                  label: strings.ShowScaleBar
                }),
                PropertyPaneToggle('allowMouseWheelZoom', {
                  label: strings.AllowMouseWheelZoom
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
