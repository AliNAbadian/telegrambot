# Telegram Bot - OpenAI + Tesseract OCR

This project is a Telegram bot that integrates **OpenAI**'s GPT-4 model and **Tesseract.js** for Optical Character Recognition (OCR). It processes text and images sent to the bot, providing responses using OpenAI’s language model or extracting text from images using Tesseract OCR.

## Features

- Responds to text messages using OpenAI's GPT-4 model in **Persian/Farsi**.
- Extracts text from images sent to the bot using **Tesseract OCR**.
- Handles both text and photo messages from users.

## Technologies

- **Node.js**
- **Telegram Bot API**
- **OpenAI GPT-4 API**
- **Tesseract.js (OCR)**
- **HTTPS & File Handling**

## Prerequisites

Before running the bot, ensure that you have the following:

1. **Node.js** installed on your system (version 14 or higher).
2. **Telegram Bot API Token** from [BotFather](https://core.telegram.org/bots#botfather).
3. **OpenAI API Key** from [OpenAI](https://platform.openai.com/).
4. A GitHub or GitLab account to deploy this bot to platforms like Render.

## Setup Instructions

### 1. Clone the Repository

First, clone the repository to your local machine:

```bash
git clone https://github.com/your-username/telegram-bot-openai-tesseract.git
cd telegram-bot-openai-tesseract
```

#### Step 2: Install Dependencies

````markdown
### 2. Install Dependencies

Make sure you have **Node.js** installed. Then, install the necessary dependencies by running:

```bash
npm install
```
````

#### Step 3: Set Up Environment Variables

````markdown
### 3. Set Up Environment Variables

Create a `.env` file in the root directory of your project with the following content:

```env
TELEGRAM_API=your-telegram-bot-api-token
OPEN_API=your-openai-api-key

```
````

#### Step 4: Run the Bot Locally

````markdown
### 4. Run the Bot Locally

To run the bot locally, execute the following command in the root directory of your project:

```bash
node bot.js

```
````

#### Step 5: Deploy the Bot (Optional)

```markdown
### 5. Deploy the Bot (Optional)

If you want to deploy the bot to a platform like **Render**, follow these steps:

1. **Push the code to a Git repository** (e.g., GitHub, GitLab).
2. **Create an account** on [Render](https://render.com/).
3. **Create a new Web Service** on Render, and connect it to your Git repository.
4. **Set environment variables** on Render (same as in your `.env` file).
5. **Start the service**. Render will automatically deploy your bot.
```

### 6. Using the Bot

Once the bot is running, you can interact with it in Telegram:

- **Send text messages**: The bot will reply using OpenAI's GPT-4 model in Persian/Farsi.
- **Send images**: The bot will extract text from the image using Tesseract OCR and send it back.

## Error Handling

- If an error occurs while processing a message, the bot will reply with: "❌ خطایی رخ داد. لطفاً دوباره تلاش کنید."
- If the OCR fails to extract any text from an image, the bot will reply with: "❌ هیچ متنی در تصویر یافت نشد."

## Logging

The bot logs messages it receives and the bot’s responses to a file called `log.txt`. This is useful for debugging and monitoring bot activity.

## Contributing

1. Fork the repository.
2. Clone your fork.
3. Create a new branch: `git checkout -b feature-name`.
4. Make your changes.
5. Commit your changes: `git commit -m 'Add feature-name'`.
6. Push to your fork: `git push origin feature-name`.
7. Open a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
