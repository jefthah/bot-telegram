const Telegram = require("node-telegram-bot-api")

const token = "6737474021:AAEI7myZ1ujgSEHaCdnT0SsctT2_kUBhTfA"
const option = {
    polling: true
}

const bot = new Telegram(token, option);

const prefix = ".";
const start = new RegExp(`^${prefix}start$`);
const gempa = new RegExp(`^${prefix}gempa$`);

bot.onText(start, (callback) => {
    const menuKeyboard = {
        inline_keyboard: [
            [{ text: "Info Gempa", callback_data: ".gempa" }],
            [{ text: "Info Anime Popular", callback_data: ".anime" }]
        ]
    };

    bot.sendMessage(callback.from.id, "Pilih menu:", {
        reply_markup: JSON.stringify(menuKeyboard)
    });
});

bot.on("callback_query", async (callbackQuery) => {
    const action = callbackQuery.data;
    const chatId = callbackQuery.message.chat.id;

    try {
        if (action === ".gempa") {
            // Mendapatkan data gempa terkini dari BMKG
            const BMKG_ENDPOINT = "https://data.bmkg.go.id/DataMKG/TEWS/";
            const response = await fetch(BMKG_ENDPOINT + "autogempa.json");
            const data = await response.json();

            // Mendapatkan data gempa terkini
            const latestEarthquake = data.Infogempa.gempa;
            const { Jam, Magnitude, Tanggal, Wilayah, Potensi, Kedalaman, Shakemap } = latestEarthquake;

            const BMKGImage = BMKG_ENDPOINT + Shakemap;
            const resultText = `
            Waktu: ${Tanggal} | ${Jam}
            Besaran: ${Magnitude} SR
            Wilayah: ${Wilayah}
            Potensi: ${Potensi}
            Kedalaman: ${Kedalaman}
            `;

            // Mengirim pesan dengan info gempa ke pengguna
            bot.sendPhoto(chatId, BMKGImage, {
                caption: resultText
            });
        } else if (action === ".anime") {
            const response = await fetch("https://api.jikan.moe/v4/anime?q=your lie in april&sfw");
            const data = await response.json();

            if (data.results.length > 0) {
                const animeData = data.results[0];
                const title = animeData.title;
                const imageUrl = animeData.image_url;

                bot.sendPhoto(chatId, imageUrl, {
                    caption: title
                });
            } else {
                bot.sendMessage(chatId, "Tidak ada data anime yang ditemukan.");
            }
        }
    } catch (error) {
        console.error("Error:", error);
        bot.sendMessage(chatId, "Maaf, terjadi kesalahan saat memproses permintaan.");
    }
});

bot.onText(gempa, async (callback) => {
    // Anda bisa mengabaikan ini karena logika untuk menangani ".gempa" sudah dimasukkan dalam handler callback_query di atas
});