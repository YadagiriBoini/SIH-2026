import math


# ============================================================
# HAVERSINE DISTANCE
# ============================================================

def haversine_distance(
    lat1,
    lon1,
    lat2,
    lon2
):
    """
    Calculate distance between two
    latitude/longitude points.

    Returns distance in kilometers.
    """

    R = 6371.0

    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)

    lat1 = math.radians(lat1)
    lat2 = math.radians(lat2)

    a = (
        math.sin(dlat / 2) ** 2
        +
        math.cos(lat1)
        *
        math.cos(lat2)
        *
        math.sin(dlon / 2) ** 2
    )

    c = 2 * math.atan2(
        math.sqrt(a),
        math.sqrt(1 - a)
    )

    return R * c


# ============================================================
# FIND NEARBY VESSELS
# ============================================================

def find_nearby_vessels(
    vessels,
    latitude,
    longitude,
    radius_km=50
):
    """
    Find AIS vessels within a specified
    radius of the observation location.
    """

    nearby = []

    for vessel in vessels:

        vessel_lat = vessel.get(
            "latitude"
        )

        vessel_lon = vessel.get(
            "longitude"
        )

        if vessel_lat is None or vessel_lon is None:
            continue

        distance = haversine_distance(
            latitude,
            longitude,
            vessel_lat,
            vessel_lon
        )

        if distance <= radius_km:

            vessel_copy = vessel.copy()

            vessel_copy["distance_km"] = round(
                distance,
                2
            )

            nearby.append(
                vessel_copy
            )

    nearby.sort(
        key=lambda x: x["distance_km"]
    )

    return nearby


# ============================================================
# DEMO AIS DATA
# ============================================================

def get_demo_vessels():

    return [

        {
            "mmsi": "123456789",
            "name": "DEMO TANKER 01",
            "type": "Tanker",
            "latitude": 17.55,
            "longitude": 78.52,
            "speed": 12.4,
            "course": 135
        },

        {
            "mmsi": "987654321",
            "name": "DEMO CARGO 01",
            "type": "Cargo",
            "latitude": 17.62,
            "longitude": 78.60,
            "speed": 9.8,
            "course": 220
        },

        {
            "mmsi": "555666777",
            "name": "DEMO TANKER 02",
            "type": "Tanker",
            "latitude": 18.10,
            "longitude": 79.10,
            "speed": 14.2,
            "course": 80
        }
    ]
