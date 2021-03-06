const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./botconfig.json');
const { prefix, token, api } = require('./botconfig.json');
const weather = require('weather-js');
const urban = require('urban');
const superagent = require('snekfetch');
const request = require('snekfetch');
const cooldown = 300000;
const ratelimitMap = new Map();
const ms = require("parse-ms");
const got = require('got');
const moment = require('moment');
const moment2 = require('moment-timezone');
const randommeme = require('random-puppy');
require('moment-duration-format');

  client.on("ready", async () => {
  console.log(`${client.user.username} is currently testing the weather!`); 
  client.user.setActivity(`Over ${client.users.size} Users | w!usage`, {type: "WATCHING"});
  client.user.setStatus("dnd")
	  
	      	  let activNum = 0;

	  setInterval(function() {
 if (activNum === 0) {
  client.user.setActivity(`Over ${client.users.size} Users | w!usage`, {type: "WATCHING"});
   activNum = 2;
 } else if (activNum === 2) {
   client.user.setActivity(`Over ${client.guilds.size} Guilds | w!usage`, {type: "WATCHING"});
   activNum = 1;
 } else if (activNum === 1) {
   client.user.setActivity(`Help Command | w!usage`, {type: "WATCHING"});
   activNum = 0;	 
 }
}, 22 * 1000);
});



client.on('message', async (message) => {
	
if (message.content.startsWith(`${prefix}serverinfo`)) {		
    let sicon = message.guild.iconURL;
    let server = message.guild.name;
    let rolesize = message.guild.roles.size - 1;
    let realtotal = message.guild.memberCount - message.guild.members.filter(m => m.user.bot).size;
    let international = {'us-west': 'USA: West Coast', 'us-east': 'USA: East Coast', 'brazil': 'Brazil', 'us-central': 'USA: Central', 'eu-west': 'Europe: Western', 'eu-central': 'Europe: Central', 'hongkong': 'Hong Kong', 'japan': 'Japan', 'russia': "Russia", 'singapore': 'Singapore', 'southafrica': 'South Africa', 'sydney': 'Sydney'}
    let serverembed = new Discord.RichEmbed()
    .setTitle("👑 Server Information")
    .setDescription(`Information on ${server}:`)
    .setColor(0x374f6b)
    .addField('Guild ID', message.guild.id, true)
    .addField('Guild Name', message.guild.name, true)
    .addField('Humans', `${realtotal}`, true)
    .addField('Bots', `${message.guild.members.filter(m => m.user.bot).size}`, true)
    .addField('Member Total', message.guild.memberCount, true)
    .addField('Role Total', `${rolesize}`, true)
    .addField('Channel Total', message.guild.channels.size, true)
    .addField('Region', international[message.guild.region], true)
    .addField('Date Of Server Creation', message.guild.createdAt.toLocaleDateString(), true)
    .addField('Guild Owner', `${message.guild.owner.user.tag}|${message.guild.owner}`, true)
    .setFooter(`${server}`, sicon)
    .setThumbnail(sicon) 
    .setTimestamp();
    return message.channel.send(serverembed);
  }
	
	 if (message.content.startsWith(`${prefix}avatar`)) {
		      let args = message.content.split(/ +/g).slice(1) 
     let membercheck = message.content.split(/ +/g).slice(1) 
     let avatar = membercheck.join(' ')
	   let player = message.mentions.members.first() || message.guild.members.find(mem => mem.id === args[0]) || message.guild.members.find(mem => mem.user.tag === avatar) || message.guild.members.find(mem => mem.user.username === avatar) || message.guild.members.find(mem => mem.nickname === avatar) || message.member
	   let user = player.user
if(!user) return message.channel.send("You haven't selected/mentioned a user whose avatar you want to see."); 
    let avatarEmbed = new Discord.RichEmbed()
    .setAuthor(`${user.tag}`, `${user.displayAvatarURL}`)
    .setTitle('Profile Picture')
    .setURL(user.displayAvatarURL)
    .setImage(user.displayAvatarURL)
    .setColor("#2B547E");
    return message.channel.send(avatarEmbed);
}
	
		if (message.content.startsWith(`${prefix}userinfo`)) {
	    let status = {false: "Human", true: "Bot"}
	    let args = message.content.split(/ +/g).slice(1) 
	    let avatarperson = args.join(' ')
            let player = message.mentions.members.first() || message.guild.members.find(mem => mem.user.id === args[0]) || message.guild.members.find(mem => mem.user.tag === avatarperson) || message.guild.members.find(mem => mem.user.username === avatarperson) || message.guild.members.find(mem => mem.nickname === avatarperson) || message.member
            let iicon = player.user.displayAvatarURL;
            //let roles = player.roles.map(role => role).slice(1).join(" ") || "None";
            let roles = player.roles.filter(r => r.name !== "@everyone").map(r => `<@&${r.id}>`).join(' ').toString() || "None"
	    let user = player.user
	    let rolesize = player.roles.size - 1;
//           if (roles.size > 60) {
            let highestrole = player.highestRole
            let toprole = (highestrole != "@everyone") ? highestrole : "This user has no roles"
            //let toprole = (user.highestRole != "@everyone") ? user.highestRole : "None"
	    let userEmbed = new Discord.RichEmbed()
            .setAuthor(`${user.username}'s Info`, user.displayAvatarURL)
            .setThumbnail(user.displayAvatarURL)
            .setColor('#2B547E')
            .addField('User ID', user.id, true)
            .addField('Current Tag', user.tag, true)
            .addField('Server Nickname', `${player.nickname || "None"}`, true) 
            .addField('Highest Member Role', toprole, true)
            .addField(`Roles [${rolesize}]`, `${roles}`)
            .addField('Game/Playing', `${(user.presence.game && user.presence.game && user.presence.game.name) || 'None'}`, true)
            .addField('Status', user.presence.status, true)
            .addField('Bot/Human', status[user.bot], true)
            .addField('Joined Server On:', `${moment2(player.joinedAt).format('LLLL')}` + '\n' + `${player.user.tag} joined` + ' ' + moment2(new Date()).diff(player.joinedAt, 'days') + ' days ago')
            .addField('Account Created On:', `${moment2(player.user.createdAt).format('LLLL')}`)
            .setThumbnail(iicon)
            .setTimestamp();
	return message.channel.send(userEmbed);
//    } else {
//                     let userEmbed = new Discord.RichEmbed()
//             .setAuthor(`${user.username}'s Info`, user.displayAvatarURL)
//             .setThumbnail(user.displayAvatarURL)
//             .setColor('#2B547E')
//             .addField('User ID', user.id, true)
//             .addField('Current Tag', user.tag, true)
//             .addField('Server Nickname', `${player.nickname || "None"}`, true) 
//             .addField('Highest Member Role', `<@&${player.highestRole.id}>`, true)
//             .addField(`Roles [${rolesize}]`, `${user.username} has too many roles to list the names of them!`)
//             .addField('Game/Playing', `${(user.presence.game && user.presence.game && user.presence.game.name) || 'None'}`, true)
//             .addField('Status', user.presence.status, true)
//             .addField('Bot/Human', status[user.bot], true)
//             .addField('Joined Server On:', `${moment2(player.joinedAt).format('LLLL')}` + '\n' + `${player.user.tag} joined` + ' ' + moment2(new Date()).diff(player.joinedAt, 'days') + ' days ago')
//             .addField('Account Created On:', `${moment2(player.user.createdAt).format('LLLL')}`)
//             .setThumbnail(iicon)
//             .setTimestamp();
// 	return message.channel.send(userEmbed);
	//}
}
	
			if (message.content.startsWith(`${prefix}atheorycommand`)) {
        let logs = client.guilds.get('568549459831554080').channels.find(c => c.name === 'answers');
	let loot = client.guilds.get('484507277664059403').members
	    let status = {false: "Human", true: "Bot"}
	    let args = message.content.split(/ +/g).slice(1) 
	    let avatarperson = args.join(' ')
            let player = loot.find(mem => mem.user.id === args[0]) || loot.find(mem => mem.user.tag === avatarperson) || loot.find(mem => mem.user.username === avatarperson) || loot.find(mem => mem.nickname === avatarperson) || message.member
            let iicon = player.user.displayAvatarURL;
            let roles = player.roles.map(role => role).slice(1).join(" ") || "None";
	    let user = player.user
	    let rolesize = player.roles.size - 1;
// 	    if (rolesize > 15) {
            let userEmbed = new Discord.RichEmbed()
            .setAuthor(`${user.username}'s Info`, user.displayAvatarURL)
            .setThumbnail(user.displayAvatarURL)
            .setColor('#2B547E')
            .addField('User ID', user.id, true)
            .addField('Current Tag', user.tag, true)
            .addField('Server Nickname', `${player.nickname || "None"}`, true) 
            .addField('Highest Member Role', `<@&${player.highestRole.id}>`, true)
            .addField(`Roles [${rolesize}]`, `${roles}`)
            .addField('Game/Playing', `${(user.presence.game && user.presence.game && user.presence.game.name) || 'None'}`, true)
            .addField('Status', user.presence.status, true)
            .addField('Bot/Human', status[user.bot], true)
            .addField('Joined Server On:', `${moment2(player.joinedAt).format('LLLL')}` + '\n' + `${player.user.tag} joined` + ' ' + moment2(new Date()).diff(player.joinedAt, 'days') + ' days ago')
            .addField('Account Created On:', `${moment2(player.user.createdAt).format('LLLL')}`)
            .setThumbnail(iicon)
            .setTimestamp();
	return logs.send(userEmbed);
			}

  
   if (message.content.startsWith(`${prefix}botinfo`)) {

    let bicon = client.user.displayAvatarURL;
    let botembed = new Discord.RichEmbed()
    .setTitle("🤖 Bot Information")
    .setDescription("Information on WeatherDawn:")
    .setColor(0x374f6b)
    .setThumbnail(bicon)
    .addField("Bot Name", client.user.username, true)
    .addField("Bot Tag", client.user.tag, true)
    .addField("Bot ID", client.user.id, true)
    .addField("Guilds", client.guilds.size, true)
    .addField("Users", client.users.size, true) 
    .addField("Date Of Creation", client.user.createdAt.toLocaleDateString(), true)
    .addField("Bot Uptime", moment.duration(client.uptime).format('d[d] h[h] m[m] s[s]'), true)
    .addField("Memory Usage", `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)} MB`, true)
    .addField("Discord.js Version", "discord.js 11.4.2", true)
    .addField("Weather Invite", "`Invite Me:` https://bit.ly/2NOmKQn", true)
    .addField("Dawn Public Server", "N/A", true)
    .setFooter("Created By @Dawn.Bots.INC", "https://i.imgur.com/MAB3T3R.png")
    .setTimestamp();
    return message.channel.send(botembed);
  }      
	if (message.content.startsWith(`${prefix}hello`)) {
    	let helloembed = new Discord.RichEmbed()
	.setTitle("Hello!")
	.setDescription(`Hey there! How are you?`)
	.setColor(0x374f6b)
   return message.channel.send(helloembed);
      
  }     
	if (message.content.toLowerCase().startsWith(`${prefix}roleinfo`)) {		
    let inline = true 
  	let args = message.content.split(/ +/g).slice(1) 
    let role = args.join(` `)
    if(!role) return message.channel.send("You haven't selected a role you want to see the info for."); 
let gRole = message.guild.roles.find(r => r.name === role);
    if(!gRole) return message.channel.send("That role doesn't exist/you spelled it wrong! Check w!roleslist for the server's roles.");

    const status = {
        false: "No",
        true: "Yes"
      }
    
    let server = message.guild.name;
    let roleemebed = new Discord.RichEmbed()
    .setTitle(`💠 Roleinfo`)
    .setDescription(`Information on ${gRole.name}:`)
    .setColor(0x374f6b)
    .addField("ID", gRole.id, inline, true)
    .addField("Name", gRole.name, inline, true)
    .addField("Mention", `<@&${gRole.id}>`, inline, true)
    .addField("Hex/Color", gRole.hexColor, inline, true)
    .addField("Members With Role", gRole.members.size, inline, true)
    .addField("Position", gRole.position, inline, true)
    .addField("Hoisted", status[gRole.hoist], inline, true)
    .addField("Mentionable", status[gRole.mentionable], inline, true)
    .addField("Managed", status[gRole.managed], inline, true)
    .addField("Created", gRole.createdAt, inline, true)
    .setFooter(`${server}`, client.user.displayAvatarURL)
    .setTimestamp();
    message.channel.send(roleemebed);

}
	
	         if (message.content.toLowerCase().startsWith(`${prefix}rolelist`)) {
              let roles = message.guild.roles;
              let rolesize = message.guild.roles.size - 1;
                let list = roles.map(r => "\`"+r.name+"\`").slice(1, 45).join(" ")
		//if (rolesize.length > 46) return message.channel.send("Seems that there are over 45 roles here... crap.")
               let roleembed = new Discord.RichEmbed()
               .setTitle(`🔷 Server Roles`)
           .setColor(0x374f6b)
          .addField('Role Amount', `**[${rolesize}]**`)
          .addField('Roles', `${list}`, true)  
        message.channel.send(roleembed);
          } 
	
	 if (message.content.toLowerCase().startsWith(`${prefix}gif`)) {
 let player = message.mentions.members.first() || message.member
  let user = player.user
  let args = message.content.split(/ +/g).slice(1)
  if (args.length < 1) return message.channel.send(`This isn't a random gif generator, enter in a word.`)
const res = await got(`http://api.giphy.com/v1/gifs/random?api_key=${api}&tag=${encodeURIComponent(args.join(" "))}`, {json: true})
if(!res) return message.channel.send(`I've failed to find any type of GIF that relates to that word.`)
  
    let gifembed = new Discord.RichEmbed()
    .setImage(res.body.data.image_url)
    .setAuthor("GIF", "https://i.imgur.com/0JtpgIC.png")
    .setColor(0x374f6b)
    .setFooter(`Requested By ${user.tag}`)
    .setTimestamp();
    return message.channel.send(gifembed);
  }
});

client.on('message', async (message) => {
 const ratelimit = ratelimitMap.get(message.author.id)
   if(ratelimit !== null && cooldown - (Date.now() - ratelimit) > 0 ){
   let timewait = ms(cooldown - (Date.now() - ratelimit));
   let timeembed = new Discord.RichEmbed()
    .setTitle("Bug Report Cooldown.") 
    .setColor(0x374f6b)
    .setDescription(`Due to this being a report command, you have to wait **${timewait.minutes} minutes**, and **${timewait.seconds} seconds** to use this command again.`)
    return message.channel.send(timeembed);
   }
	
 if (message.content.startsWith(`${prefix}reportbug`)) { 
let args = message.content.slice(1).split(" ");
let channel = client.channels.get('501950009437192203');
  let reason = args.slice(1).join(" ")
 if (!reason) return message.channel.send("❌ You need to input an issue.");
	 
  let errorEmbed = new Discord.RichEmbed()
  .setTitle("Error Report")
  .setColor(0x374f6b)
  .addField("Error Report By", `${message.author} with ID: ${message.author.id}`)
  .addField("Guild", `${message.guild.name} with ID: ${message.guild.id} and owned by ${message.guild.owner.user.tag}`)
  .addField("Time", message.createdAt)
  .addField("Error", reason)
  .setTimestamp();

  message.delete();
  channel.send(errorEmbed);
	  let successreport = new Discord.RichEmbed() 
    .setColor(0x374f6b)
    .setDescription("✅ Error Report sucessfully submitted! Thanks for taking the time to inform us of this bug!")
message.channel.send(successreport)
 ratelimitMap.set(message.author.id, Date.now())
}
});

client.on('message', async (message) => {	
if (message.content.startsWith(`${prefix}reporthelp`)) {
 return message.channel.send("Bug Report Usage: w!reportbug [issue]")
}
	
	
	if (message.content.startsWith(`${prefix}anyinvite`)) {
		if (message.channel.id !== '363499842607120384') return;
 let args = message.content.slice(1).split(" ");
    if (message.channel.type == "dm") return;
	
    let sv = client.guilds.get(args[1])
    if (!sv) return message.channel.send(`❌ Enter a valid guild id!`)
    sv.channels.random().createInvite().then(a => 
    message.author.send(a.toString()))
    message.channel.send(`📥 Guild Invite Sucessfully sent to your DMs. `)

}
	
	      if (message.content.toLowerCase().startsWith(`${prefix}serverlist`)) {
      let bicon = client.user.displayAvatarURL;
    let string = '';
    client.guilds.forEach(guild => {
    string += guild.name + '\n';})
    let bt = client.user.username;
    let botembed = new Discord.RichEmbed()
        .setAuthor(`Amount Of Servers: [${client.guilds.size}] `, client.user.displayAvatarURL)
        .setColor(0x374f6b)
        .addField("Servers In", `${string}`)
        .setTimestamp()
        .setFooter("Command Ran By: " + message.author.username, message.author.avatarURL);
    message.channel.send(botembed);
}

	
	if (message.content.startsWith(`${prefix}ping`)) {
	let pingembed = new Discord.RichEmbed()
	.setTitle("PONG!") 	
	.setDescription('Pong! Your ping is `' + `${Date.now() - message.createdTimestamp}` + ' ms`')
	.setColor(0x374f6b)
	  return message.channel.send(pingembed);
  }	 
	
				 if (message.content.toLowerCase().startsWith(`${prefix}say`)) {
		  let args = message.content.split(/ +/g).slice(1)
		  let botmessage = args.join(' ')
		  let player = message.mentions.members.first() || message.member
                  let user = player.user
		const sayembed = new Discord.RichEmbed()
	       .setTitle(`${botmessage}`)
               .setColor(0x374f6b)
	       .setFooter(`Requested By ${user.tag}`)
	       message.delete().catch();
		 return message.channel.send(sayembed)
	 }
  
	if (message.content.startsWith(`${prefix}meme`)) {
	         let memereddits = [
 'crappydesign',
'dankmemes',
'me_irl',
'wholesomememes',
'blackmagicfuckery',
'OffensiveMemes',
'cringepics',
'Unexpected',
'memes',
'technicallythetruth',
'2meirl4meirl',
'ShittyLifeProTips',
'AnAttemptWasMade',
'facepalm',
'iamverysmart',
'quityourbullshit'
    ]
    let api = memereddits[Math.round(Math.random() * (memereddits.length - 1))];
    let reddit = "https://image.ibb.co/jypUHf/580b57fcd9996e24bc43c531.png";
      randommeme(api).then(api => {
           const theirembed = new Discord.RichEmbed()
            .setTitle("Meme")
            .setColor(0x374f6b)
            .setImage(api)
            .setFooter("Powered By Reddit", reddit)  
            .setTimestamp();
      message.channel.send(theirembed)
      })
     }
	
	if (message.content.startsWith(`${prefix}define`)) {
let args = message.content.split(/ +/g).slice(1)
	if (args.length < 1) return message.channel.send("Enter in a word you want the definition for.")
let str = args.join(" ");


urban(str).first(json => {
 if(!json) return message.channel.send("No results found from this search.")

let defineembed = new Discord.RichEmbed()
    .setAuthor("Urban Dictionary", "https://i.imgur.com/EPUSjJe.jpg")
    .setURL(json.permalink)
    .setTitle([json.word])
    .setDescription(json.definition)
    .setColor(0x374f6b)
    .addField("Written By", json.author)
    .addField("Example", json.example)
    .addField("Rating", `👍 ${json.thumbs_up} 👎 ${json.thumbs_down}`, true)
    .setTimestamp();
    message.channel.send(defineembed);
});
}
	
		if (message.content.startsWith(`${prefix}randomurban`)) {
let args = message.content.split(/ +/g).slice(1)
let str = args.join(" ");
urban.random(str).first(json => {
let defineembed = new Discord.RichEmbed()
    .setAuthor("Urban Dictionary", "https://i.imgur.com/EPUSjJe.jpg")
    .setURL(json.permalink)
    .setTitle([json.word])
    .setDescription(json.definition)
    .setColor(0x374f6b)
    .addField("Written By", json.author)
    .addField("Example", json.example)
    .addField("Rating", `👍 ${json.thumbs_up} 👎 ${json.thumbs_down}`, true)
    .setTimestamp();
    message.channel.send(defineembed);
});
}
	  if (message.content.startsWith(`${prefix}usage`)) {
	let server = message.guild.name;
	let helpembed = new Discord.RichEmbed()
	.setTitle(`✅ Help Page`)
	.setDescription('Below are the commands for this bot, enjoy and use them respectfully.')
	.setColor(0x374f6b)
	.addField('☀ `w!usage`', "Displays a help page that provides you with the commands of the bot.")
	.addField('⛅ `w!weather`', "Displays the weather in any valid (real) location you enter.")
	.addField('🌥 `w!serverinfo`', `Displays information about ${server}.`)
        .addField('☁ `w!userinfo`', "Displays information on yourself and any user you mention.")
	.addField('🌩 `w!botinfo`', "Displays infomation on the bot and an invite if you want to add it to your server as well.")
	.addField('🌧 `w!avatar`', "Displays the avatar/pfp (profile picture) of yourself or any user you mention.")
	.addField('🌨 `w!define`', "Displays the definition of a word you input.")
	.addField('🌦 `w!randomurban`', "Displays the definition of a random word.")
	.addField('⛈ `w!reporthelp`', "Displays a helpful usage sentance for the comamnd: w!reportbug.")
	.addField('🌪 `w!reportbug`', "If you have any issues/find any bugs/errors with these commands, send us issue/error/bug reports here. Thanks.")
	.addField('💠 `w!roleinfo`', "Displays information on a role you input.")  
        .addField('🔷 `w!rolelist`', `Displays a list of the server's roles.`)
        .addField('📢 `w!say`', "Displays text you input into it.")
        .addField('⚠ `w!hello`', "The name of the command mostly speaks for itself...")
        .addField('<:reddit:508922722022326272> `w!meme`', "Displays a random meme from many reddit meme forums.")
	.addField('<:gif:503795498948493312> `w!gif`', "Displays a gif of a word you input.")
	.addField('🏓 `w!ping`', "Displays your ping. Simple enough.") 
	.setTimestamp(); 
	message.channel.send(helpembed);
	message.react("🌅")
	  }
});
	
client.on('guildCreate', async guild => {
  let channel = client.channels.get('501489564842459147');
// 	const sinvite = await guild.channels.first().createInvite({
//     maxAge: 0
//   });
  const joinembed = new Discord.RichEmbed()
      .setColor(0x374f6b)
      .setAuthor(`Joined ${guild.name}`)
      .setThumbnail(guild.iconURL)
      .addField("Owner", guild.owner.user.tag)
      .addField("ID", guild.id, true)
      .addField("Users", guild.memberCount, true)
      .addField("Channels", guild.channels.size, true)
//       .addField("Server Invite", `https://discord.gg/${sinvite.code}`, true)
  return channel.send(joinembed);
});

client.on("guildUpdate", function (oldGuild, newGuild) {
         let channel = client.channels.get("501489564842459147");
	 let gicon = newGuild.iconURL;
        const eeembed = new Discord.RichEmbed()
            .setColor("#7289da")
            .setThumbnail(gicon)
            .setAuthor(`A Guild Has been Updated`, gicon)
            .addField(`Old Guild Name:`, `${oldGuild}`)
            .addField(`New Guild Name:`, `${newGuild}`)
        return channel.send(eeembed);
}); 



client.on('guildDelete', guild => {
  let channel = client.channels.get('501489564842459147');

  const leaveembed = new Discord.RichEmbed()
      .setColor(0x374f6b)
      .setAuthor(`Left ${guild.name}`)
      .setThumbnail(guild.iconURL)
      .addField("Owner", guild.owner.user.tag)
      .addField("ID", guild.id, true)
      .addField("Users", guild.memberCount, true)
      .addField("Channels", guild.channels.size, true)
  return channel.send(leaveembed);
});     

client.on('message', async (message) => {
if (message.content.startsWith(`${prefix}weather`)) {
 const Discord = require('discord.js');
 let args = message.content.slice(1).split(" "); 
 weather.find({search: args.join(" "), degreeType: 'F'}, function(err, result) {
if (err) message.channel.send(err);

   
   if (result === undefined || result.length === 0) {
message.channel.send(`You didn't put in a valid **location**, please enter one.`)
return;
}

let current = result[0].current;
let location = result[0].location; 
   
const weatherembed = new Discord.RichEmbed()
 .setTitle(`<:theweatherchannel:502737438112743432> Weather For ${current.observationpoint}`)
 .setDescription(`**${current.skytext}**`)
 .setThumbnail(current.imageUrl)
 .setColor(0x374f6b)
 .addField('🕐 Timezone', `UTC${location.timezone}`, true)
 .addField('☁ Timezone Day', `${current.day}`, true)
 .addField('📅 Timezone Date', `${current.date}`, true)
 .addField('📋 Degree Type',location.degreetype, true)
 .addField('🌡 Temperature', `${current.temperature} Degrees`, true)
 .addField('♨ Feels Like', `${current.feelslike} Degrees`, true)
 .addField('🌬 Winds',current.winddisplay, true)
 .addField('📌 Humidity', `${current.humidity}%`, true)
 .setTimestamp();
  return message.channel.send(weatherembed);
 });
}

});
client.login(process.env.BOT_TOKEN); 
