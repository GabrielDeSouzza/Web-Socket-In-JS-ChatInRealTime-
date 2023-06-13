import { HttpServer } from "./HttpServer";
import './WebsocketServer'
import '../jobs/removeLocalUploads'


HttpServer.listen(3000)

