<script lang="ts">
  import type { Activity } from '../store'
  import { onMount } from 'svelte'

  export let activity: Activity
  export let strings: Record<string, string>

  const centers = {
    a12: { x: activity.location.lon, y: activity.location.lat, scale: 30000 },
    a14: { x: 12.274835, y: 55.563856, scale: 4000 },
    a13: { x: 12.35558, y: 55.59478, scale: 10000 },
    a20: { x: activity.location.lon, y: activity.location.lat, scale: 10000 },
    lejren: { x: 12.177261, y: 55.626132, scale: 16000 },
  }

  onMount(async () => {
    const Map = (await import('@arcgis/core/Map')).default
    const MapView = (await import('@arcgis/core/views/MapView')).default
    const Point = (await import('@arcgis/core/geometry/Point')).default
    const FeatureLayer = (await import('@arcgis/core/layers/FeatureLayer')).default
    const PictureMarkerSymbol = (await import('@arcgis/core/symbols/PictureMarkerSymbol')).default
    const Graphic = (await import('@arcgis/core/Graphic')).default
    const GraphicsLayer = (await import('@arcgis/core/layers/GraphicsLayer')).default

    const symbol = new PictureMarkerSymbol({
      url: 'https://aktiviteter.sl22.dk/images/aktivitet.svg',
      width: 60,
      height: 70,
      xoffset: 18,
			yoffset: 30
    })
    const point = new Point({ x: activity.location.lon, y: activity.location.lat })
    const marker = new Graphic({ geometry: point, symbol: symbol })
    const graphicsLayer = new GraphicsLayer()
    graphicsLayer.add(marker)

    const map = new Map({ basemap: 'gray-vector' })
    const center = new Point(centers[activity.location.id])

    map.add(graphicsLayer)

    if (activity.location.id === 'lejren') {
      const tents = new FeatureLayer({
        url: 'https://services3.arcgis.com/xM7TBEkeCBbfcxXh/arcgis/rest/services/TelteOgKontruktioner__visning/FeatureServer/0',
        labelingInfo: [
          {
            symbol: {
              type: 'text',
              haloColor: 'white',
              haloSize: 1,
            },
            labelExpressionInfo: {
              expression: '$feature.anvendelse',
            },
            where: "sltype = 'T'",
            minScale: 8000,
          },
        ],
      })

      const areas = new FeatureLayer({
        url: 'https://services3.arcgis.com/xM7TBEkeCBbfcxXh/arcgis/rest/services/Områder_vis/FeatureServer/0',
        labelingInfo: [
          {
            symbol: {
              type: 'text',
              haloColor: 'white',
              haloSize: 2,
            },
            labelExpressionInfo: {
              expression:
                '$feature.Beskrivelse + IIf(IsEmpty($feature.Navn), "", " - " +  $feature.Navn)',
            },
          },
        ],
      })

      map.add(areas)
      map.add(tents)
    }

    const view = new MapView({
      container: 'viewDiv',
      map: map,
      center: center,
      scale: centers[activity.location.id].scale,
      navigation: {
        mouseWheelZoomEnabled: false,
        browserTouchPanEnabled: false,
        momentumEnabled: false,
      },
    })
  })
</script>

<div class="mt-4">
  <div class="border-b-2 border-gray-200 pb-2 text-lg font-medium">{strings.mapheader}</div>
  <div class="mt-4 w-full" style="height:600px" id="viewDiv" />
</div>
