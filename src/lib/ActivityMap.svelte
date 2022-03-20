<script type="ts">
  import type { Activity } from '../store'
  import Map from '@arcgis/core/Map'
  import MapView from '@arcgis/core/views/MapView'
  import WMTSLayer from '@arcgis/core/layers/WMTSLayer'
  import FeatureLayer from '@arcgis/core/layers/FeatureLayer'
  import Point from '@arcgis/core/geometry/Point'
  import SpatialReference from '@arcgis/core/geometry/SpatialReference'
  import * as projection from '@arcgis/core/geometry/projection'
  import Graphic from '@arcgis/core/Graphic'
  import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer'
  import SimpleMarkerSymbol from '@arcgis/core/symbols/SimpleMarkerSymbol'

  export let activity: Activity

  let map

  async function createMap(container) {
  
    const basemap = new WMTSLayer({
      url: 'https://api.dataforsyningen.dk/natur_friluftskort',
      serviceMode: 'KVP',
      customParameters: { token: 'fd44f26ab5701c01ca9f570e507fe9ab' },
      activeLayer: { id: 'nfkort' },
    })

    await basemap.load()
    await projection.load()

    const map = new Map({
      basemap: {
        baseLayers: [basemap],
      },
    })

    const spatialReference = new SpatialReference({ wkid: 25832 })
    const center = new Point({ x: 12.177261, y: 55.626132 })

    const view = new MapView({
      map,
      container,
      center: projection.project(center, spatialReference) as Point,
      scale: 16000,
    })

    const areas = new FeatureLayer({
      url: 'https://services3.arcgis.com/xM7TBEkeCBbfcxXh/arcgis/rest/services/Omr%C3%A5der_Off/FeatureServer/0',
    })

    map.add(areas)

    const graphicsLayer = new GraphicsLayer()
    map.add(graphicsLayer)
    
    const point = new Point({ x: activity.location.lon, y: activity.location.lat })

    const simpleMarkerSymbol = new SimpleMarkerSymbol( {
      color: [226, 119, 40], // Orange
      outline: {
        color: [255, 255, 255], // White
        width: 1,
      },
      size: 20,
      style: 'diamond'
    }
    )

    const pointGraphic = new Graphic({
      geometry: point,
      symbol: simpleMarkerSymbol,
    })
    graphicsLayer.add(pointGraphic)

    return view
  }

  function mapAction(container) {
    map = createMap(container)
    return {
      destroy: () => {
        // map.remove()
      },
    }
  }
</script>

<div class="w-full" style="height:600px" use:mapAction />
