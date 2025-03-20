const express = require("express");
const cors = require("cors");
const { google } = require("googleapis");
const fs = require("fs");
const { Configuration, OpenAIApi, OpenAI} = require("openai");
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

const SHEET_ID = process.env.SHEET_ID; // Google Sheet ID
const CREDENTIALS = JSON.parse(fs.readFileSync(process.env.GOOGLE_CREDENTIALS_FILE, "utf8")); // API key
const OPENAI_KEY = process.env.OPENAI_KEY; // API key 

const auth = new google.auth.GoogleAuth({
    credentials: CREDENTIALS,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});
const sheets = google.sheets({ version: "v4", auth });

// OpenAI API
const openai = new OpenAI({
    apiKey: OPENAI_KEY, // Đọc API key từ biến môi trường
});

// Lấy danh sách khách sạn từ Google Sheets
async function getHotels(location) {
    
    //console.log(location);

    const response = await sheets.spreadsheets.values.get({
        spreadsheetId: SHEET_ID,
        range: "Sheet1!A2:E",
    });

    const results = response.data.values
        .filter(row => row[2].toLowerCase().includes(location.toLowerCase()))
        .map(row => ({
            id: row[0],
            name: row[1],
            address: row[2],
            price: row[3],
            available_rooms: row[4],
        }));

    //console.log(results);

    if (results.length === 0) {
        return "Xin lỗi, không có khách sạn nào tại khu vực bạn tìm kiếm.";
    }

    const hotelList = results.map(hotel => 
        `${hotel.name} tại ${hotel.address}, giá ${hotel.price}. Hiện còn ${hotel.available_rooms > 0 ? hotel.available_rooms : 'hết'} phòng.`).join('\n');

    return hotelList;
}

// API chatbot
app.post("/chat", async (req, res) => {
    try {
        const { message } = req.body;
        //const hotels = await getHotels();

        const prompt = `Bạn là một nhân viên đặt chỗ khách sạn. Một khách hàng đến và hỏi: "${message}".Hãy trả lời một cách tự nhiên.`;

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }],
            tools: [
                {
                    type: "function",
                    function: {
                        name: "getHotels",
                        description: "Trả về danh sách khách sạn dựa trên địa điểm",
                        parameters: {
                            type: "object",
                            properties: {
                                location: { type: "string", description: "Tên thành phố hoặc địa điểm" }
                            },
                            required: ["location"]
                        }
                    }
                }
            ],
            tool_choice: { type: "function", function: { name: "getHotels" } }
        });

        // Xử lý phản hồi từ OpenAI
        const toolCall = response.choices[0].message.tool_calls?.[0];
        if (toolCall && toolCall.function.name === "getHotels") {
            const location = JSON.parse(toolCall.function.arguments).location;
            const hotelList  = await getHotels(location);
            // Yêu cầu OpenAI tạo câu trả lời tự nhiên dựa trên dữ liệu khách sạn
            const response = await openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [
                    { role: "system", content: "Hãy trả lời như một hướng dẫn viên du lịch thân thiện." },
                    { role: "user", content: `${message} Đây là danh sách các khách sạn:\n${hotelList}` }
                ],
                max_tokens: 300
            });

            res.json({ message: response.choices[0].message.content });
        } else {
            res.json({ message: "Không thể tìm thấy thông tin khách sạn." });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.listen(5000, () => console.log("Server running on port 5000"));
