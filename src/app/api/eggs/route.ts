import { google } from 'googleapis';
import { NextResponse } from 'next/server';

interface EggData {
    number: number;
    date: string;
    house: string;
    totalEggs: number;
    mortality: number;
    brokenEggs: number;
    chickens: number;
    food: number;
    user: string;
    tray: number;
    percentage: number;
}

async function fetchEggData(): Promise<EggData[]> {
    try {

        const credentialsJson = Buffer.from(
            process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON || '',
            'base64'
        ).toString('utf8');

        const credentials = JSON.parse(credentialsJson);

        const auth = new google.auth.GoogleAuth({
            credentials: credentials,
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        const sheets = google.sheets({ version: 'v4', auth });

        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: process.env.GOOGLE_SHEETS_SPREADSHEET_ID,
            range: process.env.GOOGLE_SHEETS_RANGE,
        });

        const rows = response.data.values;

        if (!rows || rows.length === 0) {
            throw new Error('No data found in the spreadsheet.');
        }

        const data = rows.slice(1).map((row, index) => {
            const safeParseFloat = (value: string | number | null | undefined): number => {
                if (value === undefined || value === null || value === '') return 0;
                const num = parseFloat(value.toString().trim());
                return isNaN(num) ? 0 : num;
            };

            return {
                number: index + 1,
                date: row[0]?.toString().trim() || '',
                house: row[1]?.toString().trim() || '',
                totalEggs: safeParseFloat(row[2]),
                mortality: safeParseFloat(row[3]),
                brokenEggs: safeParseFloat(row[4]),
                chickens: safeParseFloat(row[5]),
                food: safeParseFloat(row[6]),
                user: row[7]?.toString().trim() || '',
                tray: safeParseFloat(row[8]),
                percentage: safeParseFloat(row[9]),
            };
        });

        return data;

    } catch (error) {
        console.error('Error fetching egg data:', error);
        throw new Error('Failed to fetch egg data from Google Sheets.');
    }
}

export async function GET() {
    try {
        const eggData = await fetchEggData();

        return NextResponse.json(eggData);
    } catch (error: unknown) {
            if (error instanceof Error) {
                return NextResponse.json({ error: error.message }, { status: 500 });
            } else {
                return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
            }
        return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
    }
}