# Judge0 API Integration Setup

This guide will help you set up the Judge0 API integration for real-time code compilation and execution in your Quick-Code application.

## Prerequisites

1. A RapidAPI account (free tier available)
2. Node.js and npm installed
3. Your Quick-Code application running

## Step 1: Get RapidAPI Key

1. Go to [RapidAPI](https://rapidapi.com/) and create an account
2. Search for "Judge0 CE" in the API marketplace
3. Subscribe to the "Judge0 CE" API (free tier available)
4. Copy your RapidAPI key from the dashboard

## Step 2: Configure Environment Variables

1. Create a `.env` file in your project root directory
2. Add your RapidAPI key:

```env
REACT_APP_RAPIDAPI_KEY=your_rapidapi_key_here
```

3. Restart your development server after adding the environment variable

## Step 3: Test the Integration

1. Start your application: `npm start`
2. Create or join a room
3. Select a programming language from the dropdown
4. Write some code in the editor
5. Add input if needed
6. Click "Run Code" to execute

## Supported Languages

The integration supports the following programming languages:

- **JavaScript (Node.js 12.14.0)** - ID: 63
- **Python (3.8.1)** - ID: 71
- **C++ (GCC 9.2.0)** - ID: 54
- **C (GCC 9.2.0)** - ID: 50
- **Java (OpenJDK 13.0.1)** - ID: 62
- **C# (Mono 6.6.0.161)** - ID: 51
- **Go (1.13.5)** - ID: 60
- **Ruby (2.7.0)** - ID: 72
- **Rust (1.40.0)** - ID: 73
- **Swift (5.2.3)** - ID: 74

## Features

### Real-time Collaboration
- Code changes are synchronized across all users in the room
- Input/output is shared in real-time
- Language selection is synchronized
- Execution results are broadcast to all users

### Code Execution
- Execute code with custom input
- View execution time
- See detailed status messages for different execution states
- Handle compilation errors, runtime errors, and other issues

### User Interface
- Modern dark theme with syntax highlighting
- Responsive design for mobile and desktop
- Language-specific code templates
- Real-time input/output panels

## Error Handling

The application handles various execution states:

- **✓ Execution successful** - Code ran successfully
- **✗ Compilation error** - Syntax or compilation issues
- **✗ Runtime error** - Errors during execution
- **⏱ Time limit exceeded** - Code took too long to execute
- **💾 Memory limit exceeded** - Code used too much memory
- **❌ Wrong answer** - Output didn't match expected results

## Troubleshooting

### Common Issues

1. **"Error: YOUR_RAPIDAPI_KEY"**
   - Make sure you've set the `REACT_APP_RAPIDAPI_KEY` environment variable
   - Restart your development server after adding the environment variable

2. **"HTTP error! status: 401"**
   - Check if your RapidAPI key is valid
   - Ensure you're subscribed to the Judge0 CE API

3. **"Execution timeout"**
   - The code might be taking too long to execute
   - Try simplifying your code or reducing input size

4. **"No output"**
   - Some languages might not produce output for certain code
   - Try adding print/console.log statements

### API Limits

- Free tier: 100 requests per month
- Paid tiers available for higher usage
- Check your RapidAPI dashboard for current usage

## Security Notes

- Never commit your RapidAPI key to version control
- Use environment variables for sensitive configuration
- The API key is only used on the client side for direct API calls

## Customization

You can customize the integration by modifying:

- `src/config/judge0.js` - Language options and API configuration
- `src/components/CodeEditor.jsx` - Execution logic and UI
- `src/components/codeEditor.css` - Styling and layout

## Support

For issues with:
- **Judge0 API**: Check the [Judge0 documentation](https://judge0.com/)
- **RapidAPI**: Contact RapidAPI support
- **Application**: Check the application logs and browser console 