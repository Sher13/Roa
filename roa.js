const discord = require("discord.js");
const { Client, Intents, MessageEmbed} = require('discord.js');

const client = new Client({
    partials: ['USER', 'REACTION', 'MESSAGE'],
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS]
});
const fs = require("fs");

const servers = {
    myServer: {
        id: "471630590806851584",
        changeRole: "494465327476899840",
        colorChannel: "535391187411140608",
        voiceRole : "620182672618160137",
        logChannel: "887723855400022017"
    },
    savaServer: {
        id: "622954155077533696"
    },
    rostikServer: {
        id: "470179380824506368"
    },
    jimmyServer: {
        id: "381829822982389771"
    },
    svetaServer: {
        id: "611111608219074570"
    },
    nerserServer: {
        id: "429729565817044992"
    }
}
const people = {
    sher: {
        id: "465931840398557194"
    },
    kofuBot: {
        id: "519186885331910676"
    },
    teaBot: {
        id: "654810705903484949"
    },
    kartusBot: {
        id: "523116257390886954"
    }
}

let COLOR_EMOGI = {
    '887728560717053982' : '887685440763727873',
    '887728560800944178' : '887684955860250674',
    '887727285149499523' : '887683899411529809',
    '887728560289230908' : '887684284452839495',
    '887728560297627698' : '887684069125656597',
    '887728560587018290' : '887684714536775701',
    '887728560608010310' : '887684473762762824',
    '887728560679309312' : '887684833466286101',
    '887728560658325554' : '887685035661082664',
    '887728560599625778' : '887685141026185286',
    '887728560683499540' : '887685312036347944'
}

client.on("ready", () => {
    console.log("I am ready!");
    client.channels.cache.get(servers.myServer.logChannel).messages.fetch({
        limit: 1
    }).then(messages => {
        let msg = messages.first();
        let id = msg.content.split(" ");
        attachCollectorToMessage(id[0], id[1]);
    });
});

// Just function

function attachCollectorToMessage(channel_id, msg_id) {
    client.channels.cache.get(channel_id).messages.fetch({
        around: msg_id,
        limit: 1
    }).then(
        messages => {
            let msg = messages.first();
            const filter = (react, user) => !user.bot;
            let collector = msg.createReactionCollector({filter, dispose : true});
            collector.on('collect', (reaction, user) => {
                if (user.id !== people.kofuBot.id) {
                    msg.guild.members.cache.get(user.id).roles.add(COLOR_EMOGI[reaction.emoji.id]);
                }
            });
            collector.on('remove', (reaction, user) => {
                if (user.id !== people.kofuBot.id) {
                    msg.guild.members.cache.get(user.id).roles.remove(COLOR_EMOGI[reaction.emoji.id]);
                }
            })
        })
}

function getRandom(l, r) {
    return Math.round((Math.random() * r)) % (r - l) + l;
}

function shuffle(v) {
    for (let i = 0; i < v.length; i++) {
        let e = getRandom(0, v.length);
        let t = v[e];
        v[e] = v[i];
        v[i] = t;
    }
    return v;
}

function lowerCase(s) {
    let s1 = "";
    for (let i = 0; i < s.length; i++) {
        if (s.charCodeAt(i) === 1025) {
            s1 += "е";
        } else if (s.charCodeAt(i) >= 1040 && s.charCodeAt(i) <= 1071) {
            s1 += String.fromCharCode(s.charCodeAt(i) + 32);
        } else
            s1 += s.charAt(i);
    }
    return s1;
}

function isDigit(s) {
    if (s.charCodeAt(0) >= 97 && s.charCodeAt(0) <= 122)
        return true;
    return s.charCodeAt(0) >= 1072 && s.charCodeAt(0) <= 1103;

}


function get_text(msg) {
    let sql = "SELECT * FROM Links";
    db.all(sql, [], (err, rows) => {
        let emb = new RichEmbed()
            .setColor(14614685)
            .setTitle("Links");
        rows.forEach((row) => {
            emb.addField("‎", row.text);
        })
        msg.channel.send(emb);
    })
}

function del_text(msg, id) {
    let sql = "SELECT * FROM Links";
    db.all(sql, [], (err, rows) => {
        id = rows[id].id;
        sql = "DELETE FROM Links WHERE id = ?";
        db.run(sql, id, (err) => {
            if (err) {
                return msg.reply("error");
            }
            msg.reply("ok");
        })
    })
}

function parseAnswer(msg, user, text) {
    var members = msg.guild.members;
    return text.replace("@author",`${members.get(msg.author.id)}`)
        .replace("@number", getRandom(1000000, 1000000000))
        .replace("@me", `${members.get(people.kofuBot.id)}`)
        .replace("@user",`${user}`)
        .replace("@random", `${members.array()[getRandom(0, members.size)]}`);
}

// Message

client.on("message", (msg) => {
    if (msg.author.id === people.sher.id && msg.content === "color") {
        let emb = new MessageEmbed()
            .setTitle("Сообщение для выбора цвета")
            .addField("‎", "Нажмите на реакцию  внизу в зависимости от цвета, который вы хотите.")
            .addField("‎", "При нажатии нескольких реакций, вам поставится несколько цветов, но виден будет только самый верхний, так что сами думайте зачем вам это.")
        msg.channel.send({embeds : [emb]})
            .then(res => {
                let keys = Object.keys(COLOR_EMOGI);
                for (let i in keys) {
                    res.react(client.guilds.cache.get(servers.myServer.id).emojis.cache.get(keys[i]));
                }
                attachCollectorToMessage(msg.channel.id, res.id);
            });
    }
});


client.login(process.env.TOKEN);
