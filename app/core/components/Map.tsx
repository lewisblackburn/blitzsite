import { MAPBOX_TOKEN } from "app/lib/constants"
import { Component, useState } from "react"
import ReactMapGL from "react-map-gl"

export default function Map() {
  const [viewState, setViewState] = useState({
    width: "100vw",
    height: "100vh",
    latitude: 53.68297,
    longitude: -1.4991,
    zoom: 10,
  })

  return (
    <ReactMapGL
      {...viewState}
      onMove={(evt: any) => setViewState(evt.viewState)}
      mapStyle="mapbox://styles/mapbox/dark-v10"
      mapboxAccessToken={MAPBOX_TOKEN}
      dragRotate={false}
      style={{ borderRadius: "0.25rem" }}
    />
  )
}
