const express = require('express');
const cors = require('cors');
const axios = require('axios');
const cheerio = require('cheerio');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080; // Cloud run default is 8080

app.use(cors());

// Serve static frontend files
app.use(express.static(path.join(__dirname, 'public')));

// Mock data generator for IPL matches
function generateMockMatchData() {
    return [
        {
            id: '1',
            title: 'Royal Challengers Bengaluru vs Chennai Super Kings, 1st Match',
            status: 'Live',
            team1: { name: 'RCB', score: '175/4', overs: '18.2' },
            team2: { name: 'CSK', score: '', overs: '' },
            summary: 'RCB opt to bat',
            batsmen: [
                { name: 'V Kohli', runs: '82', balls: '54', strikeRate: '151.85' },
                { name: 'G Maxwell', runs: '34', balls: '20', strikeRate: '170.00' }
            ],
            bowlers: [
                { name: 'R Jadeja', overs: '4.0', maidens: '0', runs: '28', wickets: '1' },
                { name: 'M Pathirana', overs: '3.2', maidens: '0', runs: '32', wickets: '2' }
            ],
            currentRunRate: '9.55',
            projectedScore: '192'
        },
        {
            id: '2',
            title: 'Mumbai Indians vs Gujarat Titans, 2nd Match',
            status: 'Upcoming',
            team1: { name: 'MI', score: '', overs: '' },
            team2: { name: 'GT', score: '', overs: '' },
            summary: 'Match starts at 07:30 PM'
        }
    ];
}

// Mock news data
function generateMockNews() {
    return [
        { id: 1, headline: 'Kohli shines again as RCB takes early control', time: '1 hr ago' },
        { id: 2, headline: 'Bumrah declared fit for the upcoming clash against GT', time: '3 hrs ago' },
        { id: 3, headline: 'Weather update: Clear skies expected for the evening match in Mumbai', time: '5 hrs ago' }
    ];
}

app.get('/api/live-scores', async (req, res) => {
    try {
        // Here we would normally scrape Cricbuzz:
        // const response = await axios.get('https://www.cricbuzz.com/cricket-match/live-scores');
        // const $ = cheerio.load(response.data);
        // ... scraping logic ...
        
        // Using mock data for reliable demonstration
        const data = generateMockMatchData();
        res.json({ success: true, data });
    } catch (error) {
        console.error('Error fetching live scores:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch live scores' });
    }
});

app.get('/api/news', async (req, res) => {
    try {
        // Scrape logic would go here
        const data = generateMockNews();
        res.json({ success: true, data });
    } catch (error) {
        console.error('Error fetching news:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch news' });
    }
});

// Endpoint for stadium density/wait times (simulated)
app.get('/api/stadium-status', (req, res) => {
    const zones = ['North Stand', 'South Pavilion', 'East Stand', 'West Stand', 'VIP Lounge'];
    const status = zones.map(zone => ({
        zone,
        density: Math.floor(Math.random() * 100), // 0 to 100%
        concessionWaitTime: Math.floor(Math.random() * 25) + 5, // 5 to 30 mins
        restroomWaitTime: Math.floor(Math.random() * 15) + 2 // 2 to 17 mins
    }));
    
    res.json({ success: true, data: status });
});

app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});
