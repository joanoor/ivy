import { http } from '@/utils/http'

enum API {
  INVERSE_GEOCODING = `https://restapi.amap.com/v3/geocode/geo?key=1fa4c84e850a8ce091feb079a5c744ca`,
}

export const inverseGeocoding = params => {
  http.get({
    url: API.INVERSE_GEOCODING,
    params,
  })
}
