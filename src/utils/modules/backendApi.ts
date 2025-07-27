// Imported TypeScript:
import { GuildDataResponse } from './types/backendApi.types'


/** Fetches guild data from backend API.
 * 
 * + Discord Guild API Data
 * + Discord Guild ➞ Channels API Data
 * + Internal Firestore Guild Data
 * + and more...
 * @param guildId Discord Guild ID to fetch data for
 */
export async function getGuildData(guildId) : Promise <GuildDataResponse> {
    const requestUrl = 'https://brilliant-austina-sessions-bot-discord-5fa4fab2.koyeb.app/api/discord/guild?guildId=' + guildId;

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
        console.warn('API ERROR', 'FETCH GUILD DATA: ', error);
        responseData = {
            success: false,
            data: null,
            error
        };
        return responseData;
    }
}