import AsyncStorage from "@react-native-async-storage/async-storage";

class WaypointList {
  constructor(waypoints) {
    this.waypoints = waypoints ? waypoints : [];
  }

  /**
   *
   * @param {waypoint object} waypoint
   */
  addWayPoint(waypoint) {
    console.log("waypoints: " + JSON.stringify(this.waypoints));
    this.waypoints.push(waypoint);
  }

  /**
   *
   * @param {number} index index of waypoint in waypoint list
   */
  removeWayPoint(index) {
    this.waypoints.splice(index, 1);
  }

  /**
   *
   * @returns total distance in miles
   */
  calcTotalDistance() {
    let totDistance = 0;
    for (let i = 0; i < this.waypoints.length - 1; i++) {
      totDistance += this.waypoints[i].calcDistance(this.waypoints[i + 1]);
    }
    return totDistance;
  }

  /**
   *
   * @param {number} distance distance in miles
   * @param {number} time total time in milliseconds
   * @returns miles per hour
   */
  calcSpeed(distance, time) {
    let hours = time * 0.0000027777777778;
    return distance / hours;
  }

  toLineCoordinates() {
    let coords = [];
    this.waypoints.forEach((waypoint) => {
      coords.push({ latitude: waypoint.lat, longitude: waypoint.long });
    });
    return coords;
  }

  calcCarbon(distance, carbon) {
    return 1.60934 * distance * carbon;
  }

  static getAllLists() {
    return new Promise(async (resolve, reject) => {
      try {
        let routes = await AsyncStorage.getItem("routes");
        if (routes) {
          let routesParsed = JSON.parse(routes);
          let convertLists = routesParsed.map((item) => new WaypointList(item));
          resolve(convertLists);
        }
      } catch (err) {
        console.log(err);
      }
    });
  }

  saveList() {
    return new Promise(async (resolve, reject) => {
      try {
        let routes = await AsyncStorage.getItem("routes");
        if (routes) {
          let routesParsed = JSON.parse(routes);
          routesParsed.push(this.waypoints);
          let routesString = JSON.stringify(routesParsed);
          await AsyncStorage.setItem("routes", routesString);
          resolve(routesParsed);
        } else {
          let routesParsed = [this.waypoints];
          let routesString = JSON.stringify(routesParsed);
          await AsyncStorage.setItem("routes", routesString);
          resolve(routesParsed);
        }
      } catch (err) {
        console.log(err);
      }
    });
  }
}

export default WaypointList;
