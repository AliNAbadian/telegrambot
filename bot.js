import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
import TelegramBot from "node-telegram-bot-api";
import OpenAI from "openai";
import fs from "fs";
import Tesseract from "tesseract.js";
import https from "https";
import path from "path";

const token = process.env.OPEN_API;
const endpoint = "https://models.github.ai/inference";
const model = "openai/gpt-4.1";

const bot = new TelegramBot(process.env.TELEGRAM_API, { polling: true });
const client = new OpenAI({ baseURL: endpoint, apiKey: token });

// Ensure the downloads folder exists
const __dirname = path.resolve(); // Fixing the __dirname issue
const downloadDir = path.join(__dirname, "downloads");

// Create the downloads folder if it doesn't exist
if (!fs.existsSync(downloadDir)) {
  fs.mkdirSync(downloadDir);
}

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  try {
    // Check if the message is text or photo
    if (text) {
      // Handle text messages with OpenAI API
      await bot.sendChatAction(chatId, "typing");

      const waitingMsg = await bot.sendMessage(
        chatId,
        "🤔 لطفاً کمی صبر کنید..."
      );

      // Optional: Add artificial delay for realism
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const response = await client.chat.completions.create({
        model: model,
        messages: [
          {
            role: "system",
            content:
              "You are a helpful assistant. Answer the user's questions as best as you can. in persian and farsi language no other language is allowed.",
          },
          { role: "user", content: text },
        ],
      });

      const reply = response.choices[0].message.content;
      writeLogFile(reply);

      // Edit placeholder message with actual response
      await bot.editMessageText(reply, {
        chat_id: chatId,
        message_id: waitingMsg.message_id,
      });

      console.log("Message from user:", text);
    }
  } catch (err) {
    console.error("❌ Error handling message:", err);
    bot.sendMessage(chatId, "خطایی رخ داد. لطفاً دوباره تلاش کنید.");
  }
});

// Handling photos (Image-to-text using Tesseract OCR)
bot.on("photo", async (msg) => {
  let filePath = null; // Declare filePath outside try block
  try {
    const chatId = msg.chat.id;
    const photo = msg.photo[msg.photo.length - 1];
    const fileId = photo.file_id;
    const file = await bot.getFile(fileId);
    const fileUrl = `https://api.telegram.org/file/bot${process.env.TELEGRAM_API}/${file.file_path}`;
    console.log("File URL:", fileUrl);

    filePath = path.join(downloadDir, `${file.file_unique_id}.jpg`);
    const dest = fs.createWriteStream(filePath);

    // Retry download with increased delay and timeout
    await retry(
      () =>
        new Promise((resolve, reject) => {
          const req = https.get(fileUrl, { timeout: 10000 }, (res) => {
            // Increased timeout
            console.log("Response status:", res.statusCode);
            if (res.statusCode !== 200) {
              reject(
                new Error(`Failed to download file: HTTP ${res.statusCode}`)
              );
              return;
            }
            res.pipe(dest);
            res.on("error", (err) => {
              console.error("Response stream error:", err.message);
              reject(err);
            });
            dest.on("finish", () => {
              dest.close();
              resolve();
            });
          });

          req.on("error", (err) => {
            console.error("HTTPS request error:", err.message);
            reject(err);
          });

          req.end();
        })
    );

    await bot.sendMessage(chatId, "🧠 در حال شناسایی متن از تصویر...");
    const result = await Tesseract.recognize(filePath, "fas", {
      logger: (m) => console.log(m),
    });

    const extractedText = result.data.text.trim();
    if (extractedText) {
      await bot.sendMessage(chatId, `📝 متن استخراج‌شده:\n\n${extractedText}`);
    } else {
      await bot.sendMessage(chatId, "❌ هیچ متنی در تصویر یافت نشد.");
    }
  } catch (err) {
    console.error("Photo processing error:", err.message);
    await bot.sendMessage(msg.chat.id, "❌ خطایی در پردازش تصویر رخ داد.");
  } finally {
    if (filePath && fs.existsSync(filePath)) {
      fs.unlink(filePath, (err) => {
        if (err) console.error("Error deleting file:", err);
      });
    }
  }
});

// Retry utility function with detailed logging and delay
const retry = async (fn, retries = 3, delay = 3000) => {
  // Increased delay to 3 seconds
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      console.log(`Retry ${attempt}/${retries} after error: ${err.message}`);
      if (attempt === retries) {
        console.error("Max retries reached, failing...");
        throw err;
      }
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
};

const writeLogFile = (message) => {
  const logFilePath = "./log.txt";
  const logMessage = `${new Date().toISOString()} - ${message}\n`;
  fs.appendFile(logFilePath, logMessage, (err) => {
    if (err) {
      console.error("Error writing to log file:", err);
    } else {
      console.log("Log message written to file:", logMessage);
    }
  });
};
