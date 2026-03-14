const { 
  Client, 
  GatewayIntentBits, 
  ActionRowBuilder, 
  ButtonBuilder, 
  ButtonStyle, 
  EmbedBuilder 
} = require("discord.js");

const TOKEN = "TOKEN_DYALK"; 
const CREATE_CHANNEL_ID = "1480913492574867519";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages
  ]
});

client.once("ready", () => {
  console.log("DS WORLD BOT ONLINE 🚀");
});

client.on("voiceStateUpdate", async (oldState, newState) => {
  if (newState.channelId === CREATE_CHANNEL_ID) {
    // نصايب القناة الصوتية
    const voiceChannel = await newState.guild.channels.create({
      name: `${newState.member.user.username} Room`,
      type: 2,
      parent: newState.channel.parent
    });

    await newState.member.voice.setChannel(voiceChannel);

    // نصايب قناة نصية مرتبطة بالقناة الصوتية
    const textChannel = await newState.guild.channels.create({
      name: `${newState.member.user.username}-panel`,
      type: 0, // Text
      parent: newState.channel.parent
    });

    // Panel
    const embed = new EmbedBuilder()
      .setTitle("♡ Kamita Loves You♡")
      .setDescription(
        "୨ Control Panel ୧\nʟƐ ʳ⋆⋆ʳ ʒʖ♡ Welcome, " +
          newState.member.user.username +
          "! Enjoy your stay.\n[Developed by NextGen](https://nextgen.dev)"
      )
      .setColor(0x5865f2)
      .setImage("https://cdn.discordapp.com/attachments/1410364493824917534/1481291852492570664/Copilot_20260311_132153.png");

    // صف 1 (5 أزرار)
    const row1 = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId("lock").setLabel("Lock").setStyle(ButtonStyle.Danger).setEmoji("<:padlock:1481306495932043346>"),
      new ButtonBuilder().setCustomId("unlock").setLabel("Unlock").setStyle(ButtonStyle.Success).setEmoji("<:unlock:1481306721728204933>"),
      new ButtonBuilder().setCustomId("hide").setLabel("Hide").setStyle(ButtonStyle.Secondary).setEmoji("<:hide:1481306865622188184>"),
      new ButtonBuilder().setCustomId("show").setLabel("Show").setStyle(ButtonStyle.Primary).setEmoji("<:unhide:1481306958257455104>"),
      new ButtonBuilder().setCustomId("rename").setLabel("Rename").setStyle(ButtonStyle.Secondary).setEmoji("<:rename:1481307134145597528>")
    );

    // صف 2 (3 أزرار)
    const row2 = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId("kick").setLabel("Kick User").setStyle(ButtonStyle.Danger).setEmoji("<:kick:1481307134145597528>"),
      new ButtonBuilder().setCustomId("limit").setLabel("Set User Limit").setStyle(ButtonStyle.Primary).setEmoji("<:limit:1481307321400299570>"),
      new ButtonBuilder().setCustomId("delete").setLabel("Delete Channel").setStyle(ButtonStyle.Danger).setEmoji("<:delete:1481305290807709696>")
    );

    // نرسل Panel فالقناة النصية
    await textChannel.send({ embeds: [embed], components: [row1, row2] });
  }

  // مسح القنوات الصوتية الفارغة + النصية المرتبطة
  if (oldState.channel && oldState.channel.id !== CREATE_CHANNEL_ID) {
    if (oldState.channel.members.size === 0 && oldState.channel.parent) {
      try {
        const linkedText = oldState.guild.channels.cache.find(
          c => c.name === `${oldState.channel.name}-panel`
        );
        if (linkedText) await linkedText.delete();

        await oldState.channel.delete();
        console.log(`Deleted empty channel: ${oldState.channel.name}`);
      } catch (err) {
        console.error("Error deleting channel:", err);
      }
    }
  }
});

client.login(TOKEN);
