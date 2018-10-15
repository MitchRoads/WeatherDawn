const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./botconfig.json');
const { prefix, token } = require('./botconfig.json');
const weather = require('weather-js')

  client.on("ready", async () => {
  console.log(`${client.user.username} is currently testing the weather!`);
  client.user.setActivity("The Weather Channel (w!commands)", {type: "WATCHING"});
  client.user.setStatus("idle")
});

client.on('message', async (message) => {
	
if (message.content.startsWith(`${prefix}serverinfo`)) {		
    let sicon = message.guild.iconURL;
    let server = message.guild.name;
    let serverembed = new Discord.RichEmbed()
    .setTitle("Server Information")
    .setDescription(`Information on ${server}:`)
    .setColor(0x374f6b)
    .addField('Guild ID', message.guild.id, true)
    .addField('Guild Name', message.guild.name, true)
    .addField('Guild Channel Total', message.guild.channels.size, true)
    .addField('Guild Member Total', message.guild.memberCount, true)
    .addField('Guild Role Total', message.guild.roles.size, true)
    .addField('Guild Region', message.guild.region, true)
    .addField('Date Of Server Creation', message.guild.createdAt.toLocaleDateString(), true)
    .addField('Guild Owner', message.guild.owner, true)
    .setThumbnail(sicon) 
    .setTimestamp();
    return message.channel.send(serverembed);
  }
  
   if (message.content.startsWith(`${prefix}botinfo`)) {

    let bicon = client.user.displayAvatarURL;
    let botembed = new Discord.RichEmbed()
    .setTitle("Bot Information")
    .setDescription("Information on WeatherDawn:")
    .setColor(0x374f6b)
    .setThumbnail(bicon)
    .addField("Bot Name", client.user.username, true)
    .addField("Bot Tag", client.user.tag, true)
    .addField("Guilds", client.guilds.size, true)
    .addField("Users", client.users.size, true)
    .addField("Date Of Creation", client.user.createdAt.toLocaleString(), true)
    .addField("Weather Invite", "https://bit.ly/2CLYsp0", true)
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
	if (message.content.startsWith(`${prefix}ping`)) {
	let pingembed = new Discord.RichEmbed()
	.setTitle("PONG!") 	 
	.setColor(0x374f6b)
	.addField("Ping:", 'Pong! Your ping is `' + `${Date.now() - message.createdTimestamp}` + ' ms`')
	.setTimestamp();
	  return message.channel.send(pingembed);
  }
	
	  if (message.content.startsWith(`${prefix}commands`)) {
	let server = message.guild.name;
	let helpembed = new Discord.RichEmbed()
	.setTitle(`✅ Help Page`)
	.setDescription('Below are the commands for this bot, enjoy and use them respectfully.')
	.setColor(0x374f6b)
	.addField('☀ `w!weather`', "Displays the weather in any valid (real) location you enter.")
	.addField('⛅ `w!serverinfo`', `Displays information about ${server}.`)
	.addField('☁ `w!botinfo`', "Displays infomation on the bot and an invite if you want to add it to your server as well.")
	.addField('⛈ `w!hello`', "The name of the command mostly speaks for itself...")
	.addField('🏓 `w!ping`', "Displays your ping. Simple enough.")
	.setTimestamp();
	return message.channel.send(helpembed);
    message.react("🌅");
  }
  
	client.on('guildCreate', guild => {
  let channel = client.channels.get("499832353544470539");

  const embed = new Discord.RichEmbed()
      .setColor(0x374f6b)
      .setAuthor(`Joined ${guild.name}`)
      .setThumbnail(guild.iconURL)
      .addField("Owner", guild.owner.user.tag)
      .addField("ID", guild.id, true)
      .addField("Users", guild.memberCount, true)
      .addField("Channels", guild.channels.size, true)
  return channel.send(embed);
});



client.on('guildDelete', guild => {
  let channel = client.channels.get("499832353544470539");

  const embed = new Discord.RichEmbed()
      .setColor(0x374f6b)
      .setAuthor(`Left ${guild.name}`)
      .setThumbnail(guild.iconURL)
      .addField("Owner", guild.owner.user.tag)
      .addField("ID", guild.id, true)
      .addField("Users", guild.memberCount, true)
      .addField("Channels", guild.channels.size, true)
  return channel.send(embed);
});     

if (message.content.startsWith(`${prefix}weather`)) {
 const Discord = require('discord.js');
 let args = message.content.slice(1).split(" "); 
 weather.find({search: args.join(" "), degreeType: 'F'}, function(err, result) {
if (err) message.channel.send(err);

   
   if (result === undefined || result.length === 0) {
message.channel.send(`You didn't put in valid **location**, please enter one.`)
return;
}

let current = result[0].current;
let location = result[0].location; 
   
const weatherembed = new Discord.RichEmbed()
 .setTitle(`Weather For ${current.observationpoint}`)
 .setDescription(`**${current.skytext}**`)
 .setThumbnail(current.imageUrl)
 .setColor(0x374f6b)
 .addField('Timezone', `UTC${location.timezone}`, true)
 .addField('Timezone Day', `${current.day}`, true)
 .addField('Timezone Date', `${current.date}`, true)
 .addField('Degree Type',location.degreetype, true)
 .addField('Temperature', `${current.temperature} Degrees`, true)
 .addField('Feels Like', `${current.feelslike} Degrees`, true)
 .addField('Winds',current.winddisplay, true)
 .addField('Humidity', `${current.humidity}%`, true)
 .setTimestamp();
  return message.channel.send(weatherembed);
 });

}

});
client.login(process.env.BOT_TOKEN); 
