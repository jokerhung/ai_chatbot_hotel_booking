import { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";

export default function Chatbot() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage = { role: "user", content: input };
        setMessages([...messages, userMessage]);
        setInput("");
        setLoading(true);

        try {
            const response = await fetch("http://localhost:5000/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: input })
            });
            const data = await response.json();

            const botMessage = { role: "bot", content: data.message };
            setMessages([...messages, userMessage, botMessage]);
        } catch (error) {
            console.error("Error calling chat API:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-[50vh] w-[50vw] p-4 mx-auto">
            <Card className="h-full w-full rounded-2xl shadow-lg">
                <CardContent className="h-full flex flex-col">
                    <ScrollArea className="flex-1 border-b p-4">
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`my-2 p-2 rounded-lg ${msg.role === "user" ? "bg-blue-100 text-right" : "bg-gray-100 text-left"}`}
                            >
                                {msg.content}
                            </div>
                        ))}
                        {loading && (
                            <div className="text-center text-gray-500 mt-2 flex justify-center items-center space-x-2">
                                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-duration:0.6s] [animation-timing-function:ease-in-out] translate-y-[-6px]"></div>
                                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.2s] [animation-duration:0.6s] [animation-timing-function:ease-in-out] translate-y-[-6px]"></div>
                                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.4s] [animation-duration:0.6s] [animation-timing-function:ease-in-out] translate-y-[-6px]"></div>
                            </div>
                        )}
                    </ScrollArea>

                    <div className="flex items-center gap-2 mt-4">
                        <Input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Nhập tin nhắn..."
                        />
                        <Button onClick={handleSend} disabled={loading}>
                            {loading ? "Đang gửi..." : "Gửi"}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
