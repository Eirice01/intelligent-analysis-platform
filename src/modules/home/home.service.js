import axios from 'axios'
export const queInitTroop = () => axios.get("/api/enemy/initset/queInitTroop",{ headers: {'use-mock-service': false} })
export const troopsinfoForMap = () => axios.get("/api/enemy/troopsinfo/troopsinfoForMap",{ headers: {'use-mock-service': false} })

export const capabilityAnalysis = (armyno) => axios.get(`/api/capability/latestRatio/${armyno}`,{ headers: {'use-mock-service': false} })
export const latestTrainInfo = (armyno) => axios.get(`/api/train/latestTrainInfo/${armyno}`,{ headers: {'use-mock-service': false} })
export const getEquipStatus = (params) => axios.get(`/api/status/getStatus`,{ params, headers: {'use-mock-service': false} })
export const getTroopLocation = () => axios.get("/api/enemy/troopsinfo/location",{ headers: {'use-mock-service': false} })
export const HomeTroopsinfo = (params) => axios.get("/api/enemy/troopsinfo/HomeTroopsinfo",{ params, headers: {'use-mock-service': false} })
export const getRyxxByMaxJz = (params) => axios.get("/api/enemy/personnelinfo/getRyxxByMaxJz",{ params, headers: {'use-mock-service': false} })



