import _ from 'underscore';

import SIM from './SIM';
import Network from './Network';
import WAN from './WAN';
import Usage from './Usage';
import Tr069 from './Tr069';
import IpFilter from './IpFilter';
import Wlan from './Wlan';
import System from './System';
import ParentalControl from './ParentalControl';
import Firewall from './Firewall.js';
import Qos from './Qos.js';
import Ddns from './Ddns.js';
var api = {}
_.extend(api,SIM,Network,WAN,Usage,Tr069,IpFilter,Wlan,System,ParentalControl,Firewall,Qos,Ddns);
export default api
