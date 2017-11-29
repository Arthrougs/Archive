var Discord = require('discord.io');
var pack = require('./package.json');
var logger = require('winston');
var auth = require('./auth.json');
var fs = require('fs');
var boundChannels = [];
// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';





// Initialize Discord Bot
var bot = new Discord.Client({
   token: auth.token,
   autorun: true
});
bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});
bot.on('message', function (user, userID, channelID, message, evt) {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
   if (message.substring(0, 1) == '!') {
        var args = message.substring(1).split(' ');
        var cmd = args[0].toLowerCase();
       
        args = args.splice(1);
        switch(cmd) {
			case 'bind':
				boundChannels.push(channelID);
				break;
			case 'list':
				for(var i=0; i<boundChannels.length; i++)
				{
					bot.sendMessage({
						to: channelID,
						message: boundChannels[i]
					});
				}
				console.log("Listing Channels");
			default:
				break;
		}
	}
	else
	{
		for(var i = 0; i<boundChannels.length; i++)
		{
			if(channelID == boundChannels[i])
			{
				message.concat("\n");
				fs.appendFile('archive.txt', user + ": " + message, function (err) {
				  if (err) throw err;
				  console.log('Saved!');
				});

			}
		}
	}
	
	//Push message to google doc
	function pushMessage(message)
	{
		console.log(message);
	}
		
   /* if (message.substring(0, 1) == '!') {
        var args = message.substring(1).split(' ');
        var cmd = args[0];
       
        args = args.splice(1);
        switch(cmd) {
            // !ping
            case 'ping':
                bot.sendMessage({
                    to: channelID,
                    message: 'Pong!'
                });
            break;
            // Just add any case commands if you want to..
         }
     }*/
});