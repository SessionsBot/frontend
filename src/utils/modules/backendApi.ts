// Imported TypeScript:
// import { GuildDataResponse, SecureActionResponse, SecureActionNames } 
import { GuildDataResponse, SecureActionResponse, SecureActionNames } from "@sessionsbot/api-types";


/** Fetches guild data from backend API.
 * @details
 * + Discord ➞ Guild API Data
 * + Discord ➞ Channels API Data
 * + Firestore ➞ Internal Guild Data
 * + and more...
 * @param guildId Discord Guild ID to fetch data for
 */
export async function getGuildData(guildId) : Promise <GuildDataResponse> {
    const requestUrl = 'https://brilliant-austina-sessions-bot-discord-5fa4fab2.koyeb.app/api/api/v2/guilds/' + guildId;

    let responseData : GuildDataResponse;

    try {
        const response = await fetch(requestUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        responseData = await response.json();
        return responseData;

    } catch (error) {
        console.warn('API ERROR', 'Fetch Guild Data', error);
        responseData = {
            success: false,
            data: null,
            error
        };
        return responseData;
    }
}