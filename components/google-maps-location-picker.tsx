"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { MapPin, Loader2, Search } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { useTranslation } from "@/lib/i18n/translations"

export interface LocationData {
    address: string
    latitude: number
    longitude: number
    placeId?: string
    formattedAddress?: string
}

interface GoogleMapsLocationPickerProps {
    value: LocationData | null
    onChange: (location: LocationData) => void
    label?: string
    placeholder?: string
    apiKey?: string
}

export function GoogleMapsLocationPicker({
    value,
    onChange,
    label,
    placeholder,
    apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
}: GoogleMapsLocationPickerProps) {
    const { language } = useLanguage()
    const t: any = useTranslation(language)
    
    // Use translated defaults if props not provided
    const displayLabel = label || t.projectLocation
    const displayPlaceholder = placeholder || t.searchLocation

    const [searchInput, setSearchInput] = useState(value?.address || "")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string>("")
    const [suggestions, setSuggestions] = useState<any[]>([])
    const [showSuggestions, setShowSuggestions] = useState(false)
    const autocompleteServiceRef = useRef<any>(null)
    const placesServiceRef = useRef<any>(null)
    const mapContainerRef = useRef<HTMLDivElement>(null)
    const mapRef = useRef<any>(null)
    const markerRef = useRef<any>(null)

    // Initialize Google Maps API & map instance
    useEffect(() => {
        if (!apiKey) {
            console.warn("Google Maps API key not configured. Set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY")
            return
        }

        const loadGoogleMapsAPI = () => {
            if ((window as any).google?.maps?.places) {
                autocompleteServiceRef.current = new (window as any).google.maps.places.AutocompleteService()
                placesServiceRef.current = new (window as any).google.maps.places.PlacesService(
                    document.createElement("div"),
                )

                // create map once maps library is ready
                if (mapContainerRef.current && !mapRef.current) {
                    mapRef.current = new (window as any).google.maps.Map(mapContainerRef.current, {
                        center: { lat: 0, lng: 0 },
                        zoom: 2,
                    })
                    mapRef.current.addListener("click", (e: any) => {
                        const lat = e.latLng.lat()
                        const lng = e.latLng.lng()
                        handleMapClick(lat, lng)
                    })
                }
                return
            }

            const script = document.createElement("script")
            script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`
            script.async = true
            script.onload = () => {
                if ((window as any).google?.maps?.places) {
                    autocompleteServiceRef.current = new (window as any).google.maps.places.AutocompleteService()
                    placesServiceRef.current = new (window as any).google.maps.places.PlacesService(
                        document.createElement("div"),
                    )
                    if (mapContainerRef.current && !mapRef.current) {
                        mapRef.current = new (window as any).google.maps.Map(mapContainerRef.current, {
                            center: { lat: 0, lng: 0 },
                            zoom: 2,
                        })
                        mapRef.current.addListener("click", (e: any) => {
                            const lat = e.latLng.lat()
                            const lng = e.latLng.lng()
                            handleMapClick(lat, lng)
                        })
                    }
                }
            }
            document.head.appendChild(script)
        }

        loadGoogleMapsAPI()
    }, [apiKey])

    // update map/marker when external value changes
    useEffect(() => {
        if (value && value.latitude && value.longitude) {
            updateLocationOnMap(value.latitude, value.longitude)
        }
    }, [value])

    // helper: set marker & center map
    const updateLocationOnMap = (lat: number, lng: number) => {
        if (!mapRef.current) return
        const position = new (window as any).google.maps.LatLng(lat, lng)
        mapRef.current.setCenter(position)
        mapRef.current.setZoom(14)
        if (!markerRef.current) {
            markerRef.current = new (window as any).google.maps.Marker({
                map: mapRef.current,
                position,
                draggable: false,
            })
        } else {
            markerRef.current.setPosition(position)
        }
    }

    // helper: when user clicks on map
    const handleMapClick = async (lat: number, lng: number) => {
        setIsLoading(true)
        setError("")
        updateLocationOnMap(lat, lng)
        try {
            const response = await fetch(
                `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`,
            )
            const data = await response.json()
            if (data.results && data.results.length > 0) {
                const result = data.results[0]
                const locationData: LocationData = {
                    address: result.formatted_address,
                    latitude: lat,
                    longitude: lng,
                    formattedAddress: result.formatted_address,
                }
                setSearchInput(result.formatted_address)
                onChange(locationData)
            } else {
                onChange({ address: `${lat.toFixed(4)}, ${lng.toFixed(4)}`, latitude: lat, longitude: lng })
            }
        } catch (err) {
            console.error("Reverse geocode map click error:", err)
            onChange({ address: `${lat.toFixed(4)}, ${lng.toFixed(4)}`, latitude: lat, longitude: lng })
        }
        setIsLoading(false)
    }

    // geocode a free-form address string to coordinates
    const geocodeAddress = async (address: string) => {
        if (!address || !apiKey) return null
        try {
            const response = await fetch(
                `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
                    address,
                )}&key=${apiKey}`,
            )
            const data = await response.json()
            if (data.results && data.results.length > 0) {
                const r = data.results[0]
                return {
                    lat: r.geometry.location.lat,
                    lng: r.geometry.location.lng,
                    formatted: r.formatted_address,
                }
            }
        } catch (err) {
            console.error("Geocode error:", err)
        }
        return null
    }

    // Get autocomplete suggestions
    const handleSearchChange = async (inputValue: string) => {
        setSearchInput(inputValue)
        setError("")

        if (!inputValue || inputValue.length < 2) {
            setSuggestions([])
            setShowSuggestions(false)
            return
        }

        if (!autocompleteServiceRef.current) {
            // service not ready yet – just ignore suggestions and keep the input value
            // we'll still allow fallback on blur/enter to propagate the raw address
            return
        }

        try {
            const predictions = await autocompleteServiceRef.current.getPlacePredictions({
                input: inputValue,
                types: ["geocode"],
                fields: ["place_id", "description", "geometry"],
            })

            setSuggestions(predictions.predictions || [])
            setShowSuggestions(true)
        } catch (err: any) {
            setError("Failed to fetch location suggestions")
            console.error("Autocomplete error:", err)
        }
    }

    // Get place details and coordinates
    const handleSelectPlace = async (placeId: string, description: string) => {
        setIsLoading(true)
        setError("")

        try {
            if (!placesServiceRef.current) throw new Error("Places service not available")

            const request = {
                placeId,
                fields: ["name", "formatted_address", "geometry", "place_id"],
            }

            placesServiceRef.current.getDetails(request, (place: any, status: any) => {
                if (status === (window as any).google.maps.places.PlacesServiceStatus.OK && place) {
                    const lat = place.geometry.location.lat()
                    const lng = place.geometry.location.lng()
                    const locationData: LocationData = {
                        address: description,
                        latitude: lat,
                        longitude: lng,
                        placeId: placeId,
                        formattedAddress: place.formatted_address,
                    }

                    updateLocationOnMap(lat, lng)
                    setSearchInput(description)
                    onChange(locationData)
                    setSuggestions([])
                    setShowSuggestions(false)
                } else {
                    setError("Could not retrieve location details")
                }
                setIsLoading(false)
            })
        } catch (err: any) {
            setError(err.message || "Failed to get location details")
            setIsLoading(false)
        }
    }

    // Get current user location
    const handleUseCurrentLocation = () => {
        setIsLoading(true)
        setError("")

        if (!navigator.geolocation) {
            setError("Geolocation not supported by your browser")
            setIsLoading(false)
            return
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude, accuracy } = position.coords
                console.log(`Location accuracy: ${accuracy} meters`)
                updateLocationOnMap(latitude, longitude)

                try {
                    // Reverse geocode with high precision
                    const response = await fetch(
                        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}&location_type=ROOFTOP`,
                    )
                    const data = await response.json()

                    if (data.results && data.results.length > 0) {
                        const result = data.results[0]
                        const locationData: LocationData = {
                            address: result.formatted_address,
                            latitude,
                            longitude,
                            formattedAddress: result.formatted_address,
                        }

                        setSearchInput(result.formatted_address)
                        onChange(locationData)
                    } else {
                        // Fallback to general reverse geocode if ROOFTOP fails
                        const fallbackResponse = await fetch(
                            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`,
                        )
                        const fallbackData = await fallbackResponse.json()
                        const result = fallbackData.results?.[0] || { formatted_address: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}` }
                        
                        const locationData: LocationData = {
                            address: result.formatted_address,
                            latitude,
                            longitude,
                            formattedAddress: result.formatted_address,
                        }
                        setSearchInput(result.formatted_address)
                        onChange(locationData)
                    }
                } catch (err) {
                    console.error("Reverse geocoding error:", err)
                    const locationData: LocationData = {
                        address: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
                        latitude,
                        longitude,
                    }
                    setSearchInput(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`)
                    onChange(locationData)
                }
                setIsLoading(false)
            },
            (err) => {
                setError(`Geolocation error: ${err.message}`)
                setIsLoading(false)
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        )
    }

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="location-search">{displayLabel}</Label>
                <div className="relative space-y-2">
                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground pointer-events-none" />
                            <Input
                                id="location-search"
                                type="text"
                                placeholder={displayPlaceholder}
                                value={searchInput}
                                onChange={(e) => handleSearchChange(e.target.value)}
                                onKeyDown={async (e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault()
                                        // try geocoding the raw input if no suggestion selected
                                        const geo = await geocodeAddress(searchInput)
                                        if (geo) {
                                            handleMapClick(geo.lat, geo.lng)
                                        } else if (searchInput) {
                                            // fallback to plain address only
                                            onChange({ address: searchInput, latitude: 0, longitude: 0 })
                                        }
                                    }
                                }}
                                onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                                onBlur={async () => {
                                    // geocode on blur if the user typed an address
                                    if (searchInput && (!value || searchInput !== value.address)) {
                                        const geo = await geocodeAddress(searchInput)
                                        if (geo) {
                                            handleMapClick(geo.lat, geo.lng)
                                        } else {
                                            onChange({ address: searchInput, latitude: 0, longitude: 0 })
                                        }
                                    }
                                }}
                                className="pl-10 h-11"
                                disabled={isLoading}
                            />
                        </div>
                        <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={handleUseCurrentLocation}
                            disabled={isLoading}
                            title={t.detectLocation}
                            className="h-11 w-11 flex-shrink-0"
                        >
                            {isLoading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <MapPin className="h-4 w-4" />
                            )}
                        </Button>
                    </div>

                    {isLoading && (
                        <p className="text-xs text-muted-foreground animate-pulse animate-in slide-in-from-top-1">
                            {t.gettingLocation}
                        </p>
                    )}

                    {/* Autocomplete Suggestions */}
                    {showSuggestions && suggestions.length > 0 && (
                        <Card className="absolute top-full left-0 right-0 z-50 border shadow-md">
                            <ul className="max-h-48 overflow-y-auto">
                                {suggestions.map((suggestion, index) => (
                                    <li
                                        key={`${suggestion.place_id}-${index}`}
                                        className="px-4 py-2 hover:bg-accent cursor-pointer border-b last:border-b-0"
                                        onClick={() =>
                                            handleSelectPlace(suggestion.place_id, suggestion.description)
                                        }
                                    >
                                        <div className="flex items-start gap-2">
                                            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium truncate">
                                                    {suggestion.description}
                                                </p>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </Card>
                    )}

                    {/* Error Message */}
                    {error && <p className="text-sm text-destructive">{error}</p>}

                    {/* Selected Location Display */}
                    {value && (
                        <Card className="p-4 bg-primary/5 rounded-lg border border-primary/10">
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-primary/10 rounded-full text-primary mt-1">
                                    <MapPin className="w-4 h-4" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-foreground">{t.locationPinpoint}</p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {t.locationAccuracyInfo}
                                    </p>
                                    <div className="mt-2 text-xs font-mono text-muted-foreground bg-background/50 p-1.5 rounded">
                                        📍 {value.latitude.toFixed(6)}, {value.longitude.toFixed(6)}
                                    </div>
                                    <p className="text-sm font-medium text-foreground mt-2">{value.address}</p>
                                </div>
                            </div>
                        </Card>
                    )}

                    {/* Map (clickable) */}
                    {(mapRef.current || autocompleteServiceRef.current) && (
                        <div
                            ref={mapContainerRef}
                            className="w-full h-48 rounded border border-border overflow-hidden shadow-inner"
                        />
                    )}
                </div>
            </div>
        </div>
    )
}
