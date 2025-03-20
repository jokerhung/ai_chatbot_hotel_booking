# AI Chatbot Hotel Booking

This project is an AI-powered chatbot designed to assist users with hotel bookings. The chatbot can handle various tasks such as searching for available hotels, making reservations, and answering common questions related to hotel services.

## Features

- Search for available hotels based on data in google sheet
- Make hotel reservations
- Answer frequently asked questions about hotel services
- Provide information about hotel amenities and policies

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/yourusername/ai_chatbot_hotel_booking.git
    ```
2. Navigate to the project directory:
    ```bash
    cd ai_chatbot_hotel_booking
    ```

## Usage

### Running the Backend

1. Navigate to the backend directory:
    ```bash
    cd backend
    ```
2. Create a `.env` file with the necessary environment variables
    ```
    OPENAI_KEY=your_openai_key
    SHEET_ID=your_google_sheet_id
    GOOGLE_CREDENTIALS_FILE=path_to_your_google_credentials_file
    ```
3. Install the backend dependencies:
    ```bash
    npm install
    ```
4. Run the backend server:
    ```bash
    npm start
    ```


### Running the Frontend

1. Navigate to the frontend directory:
    ```bash
    cd frontend
    ```
2. Install the frontend dependencies:
    ```bash
    npm install
    ```
3. Run the frontend application:
    ```bash
    npm start
    ```

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request with your changes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.