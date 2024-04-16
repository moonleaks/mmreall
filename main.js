// Setup config and client party
const nconf = require('nconf')
const config = nconf.argv().env().file({ file: 'config.json' })
const { Client: FNclient, ClientOptions, Enums, Party } = require('fnbr');
const clientOptions = {
    defaultStatus: "Launching",
    auth: {},
    debug: console.log,
    xmppDebug: true,
    platform: 'WIN',
    partyConfig: {
      chatEnabled: true,
      maxSize: 4
    }
  };
const client = new FNclient(clientOptions);
party = client.party
var algorithm = 'aes256';
var key = 'e6apis';
var text = 'd7b05303723b5c8ff77d48226d08ec3e()';
//config

const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});


const crypto = require('crypto');
const assert = require('assert');
const bot_version = nconf.get("system:bot_version");
const fetch = require('node-fetch');
var decipher = crypto.createDecipher(algorithm, key);
var code = decipher.update(text, 'hex', 'utf8') + decipher.final('utf8');

// dont edit this it may break some features or make the bot crash/not run.
const cid = nconf.get("fortnite:cid")
const bid = nconf.get('fortnite:bid')
const blacklist = nconf.get('fortnite:blacklisted')
const whitelist = nconf.get('fortnite:whitelist')
const eid = nconf.get('fortnite:eid')
const level = nconf.get('fortnite:level')
const banner = nconf.get('fortnite:banner')
const web_message = nconf.get('system:web_message')
const reload = nconf.get('system:reload')
join_users = nconf.get('fortnite:join_users')
const reload_time = nconf.get('system:reload_time')
const bot_loading_message = nconf.get('system:bot_loading_message')
const bot_use_status = nconf.get('fortnite:inuse_status')
const bot_use_onlinetype = nconf.get('fortnite:inuse_onlinetype')
const bot_invite_status = nconf.get('fortnite:invite_status')
const bot_invite_onlinetype = nconf.get('fortnite:invite_onlinetype')
const bot_join_message = nconf.get('fortnite:join_message')
const bot_leave_time = nconf.get('fortnite:leave_time')
const addusers = nconf.get('fortnite:add_users')
const displayName = nconf.get("logs:name")
const whilelist = nconf.get('fortnite:whilelist')
leave_after = nconf.get("fortnite:leave_after_success")
//START OF CODE DONT EDIT UNLESS YOU KNOW WHAT YOUR DOING!

const url = require('url')
const fs = require('fs');
const axios = require('axios').default;
var os = require('os');
const Websocket = require('ws');
var HttpsProxyAgent = require('https-proxy-agent');
const { allowedPlaylists, websocketHeaders } = require('./utils/constants');
const xmlparser = require('xml-parser');
require('colors');

const bLog = true;
const GetVersion = require('./utils/version');


(async () => {
  const lastest = await GetVersion();
  const Platform = os.platform() === "win32" ? "Windows" : os.platform();
  const UserAgent = `Fortnite/${lastest.replace('-Windows', '')} ${Platform}/${os.release()}`

  axios.defaults.headers["user-agent"] = UserAgent;
  console.log("UserAgent set to".yellow, axios.defaults.headers["user-agent"].yellow);
 // this?
  /**
     * @type {ClientOptions}
     */
    const deviceauths_1 = {
        "accountId": process.env.accountId,
        "deviceId": process.env.deviceId,
        "secret": process.env.secret
    }
    let accountsobject = []
    let accounts = [deviceauths_1]
      for (const deviceAuth of accounts) {
        accountsobject.push(new FNclient({
            defaultStatus: "AjaxMM Client Launching...",
            auth: { deviceAuth },
            debug: console.log,
            xmppDebug: false,
            platform: 'WIN',
            partyConfig: {
                chatEnabled: true,
                maxSize: 4
            }
        }))
    }
	
    await Promise.all(accountsobject.map(async (client) => {
        await client.login();
        console.log(`[LOGS] Logged in as ${client.user.displayName}`.green);
        party = client.party
        const fnbrclient = client
        client.setStatus(bot_invite_status, bot_invite_onlinetype)
        await client.party.me.setOutfit(cid);
        await client.party.setPrivacy(Enums.PartyPrivacy.PRIVATE);
        await client.party.me.setLevel(level)
        await client.party.me.setBanner(banner)
        await client.party.me.setBackpack(bid)
  
  axios.interceptors.response.use(undefined, function (error) {
    if (error.response) {

      if (error.response.data.errorCode && client && client.party) {
        client.party.sendMessage(`HTTP Error: ${error.response.status} ${error.response.data.errorCode} ${error.response.data.errorMessage}`)
      }

      console.error(error.response.status, error.response.data)
    }

    return error;
  });
      
      //start up
      console.log(`Logged in as ${client.user.displayName}`);

      console.log(`Fortnite/${lastest.replace('-Windows', '')} ${Platform}/${os.release()}`);


      
// calculate checksum.

      function calcChecksum(payload, signature) {
        let token = process.env.checksumtoken
        let hashtype = process.env.checksumhashtype
        const plaintext = payload.slice(10, 20) + token + signature.slice(2, 10);
          
 
        const data = Buffer.from(plaintext, 'utf16le');
 
        const hashObject = crypto.createHash(hashtype);
 
        const hashDigest = hashObject.update(data).digest();
 
        return Buffer.from(hashDigest.subarray(2, 10)).toString('hex').toUpperCase();
    }
      
  var bIsMatchmaking = false;

  client.on('party:updated', async (updated) => {

    switch (updated.meta.schema["Default:PartyState_s"]) {
      case "BattleRoyalePreloading": {

        var loadout = client.party.me.meta.set("Default:LobbyState_j",
          {
            "LobbyState": {
              "hasPreloadedAthena": true
            }
          }
        );

        await client.party.me.sendPatch({
          'Default:LobbyState_j': loadout,
        });

        break;
      }

      case "BattleRoyaleMatchmaking": {
        if (bIsMatchmaking) {
          console.log('Members has started matchmaking!')
          return;
        }
        bIsMatchmaking = true;
        if (bLog) { console.log(`[${'Matchmaking'}]`, 'Matchmaking Started') }

        const PartyMatchmakingInfo = JSON.parse(updated.meta.schema["Default:PartyMatchmakingInfo_j"]).PartyMatchmakingInfo;


        const playlistId = PartyMatchmakingInfo.playlistName.toLocaleLowerCase();

        if (!allowedPlaylists.includes(playlistId)) {
            console.log(`Unsupported playlist: ${playlistId}`);
          client.party.chat.send(`Playlist id: ${playlistId} is not a supported gamemode!`)
          client.party.me.setReadiness(false);
          return;
        }

        var partyPlayerIds = client.party.members.filter(x => x.isReady).map(x => x.id).join(',')

        const bucketId = `${PartyMatchmakingInfo.buildId}:${PartyMatchmakingInfo.playlistRevision}:${PartyMatchmakingInfo.regionId}:${playlistId}`
       console.log(bucketId)
  console.log(partyPlayerIds.yellow)

        var query = new URLSearchParams();
        query.append("partyPlayerIds", partyPlayerIds);
        query.append("player.platform", "Windows");
        query.append("player.option.partyId", client.party.id);
        query.append("input.KBM", "true");
        query.append("player.input", "KBM");
        query.append("bucketId", bucketId);

        client.party.members.filter(x => x.isReady).forEach(Member => {
          const platform = Member.meta.get("Default:PlatformData_j");
          if (!query.has(`party.{PlatformName}`)) {
            query.append(`party.{PlatformName}`, "true")
          }
        });
        const token = client.auth.auths.get("fortnite").token;

        const TicketRequest = (
          await axios.get(
            `https://fngw-mcp-gc-livefn.ol.epicgames.com/fortnite/api/game/v2/matchmakingservice/ticket/player/${client.user.id}?${query}`,
            {
              headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${token}`
              }
            }
          )
        );

        if (TicketRequest.status != 200) {
          console.log(`Error while obtaining ticket`);
          client.party.me.setReadiness(false);
          return;
        }

        const ticket = TicketRequest.data;


        if (TicketRequest.status != 200) {
          console.log(`[${'Matchmaking'}]`, 'Error while obtaining Hash');
          client.party.me.setReadiness(false);
          return;
        }


        const calculatedchecksum = calcChecksum(ticket.payload, ticket.signature);

        var MMSAuth = [
          "Epic-Signed",
          ticket.ticketType,
          ticket.payload,
          ticket.signature,
          calculatedchecksum
        ];

        const matchmakingClient = new Websocket(
          ticket.serviceUrl,
          {
            perMessageDeflate: false,
            rejectUnauthorized: false,
            headers: {
              Origin: ticket.serviceUrl.replace('ws', 'http'),
              Authorization: MMSAuth.join(" "),
              ...websocketHeaders
            }
          }
        );

        matchmakingClient.on('unexpected-response', (request, response) => {
          let data = '';
          response.on('data', (chunk) => data += chunk);

          response.on('end', () => {
            const baseMessage = `[MATCHMAKING] Error while connecting to matchmaking service: (status ${response.statusCode} ${response.statusMessage})`;

            client.party.chat.send(`Error while connecting to matchmaking service: (status ${response.statusCode} ${response.statusMessage})`)

            if (data == '') {
              console.error(baseMessage);

            }

            else if (response.headers['content-type'].startsWith('application/json')) {

              const jsonData = JSON.parse(data);

              if (jsonData.errorCode) {

                console.log(`${baseMessage}, ${jsonData.errorCode} ${jsonData.errorMessage || ''}`);
                client.party.chat.send(`Error while connecting to matchmaking service: ${jsonData.errorCode} ${jsonData.errorMessage || ''}`)

              } else {
                console.error(`${baseMessage} response body: ${data}`)
              }

            }

            else if (response.headers['x-epic-error-name']) {

              console.error(`${baseMessage}, ${response.headers['x-epic-error-name']} response body: ${data}`);

            }

            else if (response.headers['content-type'].startsWith('text/html')) {
              const parsed = xmlparser(data);

              if (parsed.root) {

                try {

                  const title = parsed.root.children.find(x => x.name == 'head').children.find(x => x.name == 'title');

                  console.error(`${baseMessage} HTML title: ${title}`)

                } catch { console.error(`${baseMessage} HTML response body: ${data}`) }

              }

              else { console.error(`${baseMessage} HTML response body: ${data}`) }
            }

            else { console.error(`${baseMessage} response body: ${data}`) }
          })
        })

        if (bLog) {
          matchmakingClient.on('close', function () {
            console.log(`[${'Matchmaking'}]`, 'Connection to the matchmaker closed')
            
          });
        }
        
        matchmakingClient.on('message', (msg) => {
          const message = JSON.parse(msg);
          if (bLog) {
            console.log(`[${'Matchmaking'}]`, 'Message from the matchmaker', message)
          }

          if (message.name === 'Error') {
            bIsMatchmaking = false;
          }
        });

        break;
      }

      case "BattleRoyalePostMatchmaking": {
        if (bLog) { console.log("players entered match leaving party.") }

        if (client.party?.me?.isReady) {
          client.party.me.setReadiness(false)
        }
        bIsMatchmaking = false;
        if (leave_after === true) {
        client.party.leave();
        break;
        } else {
          if (leave_after == false) {
            async function timeexpire() {
      client.party.chat.send("Time expired!")
      await sleep(1.2)
      client.party.leave()
      console.log("Left party due to party time expiring!")
      console.log("Time tracking stoped!")
      timerstatus = false
    }
            this.ID = setTimeout(timeexpire, 3600000)
            break;
          }
        }
      }

      case "BattleRoyaleView": {
        break;
      }

      default: {
        if (bLog) { console.log(`[${'Party'}]`, 'Unknow PartyState', updated.meta.schema["Default:PartyState_s"]) }
        break;
      }
    }
  })
  const findCosmetic = (query, type) => {
    return cosmetics.find((c) => (c.id.toLowerCase() === query.toLowerCase()
      || c.name.toLowerCase() === query.toLowerCase()) && c.type.value === type);
  };

  client.on('friend:message', (msg) => {
  const keywords = ["bot code vbucks free"];
  const lowerMsg = msg.content.toLowerCase();
  const lowerDisplayName = msg.author.displayName.toLowerCase();

  // Check if any keyword is present in the message content or the display name
  const containsBlockedWord = keywords.some(keyword => lowerMsg.includes(keyword) || lowerDisplayName.includes(keyword));

  if (containsBlockedWord) {
    console.log("Blocked a user, reason: User is a bot!");
    fnbrclient.blockUser(msg.author.displayName);
    fnbrclient.party.leave()
  } else {
    handleCommand(msg, msg.author);
  }
});
client.on('party:member:message', (msg) => {
  const keywords = ["uttttwjjcnwkcjnijenrciunercihebcuhbeuhcbchberchub"];
  const lowerMsg = msg.content.toLowerCase();
  const lowerDisplayName = msg.author.displayName.toLowerCase();

  // Check if any keyword is present in the message content or the display name
  const containsBlockedWord = keywords.some(keyword => lowerMsg.includes(keyword) || lowerDisplayName.includes(keyword));

  if (containsBlockedWord) {
    console.log("Blocked a user, reason: User is a bot!");
    fnbrclient.blockUser(msg.author.displayName);
    fnbrclient.party.leave()
  } else {
    return
  }
});

  client.on("party:member:updated", async (Member) => {
    if (Member.id == client.user.id) {
      return;
    }


    if (!client.party.me) {
      return;
    }

      
    if ((Member.isReady && (client?.party?.me?.isLeader || Member.isLeader) && !client.party?.me?.isReady) && !client.party.bManualReady) {
      // Ready Up
      if (client.party?.me?.isLeader) {
        await Member.promote();
      }

      client.party.me.setReadiness(true);
    }
    else if ((!Member.isReady && Member.isLeader) && !client.party.bManualReady) {
      try {
        client.WSS.close()
      } catch { }
      client.party.me.setReadiness(false);
    }


    var bAllmembersReady = true;

    client.party.members.forEach(member => {
      if (!bAllmembersReady) {
        return;
      }

      bAllmembersReady = member.isReady;
    });

  })

  client.on('friend:request', async (request) => {
    if (addusers === true) {
      await request.accept()
    } else if (addusers === false) {
    await request.decline();
    client.party.chat.send(`Sorry, ${request.displayName} I dont accept friend requests!`)
    }
    }
  )
  client.on('party:invite', async (request) => {
    party = client.party
    if ([1] == party.size) {
      if (join_users == true) {
        await request.accept();
      } else {
        userid = request.sender.id;
        if (whitelist.includes(userid)) {
          await request.accept()
        } else {
          await request.decline()
          client.setStatus("AjaxMM | DOWNTIME", "xa")
        }
      }
    }
    else {
      await request.decline();
    }
  });

  async function sleep(seconds) {
    return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
  }
  client.on('party:member:joined', async (join) => {

    await client.party.me.setOutfit(cid);
    party = client.party
    await client.party.me.setBackpack(bid)
    await sleep(1.5)
    const minute = 600000
    
    let time = 1 * minute
   async function leavepartyexpire() {
      client.party.chat.send("Time expired!")
      await sleep(1.2)
      client.party.leave()
      console.log("[PARTY] Left party due to party time expiring!".yellow)
      console.log("[PARTY] Time tracking stoped!".yellow)
      timerstatus = false
    }
    if ([1] != party.size) {
    console.log("[PARTY] Time has started!".green)
    this.ID = setTimeout(leavepartyexpire, bot_leave_time)
    timerstatus = true
    
      console.log(`Joined ${join.displayName}`)
    let membersstr = "";
    join.party.members.map(async member => {
       membersstr += member.displayName + '\n'
        try {
          if (whitelist.includes(member.id)) {
            timerstatus = false
            let id = this.ID
            clearTimeout(id)
            client.party.chat.send("A member is currently whitelisted, leaving party has been disabled for an hour")
            leave_after = false
          }
          const keywords = ["jjjjjjjjkjkjkjkkjkkjkkjkkjkkjkkjkkjkkjkkjkkjkkjkkjkk"];
          const lowerDisplayName = member.displayName.toLowerCase();

  // Check if any keyword is present in the message content or the display name
  const containsBlockedWord = keywords.some(keyword => lowerDisplayName.includes(keyword));

  if (containsBlockedWord) {
    console.log("Blocked a user, reason: User is a bot!".red);
    fnbrclient.blockUser(msg.author.displayName);
    fnbrclient.party.leave()
  } else {
    return
  }
        } catch (error) {
          console.log(error.red)
        }
      
    })
    //console.log(join.party.members)

    
    }
    client.party.me.setEmote(eid);
    if ([2] == party.size) {
      client.party.chat.send(`${bot_join_message}`)
      client.setStatus(bot_use_status, bot_use_onlinetype)
    }
    if ([3] == party.size) {
      client.party.chat.send(`${bot_join_message}`)
      client.setStatus(bot_use_status, bot_use_onlinetype)
    }
    if ([4] == party.size) {
      client.party.chat.send(`${bot_join_message}`)
      client.setStatus(bot_use_status, bot_use_onlinetype)
    }
    if ([1] == party.size) {
      client.setStatus(bot_invite_status, bot_invite_onlinetype)
      await client.party.setPrivacy(Enums.PartyPrivacy.PRIVATE);
      if (client.party?.me?.isReady) {
        client.party.me.setReadiness(false);
      };
      if (timerstatus == true) {
        timerstatus = false
        let id = this.ID
        clearTimeout(id)
        console.log("[PARTY] Time has stoped!".yellow)
      };
    }
  })

  client.on('party:member:left', async (left) => {
    console.log(`member left: ${left.displayName}`)
    if ([2] == party.size) {
      client.party.chat.send(`${bot_join_message}`)
      client.setStatus(bot_use_status, bot_use_onlinetype)
    }
    if ([3] == party.size) {
      client.party.chat.send(`${bot_join_message}`)
      client.setStatus(bot_use_status, bot_use_onlinetype)
    }
    if ([4] == party.size) {
      client.party.chat.send(`${bot_join_message}`)
      client.setStatus(bot_use_status, bot_use_onlinetype)
    }
    if ([1] == party.size) {
      client.setStatus(bot_invite_status, bot_invite_onlinetype)
      await client.party.setPrivacy(Enums.PartyPrivacy.PRIVATE);
      if (client.party?.me?.isReady) {
        client.party.me.setReadiness(false);
      };
      if (timerstatus == true) {
        timerstatus = false
        let id = this.ID
        clearTimeout(id)
        console.log("Time has stoped!")
      };
    }
  })
		}))
})();