import React from 'react'
import { Input, Button, Tooltip } from '../Form'
import mapIcon from '../../images/mapIcon.svg'
export default class Maps extends React.Component {
  constructor (props) {
    super(props)
    this.state = { searchVal: '', searchDist: 10, isNav: true }
    this.insertMarkerList = this.insertMarkerList.bind(this)
    this.setToCurrentLocation = this.setToCurrentLocation.bind(this)
    this.compareDist = this.compareDist.bind(this)
    this.setSearch = this.setSearch.bind(this)
    this.goToGoogleMaps = this.goToGoogleMaps.bind(this)
    this.copyAdress = this.copyAdress.bind(this)
    this.key = 'AIzaSyDGloI_9FzwRcXO3KrlYMYdjlbVdiAlRJw'
    this.script = document.createElement('script')
    this.setNav = this.setNav.bind(this)
    window.addEventListener('resize', this.setNav)
    const url = `https://maps.googleapis.com/maps/api/js?key=${this.key}`
    document.body.appendChild(this.script)
    this.script.setAttribute('src', url)
    this.script.onload = () => {
      const mapNode = document.getElementById('google-maps')
      this.map = new window.google.maps.Map(mapNode, {
        zoom: 10,
        center: { lat: 45.498308, lng: -73.586802 },
        disableDefaultUI: true
      })
      if (this.props.global.locationList.length) this.insertMarkerList()
    }
  }
  componentWillUnmount () {
    window.removeEventListener('resize', this.setNav)
  }
  setNav () {
    if (window.innerWidth > 760 && !this.state.isNav) this.setState({ isNav: true })
  }
  setToCurrentLocation () {
    window.navigator.geolocation.getCurrentPosition(async result => {
      const { latitude: lat, longitude: lng } = result.coords
      const location = { lat, lng }
      this.setState({ searchCoords: location })
      const geocoder = new window.google.maps.Geocoder()
      geocoder.geocode({ location }, (result) => {
        const postalCode = result[0].address_components.find(obj => obj.types.includes('postal_code')).long_name
        this.setState({ searchVal: postalCode })
      })
    })
  }
  setSearch () {
    const geocoder = new window.google.maps.Geocoder()
    geocoder.geocode({ address: this.state.searchVal }, (result) => {
      const { lng, lat } = result[0].geometry.location
      const postalCode = result[0].address_components.find(obj => obj.types.includes('postal_code')).long_name
      this.setState({
        searchCoords: { lng: lng(), lat: lat() },
        searchVal: postalCode
      })
    })
    console.log('bonjour')
  }
  filter ({ lat: lat1, lng: lng1 }) {
    if (!this.state.searchCoords) return true
    const { lat, lng } = this.state.searchCoords
    const dist = distance(lat1, lng1, lat, lng, 'K')
    if (dist <= Number(this.state.searchDist)) return dist
    else return false
  }
  componentDidUpdate (oldProps) {
    if (this.map && this.props.global.locationList.length && !oldProps.global.locationList.length) {
      this.insertMarkerList()
    }
  }
  geocode (params) {
    return new Promise((resolve, reject) => {
      this.mapsClient.geocode(params, (err, result) => {
        if (err) reject(err)
        resolve(result)
      })
    })
  }
  insertMarkerList () {
    this.props.global.locationList.forEach(({ lat, lng, ...rest }) => {
      this[`${lat},${lng}`] = new window.google.maps.Marker({
        position: { lat, lng },
        map: this.map,
        animation: window.google.maps.Animation.DROP,
        title: rest[this.props.global.lang].description,
        icon: mapIcon
      })
    })
  }
  copyAdress (evt, location) {
    evt.stopPropagation()
    navigator.clipboard.writeText(location[this.props.global.lang].address)
  }
  goToGoogleMaps (evt, location) {
    evt.stopPropagation()
    const link = document.createElement('a')
    const url = `https://www.google.com/maps/search/${location.fr.address}`
    link.setAttribute('href', url)
    link.setAttribute('target', '_blank')
    link.setAttribute('rel', 'noopener noreferrer')
    link.click()
  }
  compareDist (a, b) {
    if (!this.state.searchCoords) return 0
    return this.filter(a) > this.filter(b) ? 1 : -1
  }
  render () {
    return (
      <div id='maps'>
        {!this.state.isNav &&
          <Button
            className='open'
            faClass='far fa-search'
            onClick={() => this.setState({ isNav: true })}
          />
        }
        {this.state.isNav &&
          <div className='location-nav'>
            <Button
              className='close'
              faClass='fas fa-times'
              onClick={() => this.setState({ isNav: false })}
            >Close Navigation</Button>
            <Input
              value={this.state.searchVal}
              onChange={(searchVal) => this.setState({ searchVal })}
              onEnterKey={() => this.setSearch()}
              onOptionChange={(searchDist) => this.setState({ searchDist })}
              rightList={Object.keys(dist())}
              rightValue={dist(this.state.searchDist)}
              outputList={Object.values(dist())}
              placeholder={this.props.global.say.searchMapPlaceholder}
            />
            <Button
              faClass='fas fa-bullseye-arrow'
              onClick={this.setToCurrentLocation}
            >
              {this.props.global.say.getCurrentLocation}
            </Button>
            <div className='list'>
              {this.props.global.locationList.sort(this.compareDist).map(location => {
                const dist = this.filter(location)
                if (dist === false) return null
                else {
                  return (
                    <div
                      key={location._id}
                      className='item'
                      onClick={() => {
                        this.map.setCenter(location)
                        this.map.setZoom(14)
                        if (window.innerWidth <= 760) this.setState({ isNav: false })
                      }}
                    >
                      <i className='fas fa-map-pin' />
                      <div className='text'>
                        <h4>{location[this.props.global.lang].description}</h4>
                        <p>{location[this.props.global.lang].address}</p>
                        {dist !== true && <span>{dist} Km</span>}
                      </div>
                      <div className='options'>
                        <i
                          className='fas fa-copy'
                          onClick={(evt) => this.copyAdress(evt, location)}
                        ><Tooltip noHover>{this.props.global.say.copy}</Tooltip></i>
                        <i
                          className='fas fa-map-marked-alt'
                          onClick={(evt) => this.goToGoogleMaps(evt, location)}
                        ><Tooltip noHover>{this.props.global.say.seeInMaps}</Tooltip></i>
                      </div>
                    </div>
                  )
                }
              })}
            </div>
          </div>
        }
        <div id='google-maps' />
      </div>
    )
  }
}
const dist = (key) => {
  const obj = {
    1: '1 km',
    2: '2 km',
    3: '3 km',
    5: '5 km',
    10: '10 km',
    20: '20 km',
    50: '50 km',
    Infinity: '50+ km'
  }
  if (key) return obj[key]
  else return obj
}

function distance (lat1, lon1, lat2, lon2, unit) {
  if ((lat1 === lat2) && (lon1 === lon2)) {
    return 0
  } else {
    var radlat1 = Math.PI * lat1 / 180
    var radlat2 = Math.PI * lat2 / 180
    var theta = lon1 - lon2
    var radtheta = Math.PI * theta / 180
    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta)
    if (dist > 1) {
      dist = 1
    }
    dist = Math.acos(dist)
    dist = dist * 180 / Math.PI
    dist = dist * 60 * 1.1515
    if (unit === 'K') { dist = dist * 1.609344 }
    if (unit === 'N') { dist = dist * 0.8684 }
    return Math.round(dist)
  }
}
