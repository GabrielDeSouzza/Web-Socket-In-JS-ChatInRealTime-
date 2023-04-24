import { httpServer } from "./http";
import './websocket'
import '../jobs/removeLocalUploads'
httpServer.listen(3401)