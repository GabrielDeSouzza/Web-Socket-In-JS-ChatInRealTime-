import { HttpServer } from "./HttpServer";
import './WebsocketServer'
import '../jobs/RemoveLocalUploads'


HttpServer.listen(3000)

